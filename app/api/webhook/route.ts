import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error:${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const emailAddress = session?.customer_email;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  // Here we should check if Product stock is actually sufficient if yes continue if not cancel

  // session.metadata was updated during creating of the session in checkout.route.ts
  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
        email: emailAddress || "",
      },
      include: {
        orderItems: true,
      },
    });

     // Update product stock and status based on ordered items
     await Promise.all(order.orderItems.map(async (orderItem) => {
      const product = await prismadb.product.findUnique({
        where: {
          id: orderItem.productId,
        },
      });

      if (!product) return;

      // Subtract quantity from product stock
      const updatedStock = product.stock - orderItem.quantity;

      // Update product stock and status
      await prismadb.product.update({
        where: {
          id: product.id,
        },
        data: {
          stock: updatedStock,
          isArchived: updatedStock <= 0, // Set to true if stock becomes 0
        },
      });
    }));
  }

  return new NextResponse(null, { status: 200 });
}
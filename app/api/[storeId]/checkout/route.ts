import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { headers } from "next/headers";

// since we have different applications on different hosts we need to configure CORS policy

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// first we pass our cors policy
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productsAndQuantity } = await req.json();

  if (!productsAndQuantity || productsAndQuantity.length === 0) {
    return new NextResponse("Product Ids are required", { status: 400 });
  }

  const productIds = Object.keys(productsAndQuantity);
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // Check if there is enough stock for each product
  const insufficientStockProducts = products.filter((product) => {
    const requestedQuantity = productsAndQuantity[product.id];
    return requestedQuantity > product.stock;
  });

  if (insufficientStockProducts.length > 0) {
    const productNames = insufficientStockProducts
      .map((product) => product.name)
      .join(", ");
    return new NextResponse(
      `Insufficient stock for products: ${productNames}`,
      { status: 400 }
    );
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  products.forEach((product) => {
    const quantity = productsAndQuantity[product.id];
    line_items.push({
      quantity: quantity,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
    });
  });

  // this part of the code creates an array of objects,
  // each representing an orderItem to be associated with the order being created.
  // Each orderItem is connected to a product in the database using its ID.
  const order = await prismadb.order.create({
    data: {
      store: {
        connect: { id: params.storeId },
      },
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          productId: productId,
          totalPrice:
            productsAndQuantity[productId] *
            (products.find((p) => p.id === productId)?.price ?? 0),
          quantity: productsAndQuantity[productId],
        })),
      },
    },
  });

  // metadata is referencing orderId so that its isPaid prop is changed.

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}

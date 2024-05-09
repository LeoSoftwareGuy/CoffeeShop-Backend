import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Routes for creating new coffeeBrand and gettign all coffeeBrands available for specific store

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard was not chosen", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // If user is authenticated so he has userId but there is no store under this user,
    // it means he is trying to create category for store which does not belong to him.
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const coffeeBrand = await prismadb.coffeeBrand.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(coffeeBrand);
  } catch (error) {
    console.log("COFFEEBRANDS_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const coffeeBrands = await prismadb.coffeeBrand.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(coffeeBrands);
  } catch (error) {
    console.log("COFFEEBRANDS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

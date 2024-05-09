import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Routes for creating new origin and gettign all origins available for specific store

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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
    // it means he is trying to create color for store which does not belong to him.
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const origin = await prismadb.origin.create({
      data: {
        name,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(origin);
  } catch (error) {
    console.log("ORIGINS_POST", error);
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

    const origins = await prismadb.origin.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(origins);
  } catch (error) {
    console.log("ORIGINS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

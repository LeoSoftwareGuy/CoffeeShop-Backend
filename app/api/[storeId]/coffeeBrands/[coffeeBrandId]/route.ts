import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Routes to get, edit or delelte existing coffeeBrand under specific store

interface IParams {
  coffeeBrandId: string;
  storeId: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { coffeeBrandId } = params;

    if (!coffeeBrandId) {
      return new NextResponse("CoffeeBrand Id is required", { status: 400 });
    }

    const coffeeBrand = await prismadb.coffeeBrand.findUnique({
      where: {
        id: coffeeBrandId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(coffeeBrand);
  } catch (error) {
    console.log("COFFEEBRAND_GET", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();
    const { coffeeBrandId, storeId } = params;

    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!coffeeBrandId) {
      return new NextResponse("Coffee Brand Id is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const coffeeBrand = await prismadb.coffeeBrand.updateMany({
      where: {
        id: coffeeBrandId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(coffeeBrand);
  } catch (error) {
    console.log("COFFEEBRAND_PATCH", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();
    const { coffeeBrandId, storeId } = params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!coffeeBrandId) {
      return new NextResponse("Coffee Brand Id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const coffeeBrand = await prismadb.coffeeBrand.deleteMany({
      where: {
        id: coffeeBrandId,
      },
    });

    return NextResponse.json(coffeeBrand);
  } catch (error) {
    console.log("COFFEEBRAND_DELETE", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

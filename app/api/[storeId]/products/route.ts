import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Routes for creating new product and gettign all products available for specific store

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      images,
      price,
      coffeeBrandId,
      intensityId,
      originId,
      sizeId,
      stock,
      isFeatured,
      isArchived,
      description
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!coffeeBrandId) {
      return new NextResponse("Coffee Brand must be chosen", { status: 400 });
    }

    if (!intensityId) {
      return new NextResponse("Instensity must be chosen", { status: 400 });
    }

    if (!originId) {
      return new NextResponse("Origin must be chosen", { status: 400 });
    }

    if (!stock) {
      return new NextResponse("Stock must be chosen", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size must be chosen", { status: 400 });
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
    // it means he is trying to create billboard for store which does not belong to him.
    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        stock,
        isFeatured,
        isArchived,
        originId,
        coffeeBrandId,
        intensityId,
        sizeId,
        storeId: params.storeId,
        description,
        images: {
          createMany: {
            data: [...images.map((image: { url: "string" }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("PRODUCTS_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// We are not just returning based on storeId but also based on filters provided.
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const coffeeBrandId = searchParams.get("coffeeBrandId") || undefined;
    const intensityId = searchParams.get("intensityId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const originId = searchParams.get("originId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        coffeeBrandId,
        intensityId,
        originId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        coffeeBrand: true,
        intensity: true,
        origin: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("PRODUCTS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

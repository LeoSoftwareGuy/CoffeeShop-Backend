import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Routes to get, edit or delelte existing origin under specific store

interface IParams {
  originId: string;
  storeId: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { originId } = params;

    if (!originId) {
      return new NextResponse("Origin Id is required", { status: 400 });
    }

    const origin = await prismadb.origin.findUnique({
      where: {
        id: originId,
      },
    });

    return NextResponse.json(origin);
  } catch (error) {
    console.log("ORIGIN_GET", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();
    const { originId, storeId } = params;

    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!originId) {
      return new NextResponse("Origin Id is required", { status: 400 });
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

    const origin = await prismadb.origin.updateMany({
      where: {
        id: originId,
      },
      data: {
        name
      },
    });

    return NextResponse.json(origin);
  } catch (error) {
    console.log("ORIGIN_PATCH", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();
    const { originId, storeId } = params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!originId) {
      return new NextResponse("Origin Id is required", { status: 400 });
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

    const origin = await prismadb.origin.deleteMany({
      where: {
        id: originId,
      },
    });

    return NextResponse.json(origin);
  } catch (error) {
    console.log("ORIGIN_DELETE", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

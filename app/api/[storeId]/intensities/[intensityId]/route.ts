import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Routes to get, edit or delelte existing intensity under specific store

interface IParams {
  intensityId: string;
  storeId: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { intensityId } = params;

    if (!intensityId) {
      return new NextResponse("Intensity Id is required", { status: 400 });
    }

    const intensity = await prismadb.intensity.findUnique({
      where: {
        id: intensityId,
      },
    });

    return NextResponse.json(intensity);
  } catch (error) {
    console.log("INTENSITY_GET", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();
    const { intensityId, storeId } = params;

    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!intensityId) {
      return new NextResponse("Intensity Id is required", { status: 400 });
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

    const intensity = await prismadb.intensity.updateMany({
      where: {
        id: intensityId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(intensity);
  } catch (error) {
    console.log("INTENSITY_PATCH", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = auth();
    const { intensityId, storeId } = params;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!intensityId) {
      return new NextResponse("Intensity Id is required", { status: 400 });
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

    const intensity = await prismadb.intensity.deleteMany({
      where: {
        id: intensityId,
      },
    });

    return NextResponse.json(intensity);
  } catch (error) {
    console.log("INTENSITY_DELETE", error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}

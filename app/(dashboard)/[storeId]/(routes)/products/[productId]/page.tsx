import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  let product = null;
  if (params.productId !== "new") {
    product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });
  }

  // Find all categories, sizes and colors connected to the current store
  const coffeeBrands = await prismadb.coffeeBrand.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const intensities = await prismadb.intensity.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const origins = await prismadb.origin.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          coffeeBrands={coffeeBrands}
          intensities={intensities}
          origins={origins}
          sizes={sizes}
          initialData={product}
        />
      </div>
    </div>
  );
};

export default ProductPage;

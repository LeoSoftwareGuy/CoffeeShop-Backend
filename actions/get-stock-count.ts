import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string) => {
  const availableProducts = await prismadb.product.findMany({
    where: {
      storeId,
      isArchived: false,
    },
  });

  const stockCount = availableProducts.reduce((total, item) => {
    return total + item.stock;
  }, 0);

  return stockCount;
};

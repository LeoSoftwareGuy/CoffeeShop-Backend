import prismadb from "@/lib/prismadb";
import CoffeeBrandForm from "./components/coffeeBrand-form";

const CoffeeBrandPage = async ({
  params,
}: {
  params: { coffeeBrandId: string; storeId: string };
}) => {
  let coffeeBrand = null;
  if (params.coffeeBrandId !== "new") {
    coffeeBrand = await prismadb.coffeeBrand.findUnique({
      where: {
        id: params.coffeeBrandId,
      },
    });
  }

  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CoffeeBrandForm initialData={coffeeBrand} billboards={billboards} />
      </div>
    </div>
  );
};

export default CoffeeBrandPage;

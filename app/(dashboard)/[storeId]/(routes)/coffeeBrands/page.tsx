import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { CoffeeBrandClient } from "./components/client";
import { CoffeeBrandColumn } from "./components/columns";

const CoffeeBrandsPage = async ({ params }: { params: { storeId: string } }) => {
  const coffeeBrands = await prismadb.coffeeBrand.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCoffeeBrands: CoffeeBrandColumn[] = coffeeBrands.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CoffeeBrandClient data={formattedCoffeeBrands} />
      </div>
    </div>
  );
};

export default CoffeeBrandsPage;

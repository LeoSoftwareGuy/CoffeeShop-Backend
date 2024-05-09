import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { IntensityClient } from "./components/client";
import { IntensityColumn } from "./components/columns";

const IntensityPage = async ({ params }: { params: { storeId: string } }) => {
  const intensities = await prismadb.intensity.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedIntensities: IntensityColumn[] = intensities.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <IntensityClient data={formattedIntensities} />
      </div>
    </div>
  );
};

export default IntensityPage;

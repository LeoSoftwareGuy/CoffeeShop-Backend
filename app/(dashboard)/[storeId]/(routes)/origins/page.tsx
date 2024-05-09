import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { OriginColumn } from "./components/components/columns";
import { OriginClient } from "./components/components/client";

const OriginsPage = async ({ params }: { params: { storeId: string } }) => {
  const origins = await prismadb.origin.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: OriginColumn[] = origins.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OriginClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default OriginsPage;

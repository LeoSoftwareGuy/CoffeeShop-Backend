"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { IntensityColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";



export const revalidate = 0;
interface IntensityClientProps {
  data: IntensityColumn[];
}

export const IntensityClient: React.FC<IntensityClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Intensities (${data.length})`}
          description="Manage intensities for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/intensities/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Sizes" />
      <Separator />
      <ApiList entityName="intensities" entityIdName="intensityId" />
    </>
  );
};

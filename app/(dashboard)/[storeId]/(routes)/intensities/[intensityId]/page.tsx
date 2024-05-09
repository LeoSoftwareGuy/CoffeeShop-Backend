import prismadb from "@/lib/prismadb";
import IntensityForm from "./components/intensity-form";

const IntensityPage = async ({ params }: { params: { intensityId: string } }) => {
  let intensity = null;
  if (params.intensityId !== "new") {
    intensity = await prismadb.intensity.findUnique({
      where: {
        id: params.intensityId,
      },
    });
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <IntensityForm initialData={intensity} />
      </div>
    </div>
  );
};

export default IntensityPage;

import prismadb from "@/lib/prismadb";
import OriginForm from "./components/origin-form";
import useCountries from "@/hooks/use-countries";


const OriginPage = async ({ params }: { params: { originId: string } }) => {
  let origin = null;
  if (params.originId !== "new") {
    origin = await prismadb.origin.findUnique({
      where: {
        id: params.originId,
      },
    });
  }

  var allcountries = useCountries();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OriginForm initialData={origin} countries={allcountries} />
      </div>
    </div>
  );
};

export default OriginPage;

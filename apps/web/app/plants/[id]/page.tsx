import PlantDetail from "@/components/PlantDetail";

export const metadata = {
  title: "Detail Tanaman - LeafLens",
};

export default function PlantDetailPage({ params }: { params: { id: string } }) {
  return <PlantDetail id={params.id} />;
}

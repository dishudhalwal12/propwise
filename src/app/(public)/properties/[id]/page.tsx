import { PropertyDetailsClient } from "@/components/property/property-details-client";

export default async function PropertyDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="container-shell py-12 lg:py-16">
      <PropertyDetailsClient id={id} />
    </main>
  );
}

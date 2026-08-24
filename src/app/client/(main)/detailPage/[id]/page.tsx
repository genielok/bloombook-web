import { ShopeDetailClient } from "./ShopDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <ShopeDetailClient id={id} />
    </div>
  );
}

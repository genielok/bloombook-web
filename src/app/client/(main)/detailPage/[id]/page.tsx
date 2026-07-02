import { getShopDetail } from "@/app/api/shopDetail/data";
import { ShopeDetailClient } from "./ShopDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shopDetail = getShopDetail(id);

  return (
    <div>
      <ShopeDetailClient shopDetail={shopDetail} />
    </div>
  );
}

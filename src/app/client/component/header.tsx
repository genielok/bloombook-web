import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/mockAuth";
import { HeaderClient } from "./headerClient";

export async function HeaderComponent(props: { children?: ReactNode }) {
  const user = await getCurrentUser();

  return <HeaderClient user={user}>{props.children}</HeaderClient>;
}

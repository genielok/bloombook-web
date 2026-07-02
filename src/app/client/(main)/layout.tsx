import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderComponent } from "../component/header";

export default function ClientMainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bloom-bg text-bloom-text">
      <HeaderComponent>
        <nav className="hidden gap-8 text-[15px] text-[#4a4540] md:flex">
          <Link href="/client/explore">Explore</Link>
        </nav>
      </HeaderComponent>
      {children}
    </div>
  );
}

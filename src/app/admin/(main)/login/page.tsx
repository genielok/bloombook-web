import { Suspense } from "react";

import { AdminAuthPage } from "./components/admin-auth-page";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminAuthPage mode="login" />
    </Suspense>
  );
}

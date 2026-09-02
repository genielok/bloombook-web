import { Suspense } from "react";

import { AdminAuthPage } from "../login/components/admin-auth-page";

export default function AdminRegisterPage() {
  return (
    <Suspense fallback={null}>
      <AdminAuthPage mode="register" />
    </Suspense>
  );
}

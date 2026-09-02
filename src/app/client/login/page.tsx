import Link from "next/link";
import { Suspense } from "react";
import { CreateAccountComponent } from "./components/CreateAccountComponent";
import { SignInComponent } from "./components/SignInComponent";
// import Image from "next/image";

// const signInWithGoogle = async () => {
//   "use server";
//   await signIn("google", { redirectTo: "/client/explore" });
// };

// function GoogleSignInButton() {
//   return (
//     <form action={signInWithGoogle}>
//       <button
//         type="submit"
//         className="flex w-full items-center justify-center gap-3 rounded-[10px] border border-[#DADCE0] bg-white px-4 py-3.5 text-[15px] font-semibold text-[#3c4043] transition hover:bg-bloom-soft focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-bloom-accent/25"
//       >
//         <Image src="/google.svg" alt="Google" width={18} height={18} />
//         Continue with Google
//       </button>
//     </form>
//   );
// }

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string | string[] }>;
}) {
  const params = searchParams ? await searchParams : {};
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const isCreatingAccount = mode === "create";

  return (
    <div className="min-h-screen overflow-hidden rounded-sm bg-bloom-bg shadow-card lg:grid lg:grid-cols-2">
      <div className="hidden bg-bloom-text p-14 text-bloom-bg lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="font-display text-[26px]">
          Bloombook <span className="text-bloom-accent">❋</span>
        </Link>

        <div>
          <h1 className="font-display text-[44px] font-normal leading-[1.12]">
            Your studios,
            <br />
            your bookings,
            <br />
            <span className="font-display-italic italic">in one place.</span>
          </h1>
          <p className="mt-6 max-w-[380px] text-[16px] leading-[1.6] text-[#B7A99B]">
            Sign in to rebook your favorites in a tap, track your visits, and
            check out faster.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[#B7A99B]">
          <span className="text-bloom-success">●</span>
          400+ studios across Europe
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center px-5 py-12 md:px-10 lg:min-h-0 lg:px-14 lg:py-16">
        <div className="w-full max-w-[440px]">
          <div className="text-center lg:text-left">
            <Link href="/" className="font-display text-[30px] lg:hidden">
              Bloombook <span className="text-bloom-accent">❋</span>
            </Link>
            <h1 className="mt-10 font-display text-[34px] font-normal leading-[1.1] lg:mt-0">
              {isCreatingAccount ? "Create an account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-[15px] text-bloom-subtle">
              {isCreatingAccount
                ? "Save your details and manage every booking in one place."
                : "Sign in to manage your bookings."}
            </p>
          </div>

          <div className="mt-8">
            {/* <GoogleSignInButton /> */}
            {isCreatingAccount ? (
              <CreateAccountComponent />
            ) : (
              <Suspense fallback={null}>
                <SignInComponent />
              </Suspense>
            )}
          </div>

          <p className="mt-6 text-center text-[14px] text-bloom-subtle">
            {isCreatingAccount ? "Already have an account? " : "New here? "}
            <Link
              href={
                isCreatingAccount
                  ? "/client/login"
                  : "/client/login?mode=create"
              }
              className="font-semibold text-bloom-accent-dark"
            >
              {isCreatingAccount ? "Sign in" : "Create an account"}
            </Link>{" "}
            · or{" "}
            <Link
              href="/client/explore"
              className="font-semibold text-bloom-text underline underline-offset-2"
            >
              book as a guest
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

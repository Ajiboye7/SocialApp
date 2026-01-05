"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";


import ContentSkeleton from "@/components/ContentSkeleton";
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  
  const { item: user, status: currentUserStatus } = useSelector(
    (state: RootState) => state.user.currentUser
  );

  useEffect(() => {
    
    if (!isLoaded) return;

    
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    if (currentUserStatus === "loading") return;

    if (currentUserStatus === "succeeded") {
      if (!user) {
        router.replace("/sign-in");
        return;
      }
    
      if (!user.onboarded && pathname !== "/onboarding") {
        router.replace("/onboarding");
        return;
      }

      if (user.onboarded && pathname === "/onboarding") {
        router.replace("/");
        return;
      }
    }
  }, [isLoaded, isSignedIn, currentUserStatus, user, router, pathname]);

 
  if (
    !isLoaded ||
    currentUserStatus === "loading" ||
    !user ||
    (!user.onboarded && pathname !== "/onboarding")
  ) {
    return (
      <section className="bg-dark-1 flex-1 min-h-screen pt-30 px-10 lg:px-20 pb-20">
        <div className="mx-auto w-full max-w-4xl">
          <ContentSkeleton items={5} avatar lines={3} title />
        </div>
      </section>
    );
  }

  return <>{children}</>
}


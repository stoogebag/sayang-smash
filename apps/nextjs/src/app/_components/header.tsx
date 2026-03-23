import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@acme/ui/button";

import { getSession } from "~/auth/server";

export async function Header() {
  const session = await getSession();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">trivtriv</span>
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-muted-foreground text-sm">
                {session.user.name}
              </span>
              <form
                action={async () => {
                  "use server";
                  const { auth } = await import("~/auth/server");
                  const { headers } = await import("next/headers");
                  await auth.api.signOut({ headers: await headers() });
                  redirect("/");
                }}
              >
                <Button variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                const { auth } = await import("~/auth/server");
                const res = await auth.api.signInSocial({
                  body: {
                    provider: "google",
                    callbackURL: "/",
                  },
                });
                if (!res.url) {
                  throw new Error("No URL returned");
                }
                redirect(res.url);
              }}
            >
              <Button size="sm">Sign in</Button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}

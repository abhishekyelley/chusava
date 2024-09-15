import Link from "next/link";

export function BaseAuth({
  children,
  heading,
  subheading,
  terms = false,
}: {
  children: React.ReactNode;
  heading: string;
  subheading: string;
  terms?: boolean;
}) {
  return (
    <main className="min-h-[calc(100vh-57px-97px)] flex-1">
      <div className="container relative pb-10">
        <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
          <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {heading}
                </h1>
                <p className="text-sm text-muted-foreground">{subheading}</p>
              </div>
              {children}
              {terms && (
                <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

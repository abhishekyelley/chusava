import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { paths } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-57px-97px)] flex-1">
      <div className="container relative pb-10">
        <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            Keep all suggestions at once place.
          </h1>
          <span className="max-w-[750px] text-center text-lg font-light text-foreground">
            A website where you can remember who suggested what.
          </span>
          <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
            <Button variant="default" asChild>
              <Link href={paths.login}>
                Login
                <ArrowRightIcon className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
        <div className="w-full flex justify-center relative">
          <Image
            src="/demo-light-min.png"
            width={1080}
            height={608}
            alt="demo"
            priority
            className="border rounded-xl shadow-sm dark:hidden"
          />
          <Image
            src="/demo-dark-min.png"
            width={1080}
            height={608}
            alt="demo-dark"
            priority
            className="border border-zinc-600 rounded-xl shadow-sm hidden dark:block dark:shadow-gray-500/5"
          />
          <Image
            src="/demo-mobile-light-min.png"
            width={228}
            height={494}
            alt="demo-mobile"
            className="border rounded-xl absolute bottom-0 right-0 hidden lg:block dark:hidden"
          />
          <Image
            src="/demo-mobile-dark-min.png"
            width={228}
            height={494}
            alt="demo-mobile"
            className="border border-zinc-600 rounded-xl absolute bottom-0 right-0 hidden dark:lg:block"
          />
        </div>
      </div>
    </main>
  );
}

"use client";

import { ContentLayout } from "@/components/layout/content-layout";
import GeneralLayout from "@/components/layout/layout";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60000,
    },
  },
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <GeneralLayout>
        <ContentLayout title={"Hey Man!"}>{children}</ContentLayout>
      </GeneralLayout>
    </QueryClientProvider>
  );
}

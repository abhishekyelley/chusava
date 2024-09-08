import { ContentLayout } from "@/components/layout/content-layout";
import GeneralLayout from "@/components/layout/layout";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GeneralLayout>
      <ContentLayout title={"Hey Man!"}>{children}</ContentLayout>
    </GeneralLayout>
  );
}

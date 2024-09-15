"use client";

import { ComingUp } from "@/components/dashboard/coming-up";
import { Friends } from "@/components/dashboard/friends/friends";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";

const tabs = [
  {
    id: "friends",
    name: "Friends",
    element: <Friends />,
  },
  {
    id: "coming-up",
    name: "Coming Up",
    element: <ComingUp />,
  },
];

export default function Page() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCallback(
    (queries: Array<{ name: string; value: string }>) => {
      const params = new URLSearchParams(searchParams.toString());
      queries.forEach(({ name, value }) => params.set(name, value));
      return params.toString();
    },
    [searchParams]
  );
  const tabParam = searchParams.get("tab");
  const tab = tabs.find((item) => item.id === tabParam);
  function handleClick(id: string) {
    router.push(
      pathname +
        "?" +
        createQueryString([
          {
            name: "tab",
            value: id,
          },
        ])
    );
  }
  return (
    <Tabs defaultValue={tab ? tab.id : tabs[0].id} className="w-full">
      <TabsList className="grid w-max grid-cols-2">
        {tabs.map(({ id, name }) => (
          <TabsTrigger
            key={id}
            value={id}
            onClick={() => handleClick(id)}
          >
            {name}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ id, element }) => (
        <TabsContent key={id} value={id}>
          <div className="p-5 rounded-xl border border-solid">
            {element}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

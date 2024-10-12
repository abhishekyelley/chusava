"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  FriendsResponse,
  RequestsPropsType,
} from "@/types/dashboard";
import { ErrorResponse } from "@/types/api/error";
import { Requests } from "@/components/dashboard/friends/requests";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axios";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";

const tabs = [
  {
    id: "incoming",
    name: "Incoming",
    element: (props: Omit<RequestsPropsType, "type">) => (
      <Requests {...props} type={"incoming"} />
    ),
  },
  {
    id: "outgoing",
    name: "Pending",
    element: (props: Omit<RequestsPropsType, "type">) => (
      <Requests {...props} type={"outgoing"} />
    ),
  },
  {
    id: "all",
    name: "All",
    element: (props: Omit<RequestsPropsType, "type">) => (
      <Requests {...props} type={"all"} />
    ),
  },
];

export function Friends() {
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
  const { data, error, isLoading, isError } = useQuery<
    FriendsResponse[],
    ErrorResponse
  >({
    queryKey: ["dashboard", "friends"],
    queryFn: async ({ signal }) => {
      const response = await axios.get<FriendsResponse[]>(
        "/api/friends",
        { signal }
      );
      return response.data;
    },
  });
  function handleClick(id: string) {
    router.push(
      pathname +
        "?" +
        createQueryString([
          {
            name: "sub",
            value: id,
          },
        ])
    );
  }
  const subParam = searchParams.get("sub");
  const sub = tabs.find((item) => item.id === subParam);
  return (
    <div>
      <Tabs
        defaultValue={sub ? sub.id : tabs[0].id}
        className="w-full grid gap-4"
      >
        <TabsList className={cn("grid w-max", "grid-cols-3")}>
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
        <div className="relative w-full">
          <Input
            className="pl-9"
            placeholder="Search..."
            id="search"
          />
          <Label htmlFor="search">
            <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
          </Label>
        </div>
        {tabs.map(({ id, element }) => (
          <TabsContent key={id} value={id}>
            {element({ data: data!, error, isLoading, isError })}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useCallback, useEffect, useState } from "react";
import { Results } from "@/components/people/results";
import { SearchBox } from "./search-box";
import {
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
export function AddFriends() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [value, setValue] = useState(
    searchParams.get("q") ?? ""
  );
  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setValue(e.target.value);
    }, []);
  const search = useDebounce(value, 500);
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    if (search) {
      urlParams.set("q", search);
      router.push(pathname + "?" + urlParams);
    }
  }, [search, router, pathname, searchParams]);
  return (
    <div>
      <SearchBox
        value={value}
        handleChange={handleChange}
      />
      <Results search={search} typing={search !== value} />
    </div>
  );
}

"use client";

import { useDebounce } from "@/hooks/use-debounce";
import { useCallback, useState } from "react";
import { Results } from "@/components/find-people/results";
import { SearchBox } from "./search-box";
export function AddFriends() {
  const [value, setValue] = useState("");
  const handleChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setValue(e.target.value);
    }, []);
  const search = useDebounce(value, 500);
  return (
    <div>
      <SearchBox
        value={value}
        handleChange={handleChange}
      />
      <Results search={search} typing={search!==value} />
    </div>
  );
}

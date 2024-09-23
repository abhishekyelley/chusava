import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { memo } from "react";

export const SearchBox = memo(
  ({
    value,
    handleChange,
  }: {
    value: string;
    handleChange: React.ChangeEventHandler<HTMLInputElement>;
  }) => {
    return (
      <div className="relative w-full">
        <Input
          className="pl-9 my-4"
          placeholder="Enter name or username..."
          value={value}
          onChange={handleChange}
          id="search"
        />
        <Label htmlFor="search">
          <Search className="absolute left-0 top-0 m-2.5 h-4 w-4 text-muted-foreground" />
        </Label>
      </div>
    );
  }
);

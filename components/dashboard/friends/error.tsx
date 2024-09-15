import { Button } from "@/components/ui/button";
import { ErrorResponse } from "@/types/api/error";
import { Bug, RotateCw } from "lucide-react";

export function FriendsError({
  error,
}: {
  error?: ErrorResponse | null;
}) {
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-5xl text-center">
        Oops! Something went wrong...
      </h1>
      {error && (
        <p className="text-muted-foreground">{error.message}</p>
      )}
      <Bug className="self-center text-red-600" size={96} />
      <Button
        onClick={() => window.location.reload()}
        className="w-max self-center "
        variant="secondary"
      >
        <RotateCw className="mr-0 md:mr-2 h-[16px] w-[16px]" />
        <span className="hidden md:block">Reload</span>
      </Button>
    </div>
  );
}

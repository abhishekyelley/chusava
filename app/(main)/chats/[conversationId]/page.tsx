import { NoResults } from "@/components/dashboard/friends/no-results";
import { Theater } from "lucide-react";

export default function Page() {
  return (
    <div className="flex self-center justify-center w-full">
      <NoResults
        message="Looks like there's more..."
        subtitle="Pick a list now"
        icon={Theater}
      />
    </div>
  );
}

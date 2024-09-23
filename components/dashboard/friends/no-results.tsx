import { Binoculars, LucideIcon } from "lucide-react";

export const NoResults = ({
  message = "Yeah, you kinda lonely...",
  icon = Binoculars,
}: {
  message?: string;
  icon?: LucideIcon;
}) => {
  const Icon = icon;
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-5xl text-center text-muted-foreground">
        {message}
      </h1>
      <Icon
        className="self-center text-muted-foreground"
        size={96}
      />
    </div>
  );
};

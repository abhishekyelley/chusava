import { Binoculars, LucideIcon } from "lucide-react";

export const NoResults = ({
  message = "Yeah, you kinda lonely...",
  subtitle = "",
  icon = Binoculars,
}: {
  message?: string;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
}) => {
  const Icon = icon;
  return (
    <div className="flex flex-col space-y-8">
      <h1 className="text-5xl text-center text-muted-foreground">
        {message}
      </h1>
      <h4 className="text-2xl text-center text-muted-foreground">{subtitle}</h4>
      <Icon
        className="self-center text-muted-foreground"
        size={96}
      />
    </div>
  );
};

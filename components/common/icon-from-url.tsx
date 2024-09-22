import { getOrigin } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  Facebook,
  Github,
  Instagram,
  Letterboxd,
  Reddit,
  Twitch,
  X,
} from "@/components/svg";
import { Link, Minus } from "lucide-react";

export function IconFromUrl({ url }: { url: string }) {
  const hostname = getOrigin(url);
  const { theme } = useTheme();
  const props = {
    height: 18,
    width: 18,
    fill: theme === "dark" ? "#fff" : "000",
  };
  let icon = <></>;
  switch (hostname) {
    case "https://letterboxd.com": {
      icon = <Letterboxd {...props} />;
      break;
    }
    case "https://facebook.com": {
      icon = <Facebook {...props} />;
      break;
    }
    case "https://instagram.com": {
      icon = <Instagram {...props} />;
      break;
    }
    case "https://reddit.com": {
      icon = <Reddit {...props} />;
      break;
    }
    case "https://github.com": {
      icon = <Github {...props} />;
      break;
    }
    case "https://twitch.com": {
      icon = <Twitch {...props} />;
      break;
    }
    case "https://x.com": {
      icon = <X {...props} />;
      break;
    }
    case "https://twitter.com": {
      icon = <X {...props} />;
      break;
    }
    case "": {
      icon = <Minus height={18} width={18} />;
      break;
    }
    default: {
      icon = <Link height={18} width={18} />;
      break;
    }
  }
  return <>{icon}</>;
}

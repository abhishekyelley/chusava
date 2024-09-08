import { paths } from "@/lib/constants";

export function generateCases(pathname: string) {
  return {
    UserGoingToRoot: pathname.startsWith("/"),
    UserGoingToLogin: pathname.startsWith(paths.login),
    UserGoingToProtected: (
      pathname.startsWith(paths.dashboard) ||
      pathname.startsWith(paths.account)
    ),
  }
}
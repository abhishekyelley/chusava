import { paths } from "@/lib/constants";

export function generateCases(pathname: string) {
  return {
    UserGoingToRoot: pathname.endsWith("/"),
    UserGoingToAuth: (
      pathname.endsWith(paths.login) ||
      pathname.endsWith(paths.signup)
    ),
    UserGoingToProtected: (
      !pathname.startsWith(paths.login) &&
      !pathname.startsWith(paths.signup) &&
      !pathname.endsWith("/")
    ),
    UserGoingToJustSettings: pathname.endsWith(paths.settings),
  }
}
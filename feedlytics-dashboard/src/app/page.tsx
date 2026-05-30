import { redirect } from "next/navigation";

import { routes } from "@/config/routes";

// Root shell: send everyone to /login. After sign-in, hooks push `/dashboard`.
// Do not gate `/dashboard` in edge `proxy` on `refreshToken`: that cookie is
// issued by the API origin (or scoped to `/api/v1/auth`), so it is not present
// on document requests to this Next host — a cookie check always redirected.
export default function RootPage(): never {
  redirect(routes.login);
}

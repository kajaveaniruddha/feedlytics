import { LoginFormDynamic } from "./__components/LoginFormDynamic";

/**
 * Thin route shell: renders the login form via a Client boundary (see
 * `LoginFormDynamic` for why `ssr: false` lives there, not here).
 */
export default function LoginPage() {
  return <LoginFormDynamic />;
}

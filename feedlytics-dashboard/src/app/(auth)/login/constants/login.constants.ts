import { routes } from "@/config/routes";

export const loginCopy = {
  heading: "Sign In",
  subheading: "Enter your email and password to sign in.",
  emailLabel: "Email",
  emailPlaceholder: "mail@feedlytics.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Min. 8 characters",
  rememberMe: "Keep me logged in",
  forgotPassword: "Forgot password?",
  submit: "Sign In",
  dividerLabel: "or",
  noAccountPrompt: "Not registered yet?",
  createAccountCta: "Create an Account",
  signupHref: routes.signup,
  forgotPasswordHref: "#",
} as const;

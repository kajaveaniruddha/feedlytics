import { routes } from "@/config/routes";

export const signupCopy = {
  heading: "Create an Account",
  subheading: "Enter your details to get started with Feedlytics.",
  nameLabel: "Name",
  namePlaceholder: "Ada Lovelace",
  emailLabel: "Email",
  emailPlaceholder: "mail@feedlytics.com",
  passwordLabel: "Password",
  passwordPlaceholder: "Min. 8 characters",
  submit: "Create Account",
  dividerLabel: "or",
  termsCopy: "By signing up you agree to our Terms & Privacy Policy.",
  haveAccountPrompt: "Already have an account?",
  signInCta: "Sign in",
  loginHref: routes.login,
} as const;

export const verifyCopy = {
  heading: "Verify your email",
  subheading: "Enter the 6-digit code we emailed you to finish setup.",
  codeLabel: "Verification code",
  codePlaceholder: "••••••",
  emailLabel: "Email",
  submit: "Verify Email",
  resendPrompt: "Didn't get the code?",
  resendCta: "Resend",
} as const;

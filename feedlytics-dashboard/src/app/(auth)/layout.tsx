import { AuthSplitPane } from "@/components/layout/AuthSplitPane";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSplitPane>
      <ThemeToggle />
      {children}
    </AuthSplitPane>
  );
}

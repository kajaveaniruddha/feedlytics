import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartCardProps {
  title: string;
  description?: string;
  isLoading: boolean;
  loadingTitle?: string;
  loadingDescription?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({
  title,
  description,
  isLoading,
  loadingTitle,
  loadingDescription = "Please wait while we load your data.",
  footer,
  children,
  className,
}: ChartCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="items-center pb-0">
          <CardTitle>{loadingTitle || `Loading ${title}...`}</CardTitle>
          <CardDescription>{loadingDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-0">{children}</CardContent>
      {footer && <CardFooter className="flex flex-col gap-2 text-sm">{footer}</CardFooter>}
    </Card>
  );
}

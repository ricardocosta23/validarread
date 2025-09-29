import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface ValidationResultBadgeProps {
  result: string;
  className?: string;
}

export default function ValidationResultBadge({ result, className }: ValidationResultBadgeProps) {
  const isSuccess = result === "OK";
  
  return (
    <Badge 
      className={`${
        isSuccess 
          ? "bg-chart-2 text-white hover:bg-chart-2/80" 
          : "bg-chart-3 text-white hover:bg-chart-3/80"
      } ${className || ""}`}
      data-testid={`badge-validation-${result.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {isSuccess ? (
        <CheckCircle className="h-3 w-3 mr-1" />
      ) : (
        <XCircle className="h-3 w-3 mr-1" />
      )}
      {result}
    </Badge>
  );
}
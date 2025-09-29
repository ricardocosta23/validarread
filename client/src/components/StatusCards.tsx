import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";

interface StatusMetrics {
  totalWebhooks: number;
  successfulWebhooks: number;
  failedWebhooks: number;
  processingTime: number; // in ms
}

interface StatusCardsProps {
  metrics: StatusMetrics;
}

export default function StatusCards({ metrics }: StatusCardsProps) {
  const successRate = metrics.totalWebhooks > 0 
    ? Math.round((metrics.successfulWebhooks / metrics.totalWebhooks) * 100) 
    : 0;

  const getSuccessRateColor = () => {
    if (successRate >= 95) return "text-chart-2";
    if (successRate >= 80) return "text-chart-3";
    return "text-chart-4";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Webhooks</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="text-total-webhooks">
            {metrics.totalWebhooks}
          </div>
          <p className="text-xs text-muted-foreground">
            All processed webhooks
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful</CardTitle>
          <CheckCircle className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-2" data-testid="text-successful-webhooks">
            {metrics.successfulWebhooks}
          </div>
          <p className="text-xs text-muted-foreground">
            Validation passed (OK)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <XCircle className="h-4 w-4 text-chart-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-4" data-testid="text-failed-webhooks">
            {metrics.failedWebhooks}
          </div>
          <p className="text-xs text-muted-foreground">
            NÃO READEQUAR status
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getSuccessRateColor()}`} data-testid="text-success-rate">
            {successRate}%
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {metrics.processingTime}ms
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
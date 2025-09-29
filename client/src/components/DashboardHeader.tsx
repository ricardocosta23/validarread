import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Settings, Webhook } from "lucide-react";

interface DashboardHeaderProps {
  webhookStatus: "online" | "offline" | "processing";
  lastActivity?: Date;
  totalWebhooks: number;
  onSettingsClick?: () => void;
}

export default function DashboardHeader({ 
  webhookStatus, 
  lastActivity, 
  totalWebhooks,
  onSettingsClick 
}: DashboardHeaderProps) {
  const getStatusColor = () => {
    switch (webhookStatus) {
      case "online": return "bg-chart-2 text-white";
      case "processing": return "bg-chart-3 text-white";
      case "offline": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusText = () => {
    switch (webhookStatus) {
      case "online": return "Online";
      case "processing": return "Processing";
      case "offline": return "Offline";
      default: return "Unknown";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Webhook className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground" data-testid="text-app-title">
                Monday.com Webhook Processor
              </h1>
              <p className="text-sm text-muted-foreground">
                Board 7549606370 • {totalWebhooks} webhooks processed
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <Badge 
              className={getStatusColor()} 
              data-testid="badge-webhook-status"
            >
              {getStatusText()}
            </Badge>
          </div>

          {lastActivity && (
            <div className="text-sm text-muted-foreground" data-testid="text-last-activity">
              Last: {lastActivity.toLocaleTimeString()}
            </div>
          )}

          <Button 
            variant="outline" 
            size="icon"
            onClick={onSettingsClick}
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
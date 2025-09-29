import { useState, useEffect } from "react";
import DashboardHeader from "./DashboardHeader";
import StatusCards from "./StatusCards";
import WebhookLogTable from "./WebhookLogTable";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Webhook, Settings, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, type WebhookLog } from "@/lib/api";

// Test data for initial demonstration
async function createTestWebhookData() {
  const testPayload = {
    boardId: 7549606370,
    itemId: 98765,
    columnValues: {
      numero_opcao: { text: "1" },
      opc1a: { text: "Readequar produto conforme especificação" },
      opc2a: { text: null },
      opc3a: { text: null },
      opc4a: { text: null }
    }
  };
  
  try {
    await api.testWebhook(testPayload);
    console.log("Test webhook data created successfully");
  } catch (error) {
    console.log("Test webhook creation failed (might already exist):", error);
  }
}

export default function Dashboard() {
  const [webhookStatus, setWebhookStatus] = useState<"online" | "offline" | "processing">("online");
  const [lastActivity, setLastActivity] = useState(new Date());
  
  // Fetch webhook logs from API
  const { data: logs = [], isLoading: loading, refetch, error } = useQuery({
    queryKey: ['webhook-logs'],
    queryFn: () => api.getWebhookLogs(50),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const successfulLogs = logs.filter(log => log.validationResult === "valid" || log.validationResult === "OK");
  const failedLogs = logs.filter(log => log.validationResult !== "valid" && log.validationResult !== "OK");
  
  const metrics = {
    totalWebhooks: logs.length,
    successfulWebhooks: successfulLogs.length,
    failedWebhooks: failedLogs.length,
    processingTime: 245 // Average processing time
  };

  const handleRefresh = async () => {
    setWebhookStatus("processing");
    
    try {
      await refetch();
      setWebhookStatus("online");
      setLastActivity(new Date());
      console.log("Dashboard refreshed");
    } catch (error) {
      console.error("Failed to refresh:", error);
      setWebhookStatus("offline");
    }
  };

  const handleSettings = () => {
    console.log("Settings panel opened");
  };

  // Create some test data on first load if no logs exist
  useEffect(() => {
    if (logs.length === 0 && !loading && !error) {
      createTestWebhookData();
    }
  }, [logs, loading, error]);

  // Update last activity when logs change
  useEffect(() => {
    if (logs.length > 0) {
      setLastActivity(new Date());
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div />
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={loading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Dashboard Header */}
        <DashboardHeader 
          webhookStatus={webhookStatus}
          lastActivity={lastActivity}
          totalWebhooks={metrics.totalWebhooks}
          onSettingsClick={handleSettings}
        />

        {/* Status Cards */}
        <StatusCards metrics={metrics} />

        {/* Configuration Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Webhook className="h-4 w-4" />
                  Board Configuration
                </h4>
                <div className="space-y-1 text-sm">
                  <div>Board ID: <Badge variant="outline">7549606370</Badge></div>
                  <div>Endpoint: <code className="text-xs bg-muted px-1 rounded">/api/webhook</code></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Column Mapping
                </h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>Numero da Opção: <code className="text-xs">n_meros_1_mkm0pdr1</code></div>
                  <div>Opç1A: <code className="text-xs">lookup_mkm0wgd5</code></div>
                  <div>Opç2A: <code className="text-xs">dup__of_op_1_mkm0dav0</code></div>
                  <div>Opç3A: <code className="text-xs">dup__of_dup__of_op_1_mkm0aphv</code></div>
                  <div>Opç4A: <code className="text-xs">lookup_mkm02qw8</code></div>
                  <div>Status: <code className="text-xs">color_mkw88tvv</code></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Activity */}
        <WebhookLogTable logs={logs} loading={loading} />
      </div>
    </div>
  );
}
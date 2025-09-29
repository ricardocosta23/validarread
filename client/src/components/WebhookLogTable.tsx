import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ValidationResultBadge from "./ValidationResultBadge";
import { Calendar, Database } from "lucide-react";
import { type WebhookLog } from "@/lib/api";

interface WebhookLogTableProps {
  logs: WebhookLog[];
  loading?: boolean;
}

export default function WebhookLogTable({ logs, loading = false }: WebhookLogTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Recent Webhook Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded-md"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Recent Webhook Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No webhook activity yet</p>
            <p className="text-sm">Waiting for Monday.com webhooks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Recent Webhook Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className="border rounded-lg p-4 hover-elevate"
              data-testid={`webhook-log-${log.id}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" data-testid={`badge-item-${log.itemId}`}>
                      Item #{log.itemId}
                    </Badge>
                    <ValidationResultBadge result={log.validationResult} />
                    {log.processedAt && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {log.processedAt.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Opção:</span>
                      <div className="font-mono" data-testid={`text-option-${log.id}`}>
                        {log.numeroOpcao || "—"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Opç1A:</span>
                      <div className="font-mono truncate" data-testid={`text-opc1a-${log.id}`}>
                        {log.opc1a || "—"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Opç2A:</span>
                      <div className="font-mono truncate" data-testid={`text-opc2a-${log.id}`}>
                        {log.opc2a || "—"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Opç3A:</span>
                      <div className="font-mono truncate" data-testid={`text-opc3a-${log.id}`}>
                        {log.opc3a || "—"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Opç4A:</span>
                      <div className="font-mono truncate" data-testid={`text-opc4a-${log.id}`}>
                        {log.opc4a || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { z } from "zod";

// API Types based on our backend schema
export interface WebhookLog {
  id: string;
  boardId: string;
  itemId: string;
  numeroOpcao: string | null;
  opc1a: string | null;
  opc2a: string | null;
  opc3a: string | null;
  opc4a: string | null;
  validationResult: string;
  rawPayload: unknown;
  processedAt: Date | null;
}

// Transform API response dates to Date objects
const transformWebhookLog = (log: any): WebhookLog => ({
  ...log,
  processedAt: log.processedAt ? new Date(log.processedAt) : null,
});

// API endpoints
export const api = {
  // Fetch all webhook logs
  async getWebhookLogs(limit = 50): Promise<WebhookLog[]> {
    const response = await fetch(`/api/webhook-logs?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch webhook logs');
    }
    const logs = await response.json();
    return logs.map(transformWebhookLog);
  },

  // Fetch webhook logs by board ID
  async getWebhookLogsByBoardId(boardId: string, limit = 50): Promise<WebhookLog[]> {
    const response = await fetch(`/api/webhook-logs/board/${boardId}?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch webhook logs for board');
    }
    const logs = await response.json();
    return logs.map(transformWebhookLog);
  },

  // Health check
  async getHealth() {
    const response = await fetch('/api/health');
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },

  // Test webhook endpoint (for development)
  async testWebhook(payload: any) {
    const response = await fetch('/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Failed to test webhook');
    }
    return response.json();
  }
};
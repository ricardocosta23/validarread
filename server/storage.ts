import { type WebhookLog, type InsertWebhookLog, webhookLogs } from "@shared/schema";
import { randomUUID } from "crypto";
// No database imports needed for memory storage

export interface IStorage {
  createWebhookLog(log: InsertWebhookLog): Promise<WebhookLog>;
  getWebhookLogs(limit?: number): Promise<WebhookLog[]>;
  getWebhookLogsByBoardId(boardId: string, limit?: number): Promise<WebhookLog[]>;
}

export class MemStorage implements IStorage {
  private webhookLogs: Map<string, WebhookLog>;

  constructor() {
    this.webhookLogs = new Map();
  }

  async createWebhookLog(insertLog: InsertWebhookLog): Promise<WebhookLog> {
    const id = randomUUID();
    const log: WebhookLog = { 
      ...insertLog,
      numeroOpcao: insertLog.numeroOpcao || null,
      opc1a: insertLog.opc1a || null,
      opc2a: insertLog.opc2a || null,
      opc3a: insertLog.opc3a || null,
      opc4a: insertLog.opc4a || null,
      rawPayload: insertLog.rawPayload || null,
      id,
      processedAt: new Date()
    };
    this.webhookLogs.set(id, log);
    return log;
  }

  async getWebhookLogs(limit = 50): Promise<WebhookLog[]> {
    const logs = Array.from(this.webhookLogs.values())
      .sort((a, b) => b.processedAt!.getTime() - a.processedAt!.getTime())
      .slice(0, limit);
    return logs;
  }

  async getWebhookLogsByBoardId(boardId: string, limit = 50): Promise<WebhookLog[]> {
    const logs = Array.from(this.webhookLogs.values())
      .filter(log => log.boardId === boardId)
      .sort((a, b) => b.processedAt!.getTime() - a.processedAt!.getTime())
      .slice(0, limit);
    return logs;
  }
}

// Using memory storage only - no database implementation needed

// Use memory storage only (no database needed)
export const storage = new MemStorage();

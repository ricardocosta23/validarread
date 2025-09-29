import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Webhook processing schema
export const webhookLogs = pgTable("webhook_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  boardId: text("board_id").notNull(),
  itemId: text("item_id").notNull(),
  numeroOpcao: text("numero_opcao"),
  opc1a: text("opc1a"),
  opc2a: text("opc2a"),
  opc3a: text("opc3a"),
  opc4a: text("opc4a"),
  validationResult: text("validation_result").notNull(),
  rawPayload: jsonb("raw_payload"),
  processedAt: timestamp("processed_at").defaultNow(),
});

export const insertWebhookLogSchema = createInsertSchema(webhookLogs).omit({
  id: true,
  processedAt: true,
});

export type InsertWebhookLog = z.infer<typeof insertWebhookLogSchema>;
export type WebhookLog = typeof webhookLogs.$inferSelect;

// Monday.com webhook payload schema - flexible to handle various payload structures
export const mondayWebhookPayloadSchema = z.object({
  // Challenge verification for webhook setup
  challenge: z.string().optional(),
  
  // Actual webhook event data (flexible structure)
  event: z.object({
    type: z.string().optional(),
    boardId: z.union([z.number(), z.string()]).optional(),
    itemId: z.union([z.number(), z.string()]).optional(),
    columnValues: z.record(z.any()).optional(),
    pulseId: z.union([z.number(), z.string()]).optional(), // Alternative name for itemId
    board_id: z.union([z.number(), z.string()]).optional(), // Snake case version
    item_id: z.union([z.number(), z.string()]).optional(), // Snake case version
  }).optional(),
  
  // Alternative structure - sometimes Monday sends data directly
  boardId: z.union([z.number(), z.string()]).optional(),
  itemId: z.union([z.number(), z.string()]).optional(),
  pulseId: z.union([z.number(), z.string()]).optional(), // Alternative name
  board_id: z.union([z.number(), z.string()]).optional(), // Snake case
  item_id: z.union([z.number(), z.string()]).optional(), // Snake case
  columnValues: z.record(z.any()).optional(),
  column_values: z.record(z.any()).optional(), // Snake case version
  
  // Accept any additional fields
}).passthrough();

export type MondayWebhookPayload = z.infer<typeof mondayWebhookPayloadSchema>;

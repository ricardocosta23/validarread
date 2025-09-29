import type { Express } from "express";
import { createServer, type Server } from "http";
import { mondayWebhookPayloadSchema, type MondayWebhookPayload } from "@shared/schema";
import { z } from "zod";

// Monday.com API query function to get item details including mirror columns
async function queryMondayItem(boardId: string, itemId: string) {
  const apiToken = process.env.MONDAY_API_TOKEN;
  if (!apiToken) {
    throw new Error("MONDAY_API_TOKEN is required");
  }

  const query = `
    query($itemId: [ID!]) {
      items(ids: $itemId) {
        id
        name
        column_values {
          id
          text
          value
          type
          ... on MirrorValue {
            display_value
          }
        }
      }
    }
  `;

  const variables = {
    itemId: [itemId]
  };

  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Monday.com API error: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Monday.com GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result.data;
}

// Monday.com API mutation function
async function updateMondayColumn(boardId: string, itemId: string, columnId: string, value: string) {
  const apiToken = process.env.MONDAY_API_TOKEN;
  if (!apiToken) {
    throw new Error("MONDAY_API_TOKEN is required");
  }

  const mutation = `
    mutation($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
      change_column_value(
        board_id: $boardId,
        item_id: $itemId,
        column_id: $columnId,
        value: $value
      ) {
        id
      }
    }
  `;

  const variables = {
    boardId,
    itemId,
    columnId,
    value: JSON.stringify({ label: value })
  };

  const response = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiToken,
    },
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Monday.com API error: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`Monday.com GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook endpoint to receive Monday.com webhooks
  app.post("/api/webhook", async (req, res) => {
    try {
      const payload = req.body;

      // Log the actual payload for debugging
      console.log("Received webhook payload:", JSON.stringify(payload, null, 2));

      // Handle challenge verification
      if (payload.challenge) {
        return res.json({ challenge: payload.challenge });
      }

      // Basic validation of Monday.com webhook payload
      const parsedPayload = mondayWebhookPayloadSchema.parse(payload);

      // Extract relevant data from Monday.com payload - handle multiple structures
      const boardId = parsedPayload.event?.boardId ||
                     parsedPayload.event?.board_id ||
                     parsedPayload.boardId ||
                     parsedPayload.board_id;

      const itemId = parsedPayload.event?.itemId ||
                    parsedPayload.event?.item_id ||
                    parsedPayload.event?.pulseId ||
                    parsedPayload.itemId ||
                    parsedPayload.item_id ||
                    parsedPayload.pulseId;

      const webhookColumnValues = parsedPayload.event?.columnValues ||
                          parsedPayload.event?.column_values ||
                          parsedPayload.columnValues ||
                          parsedPayload.column_values;

      if (!boardId || !itemId) {
        console.log("Missing required fields in webhook payload:", { boardId, itemId });
        return res.status(400).json({
          success: false,
          error: "Missing boardId or itemId in webhook payload"
        });
      }

      // Query Monday.com to get all column values including mirror columns
      let itemData;
      try {
        itemData = await queryMondayItem(boardId.toString(), itemId.toString());
        console.log("Queried item data:", JSON.stringify(itemData, null, 2));
      } catch (queryError) {
        console.error("Failed to query Monday.com item:", queryError);
        return res.status(500).json({
          success: false,
          error: "Failed to query Monday.com item"
        });
      }

      if (!itemData.items || itemData.items.length === 0) {
        console.log("No item found with ID:", itemId);
        return res.status(404).json({
          success: false,
          error: "Item not found"
        });
      }

      const item = itemData.items[0];
      const columnValues = item.column_values;

      // Extract column values by ID, handling mirror columns
      const getColumnValue = (columnId: string) => {
        const column = columnValues.find((col: any) => col.id === columnId);
        if (column) {
          // For mirror columns, use display_value, otherwise use text
          if (column.type === "mirror" && column.display_value) {
            return column.display_value;
          }
          return column.text || null;
        }
        return null;
      };

      // Board-specific column mappings
      let numeroOpcaoColumnId: string;
      let opc1aColumnId: string;
      let opc2aColumnId: string;
      let opc3aColumnId: string;
      let opc4aColumnId: string;
      let statusColumnId: string;

      const boardIdStr = boardId.toString();

      if (boardIdStr === "7549606370") {
        // Original board mapping
        numeroOpcaoColumnId = "n_meros_1_mkm0pdr1";
        opc1aColumnId = "lookup_mkm0wgd5";
        opc2aColumnId = "dup__of_op_1_mkm0dav0";
        opc3aColumnId = "dup__of_dup__of_op_1_mkm0aphv";
        opc4aColumnId = "lookup_mkm02qw8";
        statusColumnId = "color_mkw88tvv";
      } else if (boardIdStr === "7598757472") {
        // Board 7598757472 mapping
        numeroOpcaoColumnId = "numeric_mkpn57vf";
        opc1aColumnId = "lookup_mkpn9brw";
        opc2aColumnId = "lookup_mkpnj297";
        opc3aColumnId = "lookup_mkpn4nzc";
        opc4aColumnId = "lookup_mkpn76e9";
        statusColumnId = "color_mkw8kg7f";
      } else if (boardIdStr === "7383259135") {
        // Third board mapping
        numeroOpcaoColumnId = "n_meros_1_mkm0erx8";
        opc1aColumnId = "lookup_mkm056dd";
        opc2aColumnId = "dup__of_op_1_mkm0qgp0";
        opc3aColumnId = "dup__of_op_2_mkm04w4x";
        opc4aColumnId = "dup__of_op_3_mkm0y8gd";
        statusColumnId = "color_mkw8nbzn";
      } else {
        console.log(`Unknown board ID: ${boardIdStr}, using default mapping`);
        // Default to original mapping for unknown boards
        numeroOpcaoColumnId = "n_meros_1_mkm0pdr1";
        opc1aColumnId = "lookup_mkm0wgd5";
        opc2aColumnId = "dup__of_op_1_mkm0dav0";
        opc3aColumnId = "dup__of_dup__of_op_1_mkm0aphv";
        opc4aColumnId = "lookup_mkm02qw8";
        statusColumnId = "color_mkw88tvv";
      }

      // Get the values we need for validation
      const numeroOpcao = getColumnValue(numeroOpcaoColumnId); // Numeric column for "Numero da Opção"
      const opc1a = getColumnValue(opc1aColumnId); // Mirror column Opç1A
      const opc2a = getColumnValue(opc2aColumnId); // Mirror column Opç2A
      const opc3a = getColumnValue(opc3aColumnId); // Mirror column Opç3A
      const opc4a = getColumnValue(opc4aColumnId); // Mirror column Opç4A

      console.log("Extracted values:", { numeroOpcao, opc1a, opc2a, opc3a, opc4a });

      // Validation logic based on your requirements
      let validationResult = "NÃO READEQUAR"; // Default to "NÃO READEQUAR"

      const opcaoNumber = parseInt(numeroOpcao || "0");

      if (opcaoNumber === 1 && opc1a && opc1a.trim() !== "") {
        validationResult = "OK";
      } else if (opcaoNumber === 2 && opc2a && opc2a.trim() !== "") {
        validationResult = "OK";
      } else if (opcaoNumber === 3 && opc3a && opc3a.trim() !== "") {
        validationResult = "OK";
      } else if (opcaoNumber === 4 && opc4a && opc4a.trim() !== "") {
        validationResult = "OK";
      }

      console.log(`Validation result for item ${itemId}: ${validationResult} (Opção: ${opcaoNumber})`);

      // Update status column in Monday.com
      try {
        await updateMondayColumn(
          boardId.toString(),
          itemId.toString(),
          statusColumnId, // Use the dynamically determined status column ID
          validationResult
        );

        console.log(`Updated item ${itemId} with status: ${validationResult}`);
      } catch (mondayError) {
        console.error("Failed to update Monday.com:", mondayError);
        return res.status(500).json({
          success: false,
          error: "Failed to update Monday.com status"
        });
      }

      res.json({ success: true, status: validationResult });
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof z.ZodError ? "Invalid payload format" : "Processing error"
      });
    }
  });



  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
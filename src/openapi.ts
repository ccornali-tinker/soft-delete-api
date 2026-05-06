/** OpenAPI 3.0 specification for the soft-delete items API. */
export const spec = {
  openapi: "3.0.0",
  info: {
    title: "Soft Delete Items API",
    version: "1.0.0",
    description: "Manage items with soft-delete and restore support.",
  },
  paths: {
    "/health": {
      get: {
        summary: "Liveness check",
        operationId: "getHealth",
        tags: ["Health"],
        responses: {
          "200": {
            description: "Service is up",
            content: {
              "application/json": {
                schema: { type: "object", properties: { ok: { type: "boolean" } } },
                example: { ok: true },
              },
            },
          },
        },
      },
    },
    "/items": {
      get: {
        summary: "List items",
        operationId: "listItems",
        tags: ["Items"],
        parameters: [
          {
            name: "includeDeleted",
            in: "query",
            schema: { type: "boolean" },
            description: "When true, includes soft-deleted items in the response.",
          },
        ],
        responses: {
          "200": {
            description: "Active items (or all items when includeDeleted=true), sorted by createdAt ASC",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: { type: "array", items: { $ref: "#/components/schemas/Item" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create an item",
        operationId: "createItem",
        tags: ["Items"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateItemBody" },
            },
          },
        },
        responses: {
          "201": {
            description: "Item created",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Item" } },
            },
          },
          "400": { description: "Missing or empty name" },
          "409": { description: "An active item with this name already exists" },
        },
      },
    },
    "/items/{id}": {
      delete: {
        summary: "Soft-delete an item",
        operationId: "deleteItem",
        tags: ["Items"],
        parameters: [{ $ref: "#/components/parameters/ItemId" }],
        responses: {
          "204": { description: "Item soft-deleted" },
          "404": { description: "Item not found" },
        },
      },
    },
    "/items/{id}/restore": {
      post: {
        summary: "Restore a soft-deleted item",
        operationId: "restoreItem",
        tags: ["Items"],
        parameters: [{ $ref: "#/components/parameters/ItemId" }],
        responses: {
          "200": {
            description: "Item restored",
            content: {
              "application/json": { schema: { $ref: "#/components/schemas/Item" } },
            },
          },
          "404": { description: "Item not found" },
          "409": { description: "An active item with this name already exists" },
        },
      },
    },
  },
  components: {
    parameters: {
      ItemId: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "Item UUID",
      },
    },
    schemas: {
      Item: {
        type: "object",
        required: ["id", "name", "createdAt", "deletedAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          deletedAt: { type: "string", format: "date-time", nullable: true },
        },
        example: {
          id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
          name: "Alpha",
          createdAt: "2025-01-10T00:00:00.000Z",
          deletedAt: null,
        },
      },
      CreateItemBody: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Delta" },
        },
      },
    },
  },
};

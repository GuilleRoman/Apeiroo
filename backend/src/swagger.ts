import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Duty API",
      version: "1.0.0",
      description: "API documentation for the Duty service",
    },
    components: {
      schemas: {
        CreateDutyDto: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              example: "Duty Name",
            },
          },
        },
        UpdateDutyDto: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Updated Duty Name",
            },
            completed: {
              type: "boolean",
              example: "false",
            },
          },
        },
        Duty: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Duty Name" },
            completed: { type: "string", example: "false" },
            created_at: { type: "timestamp", example: "2025-04-04T00:00:00" },
            updated_at: { type: "timestamp", example: "2025-04-04T00:00:00" },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts"],
};


const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

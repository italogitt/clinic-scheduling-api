import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Sanity Test", () => {
  it("should return 404 for a route that does not exist", async () => {
    // Supertest faz uma requisição GET na rota /rota-inexistente da nossa aplicação
    const response = await request(app).get("/rota-inexistente");

    // Esperamos que o status HTTP seja 404 (Not Found)
    expect(response.status).toBe(404);
  });
});

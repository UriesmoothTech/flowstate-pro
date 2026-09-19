import { POST } from "@/app/api/executions/route";

describe("POST /api/executions", () => {
  it("creates a workflow execution for a valid payload", async () => {
    const request = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-1",
        workflowId: "workflow-api-1",
        status: "queued",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({
      id: "execution-api-1",
      workflowId: "workflow-api-1",
      status: "queued",
    });
  });

  it("rejects an invalid payload", async () => {
    const request = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "",
        workflowId: "",
        status: "invalid",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("EXECUTION_VALIDATION_FAILED");
    expect(body.message).toBe("Invalid workflow execution payload");
    expect(Array.isArray(body.issues)).toBe(true);
  });
});

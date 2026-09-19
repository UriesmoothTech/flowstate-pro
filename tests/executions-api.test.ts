import { POST } from "@/app/api/executions/route";
import { GET } from "@/app/api/executions/[id]/route";

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

describe("GET /api/executions/[id]", () => {
  it("retrieves an existing workflow execution", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-get-1",
        workflowId: "workflow-api-get-1",
        status: "queued",
      }),
    });

    const createResponse = await POST(createRequest);

    expect(createResponse.status).toBe(201);

    const response = await GET(
      new Request("http://localhost/api/executions/execution-api-get-1"),
      {
        params: Promise.resolve({
          id: "execution-api-get-1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      id: "execution-api-get-1",
      workflowId: "workflow-api-get-1",
      status: "queued",
    });
  });

  it("returns 404 when the workflow execution does not exist", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/executions/execution-api-does-not-exist",
      ),
      {
        params: Promise.resolve({
          id: "execution-api-does-not-exist",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: "EXECUTION_NOT_FOUND",
      message:
        "Workflow execution not found: execution-api-does-not-exist",
    });
  });
});

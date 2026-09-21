import { GET as GETExecutions, POST } from "@/app/api/executions/route";
import { GET as GETExecutionById } from "@/app/api/executions/[id]/route";
import { POST as POSTStartExecution } from "@/app/api/executions/[id]/start/route";
import { POST as POSTCompleteExecution } from "@/app/api/executions/[id]/complete/route";
import { POST as POSTFailExecution } from "@/app/api/executions/[id]/fail/route";

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

describe("GET /api/executions?workflowId=...", () => {
  it("lists workflow executions for a workflow", async () => {
    const workflowId = "workflow-api-list-1";

    const firstCreateRequest = new Request(
      "http://localhost/api/executions",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: "execution-api-list-1",
          workflowId,
          status: "queued",
        }),
      },
    );

    const secondCreateRequest = new Request(
      "http://localhost/api/executions",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id: "execution-api-list-2",
          workflowId,
          status: "completed",
        }),
      },
    );

    await POST(firstCreateRequest);
    await POST(secondCreateRequest);

    const response = await GETExecutions(
      new Request(
        "http://localhost/api/executions?workflowId=workflow-api-list-1",
      ),
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([
      {
        id: "execution-api-list-1",
        workflowId,
        status: "queued",
      },
      {
        id: "execution-api-list-2",
        workflowId,
        status: "completed",
      },
    ]);
  });

  it("returns 400 when workflowId is missing", async () => {
    const response = await GETExecutions(
      new Request("http://localhost/api/executions"),
    );

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "WORKFLOW_ID_REQUIRED",
      message: "workflowId query parameter is required",
    });
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

    const response = await GETExecutionById(
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
    const response = await GETExecutionById(
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

describe("POST /api/executions/[id]/start", () => {
  it("starts a queued workflow execution", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-start-1",
        workflowId: "workflow-api-start-1",
        status: "queued",
      }),
    });

    const createResponse = await POST(createRequest);

    expect(createResponse.status).toBe(201);

    const response = await POSTStartExecution(
      new Request(
        "http://localhost/api/executions/execution-api-start-1/start?startedAt=2026-09-19T14:00:00.000Z",
        {
          method: "POST",
        },
      ),
      {
        params: Promise.resolve({
          id: "execution-api-start-1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      id: "execution-api-start-1",
      workflowId: "workflow-api-start-1",
      status: "running",
      startedAt: "2026-09-19T14:00:00.000Z",
    });
  });
});

describe("POST /api/executions/[id]/complete", () => {
  it("completes a running workflow execution", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-complete-1",
        workflowId: "workflow-api-complete-1",
        status: "queued",
      }),
    });

    const createResponse = await POST(createRequest);

    expect(createResponse.status).toBe(201);

    const startResponse = await POSTStartExecution(
      new Request(
        "http://localhost/api/executions/execution-api-complete-1/start?startedAt=2026-09-19T14:00:00.000Z",
        {
          method: "POST",
        },
      ),
      {
        params: Promise.resolve({
          id: "execution-api-complete-1",
        }),
      },
    );

    expect(startResponse.status).toBe(200);

    const response = await POSTCompleteExecution(
      new Request(
        "http://localhost/api/executions/execution-api-complete-1/complete?completedAt=2026-09-19T14:30:00.000Z",
        {
          method: "POST",
        },
      ),
      {
        params: Promise.resolve({
          id: "execution-api-complete-1",
        }),
      },
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      id: "execution-api-complete-1",
      workflowId: "workflow-api-complete-1",
      status: "completed",
      startedAt: "2026-09-19T14:00:00.000Z",
      completedAt: "2026-09-19T14:30:00.000Z",
    });
  });
});


describe("POST /api/executions/[id]/complete", () => {
  it("rejects an invalid completedAt timestamp", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-complete-invalid-time",
        workflowId: "workflow-api-complete-invalid-time",
        status: "queued",
      }),
    });

    await POST(createRequest);

    const startRequest = new Request(
      "http://localhost/api/executions/execution-api-complete-invalid-time/start?startedAt=2026-09-19T14:00:00.000Z",
      {
        method: "POST",
      },
    );

    await POSTStartExecution(startRequest, {
      params: Promise.resolve({
        id: "execution-api-complete-invalid-time",
      }),
    });

    const request = new Request(
      "http://localhost/api/executions/execution-api-complete-invalid-time/complete?completedAt=not-a-timestamp",
      {
        method: "POST",
      },
    );

    const response = await POSTCompleteExecution(request, {
      params: Promise.resolve({
        id: "execution-api-complete-invalid-time",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "INVALID_COMPLETED_AT",
      message: "Invalid completedAt timestamp: not-a-timestamp",
    });
  });

  it("rejects completedAt earlier than startedAt", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-complete-time-order",
        workflowId: "workflow-api-complete-time-order",
        status: "queued",
      }),
    });

    await POST(createRequest);

    const startRequest = new Request(
      "http://localhost/api/executions/execution-api-complete-time-order/start?startedAt=2026-09-19T14:00:00.000Z",
      {
        method: "POST",
      },
    );

    await POSTStartExecution(startRequest, {
      params: Promise.resolve({
        id: "execution-api-complete-time-order",
      }),
    });

    const request = new Request(
      "http://localhost/api/executions/execution-api-complete-time-order/complete?completedAt=2026-09-19T13:30:00.000Z",
      {
        method: "POST",
      },
    );

    const response = await POSTCompleteExecution(request, {
      params: Promise.resolve({
        id: "execution-api-complete-time-order",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "INVALID_COMPLETED_AT_ORDER",
      message:
        "completedAt cannot be earlier than startedAt for workflow execution execution-api-complete-time-order",
    });
  });
});

describe("POST /api/executions/[id]/fail", () => {
  it("fails a running workflow execution", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-fail-1",
        workflowId: "workflow-api-fail-1",
        status: "queued",
      }),
    });

    await POST(createRequest);

    const startRequest = new Request(
      "http://localhost/api/executions/execution-api-fail-1/start?startedAt=2026-09-19T14:00:00.000Z",
      {
        method: "POST",
      },
    );

    await POSTStartExecution(startRequest, {
      params: Promise.resolve({ id: "execution-api-fail-1" }),
    });

    const failRequest = new Request(
      "http://localhost/api/executions/execution-api-fail-1/fail?completedAt=2026-09-19T14:30:00.000Z&errorCode=EXECUTION_RUNTIME_ERROR&errorMessage=Runtime%20failure",
      {
        method: "POST",
      },
    );

    const response = await POSTFailExecution(failRequest, {
      params: Promise.resolve({ id: "execution-api-fail-1" }),
    });

    expect(response.status).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject({
      id: "execution-api-fail-1",
      workflowId: "workflow-api-fail-1",
      status: "failed",
      startedAt: "2026-09-19T14:00:00.000Z",
      completedAt: "2026-09-19T14:30:00.000Z",
      errorCode: "EXECUTION_RUNTIME_ERROR",
      errorMessage: "Runtime failure",
    });
  });

  it("requires completedAt when failing an execution", async () => {
    const request = new Request(
      "http://localhost/api/executions/execution-api-fail-missing-time/fail",
      {
        method: "POST",
      },
    );

    const response = await POSTFailExecution(request, {
      params: Promise.resolve({
        id: "execution-api-fail-missing-time",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "COMPLETED_AT_REQUIRED",
      message: "completedAt query parameter is required",
    });
  });

  it("rejects an invalid completedAt timestamp", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-fail-invalid-time",
        workflowId: "workflow-api-fail-invalid-time",
        status: "queued",
      }),
    });

    await POST(createRequest);

    const startRequest = new Request(
      "http://localhost/api/executions/execution-api-fail-invalid-time/start?startedAt=2026-09-19T14:00:00.000Z",
      {
        method: "POST",
      },
    );

    await POSTStartExecution(startRequest, {
      params: Promise.resolve({
        id: "execution-api-fail-invalid-time",
      }),
    });

    const request = new Request(
      "http://localhost/api/executions/execution-api-fail-invalid-time/fail?completedAt=not-a-timestamp",
      {
        method: "POST",
      },
    );

    const response = await POSTFailExecution(request, {
      params: Promise.resolve({
        id: "execution-api-fail-invalid-time",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "INVALID_COMPLETED_AT",
      message: "Invalid completedAt timestamp: not-a-timestamp",
    });
  });

  it("rejects completedAt earlier than startedAt", async () => {
    const createRequest = new Request("http://localhost/api/executions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: "execution-api-fail-time-order",
        workflowId: "workflow-api-fail-time-order",
        status: "queued",
      }),
    });

    await POST(createRequest);

    const startRequest = new Request(
      "http://localhost/api/executions/execution-api-fail-time-order/start?startedAt=2026-09-19T14:00:00.000Z",
      {
        method: "POST",
      },
    );

    await POSTStartExecution(startRequest, {
      params: Promise.resolve({
        id: "execution-api-fail-time-order",
      }),
    });

    const request = new Request(
      "http://localhost/api/executions/execution-api-fail-time-order/fail?completedAt=2026-09-19T13:30:00.000Z",
      {
        method: "POST",
      },
    );

    const response = await POSTFailExecution(request, {
      params: Promise.resolve({
        id: "execution-api-fail-time-order",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "INVALID_COMPLETED_AT_ORDER",
      message:
        "completedAt cannot be earlier than startedAt for workflow execution execution-api-fail-time-order",
    });
  });

  it("rejects an invalid execution failure code", async () => {
    const request = new Request(
      "http://localhost/api/executions/execution-api-fail-invalid-code/fail?completedAt=2026-09-19T15:00:00.000Z&errorCode=INVALID_CODE",
      {
        method: "POST",
      },
    );

    const response = await POSTFailExecution(request, {
      params: Promise.resolve({
        id: "execution-api-fail-invalid-code",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "INVALID_ERROR_CODE",
      message: "Invalid workflow execution error code: INVALID_CODE",
    });
  });

  it("returns 404 when failing a missing execution", async () => {
    const request = new Request(
      "http://localhost/api/executions/execution-api-fail-missing/fail?completedAt=2026-09-19T15:00:00.000Z",
      {
        method: "POST",
      },
    );

    const response = await POSTFailExecution(request, {
      params: Promise.resolve({
        id: "execution-api-fail-missing",
      }),
    });

    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body).toEqual({
      error: "EXECUTION_NOT_FOUND",
      message: "Workflow execution not found: execution-api-fail-missing",
    });
  });

});

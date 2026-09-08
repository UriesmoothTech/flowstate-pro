import { InMemoryStreamSessionRepository } from "@/lib/repositories/in-memory-stream-session-repository";
import {
  createStreamSession,
  startStreamSession,
  stopStreamSession,
  failStreamSession,
} from "@/lib/services/streaming/stream-session-service";

describe("Stream session service", () => {
  it("creates and starts a stream session", () => {
    const repository = new InMemoryStreamSessionRepository();

    createStreamSession(
      {
        id: "stream-1",
        name: "FlowState Live",
        status: "created",
        protocol: "webrtc",
        createdAt: "2026-09-08T00:00:00.000Z",
      },
      repository,
    );

    const result = startStreamSession(
      "stream-1",
      "2026-09-08T00:01:00.000Z",
      repository,
    );

    expect(result.status).toBe("live");
    expect(result.startedAt).toBe("2026-09-08T00:01:00.000Z");
  });

  it("stops a live stream", () => {
    const repository = new InMemoryStreamSessionRepository();

    createStreamSession(
      {
        id: "stream-2",
        name: "Test Stream",
        status: "live",
        protocol: "rtmp",
        createdAt: "2026-09-08T00:00:00.000Z",
      },
      repository,
    );

    const result = stopStreamSession(
      "stream-2",
      "2026-09-08T00:05:00.000Z",
      repository,
    );

    expect(result.status).toBe("stopped");
  });

  it("fails a stream session", () => {
    const repository = new InMemoryStreamSessionRepository();

    createStreamSession(
      {
        id: "stream-3",
        name: "Failure Test",
        status: "live",
        protocol: "webrtc",
        createdAt: "2026-09-08T00:00:00.000Z",
      },
      repository,
    );

    const result = failStreamSession(
      "stream-3",
      "Streaming gateway unavailable",
      repository,
    );

    expect(result.status).toBe("failed");
    expect(result.error).toBe("Streaming gateway unavailable");
  });
});

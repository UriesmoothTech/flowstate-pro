import type { StreamSession } from "@/lib/domain/streaming/stream-session";
import type { StreamSessionRepository } from "@/lib/repositories/stream-session-repository";

export function createStreamSession(
  session: StreamSession,
  repository: StreamSessionRepository,
): StreamSession {
  return repository.create(session);
}

export function getStreamSession(
  id: string,
  repository: StreamSessionRepository,
): StreamSession | undefined {
  return repository.getById(id);
}

export function startStreamSession(
  id: string,
  startedAt: string,
  repository: StreamSessionRepository,
): StreamSession {
  const session = repository.getById(id);

  if (!session) {
    throw new Error(`Stream session not found: ${id}`);
  }

  if (session.status !== "created") {
    throw new Error(
      `Stream session cannot start from status: ${session.status}`,
    );
  }

  return repository.update({
    ...session,
    status: "live",
    startedAt,
  });
}

export function stopStreamSession(
  id: string,
  stoppedAt: string,
  repository: StreamSessionRepository,
): StreamSession {
  const session = repository.getById(id);

  if (!session) {
    throw new Error(`Stream session not found: ${id}`);
  }

  if (session.status !== "live") {
    throw new Error(
      `Stream session cannot stop from status: ${session.status}`,
    );
  }

  return repository.update({
    ...session,
    status: "stopped",
    stoppedAt,
  });
}

export function failStreamSession(
  id: string,
  error: string,
  repository: StreamSessionRepository,
): StreamSession {
  const session = repository.getById(id);

  if (!session) {
    throw new Error(`Stream session not found: ${id}`);
  }

  return repository.update({
    ...session,
    status: "failed",
    error,
  });
}

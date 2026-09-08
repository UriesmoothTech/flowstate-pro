import type { StreamSession } from "@/lib/domain/streaming/stream-session";
import type { StreamSessionRepository } from "@/lib/repositories/stream-session-repository";

export class InMemoryStreamSessionRepository
  implements StreamSessionRepository
{
  private readonly sessions = new Map<string, StreamSession>();

  create(session: StreamSession): StreamSession {
    if (this.sessions.has(session.id)) {
      throw new Error(`Stream session already exists: ${session.id}`);
    }

    this.sessions.set(session.id, session);
    return session;
  }

  getById(id: string): StreamSession | undefined {
    return this.sessions.get(id);
  }

  update(session: StreamSession): StreamSession {
    if (!this.sessions.has(session.id)) {
      throw new Error(`Stream session not found: ${session.id}`);
    }

    this.sessions.set(session.id, session);
    return session;
  }

  list(): StreamSession[] {
    return [...this.sessions.values()];
  }
}

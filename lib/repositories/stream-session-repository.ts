import type { StreamSession } from "@/lib/domain/streaming/stream-session";

export interface StreamSessionRepository {
  create(session: StreamSession): StreamSession;
  getById(id: string): StreamSession | undefined;
  update(session: StreamSession): StreamSession;
  list(): StreamSession[];
}

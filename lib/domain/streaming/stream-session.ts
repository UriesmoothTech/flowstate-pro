export type StreamSessionStatus =
  | "created"
  | "starting"
  | "live"
  | "stopping"
  | "stopped"
  | "failed";

export type StreamProtocol =
  | "webrtc"
  | "whip"
  | "rtmp";

export interface StreamSession {
  id: string;
  name: string;
  status: StreamSessionStatus;
  protocol: StreamProtocol;
  createdAt: string;
  startedAt?: string;
  stoppedAt?: string;
  error?: string;
}

import crypto from "crypto";

export interface EventData {
  run_id: string;
  event_type: string;
  action: string;
  target: string;
  metadata?: unknown;
  timestamp: string; // ISO string — must be the exact value stored in DB
}

/** Used as previous_hash for the very first event in a run. */
export const GENESIS_HASH = "0".repeat(64);

/**
 * SHA-256(previousHash + canonical JSON of eventData).
 * Keys are sorted so insertion order never affects the output.
 */
export function computeEventHash(
  previousHash: string,
  eventData: EventData
): string {
  const canonical = JSON.stringify(eventData, Object.keys(eventData).sort());
  return crypto
    .createHash("sha256")
    .update(previousHash + canonical)
    .digest("hex");
}

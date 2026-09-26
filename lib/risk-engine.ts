export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

const HIGH_ACTIONS = [
  "rm -rf",
  "git push --force",
  "git reset --hard",
  "drop database",
  "drop table",
];

const HIGH_TARGET_PATTERN = /\.env|secret|credential/i;

/**
 * Classify risk level for a Bob action.
 * Evaluation order: HIGH first → LOW → default MEDIUM.
 */
export function classifyRisk(
  event_type: string,
  action: string,
  target: string
): RiskLevel {
  // ── HIGH ──────────────────────────────────────────────────────────────────
  if (event_type === "file_delete") return "HIGH";
  if (event_type === "production_change") return "HIGH";
  if (HIGH_ACTIONS.some((cmd) => action.toLowerCase().includes(cmd))) {
    return "HIGH";
  }
  if (action.toLowerCase().includes("drop")) return "HIGH";
  if (HIGH_TARGET_PATTERN.test(target)) return "HIGH";

  // ── LOW ───────────────────────────────────────────────────────────────────
  if (["file_read", "file_create", "file_edit"].includes(event_type)) {
    return "LOW";
  }

  // ── MEDIUM (default) ──────────────────────────────────────────────────────
  return "MEDIUM";
}

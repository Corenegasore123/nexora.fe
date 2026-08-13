export interface ConfidenceThresholds {
  autoAccept: number;
  flag: number;
}

export function getConfidenceThresholds(): ConfidenceThresholds {
  return {
    autoAccept: parseFloat(process.env.NEXT_PUBLIC_CONFIDENCE_AUTO_ACCEPT ?? "0.95"),
    flag: parseFloat(process.env.NEXT_PUBLIC_CONFIDENCE_FLAG ?? "0.80"),
  };
}

export function classifyConfidence(confidence: number): "accepted" | "flagged" | "review" {
  const thresholds = getConfidenceThresholds();
  if (confidence >= thresholds.autoAccept) return "accepted";
  if (confidence >= thresholds.flag) return "flagged";
  return "review";
}

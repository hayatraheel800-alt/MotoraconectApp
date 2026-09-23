export type AuctionReportStatus = "UPLOADED" | "ANALYZING" | "READY" | "FAILED";

export type AuctionReport = {
  id: string;
  requester_id: string;
  vehicle_id: string | null;
  document_path: string;
  document_name: string;
  status: AuctionReportStatus;
  summary: string | null;
  result: Record<string, unknown>;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type AuctionReportItem = {
  id: string;
  report_id: string;
  field_name: string;
  value_text: string | null;
  source: "DETECTED" | "INTERPRETED" | "USER_PROVIDED" | "ESTIMATED" | "UNVERIFIED";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  note: string | null;
  created_at: string;
};
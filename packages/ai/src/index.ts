export type AuctionFieldSource = "DETECTED" | "INTERPRETED" | "USER_PROVIDED" | "ESTIMATED" | "UNVERIFIED";
export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export type AuctionSheetInput = {
  documentName: string;
  storagePath: string;
};

export type AuctionReportItem = {
  field: string;
  value: string | number | boolean | null;
  source: AuctionFieldSource;
  confidence: Confidence;
  note?: string;
};

export type AuctionSheetReport = {
  schemaVersion: "1";
  summary: string;
  items: AuctionReportItem[];
  mocked: true;
};

export interface AuctionSheetAnalyzer {
  analyze(input: AuctionSheetInput): Promise<AuctionSheetReport>;
}

export class MockAuctionSheetAnalyzer implements AuctionSheetAnalyzer {
  async analyze(input: AuctionSheetInput): Promise<AuctionSheetReport> {
    return {
      schemaVersion: "1",
      summary: `MOCKED FOR DEVELOPMENT: no real auction-sheet vision provider is configured for ${input.documentName}.`,
      items: [
        {field: "document_name", value: input.documentName, source: "USER_PROVIDED", confidence: "HIGH"},
        {field: "analysis_status", value: "mocked", source: "UNVERIFIED", confidence: "HIGH", note: "Replace with a real vision/OCR provider only after credentials and budget are approved."},
      ],
      mocked: true,
    };
  }
}

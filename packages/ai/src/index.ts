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
    const mockNote = "Illustrative development data only; not extracted from the uploaded sheet.";
    return {
      schemaVersion: "1",
      summary: `MOCKED FOR DEVELOPMENT: no real auction-sheet vision provider is configured for ${input.documentName}. Any sample vehicle values below are placeholders.`,
      items: [
        {field: "document_name", value: input.documentName, source: "USER_PROVIDED", confidence: "HIGH"},
        {field: "analysis_status", value: "mocked", source: "UNVERIFIED", confidence: "HIGH", note: "A real OCR/vision provider has not been configured."},
        {field: "auction_grade", value: "5", source: "UNVERIFIED", confidence: "LOW", note: mockNote},
        {field: "mileage_km", value: 68000, source: "UNVERIFIED", confidence: "LOW", note: mockNote},
        {field: "model_year", value: 2021, source: "UNVERIFIED", confidence: "LOW", note: mockNote},
        {field: "chassis_number", value: "MOCK-CHASSIS", source: "UNVERIFIED", confidence: "LOW", note: mockNote},
        {field: "inspection_summary", value: "Example: cosmetic wear noted", source: "UNVERIFIED", confidence: "LOW", note: mockNote},
      ],
      mocked: true,
    };
  }
}

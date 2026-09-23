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


export type AssistantInput={question:string;context?:Record<string,unknown>};
export type AssistantResponse={answer:string;mocked:true;disclaimer:string};

export interface MotoraconectAssistant{ask(input:AssistantInput):Promise<AssistantResponse>}

export class MockMotoraconectAssistant implements MotoraconectAssistant{
  async ask(input:AssistantInput):Promise<AssistantResponse>{
    const q=input.question.trim().toLowerCase();
    let answer="MOCKED FOR DEVELOPMENT: the Motoraconect AI provider is not connected yet.";
    if(q.includes("import")||q.includes("custom")) answer="MOCKED FOR DEVELOPMENT: use the Import Cost Calculator for purchase price, FX rate, freight, insurance, duty, tax, port, clearing, registration, and other charges. The result is an estimate, not an official customs assessment.";
    else if(q.includes("auction")||q.includes("sheet")) answer="MOCKED FOR DEVELOPMENT: Auction Sheet Reader separates DETECTED, INTERPRETED, USER_PROVIDED, ESTIMATED, and UNVERIFIED information with HIGH, MEDIUM, or LOW confidence. Confirm important details against the original sheet.";
    else if(q.includes("listing")||q.includes("sell")||q.includes("buy")) answer="MOCKED FOR DEVELOPMENT: Motoraconect supports listings, buyer-to-seller messaging, auction-sheet reports, import estimates, and human consultation.";
    return {answer,mocked:true,disclaimer:"Mocked development content only; not professional, legal, customs, financial, or vehicle-inspection advice."};
  }
}

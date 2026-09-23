export type ConsultationStatus = "REQUESTED" | "ACCEPTED" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type Consultation = {
  id: string;
  requester_id: string;
  consultant_id: string | null;
  vehicle_id: string | null;
  service_type: string;
  subject: string;
  details: string;
  status: ConsultationStatus;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
};

export type ConsultationMessage = {
  id: string;
  consultation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};
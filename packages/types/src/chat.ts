export type Conversation = {
  id: string;
  created_by: string;
  vehicle_id: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversationParticipant = {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

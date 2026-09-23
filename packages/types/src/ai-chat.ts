export type AiConversation = {
  id:string;
  requester_id:string;
  title:string|null;
  created_at:string;
  updated_at:string;
};

export type AiMessage = {
  id:string;
  conversation_id:string;
  sender_type:"USER"|"ASSISTANT";
  body:string;
  mocked:boolean;
  created_at:string;
};
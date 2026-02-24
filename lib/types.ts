export type Project = {
  id: string;
  name: string;
  client_name: string;
  description: string | null;
  created_at: string;
};

export type Decision = {
  id: string;
  project_id: string;
  title: string;
  summary: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  pending_items: string | null;
  created_at: string;
  updated_at: string;
};

export type DecisionEvent = {
  id: string;
  decision_id: string;
  event_type: string;
  actor_name: string;
  details: string | null;
  created_at: string;
};

export type Approval = {
  id: string;
  decision_id: string;
  approver_name: string;
  approver_email: string | null;
  approved_at: string | null;
  created_at: string;
};

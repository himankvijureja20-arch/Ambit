// Shapes mirror the real API responses (snake_case, matching the Postgres columns).
// The auth endpoints are the one exception — they return camelCase (see store/authStore.ts).

export type CircleStatus = 'pending' | 'approved' | 'rejected';

export interface CircleSummary {
  id: number;
  society_id: number;
  creator_id: number;
  name: string;
  description: string;
  category: string;
  meeting_schedule: string;
  image_url: string | null;
  status: CircleStatus;
  first_name: string;
  last_name: string;
  member_count: number;
  open_requests: number;
  is_member: boolean;
  created_at: string;
}

export interface CircleMember {
  id: number;
  first_name: string;
  last_name: string;
  joined_at: string;
}

export interface CircleDetail {
  id: number;
  society_id: number;
  creator_id: number;
  name: string;
  description: string;
  category: string;
  meeting_schedule: string;
  image_url: string | null;
  status: CircleStatus;
  first_name: string;
  last_name: string;
  member_count: number;
  members: CircleMember[];
  created_at: string;
}

export type RequestStatus = 'open' | 'completed' | 'cancelled' | 'flagged';
export type RequestUrgency = 'normal' | 'high' | 'urgent';

export interface RequestSummary {
  id: number;
  circle_id: number | null;
  circle_name?: string | null;
  society_id: number;
  creator_id: number;
  title: string;
  description: string;
  needed_by: string | null;
  status: string;
  category: string | null;
  urgency: RequestUrgency;
  photo_url: string | null;
  location: string | null;
  duration: string | null;
  first_name: string;
  last_name: string;
  response_count: number;
  created_at: string;
}

export interface RequestResponse {
  id: number;
  request_id: number;
  responder_id: number;
  message: string | null;
  responded_at: string;
  confirmed: boolean;
  first_name: string;
  last_name: string;
  trust_score?: number;
  phone: string | null;
}

export interface RequestDetail {
  id: number;
  circle_id: number | null;
  circle_name?: string | null;
  society_id: number;
  creator_id: number;
  title: string;
  description: string;
  needed_by: string | null;
  status: string;
  category: string | null;
  urgency: RequestUrgency;
  photo_url: string | null;
  location: string | null;
  duration: string | null;
  first_name: string;
  last_name: string;
  creator_phone: string | null;
  creator_trust_score: number | null;
  creator_flat_number: string | null;
  creator_request_count: number;
  creator_helped_count: number;
  responses: RequestResponse[];
  created_at: string;
}

export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  society_id: number;
  admin_approved: boolean;
  role: 'resident' | 'admin';
  trust_score: number;
  phone: string | null;
  flat_number: string | null;
  photo_url: string | null;
  interests: string[];
  created_at: string;
}

export interface TopHelper {
  id: number;
  first_name: string;
  last_name: string;
  trust_score: number;
  photo_url: string | null;
}

export interface PendingCircle {
  id: number;
  name: string;
  description: string;
  category: string;
  meeting_schedule: string;
  status: CircleStatus;
  first_name: string;
  last_name: string;
  founder_trust_score: number | null;
  created_at: string;
}

export interface PendingUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  flat_number: string | null;
  phone: string | null;
  created_at: string;
}

export interface AdminRequestSummary extends RequestSummary {
  circle_name: string;
}

export const CIRCLE_CATEGORIES = [
  'Sports',
  'Fitness',
  'Arts & Crafts',
  'Food & Cooking',
  'Books & Learning',
  'Music',
  'Games',
  'Outdoors',
  'Other',
];

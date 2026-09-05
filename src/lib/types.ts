export type EventRow = {
  id: string;
  user_id: string;
  slug: string;
  baby_name: string | null;
  event_date: string | null;
  location: string | null;
  host_names: string | null;
  photo_url: string | null;
  message: string | null;
  created_at: string;
  updated_at: string;
};

export type GiftRow = {
  id: string;
  event_id: string;
  name: string;
  category: string | null;
  notes: string | null;
  is_custom: boolean;
  created_at: string;
};

export type GiftWithClaim = GiftRow & { claimed: boolean };

export type RsvpRow = {
  id: string;
  event_id: string;
  guest_name: string;
  attending: boolean;
  party_size: number;
  note: string | null;
  created_at: string;
};


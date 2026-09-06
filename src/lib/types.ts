export type EventRow = {
  id: string;
  user_id: string;
  slug: string;
  baby_name: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  host_names: string | null;
  photo_url: string | null;
  message: string | null;
  ask_party_size: boolean;
  location_map_url: string | null;
  drive_url: string | null;
  invitation_image_url: string | null;
  invitation_template_id: string | null;
  guest_list_reveal_days: number;
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
  max_quantity: number | null;
  created_at: string;
};

export type GiftWithClaim = GiftRow & { claimed: boolean; claimedCount: number };

export type RsvpRow = {
  id: string;
  event_id: string;
  guest_name: string;
  attending: boolean;
  party_size: number;
  note: string | null;
  created_at: string;
};


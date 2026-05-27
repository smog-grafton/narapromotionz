export type Boxer = {
  id: number;
  name: string;
  ring_name?: string | null;
  slug: string;
  nationality?: string | null;
  country?: string | null;
  hometown?: string | null;
  weight_class?: string | null;
  stance?: string | null;
  height?: string | null;
  reach?: string | null;
  age?: number | null;
  date_of_birth?: string | null;
  image_url?: string | null;
  bio?: string | null;
  full_bio?: string | null;
  ranking?: number | null;
  ranking_label?: string | null;
  division_total?: number | null;
  titles?: string[];
  status?: string | null;
  social_links?: Record<string, string> | Array<{ platform?: string; url?: string }>;
  record_wins?: number;
  record_losses?: number;
  record_draws?: number;
  knockouts?: number;
  kos_lost?: number;
  total_fights?: number;
  knockout_percentage?: number;
  win_percentage?: number;
  record?: {
    wins: number;
    losses: number;
    draws: number;
    knockouts: number;
    display: string;
    ko_rate?: number;
    win_rate?: number;
  };
  upcoming_fight?: {
    id: number;
    name: string;
    slug: string;
    event_date?: string | null;
    venue?: string | null;
    city?: string | null;
  } | null;
  related_events?: Array<{
    id: number;
    name: string;
    slug: string;
    event_date?: string | null;
    status?: string | null;
    venue?: string | null;
    city?: string | null;
  }>;
  recent_fights?: Fight[];
  stats_summary?: Array<{ label: string; value: string }>;
  seo?: SeoPayload;
};

export type Fight = {
  id: number;
  bout_order?: number;
  status?: string;
  weight_class?: string | null;
  rounds?: number | null;
  title_fight?: boolean;
  belt_title?: string | null;
  red_corner?: Boxer;
  blue_corner?: Boxer;
  winner?: Boxer;
  result?: {
    result?: string | null;
    method?: string | null;
    round?: number | null;
    time?: string | null;
    details?: string | null;
  };
};

export type Event = {
  id: number;
  name: string;
  tagline?: string | null;
  slug: string;
  description?: string | null;
  full_description?: string | null;
  event_date?: string | null;
  event_time?: string | null;
  starts_at?: string | null;
  venue?: string | null;
  city?: string | null;
  country?: string | null;
  status?: string;
  event_type?: string;
  broadcast?: {
    network?: string | null;
    type?: string | null;
  };
  ticketing?: {
    available?: boolean;
    has_ticket_types?: boolean;
    min_price?: number | null;
    max_price?: number | null;
    currency?: string | null;
    min_formatted_price?: string | null;
    max_formatted_price?: string | null;
    purchase_url?: string | null;
  };
  streaming?: {
    has_stream?: boolean;
    is_ppv?: boolean;
    requires_ticket?: boolean;
    status?: string | null;
  };
  main_event?: {
    title?: string | null;
    red_corner?: Boxer;
    blue_corner?: Boxer;
    weight_class?: string | null;
    rounds?: number | null;
    belt_title?: string | null;
  };
  images?: {
    poster?: string | null;
    banner?: string | null;
    thumbnail?: string | null;
  };
  tickets?: Ticket[];
  fight_card?: Fight[];
  news?: NewsArticle[];
  videos?: Video[];
  seo?: SeoPayload;
};

export type Ticket = {
  id: number;
  name: string;
  price: number;
  currency: string;
  formatted_price?: string;
  access_type?: string;
  access_label?: string;
  grants_live_access?: boolean;
  grants_replay_access?: boolean;
  allows_venue_entry?: boolean;
  allows_prize_draw?: boolean;
  is_vip?: boolean;
  is_complimentary?: boolean;
  features?: string[];
  quantity_available?: number;
  quantity_sold?: number;
  remaining_quantity?: number;
  status?: string;
  sales_started?: boolean;
  sales_ended?: boolean;
  is_available?: boolean;
};

export type NewsArticle = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  content?: string | null;
  content_type?: string;
  section?: string | null;
  published_at?: string | null;
  scheduled_at?: string | null;
  reading_time?: number | null;
  views_count?: number;
  is_featured?: boolean;
  is_main_article?: boolean;
  is_breaking?: boolean;
  is_trending?: boolean;
  is_editors_pick?: boolean;
  hero_priority?: number;
  featured_image_url?: string | null;
  image_url?: string | null;
  gallery_images?: string[];
  author?: {
    name?: string | null;
    avatar_url?: string | null;
  };
  category?: {
    id?: number | null;
    name: string;
    slug: string;
    color?: string | null;
  } | null;
  categories?: Array<{
    name: string;
    slug: string;
    color?: string | null;
  }>;
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  related_event?: Event | null;
  related_boxer?: Boxer | null;
  related_video?: Video | null;
  links?: {
    frontend?: string;
  };
  seo?: SeoPayload;
};

export type Video = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  video_type?: string | null;
  source_type?: string | null;
  video_url?: string | null;
  hls_url?: string | null;
  replay_url?: string | null;
  video_id?: string | null;
  duration?: string | null;
  thumbnail_url?: string | null;
  is_premium?: boolean;
  access_type?: "free" | "ppv" | "subscription" | "ticket_holder" | "premium" | string;
  is_free?: boolean;
  price?: number;
  currency?: string;
  formatted_price?: string;
  requires_subscription?: boolean;
  can_watch?: boolean;
  published_at?: string | null;
  seo?: SeoPayload;
};

export type Sponsor = {
  name: string;
  logo_url?: string | null;
  url?: string | null;
  tier?: string | null;
};

export type HomePayload = {
  seo?: SeoPayload;
  hero_event?: Event | null;
  hero_slides?: HeroSlide[];
  upcoming_events?: Event[];
  featured_fight_card?: Event | null;
  latest_news?: NewsArticle[];
  featured_news?: NewsArticle[];
  breaking_news?: NewsArticle[];
  trending_news?: NewsArticle[];
  fight_previews?: NewsArticle[];
  interviews?: NewsArticle[];
  featured_videos?: Video[];
  boxer_spotlight?: Boxer[];
  sponsors?: Sponsor[];
};

export type HeroSlide = {
  id: number;
  content_type: "event" | "boxer" | "news" | "video" | "fight_card" | "custom" | string;
  title?: string | null;
  subtitle?: string | null;
  badge_text?: string | null;
  image_url?: string | null;
  mobile_image_url?: string | null;
  cta_text?: string | null;
  cta_url?: string | null;
  overlay_style?: string | null;
  event?: Event | null;
  boxer?: Boxer | null;
  news?: NewsArticle | null;
  video?: Video | null;
};

export type SeoPayload = {
  title?: string | null;
  description?: string | null;
  canonical?: string | null;
  og_image?: string | null;
  ogImage?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  keywords?: string | null;
  schema_type?: string | null;
};

export type Paginated<T> = {
  data: T[];
  links?: Record<string, unknown>;
  meta?: {
    current_page?: number;
    from?: number | null;
    last_page?: number;
    per_page?: number;
    to?: number | null;
    total?: number;
  };
};

export type BoxerDetailPayload = {
  profile: Boxer;
  fight_history?: Fight[];
  events?: Event[];
  videos?: Video[];
  news?: NewsArticle[];
};

export type RankingsPayload = Array<{
  division: string;
  boxers: Boxer[];
}>;

export type NewsDetailPayload = {
  article: NewsArticle;
  related?: NewsArticle[];
  more_from_category?: NewsArticle[];
};

export type VideoDetailPayload = {
  video: Video;
  related?: Video[];
};

export type WatchAccess = {
  authenticated: boolean;
  can_watch_live: boolean;
  can_watch_replay: boolean;
  reason: "login_required" | "ticket_required" | "access_granted" | string;
  access_type?: "free_event" | "free_preview" | "paid_ticket" | "admin_grant" | "no_access" | string;
  preview_active?: boolean;
  preview_ends_at?: string | null;
  requires_payment?: boolean;
  user_has_ticket?: boolean;
  message?: string | null;
  ticket_options?: Ticket[];
};

export type StreamPayload = {
  status: "scheduled" | "live" | "ended" | "replay_available" | "unavailable" | string;
  access: WatchAccess;
  stream?: {
    title?: string | null;
    provider?: string | null;
    playback_url?: string | null;
    hls_url?: string | null;
    embed_url?: string | null;
    replay_url?: string | null;
    starts_at?: string | null;
  } | null;
};

export type TaxonomyItem = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  color?: string | null;
  articles_count?: number;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  roles?: string[];
  avatar_url?: string | null;
  can_access_admin?: boolean;
};

export type AuthPayload = {
  user: AuthUser;
  token: string;
};

export type TicketPurchase = {
  id: number;
  order_number: string;
  ticket_code?: string | null;
  quantity: number;
  currency: string;
  total_price: number;
  discount_amount?: number;
  grand_total: number;
  coupon_code?: string | null;
  status: string;
  payment_status: string;
  access_status?: string | null;
  ticket_channel?: string | null;
  allows_live_stream?: boolean;
  allows_replay?: boolean;
  allows_venue_entry?: boolean;
  allows_prize_draw?: boolean;
  paid_at?: string | null;
  holder?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  ticket?: Ticket;
  event?: Event;
  qr_code_url?: string | null;
  payment?: PaymentSummary | null;
};

export type PaymentSummary = {
  id?: number;
  reference: string;
  provider_reference?: string | null;
  gateway: string;
  status: string;
  amount: number;
  currency: string;
  checkout_url?: string | null;
  paid_at?: string | null;
  purchase_type?: string;
  subscription?: UserSubscription | null;
  ticket?: {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    access_status?: string | null;
  } | null;
  event?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

export type CheckoutResponse = {
  transaction_reference: string;
  gateway: string;
  status: string;
  checkout_url?: string | null;
  requires_polling?: boolean;
  ticket: TicketPurchase;
  payment: PaymentSummary;
};

export type PaymentGateway = {
  id: number;
  code: "iotec" | "flutterwave" | string;
  name: string;
  display_name: string;
  description?: string | null;
  logo_url?: string | null;
  status: string;
  environment?: string | null;
  sort_order?: number;
  is_default?: boolean;
  supports_mobile_money?: boolean;
  supports_card?: boolean;
  supports_redirect_checkout?: boolean;
  supported_currencies?: string[];
  public_label?: string | null;
  button_label?: string | null;
  instructions?: string | null;
};

export type SubscriptionPlan = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  duration_days: number;
  price: number;
  currency: string;
  formatted_price?: string;
  features?: string[];
  unlocks_live_events?: boolean;
  unlocks_replays?: boolean;
  unlocks_paid_videos?: boolean;
  is_active?: boolean;
  sort_order?: number;
};

export type UserSubscription = {
  id: number;
  uuid?: string;
  status: string;
  starts_at?: string | null;
  expires_at?: string | null;
  auto_renew?: boolean;
  plan?: SubscriptionPlan | null;
};

export type SubscriptionCheckoutResponse = {
  transaction_reference: string;
  gateway: string;
  status: string;
  checkout_url?: string | null;
  requires_polling?: boolean;
  subscription: UserSubscription;
  payment: PaymentSummary;
};

export type FighterApplication = {
  id: number;
  stage_name?: string | null;
  phone?: string | null;
  weight_class?: string | null;
  record_summary?: string | null;
  message?: string | null;
  status: "pending" | "approved" | "rejected" | string;
  reviewed_at?: string | null;
  created_at?: string | null;
};

export type LiveStreamComment = {
  id: number;
  body: string;
  status: string;
  is_pinned?: boolean;
  is_official?: boolean;
  created_at?: string | null;
  user?: {
    id?: number | null;
    name?: string | null;
    avatar_url?: string | null;
  };
};

export type LiveStreamCommentsPayload = {
  settings: {
    comments_enabled: boolean;
    slow_mode_enabled: boolean;
    slow_mode_seconds: number;
    require_login_to_comment: boolean;
    pinned_announcement?: string | null;
  };
  pinned: LiveStreamComment[];
  comments: LiveStreamComment[];
};

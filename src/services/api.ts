import type {
  Boxer,
  BoxerDetailPayload,
  Event,
  HomePayload,
  NewsArticle,
  NewsDetailPayload,
  Paginated,
  RankingsPayload,
  StreamPayload,
  Video,
  VideoDetailPayload,
  TaxonomyItem,
  AuthPayload,
  CheckoutResponse,
  PaymentSummary,
  TicketPurchase,
  PaymentGateway,
  FighterApplication,
  LiveStreamCommentsPayload,
  LiveStreamComment,
  SubscriptionCheckoutResponse,
  SubscriptionPlan,
  UserSubscription,
} from "@/types/platform";

function normalizeApiBaseUrl(value?: string) {
  const fallback = "http://localhost/narapromotionz/public/api/v1";
  const raw = value?.trim() || fallback;

  try {
    const url = new URL(raw);

    if (url.hostname === "127.0.0.0") {
      url.hostname = "127.0.0.1";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return raw.replace("127.0.0.0", "127.0.0.1").replace(/\/$/, "");
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

type ApiEnvelope<T> = {
  data: T;
  links?: Record<string, unknown>;
  meta?: Paginated<T extends Array<infer U> ? U : never>["meta"];
};

async function apiGetEnvelope<T>(path: string, token?: string): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(token ? { cache: "no-store" as RequestCache } : { next: { revalidate: 60 } }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    let message = `API request failed (${response.status})`;

    try {
      const parsed = JSON.parse(bodyText || "{}") as {
        message?: string;
        error?: string;
        errors?: Record<string, string[]>;
      };
      message =
        parsed.message ||
        parsed.error ||
        Object.values(parsed.errors ?? {})?.flat()?.[0] ||
        message;
    } catch {
      if (bodyText.trim()) {
        message = `${message}: ${bodyText.trim()}`;
      }
    }

    throw new Error(message);
  }

  const json = (await response.json()) as ApiEnvelope<T>;
  return json;
}

async function apiGet<T>(path: string, token?: string): Promise<T> {
  const json = await apiGetEnvelope<T>(path, token);
  return json.data;
}

export async function getHome(): Promise<HomePayload> {
  return apiGet<HomePayload>("/home");
}

export async function getStream(eventSlug: string, token?: string): Promise<StreamPayload> {
  return apiGet<StreamPayload>(`/events/${eventSlug}/stream`, token);
}

export async function getActiveStream(token?: string): Promise<{ event: Pick<Event, "id" | "name" | "slug"> | null; stream: StreamPayload }> {
  return apiGet<{ event: Pick<Event, "id" | "name" | "slug"> | null; stream: StreamPayload }>("/live/stream", token);
}

export async function getPaymentGateways(): Promise<PaymentGateway[]> {
  return apiGet<PaymentGateway[]>("/payment-gateways");
}

export async function getLiveStreamComments(eventSlug: string): Promise<LiveStreamCommentsPayload> {
  return apiGet<LiveStreamCommentsPayload>(`/events/${eventSlug}/comments`);
}

export async function postLiveStreamComment(eventSlug: string, body: string, token: string): Promise<LiveStreamComment> {
  return apiPost<LiveStreamComment>(`/events/${eventSlug}/comments`, { body }, token);
}

export async function getFeaturedBoxers(limit = 4): Promise<Boxer[]> {
  return apiGet<Boxer[]>(`/boxers/featured?limit=${limit}`);
}

export async function getBoxers(params: Record<string, string | number | undefined> = {}): Promise<Paginated<Boxer>> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const envelope = await apiGetEnvelope<Boxer[]>(`/boxers${query.size ? `?${query}` : ""}`);
  return {
    data: envelope.data,
    links: envelope.links,
    meta: envelope.meta,
  };
}

export async function getBoxer(slug: string): Promise<BoxerDetailPayload> {
  return apiGet<BoxerDetailPayload>(`/boxers/${slug}`);
}

export async function getRankings(): Promise<RankingsPayload> {
  return apiGet<RankingsPayload>("/rankings");
}

export async function getEvents(params: Record<string, string | number | undefined> = {}): Promise<Paginated<Event>> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const envelope = await apiGetEnvelope<Event[]>(`/events${query.size ? `?${query}` : ""}`);
  return {
    data: envelope.data,
    links: envelope.links,
    meta: envelope.meta,
  };
}

export async function getActiveLiveEvents(limit = 3): Promise<Event[]> {
  return apiGet<Event[]>(`/live/active?limit=${limit}&summary=1`);
}

export async function getEvent(slug: string): Promise<Event> {
  return apiGet<Event>(`/events/${slug}`);
}

export async function getNews(params: Record<string, string | number | undefined> = {}): Promise<Paginated<NewsArticle>> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const envelope = await apiGetEnvelope<NewsArticle[]>(`/news${query.size ? `?${query}` : ""}`);
  return {
    data: envelope.data,
    links: envelope.links,
    meta: envelope.meta,
  };
}

export async function getFeaturedNews(limit = 8): Promise<NewsArticle[]> {
  return apiGet<NewsArticle[]>(`/news/featured?limit=${limit}`);
}

export async function getBreakingNews(limit = 8): Promise<NewsArticle[]> {
  return apiGet<NewsArticle[]>(`/news/breaking?limit=${limit}`);
}

export async function getTrendingNews(limit = 10): Promise<NewsArticle[]> {
  return apiGet<NewsArticle[]>(`/news/trending?limit=${limit}`);
}

export async function getNewsCategories(): Promise<TaxonomyItem[]> {
  return apiGet<TaxonomyItem[]>("/news/categories");
}

export async function getNewsTags(): Promise<TaxonomyItem[]> {
  return apiGet<TaxonomyItem[]>("/news/tags");
}

export async function getNewsArticle(slug: string): Promise<NewsDetailPayload> {
  return apiGet<NewsDetailPayload>(`/news/${slug}`);
}

export async function getVideos(params: Record<string, string | number | undefined> = {}): Promise<Paginated<Video>> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const envelope = await apiGetEnvelope<Video[]>(`/videos${query.size ? `?${query}` : ""}`);
  return {
    data: envelope.data,
    links: envelope.links,
    meta: envelope.meta,
  };
}

export async function getVideo(slug: string, token?: string): Promise<VideoDetailPayload> {
  return apiGet<VideoDetailPayload>(`/videos/${slug}`, token);
}

async function apiPost<T>(path: string, body: Record<string, unknown>, token?: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const rawMessage =
      json?.message ||
      json?.error ||
      Object.values(json?.errors ?? {})?.flat()?.[0] ||
      "We could not complete that request. Please check your details and try again.";
    const message = String(rawMessage).toLowerCase().includes("csrf")
      ? "We could not sign you in. Please refresh the page and try again."
      : String(rawMessage);
    throw new Error(message);
  }

  return json.data as T;
}

export function login(payload: { login: string; password: string; device_name?: string }) {
  return apiPost<AuthPayload>("/auth/login", payload);
}

export function register(payload: { name: string; email?: string; phone?: string; password: string; password_confirmation: string; device_name?: string }) {
  return apiPost<AuthPayload>("/auth/register", payload);
}

export function logout(token: string) {
  return apiPost<{ message?: string }>("/auth/logout", {}, token);
}

export async function getMe(token: string) {
  return apiGet<AuthPayload["user"]>("/auth/me", token);
}

export async function getGoogleRedirect(next = "/dashboard") {
  return apiGet<{ url: string }>(`/auth/google/redirect?next=${encodeURIComponent(next)}`);
}

export function checkoutTicket(
  eventSlug: string,
  payload: {
    event_ticket_id: number;
    quantity: number;
    gateway: "flutterwave" | "iotec";
    phone?: string;
    coupon_code?: string;
    holder?: { name?: string; email?: string; phone?: string };
  },
  token: string,
) {
  return apiPost<CheckoutResponse>(`/events/${eventSlug}/tickets/checkout`, payload, token);
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  return apiGet<SubscriptionPlan[]>("/subscription-plans");
}

export async function getMySubscriptions(token: string): Promise<{ active: UserSubscription | null; history: UserSubscription[] }> {
  return apiGet<{ active: UserSubscription | null; history: UserSubscription[] }>("/me/subscriptions", token);
}

export function checkoutSubscription(
  payload: {
    subscription_plan_id: number;
    gateway: "flutterwave" | "iotec";
    phone?: string;
  },
  token: string,
) {
  return apiPost<SubscriptionCheckoutResponse>("/subscriptions/checkout", payload, token);
}

export async function getPaymentStatus(reference: string, token?: string, params: Record<string, string | undefined> = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  return apiGet<PaymentSummary>(`/payments/${encodeURIComponent(reference)}/status${query.size ? `?${query}` : ""}`, token);
}

export async function verifyFlutterwaveCallback(params: Record<string, string | undefined>, token?: string) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  return apiGet<PaymentSummary>(`/payments/callback/flutterwave?${query}`, token);
}

export async function getMyTickets(token: string): Promise<Paginated<TicketPurchase>> {
  const envelope = await apiGetEnvelope<TicketPurchase[]>("/me/tickets", token);

  return {
    data: envelope.data,
    links: envelope.links,
    meta: envelope.meta,
  };
}

export async function getMyPayments(token: string): Promise<Paginated<PaymentSummary>> {
  const envelope = await apiGetEnvelope<PaymentSummary[]>("/me/payments", token);

  return {
    data: envelope.data,
    links: envelope.links,
    meta: envelope.meta,
  };
}

export async function getFighterApplication(token: string): Promise<FighterApplication | null> {
  return apiGet<FighterApplication | null>("/me/fighter-application", token);
}

export async function submitFighterApplication(
  token: string,
  payload: {
    stage_name?: string;
    phone?: string;
    weight_class?: string;
    record_summary?: string;
    message?: string;
  },
): Promise<FighterApplication> {
  return apiPost<FighterApplication>("/me/fighter-application", payload, token);
}

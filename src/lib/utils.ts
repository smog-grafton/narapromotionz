import { clsx, type ClassValue } from "clsx";

const configuredBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v\d+\/?$/, "") ??
  "";
const defaultCurrency = process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "UGX";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value?: string | null, fallback = "TBA") {
  if (!value) return fallback;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatTime(value?: string | null) {
  if (!value) return "Time TBA";

  if (/^\d{2}:\d{2}/.test(value)) {
    const [hours, minutes] = value.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), 0, 0);

    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return value;
}

export function imageUrl(value: string | null | undefined, fallback: string) {
  const rawValue = value?.trim();

  if (!rawValue || rawValue === "null" || rawValue === "undefined" || rawValue === "#") {
    return fallback;
  }

  if (rawValue.startsWith("//")) {
    return `https:${rawValue}`;
  }

  if (/^https?:\/\//i.test(rawValue)) {
    try {
      const url = new URL(rawValue);
      const backend = configuredBackendUrl ? new URL(configuredBackendUrl) : null;
      const isLocalBackend = ["127.0.0.1", "localhost"].includes(url.hostname);

      if (backend && isLocalBackend && (url.pathname.startsWith("/storage/") || url.pathname.startsWith("/assets/"))) {
        return `${backend.origin}${url.pathname}${url.search}`;
      }

      return rawValue;
    } catch {
      return fallback;
    }
  }

  if (rawValue.startsWith("/storage/") && configuredBackendUrl) {
    return `${configuredBackendUrl.replace(/\/$/, "")}${rawValue}`;
  }

  if (rawValue.startsWith("storage/") && configuredBackendUrl) {
    return `${configuredBackendUrl.replace(/\/$/, "")}/${rawValue}`;
  }

  if (rawValue.startsWith("/")) {
    return rawValue;
  }

  return `/${rawValue}`;
}

export function money(value?: number | null, currency = defaultCurrency) {
  if (value === null || value === undefined) return "Ticket details";

  const currencyCode = (currency || defaultCurrency).toUpperCase();

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: currencyCode === "UGX" ? 0 : 2,
  }).format(value);
}

export function stripHtml(value?: string | null) {
  return value ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : "";
}

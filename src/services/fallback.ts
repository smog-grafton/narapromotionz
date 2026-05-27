import type { Boxer, BoxerDetailPayload, Event, HomePayload, NewsArticle, NewsDetailPayload, StreamPayload, Video, VideoDetailPayload } from "@/types/platform";

export const fallbackHome: HomePayload = {
  hero_event: {
    id: 1,
    name: "Fight Night Kampala",
    tagline: "Nara Promotionz presents a new era of Ugandan boxing",
    slug: "fight-night-kampala",
    description:
      "A premium boxing night built for the arena and for online PPV viewers, featuring Nara fighters, live coverage, replays, and official ticket-holder prize draws.",
    event_date: "2026-08-22",
    event_time: "20:00:00",
    venue: "Kampala Arena",
    city: "Kampala",
    country: "Uganda",
    status: "upcoming",
    event_type: "championship",
    broadcast: { network: "Narabox TV", type: "ppv" },
    ticketing: { available: true, min_price: 15000, max_price: 80000 },
    streaming: { has_stream: true, is_ppv: true, requires_ticket: true, status: "scheduled" },
    images: {
      poster: "/assets/images/silders/herbat-matovu.jpg",
      banner: "/assets/images/silders/herbat-matovu.jpg",
    },
    main_event: {
      title: "Herbat Matovu vs Regional Contender",
      weight_class: "Super Welterweight",
      rounds: 10,
      belt_title: "East Africa Title Eliminator",
      red_corner: {
        id: 1,
        name: "Herbat Matovu",
        slug: "herbat-matovu",
        nationality: "Uganda",
        weight_class: "Super Welterweight",
        image_url: "/assets/images/profiles/fighter1.jpg",
        record: { wins: 12, losses: 1, draws: 0, knockouts: 8, display: "12-1-0" },
      },
      blue_corner: {
        id: 2,
        name: "Regional Contender",
        slug: "regional-contender",
        nationality: "Kenya",
        weight_class: "Super Welterweight",
        image_url: "/assets/images/profiles/fighter2.jpg",
        record: { wins: 10, losses: 2, draws: 1, knockouts: 6, display: "10-2-1" },
      },
    },
  },
  upcoming_events: [
    {
      id: 2,
      name: "Nara Rising Prospects",
      slug: "nara-rising-prospects",
      event_date: "2026-09-19",
      venue: "Jinja Main Hall",
      city: "Jinja",
      country: "Uganda",
      images: { poster: "/assets/images/events/event1.webp" },
      ticketing: { available: true, min_price: 10000 },
      streaming: { has_stream: true, is_ppv: true },
    },
    {
      id: 3,
      name: "Champions Road",
      slug: "champions-road",
      event_date: "2026-10-31",
      venue: "Kampala Arena",
      city: "Kampala",
      country: "Uganda",
      images: { poster: "/assets/images/events/event2.webp" },
      ticketing: { available: true, min_price: 20000 },
      streaming: { has_stream: true, is_ppv: true },
    },
  ],
  latest_news: [
    {
      id: 1,
      title: "Nara Promotionz prepares integrated PPV fight-night coverage",
      slug: "nara-prepares-ppv-coverage",
      excerpt: "The platform will bring tickets, live access, replay windows, and official news into one fight-night flow.",
      content_type: "news",
      published_at: "2026-05-24",
      reading_time: 4,
      is_breaking: true,
      is_trending: true,
      image_url: "/assets/images/banner/news_oagebanner.jpg",
      author: { name: "Nara Editorial" },
      category: { name: "News", slug: "news" },
      categories: [{ name: "News", slug: "news" }],
    },
    {
      id: 2,
      title: "Boxer spotlight: the making of a modern Ugandan contender",
      slug: "boxer-spotlight-modern-ugandan-contender",
      excerpt: "Inside the training, matchmaking, and media work behind a boxer profile ready for regional audiences.",
      content_type: "feature",
      published_at: "2026-05-23",
      reading_time: 6,
      is_editors_pick: true,
      image_url: "/assets/images/profiles/fighter3.jpg",
      author: { name: "Nara Editorial" },
      category: { name: "Features", slug: "features" },
      categories: [{ name: "Features", slug: "features" }],
    },
  ],
  breaking_news: [],
  trending_news: [],
  fight_previews: [],
  interviews: [],
  featured_videos: [
    {
      id: 1,
      title: "Training camp: power, timing, discipline",
      slug: "training-camp-power-timing-discipline",
      category: "training",
      duration: "08:12",
      thumbnail_url: "/assets/images/videos/video1.webp",
    },
    {
      id: 2,
      title: "Post-fight interview from the Nara corner",
      slug: "post-fight-interview-nara-corner",
      category: "interview",
      duration: "05:44",
      thumbnail_url: "/assets/images/videos/video2.webp",
    },
  ],
  boxer_spotlight: [
    {
      id: 1,
      name: "Sulaiman Musalo",
      slug: "sulaiman-musalo",
      ring_name: "The Silent Force",
      nationality: "Uganda",
      weight_class: "Super Welterweight",
      image_url: "/assets/images/boxer-card/sulaiman_mussaalo.png",
      record: { wins: 14, losses: 1, draws: 0, knockouts: 9, display: "14-1-0" },
    },
    {
      id: 2,
      name: "Abu Kiyaga",
      slug: "abu-kiyaga",
      nationality: "Uganda",
      weight_class: "Lightweight",
      image_url: "/assets/images/boxer-card/abu.png",
      record: { wins: 9, losses: 0, draws: 1, knockouts: 5, display: "9-0-1" },
    },
  ],
  sponsors: [
    { name: "Nara Sports", logo_url: "/assets/images/client/narasports.png", tier: "main" },
    { name: "Nara TV Live", logo_url: "/assets/images/client/naratvlive.png", tier: "media" },
    { name: "Nara Events", logo_url: "/assets/images/client/naraevents.png", tier: "supporting" },
  ],
};

export const fallbackBoxers: Boxer[] = [
  {
    id: 1,
    name: "Sulaiman Musalo",
    slug: "sulaiman-musalo",
    ring_name: "The Silent Force",
    nationality: "Uganda",
    country: "Uganda",
    hometown: "Kampala",
    weight_class: "Super Welterweight",
    stance: "Orthodox",
    height: "5'10\"",
    reach: "72\"",
    image_url: "/assets/images/boxer-card/sulaiman_mussaalo.png",
    ranking: 1,
    ranking_label: "#1 Super Welterweight",
    titles: ["ABU"],
    status: "Professional",
    bio: "A disciplined pressure fighter from the Nara roster with sharp fundamentals and a strong finishing instinct.",
    record: { wins: 14, losses: 1, draws: 0, knockouts: 9, display: "14-1-0", ko_rate: 64, win_rate: 93 },
    record_wins: 14,
    record_losses: 1,
    record_draws: 0,
    knockouts: 9,
    total_fights: 15,
    knockout_percentage: 64,
    win_percentage: 93,
  },
  {
    id: 2,
    name: "Abu Kiyaga",
    slug: "abu-kiyaga",
    nationality: "Uganda",
    weight_class: "Lightweight",
    stance: "Southpaw",
    image_url: "/assets/images/boxer-card/abu.png",
    ranking: 2,
    ranking_label: "#2 Lightweight",
    titles: ["Nara Prospect"],
    status: "Rising contender",
    bio: "A fast-handed lightweight prospect with clean counters and crowd-friendly tempo.",
    record: { wins: 9, losses: 0, draws: 1, knockouts: 5, display: "9-0-1", ko_rate: 56, win_rate: 90 },
    record_wins: 9,
    record_losses: 0,
    record_draws: 1,
    knockouts: 5,
    total_fights: 10,
    knockout_percentage: 56,
    win_percentage: 90,
  },
  {
    id: 3,
    name: "Herbat Matovu",
    slug: "herbat-matovu",
    ring_name: "The Technician",
    nationality: "Uganda",
    weight_class: "Middleweight",
    stance: "Orthodox",
    image_url: "/assets/images/silders/herbat-matovu.jpg",
    ranking: 3,
    ranking_label: "#3 Middleweight",
    status: "Professional",
    bio: "A composed boxer-puncher built for long-round fights and disciplined event main cards.",
    record: { wins: 12, losses: 1, draws: 0, knockouts: 8, display: "12-1-0", ko_rate: 67, win_rate: 92 },
    record_wins: 12,
    record_losses: 1,
    record_draws: 0,
    knockouts: 8,
    total_fights: 13,
    knockout_percentage: 67,
    win_percentage: 92,
  },
  {
    id: 4,
    name: "John Serunjogi",
    slug: "john-serunjogi",
    ring_name: "Seru",
    nationality: "Uganda",
    weight_class: "Super Middleweight",
    stance: "Orthodox",
    image_url: "/assets/images/profiles/fighter1.jpg",
    ranking: 4,
    ranking_label: "#4 Super Middleweight",
    status: "Professional",
    bio: "A sturdy all-action fighter with regional fight-night experience and a strong fan base.",
    record: { wins: 15, losses: 2, draws: 0, knockouts: 3, display: "15-2-0", ko_rate: 20, win_rate: 88 },
    record_wins: 15,
    record_losses: 2,
    record_draws: 0,
    knockouts: 3,
    total_fights: 17,
    knockout_percentage: 20,
    win_percentage: 88,
  },
];

export const fallbackEvents: Event[] = [
  fallbackHome.hero_event!,
  ...(fallbackHome.upcoming_events ?? []),
];

export const fallbackNews: NewsArticle[] = fallbackHome.latest_news ?? [];

export const fallbackVideos: Video[] = fallbackHome.featured_videos ?? [];

export function fallbackBoxerDetail(slug: string): BoxerDetailPayload {
  const profile = fallbackBoxers.find((boxer) => boxer.slug === slug) ?? fallbackBoxers[0];

  return {
    profile,
    fight_history: [],
    events: fallbackEvents,
    videos: fallbackHome.featured_videos,
    news: fallbackHome.latest_news,
  };
}

export function fallbackNewsDetail(slug: string): NewsDetailPayload {
  const article = fallbackNews.find((item) => item.slug === slug) ?? fallbackNews[0];

  return {
    article: {
      ...article,
      content:
        article.content ??
        `<p>${article.excerpt ?? "Nara Promotionz editorial coverage will be published here with fight-night context, boxer updates, interviews, and official platform news."}</p>`,
    },
    related: fallbackNews.filter((item) => item.slug !== article.slug),
  };
}

export function fallbackVideoDetail(slug: string): VideoDetailPayload {
  const video = fallbackVideos.find((item) => item.slug === slug) ?? fallbackVideos[0];

  return {
    video,
    related: fallbackVideos.filter((item) => item.slug !== video.slug),
  };
}

export const fallbackStream: StreamPayload = {
  status: "scheduled",
  access: {
    authenticated: false,
    can_watch_live: false,
    can_watch_replay: false,
    reason: "login_required",
  },
  stream: null,
};

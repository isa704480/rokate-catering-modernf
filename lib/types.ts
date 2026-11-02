export type Locale = "en" | "ru";

export type Img = {
  src: string;
  srcset: string;
  width: number | null;
  height: number | null;
  alt: string;
  blur: string;
} | null;

export type Seo = { title: string; description: string; image: Img; noindex: boolean };

export type SiteData = {
  company_name: string;
  tagline: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_text: string;
  email: string;
  instagram_url: string;
  service_area: string;
  working_hours: string;
  address: string;
  logo: string | null;
  seo: { title: string; description: string; image: Img };
  event_types: { id: number; slug: string; name: string }[];
  locations: { value: string; label: string }[];
  nav_services: { slug: string; title: string }[];
};

export type Package = {
  id: number;
  slug: string;
  name: string;
  image: Img;
  images: Img[];
  guests_min: number | null;
  guests_max: number | null;
  short_text: string;
  contents: string[];
  price_from: number | null;
  price_note: string;
  badge: string;
};

export type Project = {
  slug: string;
  title: string;
  location_type: string;
  location_label: string;
  event_type: string;
  guests: number | null;
  year: number | null;
  cover: Img;
  description: string;
  images: Img[];
  video_url: string;
};

export type ServiceCard = {
  slug: string;
  title: string;
  card_text: string;
  location_type: string;
  has_page: boolean;
  image: Img;
};

export type Offer = {
  id: number;
  title: string;
  text: string;
  image: Img;
  price: number | null;
  ends_at: string | null;
  cta_text: string;
  package: string | null;
};

export type Faq = { q: string; a: string };

export type HomeData = {
  hero: { eyebrow: string; title: string; subtitle: string; image: Img; video: string | null; cta: string };
  about: { eyebrow: string; title: string; text: string; image: Img; stats: { value: string; label: string }[] };
  directions: { title: string; items: ServiceCard[] };
  formats: { title: string; items: string[] };
  packages: { title: string; text: string; items: Package[] };
  offers: Offer[];
  relax: { eyebrow: string; title: string; text: string; image: Img; steps: { title: string; text: string }[] };
  services: { title: string; text: string; note: string; items: { title: string; description: string; icon: string }[] };
  portfolio: { title: string; text: string; items: Project[] };
  why: { title: string; items: { icon: string; title: string; text: string }[] };
  faq: { title: string; items: Faq[] };
  form: { title: string; text: string };
  seo: Seo;
};

export type ServiceData = {
  slug: string;
  title: string;
  headline: string;
  intro: string;
  body: string;
  image: Img;
  location_type: string;
  options: { title: string; text: string }[];
  packages: Package[];
  gallery: Img[];
  faq: Faq[];
  seo: Seo;
};

export type MenuData = {
  intro: string;
  pdf: string | null;
  categories: { name: string; items: { name: string; description: string; price: number | null }[] }[];
};

export type PartnersData = {
  title: string;
  intro: string;
  audience_title: string;
  audience: string[];
  offer_title: string;
  offer_text: string;
  image: Img;
  form_title: string;
  faq: Faq[];
  seo: Seo;
};

export type LegalData = { title: string; body: string; seo: Seo };

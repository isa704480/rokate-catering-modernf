export type Settings = {
  phone: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  email: string;
  city: string;
  hours: string;
  venues: string;
  siteUrl: string;
  gaId: string;
  turnstileSiteKey: string;
};

export type Direction = {
  slug: string;
  order?: number;
  title: string;
  short: string;
  page?: string; // bo'lsa — alohida sahifaga olib boradi
  photos: string[];
  body?: string;
};

export type Pkg = {
  slug: string;
  order?: number;
  title: string;
  guests: string;
  price: string;
  includes: string[];
  photo: string;
};

export type Project = {
  slug: string;
  order?: number;
  title: string;
  kind: string;
  place: string;
  photo: string;
};

export type Review = {
  slug: string;
  order?: number;
  author: string;
  text: string;
  kind?: string;
};

export type Step = { title: string; text: string };
export type Advantage = { title: string; text: string };
export type Faq = { q: string; a: string };
export type Service = { title: string; text: string };

export type Home = {
  hero: { title: string; text: string; photos: string[]; video?: string };
  about: { title: string; text: string; advantages: Advantage[] };
  directionsTitle: string;
  directionsText: string;
  packagesTitle: string;
  packagesText: string;
  relax: { title: string; text: string; steps: Step[] };
  services: { title: string; note: string; items: Service[] };
  portfolio: { title: string; text: string };
  faqTitle: string;
  cta: { title: string; text: string };
};

export type PageDoc = {
  title: string;
  lede: string;
  photo: string;
  blocks: { title: string; text: string }[];
  gallery: string[];
  listTitle?: string;
  list?: string[];
};

export type Seo = Record<string, { title: string; description: string }>;

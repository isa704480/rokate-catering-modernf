import type { Locale } from "./types";

const en = {
  nav: { services: "Services", packages: "Packages", portfolio: "Portfolio", menu: "Menu", contact: "Contact", partners: "Partners", home: "Home" },
  cta: { proposal: "Get a proposal", whatsapp: "WhatsApp", call: "Call", request: "Request", requestPackage: "Request this package",
         seeAll: "See all", learnMore: "Learn more", planEvent: "Plan my event", back: "Back to home", downloadMenu: "Download menu (PDF)" },
  price: { onRequest: "Price on request", from: "from", currency: "AED" },
  guests: (min: number | null, max: number | null) =>
    min && max ? `${min}–${max} guests` : min ? `from ${min} guests` : max ? `up to ${max} guests` : "",
  badge: { new: "New", seasonal: "Seasonal", bestseller: "Bestseller", signature: "Signature" } as Record<string, string>,
  offerUntil: "until",
  form: {
    name: "Your name", phone: "Phone / WhatsApp", date: "Event date", type: "Type of event", guests: "Number of guests",
    location: "Venue", package: "Package", comment: "Tell us more", choose: "Choose…", optional: "optional",
    namePh: "Anna", phonePh: "+971 50 123 4567", commentPh: "Yacht, number of hours, wishes for the menu…",
    submit: "Send request", sending: "Sending…", required: "Required field", phoneInvalid: "Please check the phone number",
    error: "Something went wrong. Please try again or message us on WhatsApp.", rate: "Too many requests. Please message us on WhatsApp.",
    privacy: "By sending the form you agree to our", privacyLink: "privacy policy", or: "or",
    company: "Company", field: "Field of business", email: "Email", message: "Message", partnerSubmit: "Become a partner",
    contactRequired: "Please leave a phone or email",
  },
  thanks: { title: "Thank you! Your request has been sent", text: "We will contact you shortly with a proposal. If it's urgent — message us on WhatsApp.",
            partnerTitle: "Thank you! We'll be in touch", partnerText: "We have received your partnership request and will contact you personally." },
  footer: { contacts: "Contacts", explore: "Explore", rights: "All rights reserved.", privacy: "Privacy policy", follow: "Instagram" },
  service: { options: "Service options", packages: "Suggested packages", gallery: "From our events", process: "How it works",
             steps: [["Request", "Tell us the date, venue and number of guests."], ["Proposal", "We prepare a menu and service proposal."],
                     ["Preparation", "We plan logistics, staff and decor."], ["Your event", "We serve — you enjoy the day."]] },
  menu: { title: "Menu", notSure: "Not sure what to choose?", notSureText: "Start with a ready-made package — or message us and we'll suggest the right amount of food for your guests." },
  notFound: { title: "Page not found", text: "The page you are looking for does not exist." },
  loc: { yacht: "Yacht", villa: "Villa", office: "Office", home: "Home", desert: "Desert / outdoor", venue: "Venue", other: "Other" } as Record<string, string>,
  lang: "Language",
  ourEvents: "Our events",
  photo: "Photo",
  close: "Close",
  prev: "Previous",
  next: "Next",
};

type Dict = typeof en;

const ru: Dict = {
  nav: { services: "Услуги", packages: "Пакеты", portfolio: "Портфолио", menu: "Меню", contact: "Контакты", partners: "Партнёрам", home: "Главная" },
  cta: { proposal: "Получить предложение", whatsapp: "WhatsApp", call: "Позвонить", request: "Заявка", requestPackage: "Заказать пакет",
         seeAll: "Смотреть все", learnMore: "Подробнее", planEvent: "Спланировать мероприятие", back: "На главную", downloadMenu: "Скачать меню (PDF)" },
  price: { onRequest: "Цена по запросу", from: "от", currency: "AED" },
  guests: (min: number | null, max: number | null) =>
    min && max ? `${min}–${max} гостей` : min ? `от ${min} гостей` : max ? `до ${max} гостей` : "",
  badge: { new: "Новинка", seasonal: "Сезонное", bestseller: "Хит", signature: "Фирменный" },
  offerUntil: "до",
  form: {
    name: "Ваше имя", phone: "Телефон / WhatsApp", date: "Дата мероприятия", type: "Тип мероприятия", guests: "Количество гостей",
    location: "Площадка", package: "Пакет", comment: "Комментарий", choose: "Выберите…", optional: "необязательно",
    namePh: "Анна", phonePh: "+971 50 123 4567", commentPh: "Яхта, сколько часов, пожелания по меню…",
    submit: "Отправить заявку", sending: "Отправляем…", required: "Обязательное поле", phoneInvalid: "Проверьте номер телефона",
    error: "Что-то пошло не так. Попробуйте ещё раз или напишите нам в WhatsApp.", rate: "Слишком много заявок. Напишите нам в WhatsApp.",
    privacy: "Отправляя форму, вы соглашаетесь с", privacyLink: "политикой конфиденциальности", or: "или",
    company: "Компания", field: "Сфера деятельности", email: "Email", message: "Сообщение", partnerSubmit: "Стать партнёром",
    contactRequired: "Оставьте телефон или email",
  },
  thanks: { title: "Спасибо! Заявка отправлена", text: "Мы скоро свяжемся с вами и подготовим предложение. Если срочно — напишите нам в WhatsApp.",
            partnerTitle: "Спасибо! Мы свяжемся с вами", partnerText: "Мы получили вашу заявку на партнёрство и свяжемся с вами лично." },
  footer: { contacts: "Контакты", explore: "Разделы", rights: "Все права защищены.", privacy: "Политика конфиденциальности", follow: "Instagram" },
  service: { options: "Варианты обслуживания", packages: "Подходящие пакеты", gallery: "С наших мероприятий", process: "Как мы работаем",
             steps: [["Заявка", "Расскажите дату, площадку и количество гостей."], ["Предложение", "Мы готовим меню и предложение по сервису."],
                     ["Подготовка", "Планируем логистику, персонал и декор."], ["Ваше событие", "Мы работаем — вы наслаждаетесь."]] },
  menu: { title: "Меню", notSure: "Сложно выбрать?", notSureText: "Начните с готового пакета — или напишите нам, и мы подскажем, сколько еды нужно на ваших гостей." },
  notFound: { title: "Страница не найдена", text: "Такой страницы не существует." },
  loc: { yacht: "Яхта", villa: "Вилла", office: "Офис", home: "Дом", desert: "Пустыня / outdoor", venue: "Площадка", other: "Другое" },
  lang: "Язык",
  ourEvents: "Наши мероприятия",
  photo: "Фото",
  close: "Закрыть",
  prev: "Назад",
  next: "Вперёд",
};

export function t(locale: Locale): Dict {
  return locale === "ru" ? ru : en;
}

export function formatPrice(locale: Locale, value: number) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US").format(value);
}

export function isLocale(x: string): x is Locale {
  return x === "en" || x === "ru";
}

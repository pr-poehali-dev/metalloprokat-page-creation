import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/dba27449-6278-4982-8f32-588e21f9d222/files/ef225bdd-5df0-4167-a54b-7fc331030c85.jpg";
const CATALOG_IMG = "https://cdn.poehali.dev/projects/dba27449-6278-4982-8f32-588e21f9d222/files/fd269347-1232-4b6d-99fa-5d095cf273dd.jpg";
const DELIVERY_IMG = "https://cdn.poehali.dev/projects/dba27449-6278-4982-8f32-588e21f9d222/files/077ae01c-2c98-4a4f-baf4-6728c5512774.jpg";

const NAV_ITEMS = [
  { label: "Главная", href: "#home" },
  { label: "Каталог", href: "#catalog" },
  { label: "Услуги", href: "#services" },
  { label: "Цены", href: "#prices" },
  { label: "Калькулятор", href: "#calculator" },
  { label: "Доставка", href: "#delivery" },
  { label: "О компании", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

const CATALOG_ITEMS = [
  { name: "Арматура", icon: "Minus", desc: "А400, А500 диаметром 6–40 мм", price: "от 67 500 ₽/т" },
  { name: "Труба профильная", icon: "Square", desc: "20×20 — 300×300 мм, толщина 1.5–12 мм", price: "от 85 000 ₽/т" },
  { name: "Труба круглая", icon: "Circle", desc: "Диаметр 15–530 мм, ГОСТ 8732", price: "от 78 000 ₽/т" },
  { name: "Уголок", icon: "CornerUpRight", desc: "Равнополочный 20×20 — 250×250 мм", price: "от 72 000 ₽/т" },
  { name: "Швеллер", icon: "AlignCenter", desc: "№ 5П — 40П, горячекатаный", price: "от 79 000 ₽/т" },
  { name: "Двутавр (балка)", icon: "Columns2", desc: "№10 — 70Б, ГОСТ 26020", price: "от 82 000 ₽/т" },
  { name: "Листовой металл", icon: "Layout", desc: "Горячекатаный, холоднокатаный, нержавейка", price: "от 68 000 ₽/т" },
  { name: "Нержавеющий прокат", icon: "Shield", desc: "AISI 304, 316, 321 — листы, трубы, круг", price: "от 245 000 ₽/т" },
];

const SERVICES = [
  { icon: "Scissors", title: "Резка металла", desc: "Плазменная и газовая резка по размерам заказчика с точностью ±1 мм" },
  { icon: "Wrench", title: "Гибка и рубка", desc: "Гибка листового металла, рубка на гильотине до 16 мм" },
  { icon: "Package", title: "Комплектация", desc: "Сборка комплектов под объект — от одной позиции до полной спецификации" },
  { icon: "Truck", title: "Доставка", desc: "Собственный парк транспорта. Доставка по городу и области в день заказа" },
  { icon: "FileText", title: "Документация", desc: "Сертификаты качества, счета-фактуры, товарные накладные" },
  { icon: "Headphones", title: "Технический консалтинг", desc: "Подбор материалов по проекту, расчёт веса и количества" },
];

const PRICES = [
  { category: "Арматура А500С", sizes: "Ø 8–40 мм", price: "67 500 – 72 000", unit: "₽/т" },
  { category: "Труба профильная", sizes: "20×20 – 300×300", price: "85 000 – 98 000", unit: "₽/т" },
  { category: "Труба круглая б/ш", sizes: "Ø 15–219 мм", price: "78 000 – 95 000", unit: "₽/т" },
  { category: "Уголок равнополочный", sizes: "20×20 – 160×160", price: "72 000 – 80 000", unit: "₽/т" },
  { category: "Швеллер горячекатаный", sizes: "5П – 30П", price: "79 000 – 88 000", unit: "₽/т" },
  { category: "Двутавр (балка)", sizes: "10Б – 40Б", price: "82 000 – 92 000", unit: "₽/т" },
  { category: "Лист горячекатаный", sizes: "2 – 60 мм", price: "68 000 – 78 000", unit: "₽/т" },
  { category: "Лист холоднокатаный", sizes: "0.5 – 4 мм", price: "92 000 – 110 000", unit: "₽/т" },
];

const METAL_TYPES = [
  { id: "armatura", name: "Арматура А500С", density: 7850, pricePerTon: 69000 },
  { id: "truba_prof", name: "Труба профильная", density: 7850, pricePerTon: 89000 },
  { id: "truba_krug", name: "Труба круглая", density: 7850, pricePerTon: 82000 },
  { id: "ugolok", name: "Уголок равнополочный", density: 7850, pricePerTon: 75000 },
  { id: "shveller", name: "Швеллер", density: 7850, pricePerTon: 83000 },
  { id: "dvutavr", name: "Двутавр (балка)", density: 7850, pricePerTon: 87000 },
  { id: "list_gk", name: "Лист горячекатаный", density: 7850, pricePerTon: 72000 },
  { id: "list_nj", name: "Нержавеющий лист", density: 7930, pricePerTon: 260000 },
];

type CalcParams = Record<string, number>;

const WEIGHT_FNS: Record<string, (p: CalcParams) => number> = {
  armatura: (p) => Math.PI * Math.pow(p.diameter / 2000, 2) * p.length * 7850,
  truba_prof: (p) => (p.width / 1000 * 4 - 4 * (p.thickness / 1000)) * (p.thickness / 1000) * p.length * 7850,
  truba_krug: (p) => Math.PI * (Math.pow(p.outerD / 2000, 2) - Math.pow(p.innerD / 2000, 2)) * p.length * 7850,
  ugolok: (p) => (2 * p.shelf / 1000 - p.thickness / 1000) * (p.thickness / 1000) * p.length * 7850,
  shveller: (p) => ((p.height / 1000) * (p.thickness / 1000) + 2 * (p.shelf / 1000) * (p.flangeThick / 1000)) * p.length * 7850,
  dvutavr: (p) => ((p.height / 1000) * (p.webThick / 1000) + 2 * (p.width / 1000) * (p.flangeThick / 1000)) * p.length * 7850,
  list_gk: (p) => (p.thickness / 1000) * (p.width / 1000) * (p.height / 1000) * 7850,
  list_nj: (p) => (p.thickness / 1000) * (p.width / 1000) * (p.height / 1000) * 7930,
};

type CalcParam = { label: string; key: string; default: number; min: number; max: number; step: number };

const CALC_PARAMS: Record<string, CalcParam[]> = {
  armatura: [
    { label: "Диаметр (мм)", key: "diameter", default: 12, min: 6, max: 40, step: 1 },
    { label: "Длина (м)", key: "length", default: 6, min: 0.1, max: 24, step: 0.1 },
    { label: "Количество (шт)", key: "count", default: 100, min: 1, max: 100000, step: 1 },
  ],
  truba_prof: [
    { label: "Ширина (мм)", key: "width", default: 80, min: 20, max: 300, step: 5 },
    { label: "Толщина стенки (мм)", key: "thickness", default: 4, min: 1.5, max: 12, step: 0.5 },
    { label: "Длина (м)", key: "length", default: 6, min: 0.1, max: 12, step: 0.1 },
    { label: "Количество (шт)", key: "count", default: 10, min: 1, max: 10000, step: 1 },
  ],
  truba_krug: [
    { label: "Наружный диаметр (мм)", key: "outerD", default: 57, min: 15, max: 530, step: 1 },
    { label: "Внутренний диаметр (мм)", key: "innerD", default: 50, min: 10, max: 528, step: 1 },
    { label: "Длина (м)", key: "length", default: 6, min: 0.1, max: 12, step: 0.1 },
    { label: "Количество (шт)", key: "count", default: 10, min: 1, max: 10000, step: 1 },
  ],
  ugolok: [
    { label: "Полка (мм)", key: "shelf", default: 50, min: 20, max: 250, step: 5 },
    { label: "Толщина (мм)", key: "thickness", default: 5, min: 3, max: 20, step: 0.5 },
    { label: "Длина (м)", key: "length", default: 6, min: 0.1, max: 12, step: 0.1 },
    { label: "Количество (шт)", key: "count", default: 20, min: 1, max: 10000, step: 1 },
  ],
  shveller: [
    { label: "Высота (мм)", key: "height", default: 160, min: 50, max: 400, step: 10 },
    { label: "Полка (мм)", key: "shelf", default: 64, min: 32, max: 115, step: 1 },
    { label: "Толщина стенки (мм)", key: "thickness", default: 7, min: 4, max: 12, step: 0.5 },
    { label: "Толщина полки (мм)", key: "flangeThick", default: 10, min: 5, max: 18, step: 0.5 },
    { label: "Длина (м)", key: "length", default: 6, min: 0.1, max: 12, step: 0.1 },
    { label: "Количество (шт)", key: "count", default: 5, min: 1, max: 1000, step: 1 },
  ],
  dvutavr: [
    { label: "Высота (мм)", key: "height", default: 200, min: 100, max: 700, step: 10 },
    { label: "Ширина полки (мм)", key: "width", default: 100, min: 55, max: 320, step: 5 },
    { label: "Толщина стенки (мм)", key: "webThick", default: 7, min: 4, max: 20, step: 0.5 },
    { label: "Толщина полки (мм)", key: "flangeThick", default: 11, min: 6, max: 28, step: 0.5 },
    { label: "Длина (м)", key: "length", default: 6, min: 0.1, max: 12, step: 0.1 },
    { label: "Количество (шт)", key: "count", default: 5, min: 1, max: 1000, step: 1 },
  ],
  list_gk: [
    { label: "Толщина (мм)", key: "thickness", default: 8, min: 2, max: 60, step: 1 },
    { label: "Ширина (мм)", key: "width", default: 1500, min: 500, max: 3000, step: 100 },
    { label: "Длина (мм)", key: "height", default: 6000, min: 500, max: 12000, step: 100 },
    { label: "Количество (шт)", key: "count", default: 5, min: 1, max: 1000, step: 1 },
  ],
  list_nj: [
    { label: "Толщина (мм)", key: "thickness", default: 3, min: 0.5, max: 50, step: 0.5 },
    { label: "Ширина (мм)", key: "width", default: 1000, min: 500, max: 2000, step: 100 },
    { label: "Длина (мм)", key: "height", default: 2000, min: 500, max: 6000, step: 100 },
    { label: "Количество (шт)", key: "count", default: 2, min: 1, max: 1000, step: 1 },
  ],
};

const FAQ_ITEMS = [
  { q: "Какова минимальная сумма заказа?", a: "Минимальная сумма заказа — 15 000 рублей. Для мелкорозничных покупок (физлица) — от 1 позиции." },
  { q: "Есть ли доставка по России?", a: "Да, работаем с транспортными компаниями по всей России. Стоимость доставки рассчитывается при оформлении заказа в зависимости от веса и региона." },
  { q: "Выдаёте ли документы для юридических лиц?", a: "Конечно. Счёт-фактура, ТОРГ-12, UПД, сертификаты качества — все документы предоставляем в полном объёме." },
  { q: "Можно ли купить в нестандартную длину?", a: "Да, мы режем металл по любым размерам. Резка выполняется на собственном оборудовании, стоимость согласовывается." },
  { q: "Как быстро приходит заказ?", a: "По городу и области — в день заказа или на следующий. По России — 3–14 дней в зависимости от транспортной компании." },
  { q: "Предоставляете ли скидки оптовым покупателям?", a: "Да, действует накопительная скидочная система. При регулярных закупках от 50 тонн — индивидуальные условия." },
];

function useInView(ref: React.RefObject<Element>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref as React.RefObject<Element>);
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

export default function Index() {
  const [activeNav, setActiveNav] = useState("#home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState("armatura");
  const [calcParams, setCalcParams] = useState<CalcParams>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const SEND_ORDER_URL = "https://functions.poehali.dev/4a434aad-e7ba-4de6-8eb1-205ab45f61bb";

  const handleSubmit = async () => {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) return;
    setFormStatus("sending");
    try {
      const res = await fetch(SEND_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setFormStatus("success");
        setContactForm({ name: "", phone: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  useEffect(() => {
    const defaults: CalcParams = {};
    (CALC_PARAMS[selectedMetal] || []).forEach((p) => { defaults[p.key] = p.default; });
    setCalcParams(defaults);
  }, [selectedMetal]);

  const calcResult = () => {
    const fn = WEIGHT_FNS[selectedMetal];
    if (!fn || Object.keys(calcParams).length === 0) return { weight: 0, cost: 0 };
    const weightOne = Math.max(0, fn(calcParams));
    const count = Math.max(1, calcParams.count || 1);
    const totalWeight = weightOne * count;
    const metal = METAL_TYPES.find((m) => m.id === selectedMetal);
    const cost = (totalWeight / 1000) * (metal?.pricePerTon || 0);
    return { weight: totalWeight, cost };
  };

  const { weight, cost } = calcResult();

  const scrollTo = (href: string) => {
    setActiveNav(href);
    setMobileMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background font-ibm">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[hsl(20_8%_15%)]" style={{ backgroundColor: "hsla(20,10%,6%,0.96)" }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo("#home"); }} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 flex items-center justify-center">
              <span className="text-black font-oswald font-bold text-sm">СМ</span>
            </div>
            <div>
              <div className="font-oswald font-bold text-lg text-white leading-tight tracking-wide">СПЕЦМЕТАЛЛГРУПП</div>
              <div className="text-orange-500 text-[10px] tracking-widest uppercase leading-tight">Металлопрокат</div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); scrollTo(item.href); }} className={`nav-link ${activeNav === item.href ? "active" : ""}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:+78001234567" className="hidden md:flex items-center gap-2 text-white font-oswald font-medium text-sm hover:text-orange-500 transition-colors">
              <Icon name="Phone" size={14} className="text-orange-500" />
              8 (800) 123-45-67
            </a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-white">
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[hsl(20_8%_15%)] px-4 py-4" style={{ backgroundColor: "hsl(20,10%,6%)" }}>
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); scrollTo(item.href); }} className="nav-link py-2">{item.label}</a>
              ))}
            </div>
            <a href="tel:+78001234567" className="mt-3 flex items-center gap-2 text-orange-500 font-oswald text-base">
              <Icon name="Phone" size={16} />8 (800) 123-45-67
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Металлопрокат" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(20,10%,6%) 40%, hsla(20,10%,6%,0.7) 70%, transparent)" }} />
          <div className="absolute inset-0 metal-grid opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 w-full">
          <div className="max-w-3xl">
            <div className="animate-fade-in opacity-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-orange-500/30 text-orange-500 text-xs font-oswald tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                Работаем с 2008 года
              </div>
            </div>
            <h1 className="animate-fade-in-delay opacity-0 font-oswald font-bold text-5xl md:text-7xl text-white leading-none tracking-tight mb-6">
              МЕТАЛЛОПРОКАТ<br />
              <span className="text-gradient-orange">ОПТОМ И В РОЗНИЦУ</span>
            </h1>
            <p className="animate-fade-in-delay-2 opacity-0 text-lg leading-relaxed mb-10 max-w-xl" style={{ color: "hsl(40,10%,60%)" }}>
              Полный ассортимент металлопроката: трубы, уголки, арматура, балки, листы. Собственный склад 15 000 м². Доставка по всей России.
            </p>
            <div className="animate-fade-in-delay-3 opacity-0 flex flex-wrap gap-4">
              <button onClick={() => scrollTo("#calculator")} className="btn-primary px-8 py-4 text-sm flex items-center gap-2">
                <Icon name="Calculator" size={16} />Рассчитать стоимость
              </button>
              <button onClick={() => scrollTo("#catalog")} className="px-8 py-4 text-sm font-oswald font-semibold tracking-wider uppercase border text-white flex items-center gap-2 hover:text-orange-500 transition-all" style={{ borderColor: "hsl(20,8%,30%)" }}>
                <Icon name="Grid3X3" size={16} />Смотреть каталог
              </button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: "hsl(20,8%,18%)" }}>
            {[
              { value: "15 000", unit: "м²", label: "Площадь склада" },
              { value: "50 000", unit: "т", label: "В наличии" },
              { value: "3 500+", unit: "", label: "Клиентов" },
              { value: "16", unit: "лет", label: "На рынке" },
            ].map((stat, i) => (
              <div key={i} className="px-6 py-5" style={{ background: "hsl(20,10%,6%)" }}>
                <div className="stat-number text-3xl md:text-4xl leading-none">
                  {stat.value}<span className="text-xl ml-1" style={{ color: "rgba(249,115,22,0.6)" }}>{stat.unit}</span>
                </div>
                <div className="text-sm mt-1" style={{ color: "hsl(40,10%,50%)" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Ассортимент</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">КАТАЛОГ ПРОДУКЦИИ</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATALOG_ITEMS.map((item, i) => (
              <AnimatedSection key={i}>
                <div className="card-steel p-6 transition-all duration-300 cursor-pointer group h-full">
                  <div className="w-10 h-10 border border-orange-500/30 flex items-center justify-center mb-4 group-hover:border-orange-500 group-hover:bg-orange-500/10 transition-all">
                    <Icon name={item.icon as "Minus"} size={18} className="text-orange-500" />
                  </div>
                  <h3 className="font-oswald font-semibold text-white text-lg mb-1">{item.name}</h3>
                  <p className="text-sm mb-4" style={{ color: "hsl(40,10%,50%)" }}>{item.desc}</p>
                  <div className="text-orange-500 font-oswald font-semibold text-sm">{item.price}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-12 relative overflow-hidden">
            <img src={CATALOG_IMG} alt="Склад металлопроката" className="w-full h-64 object-cover" style={{ opacity: 0.35 }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, hsl(20,10%,6%), transparent, hsl(20,10%,6%))" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={() => scrollTo("#contacts")} className="btn-primary px-10 py-4 text-base flex items-center gap-3">
                <Icon name="Phone" size={18} />Запросить прайс-лист
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* SERVICES */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Что мы делаем</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">УСЛУГИ</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <AnimatedSection key={i}>
                <div className="card-steel p-8 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 border border-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/10 transition-all" style={{ background: "rgba(249,115,22,0.06)" }}>
                      <Icon name={s.icon as "Scissors"} size={20} className="text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-oswald font-semibold text-white text-xl mb-2">{s.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: "hsl(40,10%,55%)" }}>{s.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* PRICES */}
      <section id="prices" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Актуальные цены</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">ПРАЙС-ЛИСТ</h2>
              <p className="mt-3 text-sm" style={{ color: "hsl(40,10%,50%)" }}>Цены обновляются еженедельно. Для точного расчёта используйте калькулятор.</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="border overflow-hidden" style={{ borderColor: "hsl(20,8%,18%)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: "hsl(20,8%,12%)" }}>
                    <th className="text-left px-6 py-4 font-oswald font-semibold text-orange-500 text-sm tracking-wider uppercase">Категория</th>
                    <th className="text-left px-6 py-4 font-oswald font-semibold text-sm tracking-wider uppercase hidden md:table-cell" style={{ color: "hsl(40,10%,55%)" }}>Размеры</th>
                    <th className="text-right px-6 py-4 font-oswald font-semibold text-white text-sm tracking-wider uppercase">Цена</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICES.map((row, i) => (
                    <tr key={i} className="border-t transition-colors hover:bg-[hsl(20,8%,12%)]" style={{ borderColor: "hsl(20,8%,15%)" }}>
                      <td className="px-6 py-4 text-white text-sm">{row.category}</td>
                      <td className="px-6 py-4 text-sm hidden md:table-cell" style={{ color: "hsl(40,10%,50%)" }}>{row.sizes}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-oswald font-semibold text-orange-500">{row.price}</span>
                        <span className="text-xs ml-1" style={{ color: "hsl(40,10%,50%)" }}>{row.unit}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-3" style={{ color: "hsl(40,10%,40%)" }}>* Цены указаны без НДС, при самовывозе. Доставка и НДС рассчитываются дополнительно.</p>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* CALCULATOR */}
      <section id="calculator" className="py-24 px-4" style={{ background: "hsl(20,8%,8%)" }}>
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Онлайн-инструмент</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">КАЛЬКУЛЯТОР МЕТАЛЛА</h2>
              <p className="mt-3 text-sm" style={{ color: "hsl(40,10%,50%)" }}>Рассчитайте вес и стоимость металлопроката онлайн</p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Type selector */}
              <div className="card-steel p-6">
                <h3 className="font-oswald font-semibold text-white text-lg mb-4 uppercase tracking-wider">Тип металла</h3>
                <div className="space-y-1">
                  {METAL_TYPES.map((m) => (
                    <button key={m.id} onClick={() => setSelectedMetal(m.id)}
                      className={`w-full text-left px-4 py-3 text-sm transition-all ${selectedMetal === m.id ? "bg-orange-500 text-black font-medium" : "hover:bg-[hsl(20,8%,15%)]"}`}
                      style={{ color: selectedMetal === m.id ? undefined : "hsl(40,10%,60%)" }}>
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Params */}
              <div className="card-steel p-6">
                <h3 className="font-oswald font-semibold text-white text-lg mb-4 uppercase tracking-wider">Параметры</h3>
                <div className="space-y-4">
                  {(CALC_PARAMS[selectedMetal] || []).map((param) => (
                    <div key={param.key}>
                      <label className="text-xs font-oswald tracking-wider uppercase block mb-1.5" style={{ color: "hsl(40,10%,55%)" }}>{param.label}</label>
                      <input type="number" min={param.min} max={param.max} step={param.step}
                        value={calcParams[param.key] ?? param.default}
                        onChange={(e) => setCalcParams((prev) => ({ ...prev, [param.key]: parseFloat(e.target.value) || 0 }))}
                        className="w-full text-white text-sm px-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors"
                        style={{ background: "hsl(20,10%,6%)", border: "1px solid hsl(20,8%,22%)" }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="card-steel p-6 flex flex-col">
                <h3 className="font-oswald font-semibold text-white text-lg mb-4 uppercase tracking-wider">Результат</h3>
                <div className="flex-1 space-y-4">
                  <div className="p-5 border" style={{ background: "hsl(20,10%,6%)", borderColor: "hsl(20,8%,20%)" }}>
                    <div className="text-xs font-oswald uppercase tracking-wider mb-2" style={{ color: "hsl(40,10%,50%)" }}>Общий вес</div>
                    <div className="font-oswald font-bold text-3xl text-white">
                      {weight >= 1000 ? `${(weight / 1000).toFixed(3)} т` : `${weight.toFixed(1)} кг`}
                    </div>
                    {weight >= 1000 && <div className="text-sm mt-1" style={{ color: "hsl(40,10%,50%)" }}>{weight.toFixed(0)} кг</div>}
                  </div>
                  <div className="p-5" style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)" }}>
                    <div className="text-xs font-oswald uppercase tracking-wider mb-2" style={{ color: "rgba(249,115,22,0.7)" }}>Стоимость</div>
                    <div className="font-oswald font-bold text-3xl text-orange-500">
                      {cost.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽
                    </div>
                    <div className="text-xs mt-1" style={{ color: "hsl(40,10%,50%)" }}>без НДС, при самовывозе</div>
                  </div>
                  <div className="px-4 py-3 border" style={{ background: "hsl(20,10%,6%)", borderColor: "hsl(20,8%,20%)" }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "hsl(40,10%,50%)" }}>Цена за тонну:</span>
                      <span className="text-white font-medium">{(METAL_TYPES.find((m) => m.id === selectedMetal)?.pricePerTon || 0).toLocaleString("ru-RU")} ₽</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => scrollTo("#contacts")} className="btn-primary w-full py-4 mt-4 text-sm flex items-center justify-center gap-2">
                  <Icon name="ShoppingCart" size={16} />Оформить заявку
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* DELIVERY */}
      <section id="delivery" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={DELIVERY_IMG} alt="Доставка металла" className="w-full h-full object-cover" style={{ opacity: 0.15 }} />
          <div className="absolute inset-0" style={{ background: "rgba(13,12,11,0.85)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Логистика</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">ДОСТАВКА</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: "MapPin", title: "По городу", desc: "Доставка в день заказа собственным транспортом. Манипулятор, сортиментовоз, бортовой.", badge: "1 день" },
              { icon: "Map", title: "По области", desc: "Доставка в течение 1–2 рабочих дней. Без ограничений по весу.", badge: "1–2 дня" },
              { icon: "Globe", title: "По всей России", desc: "Работаем с ТК СДЭК, Деловые Линии, ПЭК. Расчёт стоимости при оформлении.", badge: "3–14 дней" },
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className="card-steel p-7 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 border border-orange-500/30 flex items-center justify-center">
                      <Icon name={item.icon as "MapPin"} size={20} className="text-orange-500" />
                    </div>
                    <span className="text-xs font-oswald font-semibold bg-orange-500 text-black px-3 py-1 tracking-wider">{item.badge}</span>
                  </div>
                  <h3 className="font-oswald font-semibold text-white text-xl mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(40,10%,55%)" }}>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "Weight", label: "Грузоподъёмность", value: "до 25 тонн" },
                { icon: "Truck", label: "Единиц транспорта", value: "18 машин" },
                { icon: "Clock", label: "Время подачи", value: "от 2 часов" },
                { icon: "DollarSign", label: "Мин. заказ", value: "от 1 тонны" },
              ].map((stat, i) => (
                <div key={i} className="border p-5 text-center" style={{ background: "hsl(20,8%,10%)", borderColor: "hsl(20,8%,18%)" }}>
                  <Icon name={stat.icon as "Truck"} size={22} className="text-orange-500 mx-auto mb-3" />
                  <div className="font-oswald font-semibold text-white text-lg">{stat.value}</div>
                  <div className="text-xs mt-1" style={{ color: "hsl(40,10%,45%)" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* ABOUT */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Кто мы</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">О КОМПАНИИ</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="space-y-6 text-base leading-relaxed" style={{ color: "hsl(40,10%,60%)" }}>
                <p><span className="text-white font-medium">СпецМеталлГрупп</span> — ведущий поставщик металлопроката в регионе с 2008 года. За 16 лет работы мы выстроили надёжную цепочку поставок от крупнейших металлургических заводов России.</p>
                <p>Собственный склад площадью 15 000 м² позволяет поддерживать постоянный запас более 50 000 тонн металлопроката. Это гарантирует наличие нужной позиции в день обращения.</p>
                <p>Работаем с юридическими и физическими лицами. Все документы в полном объёме: сертификаты, счета-фактуры, УПД.</p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: "Заводы-поставщики", value: "ММК, НЛМК, Северсталь" },
                  { label: "Стандарт качества", value: "ISO 9001:2015" },
                  { label: "Регионы поставки", value: "85 субъектов РФ" },
                  { label: "Постоянных клиентов", value: "более 1 200" },
                ].map((item, i) => (
                  <div key={i} className="border-l-2 border-orange-500 pl-4 py-1">
                    <div className="text-xs mb-0.5" style={{ color: "hsl(40,10%,45%)" }}>{item.label}</div>
                    <div className="text-white font-medium text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "50 000+", label: "тонн в год" },
                  { value: "3 500+", label: "клиентов" },
                  { value: "16", label: "лет на рынке" },
                  { value: "24/7", label: "склад доступен" },
                ].map((stat, i) => (
                  <div key={i} className="card-steel p-8 text-center">
                    <div className="stat-number text-4xl md:text-5xl mb-2">{stat.value}</div>
                    <div className="text-sm" style={{ color: "hsl(40,10%,50%)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="section-divider mx-4" />

      {/* FAQ */}
      <section id="faq" className="py-24 px-4" style={{ background: "hsl(20,8%,8%)" }}>
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Частые вопросы</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">FAQ</h2>
            </div>
          </AnimatedSection>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <AnimatedSection key={i}>
                <div className="border overflow-hidden" style={{ borderColor: "hsl(20,8%,18%)" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
                    style={{ background: openFaq === i ? "hsl(20,8%,12%)" : undefined }}>
                    <span className="font-oswald font-semibold text-white text-base pr-4">{item.q}</span>
                    <Icon name={openFaq === i ? "Minus" : "Plus"} size={18} className={`flex-shrink-0 transition-colors ${openFaq === i ? "text-orange-500" : ""}`} style={{ color: openFaq === i ? undefined : "hsl(40,10%,40%)" }} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-sm leading-relaxed border-t pt-4" style={{ color: "hsl(40,10%,55%)", borderColor: "hsl(20,8%,18%)" }}>
                      {item.a}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <div className="text-orange-500 text-xs font-oswald tracking-widest uppercase mb-3">— Связаться с нами</div>
              <h2 className="font-oswald font-bold text-4xl md:text-5xl text-white">КОНТАКТЫ</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <AnimatedSection>
              <div className="card-steel p-8">
                <h3 className="font-oswald font-semibold text-white text-2xl mb-6 uppercase tracking-wide">Оставить заявку</h3>
                <div className="space-y-4">
                  {[
                    { label: "Ваше имя", key: "name", type: "text", placeholder: "Иван Петров" },
                    { label: "Телефон", key: "phone", type: "tel", placeholder: "+7 (999) 000-00-00" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-oswald uppercase tracking-wider block mb-1.5" style={{ color: "hsl(40,10%,55%)" }}>{field.label}</label>
                      <input type={field.type} placeholder={field.placeholder}
                        value={contactForm[field.key as keyof typeof contactForm]}
                        onChange={(e) => setContactForm((p) => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full text-white text-sm px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                        style={{ background: "hsl(20,10%,6%)", border: "1px solid hsl(20,8%,22%)" }} />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-oswald uppercase tracking-wider block mb-1.5" style={{ color: "hsl(40,10%,55%)" }}>Сообщение</label>
                    <textarea rows={4} placeholder="Опишите что нужно — вид металла, количество, сроки..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                      className="w-full text-white text-sm px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      style={{ background: "hsl(20,10%,6%)", border: "1px solid hsl(20,8%,22%)" }} />
                  </div>
                  {formStatus === "success" ? (
                    <div className="w-full py-4 text-sm flex items-center justify-center gap-2 font-oswald font-semibold tracking-wider" style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" }}>
                      <Icon name="CheckCircle" size={16} />Заявка отправлена!
                    </div>
                  ) : formStatus === "error" ? (
                    <div className="space-y-3">
                      <div className="w-full py-3 text-sm flex items-center justify-center gap-2 font-oswald" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                        <Icon name="AlertCircle" size={15} />Ошибка. Позвоните нам напрямую.
                      </div>
                      <button onClick={handleSubmit} className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2">
                        <Icon name="RotateCcw" size={16} />Попробовать снова
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleSubmit} disabled={formStatus === "sending"} className="btn-primary w-full py-4 text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                      {formStatus === "sending" ? <><Icon name="Loader" size={16} className="animate-spin" />Отправляем...</> : <><Icon name="Send" size={16} />Отправить заявку</>}
                    </button>
                  )}
                  <p className="text-xs text-center" style={{ color: "hsl(40,10%,40%)" }}>Перезвоним в течение 30 минут в рабочее время</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-3">
                {[
                  { icon: "Phone", label: "Телефон (бесплатно)", value: "8 (800) 123-45-67", href: "tel:+78001234567" },
                  { icon: "Phone", label: "Прямой номер", value: "+7 (912) 345-67-89", href: "tel:+79123456789" },
                  { icon: "Mail", label: "Email", value: "info@stalprom.ru", href: "mailto:info@stalprom.ru" },
                  { icon: "MapPin", label: "Адрес склада", value: "г. Екатеринбург, ул. Промышленная, 45", href: "#" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 8:00–18:00, Сб: 9:00–15:00", href: "#" },
                ].map((item, i) => (
                  <a key={i} href={item.href} className="card-steel flex items-center gap-4 p-5 transition-all duration-300 block">
                    <div className="w-10 h-10 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon as "Phone"} size={16} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="text-xs font-oswald uppercase tracking-wider" style={{ color: "hsl(40,10%,45%)" }}>{item.label}</div>
                      <div className="text-white font-medium text-sm mt-0.5">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-4 card-steel p-6">
                <h4 className="font-oswald font-semibold text-white text-lg mb-3 uppercase tracking-wider">Мессенджеры</h4>
                <div className="flex gap-3">
                  {[
                    { icon: "MessageCircle", label: "WhatsApp" },
                    { icon: "Send", label: "Telegram" },
                    { icon: "Phone", label: "Viber" },
                    { icon: "MessageSquare", label: "Макс", href: "https://max.ru/+79939150748" },
                  ].map((m, i) => (
                    <a key={i} href={m.href || "#"} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 border text-sm hover:text-orange-500 hover:border-orange-500/40 transition-all"
                      style={{ borderColor: "hsl(20,8%,25%)", color: "hsl(40,10%,55%)" }}>
                      <Icon name={m.icon as "Send"} size={15} />{m.label}
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8 px-4" style={{ borderColor: "hsl(20,8%,15%)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-orange-500 flex items-center justify-center">
              <span className="text-black font-oswald font-bold text-xs">СМ</span>
            </div>
            <div>
              <div className="font-oswald font-semibold text-white text-sm tracking-wide">СПЕЦМЕТАЛЛГРУПП</div>
              <div className="text-xs" style={{ color: "hsl(40,10%,40%)" }}>Металлопрокат</div>
            </div>
          </div>
          <div className="text-xs text-center" style={{ color: "hsl(40,10%,40%)" }}>
            © 2008–2026 ООО «СпецМеталлГрупп». Все права защищены.<br />ИНН 6600000000 · ОГРН 1086600000000
          </div>
          <div className="flex gap-4">
            {["Политика конфиденциальности", "Реквизиты"].map((link, i) => (
              <a key={i} href="#" className="text-xs hover:text-orange-500 transition-colors" style={{ color: "hsl(40,10%,40%)" }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
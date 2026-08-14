export const services = [
  { title: "Website Design", desc: "Editorial, conversion-focused interfaces designed for premium brands.", icon: "Palette" },
  { title: "Website Development", desc: "Hand-crafted, lightning-fast websites built to scale revenue.", icon: "Code2" },
  { title: "Shopify Development", desc: "Bespoke Shopify themes & apps engineered for 8-figure brands.", icon: "ShoppingBag" },
  { title: "WooCommerce Development", desc: "Robust, customizable WooCommerce builds for serious sellers.", icon: "Store" },
  { title: "Wix Development", desc: "Refined Wix experiences with conversion-led UX.", icon: "LayoutTemplate" },
  { title: "GoDaddy Solutions", desc: "End-to-end GoDaddy site setup, design and optimization.", icon: "Globe" },
  { title: "SEO", desc: "Technical, on-page and link strategy that compounds traffic.", icon: "Search" },
  { title: "GEO (Generative Engine Optimization)", desc: "Get cited in ChatGPT, Perplexity & Google AI Overviews.", icon: "Brain" },
  { title: "Performance Optimization", desc: "Core Web Vitals, sub-second loads, perfect Lighthouse scores.", icon: "Gauge" },
  { title: "AI Business Automation", desc: "Custom GPT agents, workflows & integrations that save 40+ hrs/wk.", icon: "Bot" },
  { title: "UGC Content Creation", desc: "Scroll-stopping creator content that converts cold traffic.", icon: "Video" },
  { title: "AI Commercial Video", desc: "Cinema-grade AI commercials at a fraction of the cost.", icon: "Film" },
  { title: "Social Media Marketing", desc: "Organic strategies that build cult-like brand communities.", icon: "Share2" },
  { title: "Social Media Advertising", desc: "Full-funnel paid social across every major platform.", icon: "Megaphone" },
  { title: "Facebook Ads", desc: "Profitable Meta campaigns with creative testing engines.", icon: "Facebook" },
  { title: "Instagram Ads", desc: "Aesthetic-led IG ads that scale ROAS predictably.", icon: "Instagram" },
  { title: "TikTok Ads", desc: "Native, viral-style TikTok creative that prints sales.", icon: "Music2" },
  { title: "Pinterest Marketing", desc: "Long-tail Pinterest growth for visual eCom brands.", icon: "Pin" },
  { title: "Email Marketing", desc: "Flows & campaigns generating 30–45% of total revenue.", icon: "Mail" },
  { title: "Klaviyo Marketing", desc: "Advanced Klaviyo segmentation, flows & deliverability.", icon: "MailCheck" },
  { title: "Mailchimp Marketing", desc: "Mailchimp automation & list growth done right.", icon: "Send" },
] as const;

export const projects = [
  { shot: "/screenshots/funnyfuzzy.jpg", name: "FunnyFuzzy", url: "https://funnyfuzzy.com/", industry: "Pet Lifestyle", services: ["Shopify", "CRO", "Email"] },
  { shot: "/screenshots/boody.jpg", name: "Boody", url: "https://boody.com/", industry: "Sustainable Apparel", services: ["Shopify Plus", "Performance"] },
  { shot: "/screenshots/maisonette.jpg", name: "Maisonette", url: "https://www.maisonette.com/", industry: "Kids' Luxury", services: ["UX", "SEO"] },
  { shot: "/screenshots/clothesmentor.jpg", name: "Clothes Mentor", url: "https://clothesmentor.com/", industry: "Resale Fashion", services: ["Web Dev", "SEO"] },
  { shot: "/screenshots/jamiekay.jpg", name: "Jamie Kay", url: "https://jamiekay.com.au/", industry: "Baby & Kids", services: ["Shopify", "Klaviyo"] },
  { shot: "/screenshots/babynoomie.jpg", name: "Baby Noomie", url: "https://babynoomie.com/", industry: "Baby Apparel", services: ["Shopify", "Ads"] },
  { name: "Ryderwear", url: "https://www.ryderwear.com/", industry: "Performance Apparel", services: ["Shopify Plus", "CRO"] },
  { shot: "/screenshots/dallianse.jpg", name: "Dallianse", url: "https://dallianse.com/en-gb", industry: "Luxury Fashion", services: ["Shopify", "Design"] },
  { shot: "/screenshots/slickgorilla.jpg", name: "Slick Gorilla", url: "https://slickgorilla.co.uk/", industry: "Men's Grooming", services: ["Shopify", "Meta Ads"] },
  { shot: "/screenshots/eloriabeauty.jpg", name: "Eloria Beauty", url: "https://eloriabeauty.ca/", industry: "Beauty", services: ["Shopify", "Klaviyo"] },
  { shot: "/screenshots/peksshop.jpg", name: "PEKS Shop", url: "https://peksshop.de/", industry: "Lifestyle", services: ["Shopify", "SEO"] },
];

export const platforms = [
  "Shopify", "WooCommerce", "Wix", "GoDaddy", "Google", "Facebook",
  "Instagram", "TikTok", "Pinterest", "Klaviyo", "Hostinger", "Mailchimp",
];

// Only substantiated figures — no revenue or ROAS claims.
export const stats = [
  { value: `${projects.length}+`, label: "Growth Projects" },
  { value: "20+", label: "Services Delivered" },
  { value: "Performance-Focused", label: "Growth Approach" },
  { value: "12", label: "Platforms Mastered" },
];

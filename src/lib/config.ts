export type SiteConfig = {
  companyName: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
};

export const defaultSiteConfig: SiteConfig = {
  companyName: "FreshWash",
  heroTitle: "Laundry done beautifully.",
  heroSubtitle: "Experience the next level of garment care. Fast, reliable, and perfectly tailored to your lifestyle. We handle the chores so you can handle life.",
  contactEmail: "support@freshwash.demo",
  contactPhone: "+1 (555) 123-4567"
};

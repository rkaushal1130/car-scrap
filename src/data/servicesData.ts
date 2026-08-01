export interface DocService {
  id: string;
  title: string;
  description: string;
  certType?: 'cod' | 'cvs';
  icon: string;
}

export interface FeaturedService {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const docServices: DocService[] = [
  {
    id: "cod",
    title: "Certificate of Deposit (COD)",
    description: "Instant digital and physical proof of vehicle handover for full legal security.",
    certType: "cod",
    icon: "FileCheck"
  },
  {
    id: "cvs",
    title: "Certificate of Vehicle Scrap (CVS)",
    description: "The final official document proving your vehicle has been scrapped following all laws.",
    certType: "cvs",
    icon: "ClipboardCheck"
  },
  {
    id: "rc",
    title: "RC Cancellation",
    description: "Complete assistance and filing for cancellation of your RC with relevant authorities.",
    icon: "Ban"
  },
  {
    id: "pickup",
    title: "Free Home Pickups",
    description: "Zero-cost doorstep collection service across Gwalior and surrounding regions.",
    icon: "Truck"
  },
  {
    id: "pan-india",
    title: "Pan India Services",
    description: "Extending our professional scrappage network to facilitate disposals nationwide. We handle long-distance logistics and cross-state paperwork seamlessly.",
    icon: "Globe"
  }
];

export const featuredServices: FeaturedService[] = [
  {
    id: "scraping",
    title: "Vehicle Scraping",
    description: "End-to-life vehicles scrapping with proper documentation and eco-friendly process.",
    image: "/images/vehicle_scraping.jpg"
  },
  {
    id: "metal-recovery",
    title: "Metal Recovery Solution",
    description: "Recovering and refining valuable metal from all types of scrap.",
    image: "/images/metal_recovery.jpg"
  },
  {
    id: "industrial-scrap",
    title: "Industrial Scrap Management",
    description: "Efficient collection, sorting, and recycling of industrial scrap for sustainable solutions.",
    image: "/images/industrial_scrap.jpg"
  }
];

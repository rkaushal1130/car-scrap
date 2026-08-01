export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  vehicle: string;
  initials: string;
  rating: number;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quote: "Extremely professional service. They gave a very fair valuation for my car and the pickup was arranged within a few hours. Highly recommended!",
    name: "Rahul Sharma",
    vehicle: "Sold: Maruti Swift (2021)",
    initials: "RS",
    rating: 5
  },
  {
    id: 2,
    quote: "Bohot badhiya experience raha. Gadi ghar se pick ho gayi aur payment bhi instant transfer kar di. No jhik-jhik at all!",
    name: "Mohd. Faisal",
    vehicle: "Sold: Hyundai Creta (2022)",
    initials: "MF",
    rating: 5
  },
  {
    id: 3,
    quote: "Excellent service in Gwalior. They are licensed and provided the official disposal proof immediately. Trustworthy and fast.",
    name: "Amit Verma",
    vehicle: "Sold: Tata Nexon (2023)",
    initials: "AV",
    rating: 5
  }
];

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: "Request a Quote",
    description: "Call us or fill out our form with your vehicle details. As a trusted dealer, we'll provide an instant estimate based on your vehicle's condition."
  },
  {
    id: 2,
    title: "Free Vehicle Pickup",
    description: "We'll schedule a convenient time to collect your vehicle from your location at no extra cost. Our team handles all the logistics."
  },
  {
    id: 3,
    title: "Documentation & Scrapping",
    description: "We handle all paperwork and legal formalities. Your vehicle is scrapped following environmentally friendly processes at our facility."
  },
  {
    id: 4,
    title: "Payment & Certificates",
    description: "Receive immediate payment for your vehicle along with an official disposal proof issued by our licensed facility."
  }
];

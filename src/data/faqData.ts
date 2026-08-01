export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Q1 What type of vehicle do you accept for scrapping ?",
    answer: "We accept all types of end-of-life vehicles including passenger cars, SUVs, two-wheelers (scooters/motorcycles), commercial trucks, buses, vans, auto-rickshaws, and industrial heavy scrap machinery."
  },
  {
    id: 2,
    question: "Q2 How is the scrap value determined ?",
    answer: "Scrap value is calculated scientifically based on your vehicle's kerb weight, reusable component condition, metal market rates (steel, aluminum, copper), engine displacement, and catalytic converter value."
  },
  {
    id: 3,
    question: "Q3 Do you provide vehicle scrapping certificates ?",
    answer: "Yes! As a Government Registered Vehicle Scrapping Facility (RVSF), we issue the official Certificate of Deposit (COD) upon vehicle pickup and the final Certificate of Vehicle Scrappage (CVS) required for RTO RC cancellation."
  },
  {
    id: 4,
    question: "Q4 Is your recycling process environmentally safe ?",
    answer: "100% yes. We strictly follow Central Pollution Control Board (CPCB) guidelines. All hazardous waste like battery acid, engine oils, coolants, and refrigerants are safely extracted and treated before metal shredding."
  }
];

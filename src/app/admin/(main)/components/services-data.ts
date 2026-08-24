export type ServiceCategory = "Nails" | "Skin" | "Brows & Lashes";

export type AdminService = {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number;
  price: number;
  staffCount: number;
  active: boolean;
  description: string;
};

export const adminServices: AdminService[] = [
  { id: "gel", name: "Gel Manicure", category: "Nails", duration: 45, price: 45, staffCount: 2, active: true, description: "Long-lasting gel polish with cuticle care and shaping." },
  { id: "classic-mani", name: "Classic Manicure", category: "Nails", duration: 30, price: 28, staffCount: 2, active: true, description: "Nail shaping, cuticle care and polish." },
  { id: "spa-pedi", name: "Spa Pedicure", category: "Nails", duration: 45, price: 52, staffCount: 2, active: true, description: "Soak, exfoliation, callus care and polish." },
  { id: "acrylic", name: "Acrylic Full Set", category: "Nails", duration: 90, price: 68, staffCount: 2, active: true, description: "Full acrylic extensions, shaped and polished." },
  { id: "nail-art", name: "Nail Art Add-on", category: "Nails", duration: 15, price: 12, staffCount: 2, active: true, description: "Hand-painted details or accent nails." },
  { id: "facial", name: "Classic Facial", category: "Skin", duration: 60, price: 75, staffCount: 1, active: true, description: "Cleanse, exfoliate and hydrate for a fresh glow." },
  { id: "lash-lift", name: "Lash Lift & Tint", category: "Brows & Lashes", duration: 45, price: 58, staffCount: 1, active: true, description: "Lifts and tints natural lashes for weeks of definition." },
  { id: "brow-shape", name: "Brow Shaping", category: "Brows & Lashes", duration: 20, price: 22, staffCount: 1, active: true, description: "Waxing and shaping tailored to face structure." },
  { id: "lash-ext", name: "Classic Lash Extensions", category: "Brows & Lashes", duration: 90, price: 110, staffCount: 1, active: false, description: "Individual lash extensions for a natural full look." },
];

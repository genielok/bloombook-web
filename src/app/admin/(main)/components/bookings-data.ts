export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "No-show";

export type AdminBooking = {
  id: string;
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes: string;
  serviceName: string;
  services?: Array<{
    name: string;
    duration: number;
    price: number;
  }>;
  duration: number;
  staffName: string;
  price: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
};

export const adminBookings: AdminBooking[] = [
  { id: "bk37", date: "2026-07-13", dateLabel: "Mon 13 Jul", startTime: "09:30", endTime: "10:00", customerName: "Nils Haas", customerEmail: "nilshaas37@email.com", customerPhone: "+49 172 1139567", customerNotes: "—", serviceName: "Classic Manicure", duration: 30, staffName: "Lena Hoffmann", price: 28, status: "Confirmed", createdAt: "Fri 10 Jul", updatedAt: "Sun 12 Jul" },
  { id: "bk38", date: "2026-07-13", dateLabel: "Mon 13 Jul", startTime: "12:00", endTime: "12:45", customerName: "Adam Kowalski", customerEmail: "adamkowalski38@email.com", customerPhone: "+49 173 1143338", customerNotes: "—", serviceName: "Lash Lift & Tint", duration: 45, staffName: "Sophia Lindqvist", price: 58, status: "Confirmed", createdAt: "Fri 10 Jul", updatedAt: "Sun 12 Jul" },
  { id: "bk39", date: "2026-07-13", dateLabel: "Mon 13 Jul", startTime: "15:30", endTime: "17:00", customerName: "Erik García", customerEmail: "erikgarcia39@email.com", customerPhone: "+49 174 1147109", customerNotes: "—", serviceName: "Acrylic Full Set", duration: 90, staffName: "Emma Richter", price: 68, status: "Confirmed", createdAt: "Fri 10 Jul", updatedAt: "Sun 12 Jul" },
  { id: "bk40", date: "2026-07-14", dateLabel: "Tue 14 Jul", startTime: "10:00", endTime: "10:45", customerName: "Anna Fischer", customerEmail: "annafischer40@email.com", customerPhone: "+49 175 1150880", customerNotes: "First time visiting, please explain aftercare.", serviceName: "Gel Manicure", duration: 45, staffName: "Mara Voss", price: 45, status: "Confirmed", createdAt: "Sat 11 Jul", updatedAt: "Mon 13 Jul" },
  { id: "bk41", date: "2026-07-14", dateLabel: "Tue 14 Jul", startTime: "13:30", endTime: "14:15", customerName: "Julia Weber", customerEmail: "juliaweber41@email.com", customerPhone: "+49 176 1154651", customerNotes: "—", serviceName: "Spa Pedicure", duration: 45, staffName: "Lena Hoffmann", price: 52, status: "Confirmed", createdAt: "Sat 11 Jul", updatedAt: "Mon 13 Jul" },
  { id: "bk42", date: "2026-07-14", dateLabel: "Tue 14 Jul", startTime: "16:00", endTime: "17:00", customerName: "Nora Ström", customerEmail: "norastrom42@email.com", customerPhone: "+49 177 1158422", customerNotes: "—", serviceName: "Classic Facial", duration: 60, staffName: "Sophia Lindqvist", price: 75, status: "Pending", createdAt: "Sat 11 Jul", updatedAt: "Mon 13 Jul" },
  { id: "bk43", date: "2026-07-15", dateLabel: "Wed 15 Jul", startTime: "09:30", endTime: "09:50", customerName: "Ida Krause", customerEmail: "idakrause43@email.com", customerPhone: "+49 178 1162193", customerNotes: "—", serviceName: "Brow Shaping", duration: 20, staffName: "Sophia Lindqvist", price: 22, status: "Confirmed", createdAt: "Sun 12 Jul", updatedAt: "Tue 14 Jul" },
  { id: "bk44", date: "2026-07-15", dateLabel: "Wed 15 Jul", startTime: "12:00", endTime: "12:45", customerName: "Freya Lund", customerEmail: "freyalund44@email.com", customerPhone: "+49 172 1165964", customerNotes: "—", serviceName: "Gel Manicure", duration: 45, staffName: "Mara Voss", price: 45, status: "Confirmed", createdAt: "Sun 12 Jul", updatedAt: "Tue 14 Jul" },
  { id: "bk45", date: "2026-07-15", dateLabel: "Wed 15 Jul", startTime: "15:30", endTime: "16:15", customerName: "Klara Vogel", customerEmail: "klaravogel45@email.com", customerPhone: "+49 173 1169735", customerNotes: "First time visiting, please explain aftercare.", serviceName: "Spa Pedicure", duration: 45, staffName: "Unassigned", price: 52, status: "Pending", createdAt: "Sun 12 Jul", updatedAt: "Tue 14 Jul" },
  { id: "bk46", date: "2026-07-16", dateLabel: "Thu 16 Jul", startTime: "10:00", endTime: "11:30", customerName: "Mette Dubois", customerEmail: "mettedubois46@email.com", customerPhone: "+49 174 1173506", customerNotes: "—", serviceName: "Acrylic Full Set", duration: 90, staffName: "Emma Richter", price: 68, status: "Confirmed", createdAt: "Mon 13 Jul", updatedAt: "Wed 15 Jul" },
  { id: "bk47", date: "2026-07-16", dateLabel: "Thu 16 Jul", startTime: "13:30", endTime: "14:15", customerName: "Ingrid Smith", customerEmail: "ingridsmith47@email.com", customerPhone: "+49 175 1177277", customerNotes: "—", serviceName: "Lash Lift & Tint", duration: 45, staffName: "Sophia Lindqvist", price: 58, status: "Confirmed", createdAt: "Mon 13 Jul", updatedAt: "Wed 15 Jul" },
  { id: "bk48", date: "2026-07-16", dateLabel: "Thu 16 Jul", startTime: "16:00", endTime: "16:30", customerName: "Elin Larsen", customerEmail: "elinlarsen48@email.com", customerPhone: "+49 176 1181048", customerNotes: "—", serviceName: "Classic Manicure", duration: 30, staffName: "Lena Hoffmann", price: 28, status: "Pending", createdAt: "Mon 13 Jul", updatedAt: "Wed 15 Jul" },
];

export const bookingStatusClass: Record<BookingStatus, string> = {
  Pending: "bg-[#fdf3e7] text-[#a06b3d]",
  Confirmed: "bg-[#e7eef5] text-[#3d6b94]",
  Completed: "bg-[#e6f0e8] text-[#3f7350]",
  Cancelled: "bg-[#fbe9e7] text-[#b0453a]",
  "No-show": "bg-[#f3e7e9] text-[#8a4a5c]",
};

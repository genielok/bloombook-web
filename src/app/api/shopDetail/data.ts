import type { IShopDetail, ISlot } from "./types";

const mockShopDetail: IShopDetail = {
  id: "1",
  name: "Petal Studio",
  type: "Nail & beauty studio",
  location: "Mitte, Berlin",
  rating: 4.9,
  reviewCount: 212,
  logoText: "P",
  coverLabel: "studio cover photo",
  services: [
    {
      category: "Manicure",
      items: [
        {
          id: "classic-manicure",
          name: "Classic Manicure",
          duration: 30,
          price: 28,
          note: null,
        },
        {
          id: "gel-manicure",
          name: "Gel Manicure",
          duration: 45,
          price: 45,
          note: "most booked",
        },
      ],
    },
    {
      category: "Pedicure",
      items: [
        {
          id: "spa-pedicure",
          name: "Spa Pedicure",
          duration: 50,
          price: 52,
          note: null,
        },
      ],
    },
    {
      category: "Haircut",
      items: [
        {
          id: "spa-pedicure1",
          name: "Spa Pedicure",
          duration: 50,
          price: 52,
          note: null,
        },
        {
          id: "spa-pedicure2",
          name: "Spa Pedicure",
          duration: 50,
          price: 52,
          note: null,
        },
        {
          id: "spa-pedicure3",
          name: "Spa Pedicure",
          duration: 50,
          price: 52,
          note: null,
        },
      ],
    },
    { category: "Massage", items: [] },
    { category: "Facial", items: [] },
    { category: "Waxing", items: [] },
    { category: "Makeup", items: [] },
  ],
  techniCians: [
    { id: "lena", name: "Lena", label: "", avatar: "pattern" },
    { id: "mara", name: "Mara", label: "", avatar: "pattern" },
  ],
  defaultBooking: {
    serviceId: "gel-manicure",
    serviceName: "Gel Manicure",
    duration: 45,
    date: "2026-06-20",
    displayDate: "Fri 20 Jun",
    time: "14:30",
    technician: "Lena",
    studio: "Petal Studio, Mitte",
    total: 45,
  },
};

export function getShopDetail(id: string): IShopDetail {
  return { ...mockShopDetail, id };
}

export const mockTimeSlotData: ISlot[] = [
  {
    date: "2026-01-10",
    available: true,
    timeSlot: [
      { time: "08:00", available: true },
      { time: "09:00", available: true },
      { time: "10:00", available: false },
      { time: "11:00", available: true },
      { time: "13:00", available: true },
      { time: "14:00", available: false },
      { time: "15:00", available: true },
      { time: "16:00", available: true },
    ],
  },
  {
    date: "2026-01-11",
    available: true,
    timeSlot: [
      { time: "08:00", available: false },
      { time: "09:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: false },
      { time: "13:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: false },
      { time: "16:00", available: true },
    ],
  },
  {
    date: "2026-01-12",
    available: false,
    timeSlot: [
      { time: "08:00", available: true },
      { time: "09:00", available: false },
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "13:00", available: false },
      { time: "14:00", available: true },
      { time: "15:00", available: true },
      { time: "16:00", available: false },
    ],
  },
  {
    date: "2026-01-13",
    available: true,
    timeSlot: [
      { time: "08:00", available: true },
      { time: "09:00", available: true },
      { time: "10:00", available: true },
      { time: "11:00", available: false },
      { time: "13:00", available: true },
      { time: "14:00", available: false },
      { time: "15:00", available: true },
      { time: "16:00", available: true },
    ],
  },
  {
    date: "2026-01-14",
    available: true,
    timeSlot: [
      { time: "08:00", available: false },
      { time: "09:00", available: false },
      { time: "10:00", available: true },
      { time: "11:00", available: true },
      { time: "13:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: false },
      { time: "16:00", available: true },
    ],
  },
];

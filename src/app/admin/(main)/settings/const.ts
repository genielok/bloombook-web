import { ServiceCategory } from "../components/services-data";

export const CategoryArray: Array<ServiceCategory> = [
  "Brows & Lashes",
  "Nails",
  "Skin",
];

export type BusinessHour = {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  capacity: number;
  slotIntervalMinutes: number;
};

export const initialBusinessHours: BusinessHour[] = [
  {
    dayOfWeek: 1,
    day: "Monday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
    capacity: 1,
    slotIntervalMinutes: 30,
  },
  {
    dayOfWeek: 2,
    day: "Tuesday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
    capacity: 1,
    slotIntervalMinutes: 30,
  },
  {
    dayOfWeek: 3,
    day: "Wednesday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
    capacity: 1,
    slotIntervalMinutes: 30,
  },
  {
    dayOfWeek: 4,
    day: "Thursday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
    capacity: 1,
    slotIntervalMinutes: 30,
  },
  {
    dayOfWeek: 5,
    day: "Friday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
    capacity: 1,
    slotIntervalMinutes: 30,
  },
  {
    dayOfWeek: 6,
    day: "Saturday",
    isOpen: true,
    startTime: "10:00",
    endTime: "17:00",
    capacity: 1,
    slotIntervalMinutes: 30,
  },
  {
    dayOfWeek: 7,
    day: "Sunday",
    isOpen: false,
    startTime: "",
    endTime: "",
    capacity: 1,
    slotIntervalMinutes: 30,
  },
];

import {
  type BusinessHour,
  type StudioBasic,
} from "@/app/api/clients/types";
import { SERVICE_CATEGORIES } from "../components/services-data";

export const CategoryArray = SERVICE_CATEGORIES;

export type { BusinessHour };

export const initialBusinessHours: BusinessHour[] = [
  {
    dayOfWeek: 0,
    day: "Monday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
  },
  {
    dayOfWeek: 1,
    day: "Tuesday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
  },
  {
    dayOfWeek: 2,
    day: "Wednesday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
  },
  {
    dayOfWeek: 3,
    day: "Thursday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
  },
  {
    dayOfWeek: 4,
    day: "Friday",
    isOpen: true,
    startTime: "09:00",
    endTime: "19:00",
  },
  {
    dayOfWeek: 5,
    day: "Saturday",
    isOpen: true,
    startTime: "10:00",
    endTime: "17:00",
  },
  {
    dayOfWeek: 6,
    day: "Sunday",
    isOpen: false,
    startTime: "10:00",
    endTime: "17:00",
  },
];

export const inistialStudioValues: StudioBasic = {
  name: "",
  category: "hair",
  city: "",
  address: "",
  phone: "",
  email: "",
  description: "",
  capacity: 1,
  slotIntervalMinutes: 30,
  imgUrl: "",
  businessHours: initialBusinessHours,
};

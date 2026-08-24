import { adminServices } from "./services-data";

export type StaffHours = {
  day: string;
  isWorking: boolean;
  start: string;
  end: string;
};

export type StaffTimeOff = {
  id: string;
  date: string;
  start?: string;
  end?: string;
  reason: string;
};

export type AdminStaff = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
  active: boolean;
  avatarBg: string;
  serviceIds: string[];
  hours: StaffHours[];
  timeOff: StaffTimeOff[];
};

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function hours(
  workingDays: number[],
  start: string,
  end: string,
  saturdayEnd = end,
): StaffHours[] {
  return days.map((day, index) => ({
    day,
    isWorking: workingDays.includes(index),
    start: workingDays.includes(index) ? start : "",
    end:
      workingDays.includes(index) && index === 5 ? saturdayEnd :
      workingDays.includes(index) ? end : "",
  }));
}

export const adminStaff: AdminStaff[] = [
  {
    id: "st1",
    name: "Mara Voss",
    role: "Owner · Senior Nail Technician",
    email: "mara@petalstudio.com",
    phone: "+49 151 2200 1190",
    bio: "Studio founder with 12 years in nail artistry.",
    active: true,
    avatarBg: "#F4EBE2",
    serviceIds: ["gel", "classic-mani", "acrylic", "nail-art"],
    hours: hours([0, 1, 2, 3, 4], "09:00", "17:00"),
    timeOff: [],
  },
  {
    id: "st2",
    name: "Lena Hoffmann",
    role: "Nail Technician",
    email: "lena@petalstudio.com",
    phone: "+49 151 2200 4471",
    bio: "Specialist in gel and structured manicures.",
    active: true,
    avatarBg: "#E6F0E8",
    serviceIds: ["gel", "classic-mani", "spa-pedi"],
    hours: hours([1, 2, 3, 4, 5], "10:00", "18:00"),
    timeOff: [],
  },
  {
    id: "st3",
    name: "Emma Richter",
    role: "Nail Technician",
    email: "emma@petalstudio.com",
    phone: "+49 151 2200 8823",
    bio: "Loves intricate nail art and acrylic extensions.",
    active: true,
    avatarBg: "#EFE0D0",
    serviceIds: ["acrylic", "nail-art", "spa-pedi"],
    hours: hours([0, 2, 3, 4, 5], "09:00", "17:00", "15:00"),
    timeOff: [
      { id: "to1", date: "2026-07-25", reason: "Personal day" },
    ],
  },
  {
    id: "st4",
    name: "Sophia Lindqvist",
    role: "Esthetician",
    email: "sophia@petalstudio.com",
    phone: "+49 151 2200 3390",
    bio: "Certified esthetician focused on skin and lash treatments.",
    active: true,
    avatarBg: "#E0E7F0",
    serviceIds: ["facial", "lash-lift", "brow-shape", "lash-ext"],
    hours: hours([1, 2, 3, 4, 5], "10:00", "18:00", "16:00"),
    timeOff: [
      {
        id: "to2",
        date: "2026-07-26",
        start: "13:00",
        end: "17:00",
        reason: "Doctor appointment",
      },
    ],
  },
];

export function getStaffInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getStaffServiceNames(staff: AdminStaff) {
  return staff.serviceIds
    .map((id) => adminServices.find((service) => service.id === id)?.name)
    .filter(Boolean)
    .join(", ");
}

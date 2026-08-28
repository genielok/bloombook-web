export enum ServiceCategory {
  Hair = "hair",
  Nails = "nails",
  Massage = "massage",
  Spa = "spa",
  Barber = "barber",
  Makeup = "makeup",
  Tanning = "tanning",
  Waxing = "waxing",
}

export const SERVICE_CATEGORIES: ServiceCategory[] =
  Object.values(ServiceCategory);

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  [ServiceCategory.Hair]: "Hair",
  [ServiceCategory.Nails]: "Nails",
  [ServiceCategory.Massage]: "Massage",
  [ServiceCategory.Spa]: "Spa",
  [ServiceCategory.Barber]: "Barber",
  [ServiceCategory.Makeup]: "Makeup",
  [ServiceCategory.Tanning]: "Tanning",
  [ServiceCategory.Waxing]: "Waxing",
};

export type AdminService = {
  id: string;
  name: string;
  serviceCategory: ServiceCategory;
  durationMinutes: number;
  price: number;
  staffCount: number;
  active: boolean;
  description: string;
};

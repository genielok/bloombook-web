export interface IShopDetail {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  reviewCount: number;
  logoText: string;
  coverLabel: string;
  services: IServiceCategory[];
  techniCians?: ITechniCians[];
  defaultBooking: IDefaultBooking;
}

interface IServiceCategory {
  category: string;
  items: IServiceItem[];
}

export interface IServiceItem {
  id: string;
  name: string;
  duration: number;
  price: number;
  note: string | null;
}

interface ITechniCians {
  id: string;
  name: string;
  label: string;
  avatar: string;
}

interface IDefaultBooking {
  serviceId: string;
  serviceName: string;
  duration: number;
  date: string;
  displayDate: string;
  time: string;
  technician: string;
  studio: string;
  total: number;
}

export interface ITimeSlot {
  time: string;
  available: boolean;
}
export interface ISlot {
  date: string;
  available: boolean;
  timeSlot: ITimeSlot[];
}

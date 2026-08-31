export type AdminStaff = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  bio: string;
};

export type StaffFormValues = Omit<AdminStaff, "id">;

export function getStaffInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

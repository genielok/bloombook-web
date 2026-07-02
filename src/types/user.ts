export type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "admin";
  avatarUrl: string;
};

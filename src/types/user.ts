export type UserRole = "buyer" | "investor" | "agent" | "property_manager" | "admin";
export type UserStatus = "active" | "pending" | "disabled";

export type UserProfile = {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  status: UserStatus;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

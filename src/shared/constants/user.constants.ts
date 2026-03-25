export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type UserRolesEnumType = (typeof UserRolesEnum)[keyof typeof UserRolesEnum];
export const AvailableRolesEnum = Object.values(UserRolesEnum) as UserRolesEnumType[];
export type AvailableRolesEnumType = typeof AvailableRolesEnum;

export const UserLoginEnum = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
} as const;

export type UserLoginEnumType = (typeof UserLoginEnum)[keyof typeof UserLoginEnum];
export const AvailableLoginsEnum = Object.values(UserLoginEnum) as UserLoginEnumType[];
export type AvailableLoginsEnumType = typeof AvailableLoginsEnum;

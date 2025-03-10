export enum UserRole {
  PARENT = 'parent',
  COACH = 'coach',
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  avatar: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IRegisterInput {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

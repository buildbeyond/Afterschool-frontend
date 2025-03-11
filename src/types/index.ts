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

export interface ParentScheduleEntry {
  id: string;
  name: string;
  avatar?: string;
  beAbsent?: boolean;
  wasAbsent?: boolean;
  plannedStart: string;
  plannedEnd: string;
  plannedPickup: boolean;
  plannedReturn: boolean;
  plannedPickupLocation: string;
  plannedReturnLocation: string;
  actualStart: string;
  actualEnd: string;
  lunch: boolean;
  dinner: boolean;
  hadSnack?: boolean;
  hadLunch?: boolean;
  hadDinner?: boolean;
  notes?: string;
  remarks?: string;
}

export interface ParentScheduleData {
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  scheduleInfo: ParentScheduleEntry;
}

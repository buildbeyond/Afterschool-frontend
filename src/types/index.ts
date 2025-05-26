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
  recipientNumbers: string;
  companyName: string;
  businessNumbers: string;
  guardianName: string;
  serviceSlot: {
    attendance: { start: string; end: string }[];
    holiday: { start: string; end: string }[];
  };
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
  selectedOptions: any[];
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
  actualAmount: string;
  lunch: boolean;
  dinner: boolean;
  hadSnack?: boolean;
  hadLunch?: boolean;
  hadDinner?: boolean;
  notes?: string;
  remarks?: string;
  supportType?: string;
  familySupport?: string;
  medicalSupport?: boolean;
  extendedSupport?: string;
  concentratedSupport?: boolean;
  specializedSupport?: boolean;
  communitySupport?: boolean;
  bathSupport?: boolean;
  childCareSupport?: boolean;
  selfSupport?: boolean;
  guardianConfirmation?: boolean;
}

export interface ParentScheduleData {
  isDropdownOpen: any;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  scheduleInfo: ParentScheduleEntry;
}

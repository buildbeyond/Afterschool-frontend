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
  date?: string;
  day?: string;
  isHoliday?: boolean;
  wasPresent?: boolean;
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
  additionalUse: boolean;
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

export const premiumOptions: {
  label: string;
  type?: 'checkbox' | 'dropdown';
  options?: { value: string; label: string }[];
  value: keyof ParentScheduleEntry;
}[] = [
  {
    label: '提供形態',
    value: 'supportType',
    type: 'dropdown',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
    ],
  },
  {
    label: '家族支援加算',
    value: 'familySupport',
    type: 'dropdown',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4' },
    ],
  },
  {
    label: '医療連携体制加算',
    value: 'medicalSupport',
  },
  {
    label: '延長支援加算',
    value: 'extendedSupport',
    type: 'dropdown',
    options: [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
  },
  {
    label: '集中的支援加算',
    value: 'concentratedSupport',
  },
  {
    label: '専門的支援加算（支援実施時）',
    value: 'specializedSupport',
  },
  {
    label: '通所自立支援加算',
    value: 'communitySupport',
  },
  {
    label: '入浴支援加算',
    value: 'bathSupport',
  },
  {
    label: '子育てサポート加算',
    value: 'childCareSupport',
  },
  {
    label: '自立サポート加算',
    value: 'selfSupport',
  },
  {
    label: '保護者等確認欄',
    value: 'guardianConfirmation',
  },
];

export const locationOptions = ['学校', '自宅', '放課後教室'] as const;

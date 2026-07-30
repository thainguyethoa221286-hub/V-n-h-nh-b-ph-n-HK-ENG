export type UserRole = 
  | 'HK_STAFF' 
  | 'ENG_STAFF' 
  | 'HK_SUPERVISOR' 
  | 'ENG_SUPERVISOR' 
  | 'ADMIN';

export interface User {
  id: string;
  name: string;
  avatar: string;
  pin: string;
  role: UserRole;
  department: 'Housekeeping' | 'Engineering' | 'Management';
  roleTitle: string;
  shift: string;
  phone: string;
  isActive: boolean;
  permissionsLocked: boolean;
}

export type RoomStatus = 'OCC' | 'ARR' | 'DO' | 'VAC';
export type RoomType = 'STD' | 'SUP' | 'DLX' | 'SUT' | 'CUL';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  hasIssue: boolean;
  waitingMaterials: boolean;
  activeIssueId?: string;
  guestName?: string;
  checkOutTime?: string;
  notes?: string;
}

export type TicketStatus = 'NEW' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'FIXED' | 'UNFIXABLE';

export interface IssueTicket {
  id: string;
  roomNumber: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  location: string;
  issueType: string;
  description: string;
  photoUrl?: string;
  isUrgent: boolean;      // 🔴 Gấp
  isGuestInRoom: boolean; // 👤 Có khách
  isDoorUnlocked: boolean;// 🔑 Đã mở cửa
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  engAssignedId?: string;
  engAssignedName?: string;
  partsRequested?: string;
  unfixableReason?: string;
  completionNotes?: string;
}

export type MatrixTaskCellState = 'NONE' | 'PROPOSED' | 'APPROVED_Y' | 'APPROVED_N' | 'DONE_D';

export interface MaintenanceTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  cycle: 'Tuần' | 'Tháng' | 'Quý' | 'Đột xuất';
  description: string;
  roomStates: Record<string, MatrixTaskCellState>;
  roomNotes?: Record<string, string>;
  createdBy: string;
  createdAt: string;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  floor: string;
  statusFilter: string;
  issueTypeFilter: string;
}

export interface ModuleTab {
  id: 'LOGIN' | 'MODULE_01' | 'MODULE_02' | 'MODULE_03' | 'MODULE_04';
  title: string;
  description: string;
}

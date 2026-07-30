import { Room, User, IssueTicket, MaintenanceTask } from '../types';

// Generate 55 Rooms across 5 floors (11 rooms per floor)
export const INITIAL_ROOMS: Room[] = Array.from({ length: 55 }, (_, index) => {
  const floor = Math.floor(index / 11) + 1;
  const roomIndexOnFloor = (index % 11) + 1;
  const roomNumPadded = roomIndexOnFloor < 10 ? `0${roomIndexOnFloor}` : `${roomIndexOnFloor}`;
  
  // Assign types
  let type: Room['type'] = 'STD';
  let number = `${floor}${roomNumPadded}`;

  if (roomIndexOnFloor === 11) {
    type = 'CUL';
    number = `${floor}${roomNumPadded} CUL`;
  } else if (roomIndexOnFloor === 10) {
    type = 'SUT';
  } else if (roomIndexOnFloor >= 7) {
    type = 'DLX';
  } else if (roomIndexOnFloor >= 4) {
    type = 'SUP';
  } else {
    type = 'STD';
  }

  // Assign initial status variety
  // OCC (Red/Rose), ARR (Blue), DO (Yellow), VAC (Green)
  const statusCycle: Room['status'][] = ['OCC', 'VAC', 'DO', 'OCC', 'ARR', 'VAC', 'OCC', 'DO', 'VAC', 'ARR', 'OCC'];
  const status = statusCycle[index % statusCycle.length];

  // Specific initial rooms with issue flags
  const isUrgentIssueRoom = number === '204' || number === '308';
  const isWaitingMaterialsRoom = number === '105' || number === '402';

  return {
    id: `room-${number}`,
    number,
    floor,
    type,
    status,
    hasIssue: isUrgentIssueRoom || isWaitingMaterialsRoom || number === '102',
    waitingMaterials: isWaitingMaterialsRoom,
    guestName: status === 'OCC' || status === 'ARR' ? `Khách P.${number}` : undefined,
    checkOutTime: status === 'DO' ? '12:00' : undefined,
  };
});

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Nguyễn Văn An',
    role: 'HK_STAFF',
    department: 'Housekeeping',
    roleTitle: 'Nhân viên Buồng phòng (HK)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    pin: '1111',
    shift: 'Sáng (06:00 - 14:00)',
    phone: '0901 123 456',
    isActive: true,
    permissionsLocked: true,
  },
  {
    id: 'usr-2',
    name: 'Trần Thị Bích',
    role: 'ENG_STAFF',
    department: 'Engineering',
    roleTitle: 'Kỹ thuật viên KTS (ENG)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    pin: '2222',
    shift: 'Sáng (07:00 - 15:00)',
    phone: '0902 234 567',
    isActive: true,
    permissionsLocked: true,
  },
  {
    id: 'usr-3',
    name: 'Lê Văn Cường',
    role: 'HK_SUPERVISOR',
    department: 'Housekeeping',
    roleTitle: 'Giám sát Buồng phòng (HK Sup)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    pin: '3333',
    shift: 'Hành chính (08:00 - 17:00)',
    phone: '0903 345 678',
    isActive: true,
    permissionsLocked: true,
  },
  {
    id: 'usr-4',
    name: 'Phạm Hoàng Dũng',
    role: 'ENG_SUPERVISOR',
    department: 'Engineering',
    roleTitle: 'Giám sát Kỹ thuật (ENG Sup)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    pin: '4444',
    shift: 'Hành chính (08:00 - 17:00)',
    phone: '0904 456 789',
    isActive: true,
    permissionsLocked: true,
  },
  {
    id: 'usr-5',
    name: 'Võ Thị Quản Trị',
    role: 'ADMIN',
    department: 'Management',
    roleTitle: 'Quản trị hệ thống (Admin)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    pin: '9999',
    shift: 'Toàn thời gian',
    phone: '0909 999 999',
    isActive: true,
    permissionsLocked: false,
  },
];

export const INITIAL_TICKETS: IssueTicket[] = [
  {
    id: 'TCK-2026-001',
    roomNumber: '204',
    reporterId: 'usr-1',
    reporterName: 'Nguyễn Văn An',
    reporterRole: 'HK_STAFF',
    location: 'Phòng tắm & Điều hòa',
    issueType: 'Chập điện & Chảy nước điều hòa',
    description: 'Điều hòa chảy nước rải rác xuống đệm, ổ cắm phòng tắm phát tiếng nổ nhẹ!',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
    isUrgent: true,        // 🔴 GẤP
    isGuestInRoom: true,   // 👤 Có khách
    isDoorUnlocked: true,  // 🔑 Đã mở cửa
    status: 'NEW',
    createdAt: '2026-07-30T08:15:00',
    updatedAt: '2026-07-30T08:15:00',
  },
  {
    id: 'TCK-2026-002',
    roomNumber: '308',
    reporterId: 'usr-1',
    reporterName: 'Nguyễn Văn An',
    reporterRole: 'HK_STAFF',
    location: 'Khóa cửa chính',
    issueType: 'Kẹt khóa từ cửa vào',
    description: 'Thẻ từ quẹt đèn đỏ liên tục, khách đang chờ ngoài hành lang.',
    photoUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=80',
    isUrgent: true,        // 🔴 GẤP
    isGuestInRoom: true,   // 👤 Có khách
    isDoorUnlocked: false, // 🔑 Chưa mở
    status: 'NEW',
    createdAt: '2026-07-30T08:25:00',
    updatedAt: '2026-07-30T08:25:00',
  },
  {
    id: 'TCK-2026-003',
    roomNumber: '105',
    reporterId: 'usr-3',
    reporterName: 'Lê Văn Cường',
    reporterRole: 'HK_SUPERVISOR',
    location: 'Bồn cầu phòng vệ sinh',
    issueType: 'Thay phao xả bồn cầu',
    description: 'Nước xả chảy rỉ liên tục không ngắt.',
    photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&auto=format&fit=crop&q=80',
    isUrgent: false,
    isGuestInRoom: false,
    isDoorUnlocked: true,
    status: 'WAITING_PARTS', // ⌛ Chờ vật tư
    partsRequested: 'Cụm van xả Toto 38mm',
    createdAt: '2026-07-29T14:10:00',
    updatedAt: '2026-07-30T07:40:00',
    engAssignedName: 'Trần Thị Bích',
  },
  {
    id: 'TCK-2026-004',
    roomNumber: '102',
    reporterId: 'usr-1',
    reporterName: 'Nguyễn Văn An',
    reporterRole: 'HK_STAFF',
    location: 'Đèn ngủ đầu giường',
    issueType: 'Hỏng bóng đèn LED',
    description: 'Đèn chùm nhỏ đầu giường bị chập chớp nháy.',
    isUrgent: false,
    isGuestInRoom: false,
    isDoorUnlocked: true,
    status: 'IN_PROGRESS',
    createdAt: '2026-07-30T07:50:00',
    updatedAt: '2026-07-30T08:00:00',
    engAssignedName: 'Trần Thị Bích',
  },
];

// Seed Matrix maintenance tasks for 55 rooms
const generateRoomStateMap = (seedType: 'HVAC' | 'CARPET' | 'PLUMBING') => {
  const map: Record<string, 'NONE' | 'PROPOSED' | 'APPROVED_Y' | 'APPROVED_N' | 'DONE_D'> = {};
  INITIAL_ROOMS.forEach((room, idx) => {
    if (seedType === 'HVAC') {
      if (idx % 5 === 0) map[room.number] = 'DONE_D';      // Green ☑
      else if (idx % 5 === 1) map[room.number] = 'APPROVED_Y'; // Yellow
      else if (idx % 5 === 2) map[room.number] = 'PROPOSED';   // Gray
      else if (idx % 7 === 0) map[room.number] = 'APPROVED_N'; // Red
      else map[room.number] = 'NONE';
    } else if (seedType === 'CARPET') {
      if (idx % 4 === 0) map[room.number] = 'DONE_D';
      else if (idx % 4 === 1) map[room.number] = 'APPROVED_Y';
      else if (idx % 6 === 0) map[room.number] = 'PROPOSED';
      else map[room.number] = 'NONE';
    } else {
      if (idx % 3 === 0) map[room.number] = 'APPROVED_Y';
      else if (idx % 3 === 1) map[room.number] = 'DONE_D';
      else map[room.number] = 'PROPOSED';
    }
  });
  return map;
};

export const INITIAL_MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: 'TASK-M01',
    name: 'Bảo trì điều hòa & Vệ sinh lưới lọc định kỳ Tháng 07/2026',
    startDate: '2026-07-25',
    endDate: '2026-08-05',
    cycle: 'Tháng',
    description: 'Xịt rửa lưới lọc, đo gas nạp bổ sung, kiểm tra đường ống thoát nước ngưng cho 55 phòng.',
    roomStates: generateRoomStateMap('HVAC'),
    createdBy: 'Phạm Hoàng Dũng (ENG Sup)',
    createdAt: '2026-07-25T08:00:00',
  },
  {
    id: 'TASK-M02',
    name: 'Giặt thảm sâu & Khử trùng khử mùi sinh học 55 phòng',
    startDate: '2026-07-28',
    endDate: '2026-08-10',
    cycle: 'Tháng',
    description: 'Phun hút thảm trải sàn, xịt khử trùng nệm gối tiêu chuẩn khách sạn 5 sao.',
    roomStates: generateRoomStateMap('CARPET'),
    createdBy: 'Lê Văn Cường (HK Sup)',
    createdAt: '2026-07-28T09:30:00',
  },
  {
    id: 'TASK-M03',
    name: 'Bảo dưỡng van xịt, đường ống nước & Kiểm tra thiết bị PCCC',
    startDate: '2026-07-20',
    endDate: '2026-07-31',
    cycle: 'Tuần',
    description: 'Kiểm tra áp lực vòi xịt phòng tắm, đầu báo khói PCCC và đèn khẩn cấp Exit.',
    roomStates: generateRoomStateMap('PLUMBING'),
    createdBy: 'Phạm Hoàng Dũng (ENG Sup)',
    createdAt: '2026-07-20T10:00:00',
  },
];

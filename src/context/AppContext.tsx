import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Room, 
  IssueTicket, 
  MaintenanceTask, 
  UserRole, 
  TicketStatus, 
  MatrixTaskCellState,
  RoomStatus 
} from '../types';
import { INITIAL_ROOMS, INITIAL_USERS, INITIAL_TICKETS, INITIAL_MAINTENANCE_TASKS } from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  rooms: Room[];
  tickets: IssueTicket[];
  maintenanceTasks: MaintenanceTask[];
  selectedTaskId: string;
  activeModule: 'LOGIN' | 'MODULE_01' | 'MODULE_02' | 'MODULE_03' | 'MODULE_04';
  urgentAlertTicket: IssueTicket | null;
  
  // Actions
  loginWithPin: (userId: string, pin: string) => { success: boolean; message?: string };
  logout: () => void;
  switchActiveUser: (userId: string) => void;
  setActiveModule: (module: 'LOGIN' | 'MODULE_01' | 'MODULE_02' | 'MODULE_03' | 'MODULE_04') => void;
  setSelectedTaskId: (id: string) => void;
  
  // Module 01 Actions
  reportIssue: (ticket: Omit<IssueTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateTicketStatus: (
    ticketId: string, 
    newStatus: TicketStatus, 
    notes?: string, 
    unfixableReason?: string,
    partsRequested?: string
  ) => void;
  updateRoomStatus: (roomNumber: string, status: RoomStatus) => void;
  dismissUrgentAlert: () => void;
  triggerMockUrgentAlert: () => void;

  // Module 02 Actions
  updateMatrixState: (taskId: string, roomNumber: string, newState: MatrixTaskCellState) => void;
  cycleMatrixStateForRoom: (taskId: string, roomNumber: string) => void;
  bulkUpdateMatrix: (taskId: string, roomNumbers: string[], newState: MatrixTaskCellState) => void;
  addMaintenanceTask: (task: Omit<MaintenanceTask, 'id' | 'createdAt'>) => void;

  // Module 04 Actions
  toggleUserLock: (userId: string) => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  updateRoomDetails: (roomNumber: string, updates: Partial<Room>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default logged in as Nguyễn Văn An (HK Staff)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [tickets, setTickets] = useState<IssueTicket[]>(INITIAL_TICKETS);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(INITIAL_MAINTENANCE_TASKS[0].id);
  const [activeModule, setActiveModule] = useState<'LOGIN' | 'MODULE_01' | 'MODULE_02' | 'MODULE_03' | 'MODULE_04'>('MODULE_01');
  
  // High Priority Urgent Alert modal state (for 🔴 GẤP tickets)
  const [urgentAlertTicket, setUrgentAlertTicket] = useState<IssueTicket | null>(null);

  // Check for any initial unhandled URGENT ticket on load
  useEffect(() => {
    const activeUrgent = tickets.find(t => t.isUrgent && t.status === 'NEW');
    if (activeUrgent && currentUser?.department === 'Engineering') {
      setUrgentAlertTicket(activeUrgent);
    }
  }, [currentUser]);

  // Login Handler
  const loginWithPin = (userId: string, pin: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      return { success: false, message: 'Nhân viên không tồn tại trong hệ thống!' };
    }
    if (targetUser.pin !== pin) {
      return { success: false, message: 'Mã PIN không đúng (Vui lòng thử 1111, 2222, 3333, 4444, 9999)!' };
    }
    setCurrentUser(targetUser);
    setActiveModule('MODULE_01');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveModule('LOGIN');
  };

  const switchActiveUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  // Module 01: Report New Issue
  const reportIssue = (ticketData: Omit<IssueTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = new Date().toISOString();
    const newId = `TCK-2026-${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicket: IssueTicket = {
      ...ticketData,
      id: newId,
      status: 'NEW',
      createdAt: now,
      updatedAt: now,
    };

    setTickets(prev => [newTicket, ...prev]);

    // Update Room flags
    setRooms(prev => prev.map(r => {
      if (r.number === ticketData.roomNumber) {
        return {
          ...r,
          hasIssue: true,
          activeIssueId: newId,
        };
      }
      return r;
    }));

    // Trigger full-screen red warning modal if 🔴 GẤP
    if (newTicket.isUrgent) {
      setUrgentAlertTicket(newTicket);
    }
  };

  // Update Ticket Status
  const updateTicketStatus = (
    ticketId: string, 
    newStatus: TicketStatus, 
    notes?: string, 
    unfixableReason?: string,
    partsRequested?: string
  ) => {
    const now = new Date().toISOString();
    let targetRoomNumber = '';

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        targetRoomNumber = t.roomNumber;
        return {
          ...t,
          status: newStatus,
          updatedAt: now,
          completionNotes: notes || t.completionNotes,
          unfixableReason: unfixableReason || t.unfixableReason,
          partsRequested: partsRequested || t.partsRequested,
          engAssignedName: currentUser?.name || t.engAssignedName,
        };
      }
      return t;
    }));

    // Synchronize Room Status Indicators
    if (targetRoomNumber) {
      setRooms(prev => prev.map(r => {
        if (r.number === targetRoomNumber) {
          if (newStatus === 'FIXED') {
            return {
              ...r,
              hasIssue: false,
              waitingMaterials: false,
              activeIssueId: undefined,
            };
          } else if (newStatus === 'WAITING_PARTS') {
            return {
              ...r,
              hasIssue: true,
              waitingMaterials: true,
            };
          }
        }
        return r;
      }));
    }

    // Dismiss urgent modal if resolving that ticket
    if (urgentAlertTicket?.id === ticketId && (newStatus === 'FIXED' || newStatus === 'IN_PROGRESS')) {
      setUrgentAlertTicket(null);
    }
  };

  // Direct Room Status Update (OCC, ARR, DO, VAC)
  const updateRoomStatus = (roomNumber: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, status: newStatus } : r));
  };

  const dismissUrgentAlert = () => {
    setUrgentAlertTicket(null);
  };

  const triggerMockUrgentAlert = () => {
    const mockUrgent: IssueTicket = {
      id: `TCK-TEST-${Date.now().toString().slice(-4)}`,
      roomNumber: '204 CUL',
      reporterId: 'usr-1',
      reporterName: 'Nguyễn Văn An',
      reporterRole: 'HK_STAFF',
      location: 'Ban công & Khóa cửa',
      issueType: '🔴 GẤP: Kẹt cửa ban công & Chập công tắc',
      description: 'Khách bị nhốt ngoài ban công phòng 204 CUL, cần kỹ thuật hỗ trợ lập tức!',
      isUrgent: true,
      isGuestInRoom: true,
      isDoorUnlocked: false,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets(prev => [mockUrgent, ...prev]);
    setUrgentAlertTicket(mockUrgent);
  };

  // Module 02 Actions
  const updateMatrixState = (taskId: string, roomNumber: string, newState: MatrixTaskCellState) => {
    setMaintenanceTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          roomStates: {
            ...task.roomStates,
            [roomNumber]: newState,
          },
        };
      }
      return task;
    }));
  };

  // Smart cycle room matrix cell state based on workflow rules
  const cycleMatrixStateForRoom = (taskId: string, roomNumber: string) => {
    setMaintenanceTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const currentState = task.roomStates[roomNumber] || 'NONE';
        let nextState: MatrixTaskCellState = 'NONE';

        // Workflow state transitions:
        // NONE (White) -> PROPOSED (Gray - ENG Đề xuất) -> APPROVED_Y (Yellow - HK Duyệt Y) -> APPROVED_N (Red - HK Duyệt N) -> DONE_D (Green - Xong D) -> NONE
        if (currentState === 'NONE') nextState = 'PROPOSED';
        else if (currentState === 'PROPOSED') nextState = 'APPROVED_Y';
        else if (currentState === 'APPROVED_Y') nextState = 'APPROVED_N';
        else if (currentState === 'APPROVED_N') nextState = 'DONE_D';
        else if (currentState === 'DONE_D') nextState = 'NONE';

        return {
          ...task,
          roomStates: {
            ...task.roomStates,
            [roomNumber]: nextState,
          },
        };
      }
      return task;
    }));
  };

  const bulkUpdateMatrix = (taskId: string, roomNumbers: string[], newState: MatrixTaskCellState) => {
    setMaintenanceTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedRoomStates = { ...task.roomStates };
        roomNumbers.forEach(num => {
          updatedRoomStates[num] = newState;
        });
        return {
          ...task,
          roomStates: updatedRoomStates,
        };
      }
      return task;
    }));
  };

  const addMaintenanceTask = (taskData: Omit<MaintenanceTask, 'id' | 'createdAt'>) => {
    const newId = `TASK-M${String(maintenanceTasks.length + 1).padStart(2, '0')}`;
    const newTask: MaintenanceTask = {
      ...taskData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setMaintenanceTasks(prev => [newTask, ...prev]);
    setSelectedTaskId(newId);
  };

  // Module 04 Actions
  const toggleUserLock = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissionsLocked: !u.permissionsLocked } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissionsLocked: !prev.permissionsLocked } : null);
    }
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    const roleTitles: Record<UserRole, string> = {
      HK_STAFF: 'Nhân viên Buồng phòng (HK)',
      ENG_STAFF: 'Kỹ thuật viên KTS (ENG)',
      HK_SUPERVISOR: 'Giám sát Buồng phòng (HK Sup)',
      ENG_SUPERVISOR: 'Giám sát Kỹ thuật (ENG Sup)',
      ADMIN: 'Quản trị hệ thống (Admin)',
    };
    
    const depts: Record<UserRole, 'Housekeeping' | 'Engineering' | 'Management'> = {
      HK_STAFF: 'Housekeeping',
      ENG_STAFF: 'Engineering',
      HK_SUPERVISOR: 'Housekeeping',
      ENG_SUPERVISOR: 'Engineering',
      ADMIN: 'Management',
    };

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role,
          roleTitle: roleTitles[role],
          department: depts[role],
        };
      }
      return u;
    }));

    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        role,
        roleTitle: roleTitles[role],
        department: depts[role],
      } : null);
    }
  };

  const updateRoomDetails = (roomNumber: string, updates: Partial<Room>) => {
    setRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, ...updates } : r));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      rooms,
      tickets,
      maintenanceTasks,
      selectedTaskId,
      activeModule,
      urgentAlertTicket,
      loginWithPin,
      logout,
      switchActiveUser,
      setActiveModule,
      setSelectedTaskId,
      reportIssue,
      updateTicketStatus,
      updateRoomStatus,
      dismissUrgentAlert,
      triggerMockUrgentAlert,
      updateMatrixState,
      cycleMatrixStateForRoom,
      bulkUpdateMatrix,
      addMaintenanceTask,
      toggleUserLock,
      updateUserRole,
      updateRoomDetails,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import type { LeaveRequest, LeaveType, Role, User } from '@/lib/schemas'

export const USERS: Record<Role, User> = {
  student: {
    id: 1,
    name: 'Ana Petrovska',
    role: 'student',
    email: 'ana.petrovska@brainster.edu.mk',
    avatar: 'AP',
    dept: 'Software Development',
    sub: 'Year 2',
  },
  employee: {
    id: 2,
    name: 'Marko Dimovski',
    role: 'employee',
    email: 'marko.dimovski@brainster.edu.mk',
    avatar: 'MD',
    dept: 'Academic Affairs',
    sub: 'Lecturer',
  },
  admin: {
    id: 3,
    name: 'Elena Stojanovic',
    role: 'admin',
    email: 'elena.stojanovic@brainster.edu.mk',
    avatar: 'ES',
    dept: 'Human Resources',
    sub: 'HR Manager',
  },
}

export const INITIAL_REQUESTS: Array<LeaveRequest> = [
  { id: 1, userId: 1, userName: 'Ana Petrovska', userRole: 'student', type: 'vacation', start: '2026-06-10', end: '2026-06-14', days: 5, status: 'pending', reason: 'Family vacation trip to the Adriatic coast', submitted: '2026-06-01', comment: '', hasDoc: false },
  { id: 2, userId: 1, userName: 'Ana Petrovska', userRole: 'student', type: 'sick', start: '2026-05-20', end: '2026-05-21', days: 2, status: 'approved', reason: 'Doctor appointment and recovery', submitted: '2026-05-19', comment: 'Approved. Please submit medical certificate to HR.', hasDoc: true },
  { id: 3, userId: 1, userName: 'Ana Petrovska', userRole: 'student', type: 'personal', start: '2026-05-15', end: '2026-05-15', days: 1, status: 'rejected', reason: 'Personal matters', submitted: '2026-05-14', comment: 'Insufficient advance notice. Minimum 3 days required.', hasDoc: false },
  { id: 4, userId: 2, userName: 'Marko Dimovski', userRole: 'employee', type: 'vacation', start: '2026-07-01', end: '2026-07-10', days: 10, status: 'pending', reason: 'Annual summer vacation — pre-booked travel', submitted: '2026-06-02', comment: '', hasDoc: false },
  { id: 5, userId: 4, userName: 'Stefan Nikolov', userRole: 'employee', type: 'sick', start: '2026-06-03', end: '2026-06-04', days: 2, status: 'approved', reason: 'Fever and flu symptoms', submitted: '2026-06-03', comment: 'Approved. Get well soon.', hasDoc: true },
  { id: 6, userId: 5, userName: 'Ivana Blazevska', userRole: 'student', type: 'personal', start: '2026-06-06', end: '2026-06-06', days: 1, status: 'pending', reason: 'Family obligation', submitted: '2026-06-05', comment: '', hasDoc: false },
  { id: 7, userId: 6, userName: 'Boris Trajkovski', userRole: 'employee', type: 'vacation', start: '2026-06-15', end: '2026-06-20', days: 6, status: 'approved', reason: 'Travel to Greece', submitted: '2026-05-28', comment: 'Approved.', hasDoc: false },
  { id: 8, userId: 2, userName: 'Marko Dimovski', userRole: 'employee', type: 'sick', start: '2026-04-10', end: '2026-04-11', days: 2, status: 'approved', reason: 'Cold and fever', submitted: '2026-04-10', comment: 'Approved.', hasDoc: true },
  { id: 9, userId: 7, userName: 'Sofija Ristić', userRole: 'student', type: 'vacation', start: '2026-06-20', end: '2026-06-25', days: 6, status: 'approved', reason: 'Summer break travel', submitted: '2026-06-01', comment: 'Approved.', hasDoc: false },
  { id: 10, userId: 8, userName: 'Aleksa Jović', userRole: 'employee', type: 'personal', start: '2026-06-08', end: '2026-06-08', days: 1, status: 'pending', reason: 'Administrative matters at municipal office', submitted: '2026-06-06', comment: '', hasDoc: false },
  { id: 11, userId: 9, userName: 'Tijana Vukić', userRole: 'student', type: 'sick', start: '2026-06-05', end: '2026-06-07', days: 3, status: 'approved', reason: 'Migraine and prescribed rest', submitted: '2026-06-05', comment: 'Approved. Medical note required upon return.', hasDoc: true },
  { id: 12, userId: 10, userName: 'Dejan Petrović', userRole: 'employee', type: 'vacation', start: '2026-06-22', end: '2026-06-26', days: 5, status: 'pending', reason: 'Family holiday', submitted: '2026-06-04', comment: '', hasDoc: false },
]

export const LEAVE_BALANCE: Record<'student' | 'employee', Record<LeaveType, { total: number; used: number }>> = {
  student: { vacation: { total: 20, used: 5 }, sick: { total: 15, used: 5 }, personal: { total: 5, used: 1 } },
  employee: { vacation: { total: 21, used: 10 }, sick: { total: 15, used: 3 }, personal: { total: 5, used: 0 } },
}

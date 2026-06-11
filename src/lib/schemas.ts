import { z } from 'zod'

export const roleSchema = z.enum(['student', 'employee', 'admin'])
export type Role = z.infer<typeof roleSchema>

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  role: roleSchema,
  email: z.string().email(),
  avatar: z.string(),
  dept: z.string(),
  sub: z.string(),
})
export type User = z.infer<typeof userSchema>

export const leaveTypeSchema = z.enum(['vacation', 'sick', 'personal'])
export type LeaveType = z.infer<typeof leaveTypeSchema>

export const requestStatusSchema = z.enum(['pending', 'approved', 'rejected'])
export type RequestStatus = z.infer<typeof requestStatusSchema>

export const leaveRequestSchema = z.object({
  id: z.number(),
  userId: z.number(),
  userName: z.string(),
  userRole: roleSchema,
  type: leaveTypeSchema,
  start: z.string(),
  end: z.string(),
  days: z.number(),
  status: requestStatusSchema,
  reason: z.string(),
  submitted: z.string(),
  comment: z.string(),
  hasDoc: z.boolean(),
})
export type LeaveRequest = z.infer<typeof leaveRequestSchema>

export const newRequestSchema = z
  .object({
    type: leaveTypeSchema,
    start: z.string().min(1, 'Start date is required'),
    end: z.string().min(1, 'End date is required'),
    reason: z.string().trim().min(1, 'Please describe the reason for your leave'),
    hasDoc: z.boolean(),
  })
  .refine((data) => new Date(data.end) >= new Date(data.start), {
    message: 'End date must be on or after the start date',
    path: ['end'],
  })
export type NewRequestInput = z.infer<typeof newRequestSchema>

export const reviewActionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  comment: z.string(),
})
export type ReviewAction = z.infer<typeof reviewActionSchema>

export const companyIdSchema = z.enum(['brainster', 'techflow'])
export type CompanyId = z.infer<typeof companyIdSchema>

export const companySchema = z.object({
  id: companyIdSchema,
  name: z.string(),
  industry: z.string(),
  logo: z.string(),
  employeeCount: z.number(),
  studentCount: z.number(),
  employeesAway: z.number(),
  studentsAway: z.number(),
})
export type Company = z.infer<typeof companySchema>

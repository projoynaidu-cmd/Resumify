import { z } from 'zod'

// ─── Auth schemas ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>

export const personalSchema = z.object({
  fname: z.string().min(1, 'First name is required'),
  lname: z.string().min(1, 'Last name is required'),
  title: z.string().optional().default(''),
  email: z.string().email('Invalid email').or(z.literal('')),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  website: z.string().optional().default(''),
  github: z.string().optional().default(''),
  twitter: z.string().optional().default(''),
})

export const experienceSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  date: z.string().optional().default(''),
  desc: z.string().optional().default(''),
})

export const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  school: z.string().min(1, 'School is required'),
  date: z.string().optional().default(''),
  desc: z.string().optional().default(''),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  tech: z.string().optional().default(''),
  date: z.string().optional().default(''),
  desc: z.string().optional().default(''),
})

export const coverLetterSchema = z.object({
  to: z.string().optional().default(''),
  company: z.string().optional().default(''),
  position: z.string().optional().default(''),
  date: z.string().optional().default(''),
  body: z.string().optional().default(''),
})

export type PersonalSchema = z.infer<typeof personalSchema>
export type ExperienceSchema = z.infer<typeof experienceSchema>
export type EducationSchema = z.infer<typeof educationSchema>
export type ProjectSchema = z.infer<typeof projectSchema>
export type CoverLetterSchema = z.infer<typeof coverLetterSchema>

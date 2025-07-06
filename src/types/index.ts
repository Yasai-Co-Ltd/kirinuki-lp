/**
 * 共通の型定義
 */

export interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface TestimonialData {
  id: number
  name: string
  company: string
  content: string
  image: string
}

export interface ProductData {
  id: number
  title: string
  image: string
  company: string
}

export interface PlanData {
  id: number
  name: string
  price: number
  features: string[]
  recommended?: boolean
}

export interface FAQData {
  id: number
  question: string
  answer: string
}

export interface NewsData {
  id: number
  date: string
  title: string
  content: string
}

export interface CompanyInfo {
  name: string
  address: string
  phone: string
  email: string
  description: string
}
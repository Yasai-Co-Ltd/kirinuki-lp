'use client'

import React, { useState } from 'react'
import { ContactFormData } from '../../types'

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void
  className?: string
}

export default function ContactForm({ onSubmit, className }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })

  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // エラーをクリア
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前は必須です'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容は必須です'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit?.(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <table className="ta1">
        <tbody>
          <tr>
            <th>お名前<span style={{color:'red'}}>※</span></th>
            <td>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="ws"
                size={30}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </td>
          </tr>
          <tr>
            <th>メールアドレス<span style={{color:'red'}}>※</span></th>
            <td>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="ws"
                size={30}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </td>
          </tr>
          <tr>
            <th>お問い合わせ詳細<span style={{color:'red'}}>※</span></th>
            <td>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="wl"
                cols={30}
                rows={10}
              />
              {errors.message && <div className="error-message">{errors.message}</div>}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="c">
        <input type="submit" value="内容を確認する" />
      </p>
    </form>
  )
}
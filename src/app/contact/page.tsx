'use client'

import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import ContactForm from '../../components/features/ContactForm'
import { ContactFormData } from '../../types'

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSubmit = async (formData: ContactFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          message: result.message
        })
        // フォームをリセットするために、成功後に少し待ってからページをリロード
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      } else {
        setSubmitMessage({
          type: 'error',
          message: result.error || 'エラーが発生しました'
        })
      }
    } catch (error) {
      console.error('送信エラー:', error)
      setSubmitMessage({
        type: 'error',
        message: 'ネットワークエラーが発生しました。しばらく時間をおいて再度お試しください。'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <section>
        <h2 className="c">お問い合わせ<span>Contact</span></h2>
        
        {submitMessage && (
          <div
            className={`message ${submitMessage.type === 'success' ? 'success' : 'error'}`}
            style={{
              padding: '16px',
              margin: '20px 0',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: submitMessage.type === 'success' ? '#d1fae5' : '#fee2e2',
              border: `1px solid ${submitMessage.type === 'success' ? '#10b981' : '#ef4444'}`,
              color: submitMessage.type === 'success' ? '#065f46' : '#991b1b'
            }}
          >
            {submitMessage.message}
          </div>
        )}

        <ContactForm
          onSubmit={handleSubmit}
        />

        {isSubmitting && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p>送信中...</p>
            </div>
          </div>
        )}
      </section>
    </Layout>
  )
}
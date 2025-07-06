'use client'

import { useEffect } from 'react'

export const useInView = () => {
  useEffect(() => {
    // Intersection Observer を使用してinview効果を実装
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          
          // upスタイル
          if (element.classList.contains('up')) {
            element.classList.add('upstyle')
          }
          
          // downスタイル
          if (element.classList.contains('down')) {
            element.classList.add('downstyle')
          }
          
          // transform1スタイル
          if (element.classList.contains('transform1')) {
            element.classList.add('transform1style')
          }
          
          // transform2スタイル
          if (element.classList.contains('transform2')) {
            element.classList.add('transform2style')
          }
          
          // transform3スタイル
          if (element.classList.contains('transform3')) {
            element.classList.add('transform3style')
          }
          
          // blurスタイル
          if (element.classList.contains('blur')) {
            element.classList.add('blurstyle')
          }
        }
      })
    }, observerOptions)

    // 対象要素を監視
    const targetElements = document.querySelectorAll('.up, .down, .transform1, .transform2, .transform3, .blur')
    targetElements.forEach(el => observer.observe(el))

    // クリーンアップ
    return () => {
      targetElements.forEach(el => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])
}
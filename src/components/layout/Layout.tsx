'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { useMainScript } from '../../hooks/useMainScript'
import { useInView } from '../../hooks/useInView'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  // カスタムフックを使用
  useMainScript()
  useInView()

  return (
    <div id="container">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
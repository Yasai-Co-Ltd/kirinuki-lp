'use client'

import { useEffect } from 'react'

export const useMainScript = () => {
  useEffect(() => {
    // debounce関数
    function debounce(func: Function, wait: number) {
      let timeout: NodeJS.Timeout
      return function(this: any, ...args: any[]) {
        const context = this
        const later = function() {
          timeout = null as any
          func.apply(context, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

    // メニュー関連の処理
    const initializeMenu = () => {
      const menubar = document.getElementById('menubar')
      const menubarHdr = document.getElementById('menubar_hdr')
      const headerNav = document.querySelector('header nav')

      if (!menubar || !menubarHdr) return

      // ウィンドウリサイズ時の処理
      const handleResize = debounce(() => {
        if (window.innerWidth < 9999) {
          document.body.classList.add('small-screen')
          document.body.classList.remove('large-screen')
          menubar.classList.add('display-none')
          menubar.classList.remove('display-block')
          menubarHdr.classList.remove('display-none', 'ham')
          menubarHdr.classList.add('display-block')
        } else {
          document.body.classList.add('large-screen')
          document.body.classList.remove('small-screen')
          menubar.classList.add('display-block')
          menubar.classList.remove('display-none')
          menubarHdr.classList.remove('display-block')
          menubarHdr.classList.add('display-none')

          // ドロップダウンメニューを閉じる
          const dropdowns = document.querySelectorAll('.ddmenu_parent > ul')
          dropdowns.forEach(dropdown => {
            ;(dropdown as HTMLElement).style.display = 'none'
          })
        }
      }, 10)

      // ハンバーガーメニューのクリック処理
      menubarHdr.addEventListener('click', () => {
        menubarHdr.classList.toggle('ham')
        if (menubarHdr.classList.contains('ham')) {
          menubar.classList.add('display-block')
        } else {
          menubar.classList.remove('display-block')
        }
      })

      // アンカーリンクでメニューを閉じる
      const anchorLinks = menubar.querySelectorAll('a[href*="#"]')
      anchorLinks.forEach(link => {
        link.addEventListener('click', () => {
          menubar.classList.remove('display-block')
          menubarHdr.classList.remove('ham')
        })
      })

      // ドロップダウンメニューの設定
      const setupDropdown = () => {
        const menuItems = document.querySelectorAll('#menubar li:has(ul), header nav li:has(ul)')
        menuItems.forEach(item => {
          item.classList.add('ddmenu_parent')
          const link = item.querySelector('a')
          if (link) {
            link.classList.add('ddmenu')
          }
        })

        // タッチデバイス用のドロップダウン処理
        let touchStartY = 0
        const ddmenus = document.querySelectorAll('.ddmenu')
        ddmenus.forEach(menu => {
          menu.addEventListener('touchstart', (e) => {
            touchStartY = (e as TouchEvent).touches[0].clientY
          })

          menu.addEventListener('touchend', (e) => {
            const touchEndY = (e as TouchEvent).changedTouches[0].clientY
            const touchDifference = touchStartY - touchEndY

            if (Math.abs(touchDifference) < 10) {
              const nextUl = menu.nextElementSibling as HTMLElement
              if (nextUl && nextUl.tagName === 'UL') {
                if (nextUl.style.display === 'block') {
                  nextUl.style.display = 'none'
                } else {
                  nextUl.style.display = 'block'
                }
                // 他のドロップダウンを閉じる
                ddmenus.forEach(otherMenu => {
                  if (otherMenu !== menu) {
                    const otherUl = otherMenu.nextElementSibling as HTMLElement
                    if (otherUl && otherUl.tagName === 'UL') {
                      otherUl.style.display = 'none'
                    }
                  }
                })
                e.preventDefault()
              }
            }
          })
        })

        // PC用ホバー処理
        const ddmenuParents = document.querySelectorAll('.ddmenu_parent')
        ddmenuParents.forEach(parent => {
          parent.addEventListener('mouseenter', () => {
            const ul = parent.querySelector('ul') as HTMLElement
            if (ul) ul.style.display = 'block'
          })
          parent.addEventListener('mouseleave', () => {
            const ul = parent.querySelector('ul') as HTMLElement
            if (ul) ul.style.display = 'none'
          })
        })
      }

      // 初期化
      handleResize()
      setupDropdown()
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    // スムーススクロール
    const initializeSmoothScroll = () => {
      const smoothScroll = (target: string) => {
        const scrollTo = target === '#' ? 0 : document.querySelector(target)?.getBoundingClientRect().top! + window.pageYOffset
        window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        })
      }

      const anchorLinks = document.querySelectorAll('a[href^="#"]')
      anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          const href = link.getAttribute('href') || '#'
          smoothScroll(href)
        })
      })

      // ページトップボタン
      const pagetopButtons = document.querySelectorAll('.pagetop')
      pagetopButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault()
          smoothScroll('#')
        })
      })

      // スクロール時のページトップボタン表示制御
      const handleScroll = () => {
        pagetopButtons.forEach(button => {
          if (window.scrollY >= 300) {
            ;(button as HTMLElement).style.display = 'block'
            button.classList.add('pagetop-show')
          } else {
            ;(button as HTMLElement).style.display = 'none'
            button.classList.remove('pagetop-show')
          }
        })
      }

      window.addEventListener('scroll', handleScroll)

      // ページロード時のハッシュ処理
      if (window.location.hash) {
        window.scrollTo(0, 0)
        setTimeout(() => {
          smoothScroll(window.location.hash)
        }, 10)
      }

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // パララックス効果
    const initializeParallax = () => {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset
        
        // speed1, speed2 要素のパララックス
        const speed1Elements = document.querySelectorAll('.speed1')
        speed1Elements.forEach(el => {
          ;(el as HTMLElement).style.transform = `translateY(${-scrollTop * 0.1}px)`
        })

        const speed2Elements = document.querySelectorAll('.speed2')
        speed2Elements.forEach(el => {
          ;(el as HTMLElement).style.transform = `translateY(${-scrollTop * 0.05}px)`
        })

        // 背景スライドアップ効果
        const windowHeight = window.innerHeight
        const bgSlideElements = document.querySelectorAll('.bg-slideup .image')
        bgSlideElements.forEach(el => {
          const element = el as HTMLElement
          const rect = element.getBoundingClientRect()
          const offsetTop = rect.top + scrollTop
          const height = element.offsetHeight

          if (offsetTop + height > scrollTop && offsetTop < scrollTop + windowHeight) {
            const percentScrolled = (scrollTop + windowHeight - offsetTop) / (windowHeight + height)
            const clampedPercent = Math.max(0, Math.min(1, percentScrolled))
            const yPos = clampedPercent * 100
            element.style.backgroundPosition = `center ${yPos}%`
          }
        })
      }

      window.addEventListener('scroll', handleScroll)
      handleScroll() // 初期実行

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // FAQ開閉処理
    const initializeFAQ = () => {
      const opencloseElements = document.querySelectorAll('.openclose')
      opencloseElements.forEach(element => {
        const nextElement = element.nextElementSibling as HTMLElement
        if (nextElement) {
          nextElement.style.display = 'none'
        }

        element.addEventListener('click', () => {
          const next = element.nextElementSibling as HTMLElement
          if (next) {
            if (next.style.display === 'none' || !next.style.display) {
              next.style.display = 'block'
            } else {
              next.style.display = 'none'
            }

            // 他の要素を閉じる
            opencloseElements.forEach(otherElement => {
              if (otherElement !== element) {
                const otherNext = otherElement.nextElementSibling as HTMLElement
                if (otherNext) {
                  otherNext.style.display = 'none'
                }
              }
            })
          }
        })
      })
    }

    // テキストスライド
    const initializeTextSlide = () => {
      const textSlide = document.querySelector('.text-slide')
      if (textSlide) {
        const originalSpan = textSlide.querySelector('span')
        if (originalSpan) {
          // 3回複製
          for (let i = 0; i < 3; i++) {
            const clone = originalSpan.cloneNode(true)
            textSlide.appendChild(clone)
          }

          const scrollText = () => {
            const firstSpan = textSlide.querySelector('span') as HTMLElement
            if (firstSpan) {
              const spanWidth = firstSpan.offsetWidth
              
              // アニメーション
              let marginLeft = 0
              const animate = () => {
                marginLeft -= 1
                ;(textSlide as HTMLElement).style.marginLeft = `${marginLeft}px`
                
                if (Math.abs(marginLeft) >= spanWidth) {
                  textSlide.appendChild(firstSpan)
                  ;(textSlide as HTMLElement).style.marginLeft = '0px'
                  marginLeft = 0
                }
                
                requestAnimationFrame(animate)
              }
              animate()
            }
          }

          scrollText()
        }
      }
    }

    // ローディング処理
    const initializeLoading = () => {
      const loading = document.getElementById('loading')
      if (loading) {
        if (sessionStorage.getItem('visited')) {
          loading.style.display = 'none'
        } else {
          setTimeout(() => {
            sessionStorage.setItem('visited', 'true')
          }, 3000)
        }
      }
    }

    // 初期化実行
    const cleanupMenu = initializeMenu()
    const cleanupScroll = initializeSmoothScroll()
    const cleanupParallax = initializeParallax()
    initializeFAQ()
    initializeTextSlide()
    initializeLoading()

    // クリーンアップ
    return () => {
      if (cleanupMenu) cleanupMenu()
      if (cleanupScroll) cleanupScroll()
      if (cleanupParallax) cleanupParallax()
    }
  }, [])
}
import { useEffect, useRef } from 'react'
import { prefersReducedMotion, useInView } from '../hooks/useScrollReveal'
import { cn } from '../lib/utils'

export function Reveal({ as: Tag = 'div', children, className, delay = 0, ...props }) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out',
        inView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        className,
      )}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function ParallaxImage({ className, strength = 0.035, alt, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const node = ref.current
    if (!node) return undefined

    let frame = null
    const update = () => {
      const rect = node.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const offset = (viewport / 2 - (rect.top + rect.height / 2)) * strength
      node.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0) scale(1.06)`
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = null
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength])

  return (
    <img
      ref={ref}
      alt={alt}
      className={cn('scale-[1.06] will-change-transform', className)}
      {...props}
    />
  )
}

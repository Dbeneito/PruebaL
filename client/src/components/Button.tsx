import { useRef, useEffect } from 'react'

const Button = ({ children, href = '/registro' }: { children: React.ReactNode, href?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.createImageData(canvas.width, canvas.height)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255
      imageData.data[i] = v
      imageData.data[i + 1] = v
      imageData.data[i + 2] = v
      imageData.data[i + 3] = Math.random() * 30
    }
    ctx.putImageData(imageData, 0, 0)
  }, [])

  const shadow = '0 8px 32px rgba(21,224,18,0.4), 0 2px 8px rgba(21,224,18,0.3), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,80,0,0.3)'
  const shadowHover = '0 12px 40px rgba(21,224,18,0.5), 0 4px 12px rgba(21,224,18,0.4), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,80,0,0.3)'

  return (
    
    <a  href={href}
      className="relative inline-flex items-center justify-center px-16 py-[18px] rounded-full no-underline overflow-hidden border border-[rgba(67,67,67,0.3)] cursor-pointer transition-transform duration-200"
      style={{
        background: 'linear-gradient(180deg, #4dff4a 0%, #15e012 40%, #0ab008 70%, #04ff00bd 100%)',
        boxShadow: shadow,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.03)'
        e.currentTarget.style.boxShadow = shadowHover
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = shadow
      }}
    >
      {/* Brillo superior */}
      <div className="absolute top-px left-[5%] right-[5%] h-1/4 rounded-full pointer-events-none bg-gradient-to-b from-white/70 to-white/0" />

      {/* Ruido */}
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        className="absolute inset-0 w-full h-full rounded-full pointer-events-none mix-blend-overlay"
      />

      {/* Texto */}
      <span className="font-[var(--font-secundaria)] text-[13px] font-bold text-[var(--negro)] tracking-[0.15em] uppercase relative z-10">
        {children}
      </span>
    </a>
  )
}

export default Button
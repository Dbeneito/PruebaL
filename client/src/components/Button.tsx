import { useRef, useEffect, useState } from 'react'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  color?: string
  shadowColor?: string
  textColor?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  unfollowMode?: boolean
}

const Button = ({
  children,
  href,
  onClick,
  color = '#15e012',
  shadowColor = '21,224,18',
  textColor = 'var(--negro)',
  size = 'md',
  fullWidth = false,
  unfollowMode = false,
}: ButtonProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovered, setIsHovered] = useState(false)

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

  const sizeMap = {
    sm: { padding: '10px 24px', fontSize: '11px' },
    md: { padding: '18px 64px', fontSize: '13px' },
    lg: { padding: '22px 80px', fontSize: '15px' },
  }

  const { padding, fontSize } = sizeMap[size]

  // Si está en unfollowMode y hover, muestra rojo
  const activeColor = unfollowMode && isHovered ? '#CC1100' : color
  const activeShadowColor = unfollowMode && isHovered ? '204,17,0' : shadowColor
  const activeTextColor = unfollowMode && isHovered ? '#ffffff' : textColor

  const shadow = `0 8px 32px rgba(${activeShadowColor},0.4), 0 2px 8px rgba(${activeShadowColor},0.3), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,80,0,0.3)`
  const shadowHover = `0 12px 40px rgba(${activeShadowColor},0.5), 0 4px 12px rgba(${activeShadowColor},0.4), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,80,0,0.3)`

  const colorDark = activeColor + 'cc'

  const sharedStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding,
    borderRadius: '100px',
    textDecoration: 'none',
    overflow: 'hidden',
    border: '1px solid rgba(67,67,67,0.3)',
    cursor: 'pointer',
    transition: 'transform 0.2s, background 0.2s, box-shadow 0.2s',
    background: `linear-gradient(180deg, ${activeColor}cc 0%, ${activeColor} 40%, ${colorDark} 70%, ${activeColor}bd 100%)`,
    boxShadow: shadow,
    width: fullWidth ? '100%' : 'auto',
  }

  const inner = (
    <>
      <div style={{
        position: 'absolute',
        top: '1px',
        left: '5%',
        right: '5%',
        height: '25%',
        borderRadius: '100px',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0))',
        pointerEvents: 'none',
      }} />
      <canvas
        ref={canvasRef}
        width={400}
        height={80}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          borderRadius: '100px',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />
      <span style={{
        fontFamily: 'var(--font-secundaria)',
        fontSize,
        fontWeight: 700,
        color: activeTextColor,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        position: 'relative',
        zIndex: 1,
        transition: 'color 0.2s',
      }}>
        {unfollowMode && isHovered ? 'Dejar de seguir' : children}
      </span>
    </>
  )

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setIsHovered(true)
    e.currentTarget.style.transform = 'scale(1.03)'
    e.currentTarget.style.boxShadow = shadowHover
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    setIsHovered(false)
    e.currentTarget.style.transform = 'scale(1)'
    e.currentTarget.style.boxShadow = shadow
  }

  if (href) {
    return (
      <a href={href} style={sharedStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {inner}
      </a>
    )
  }

  return (
    <button onClick={onClick} style={sharedStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {inner}
    </button>
  )
}

export default Button
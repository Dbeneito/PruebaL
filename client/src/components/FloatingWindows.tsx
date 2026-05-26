import { useState, useEffect, useRef } from 'react'

interface FloatWindow {
  id: number
  title: string
  img: string
  x: number
  y: number
  width: number
  visible: boolean
  zIndex: number
}

const INITIAL_WINDOWS: Omit<FloatWindow, 'visible' | 'zIndex'>[] = [
  { id: 1, title: 'LMN_001', img: 'https://picsum.photos/seed/w1/400/300', x: 12, y: 6, width: 360 },
  { id: 2, title: 'LMN_002', img: 'https://picsum.photos/seed/w2/400/300', x: 66, y: 16, width: 280 },
  { id: 3, title: 'LMN_003', img: 'https://picsum.photos/seed/w3/400/300', x: 10, y: 62, width: 300 },
]

const FloatingWindows = () => {
  const [windows, setWindows] = useState<FloatWindow[]>(
    INITIAL_WINDOWS.map(w => ({ ...w, visible: false, zIndex: 10 }))
  )
  const [topZ, setTopZ] = useState(10)
  const dragging = useRef<{ id: number, startX: number, startY: number, origX: number, origY: number } | null>(null)

  useEffect(() => {
    INITIAL_WINDOWS.forEach((w, i) => {
      setTimeout(() => {
        setWindows(prev => prev.map(win =>
          win.id === w.id ? { ...win, visible: true } : win
        ))
      }, i * 200)
    })
  }, [])

  const handleMouseDown = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    const win = windows.find(w => w.id === id)
    if (!win) return
    const newZ = topZ + 1
    setTopZ(newZ)
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: newZ } : w))
    dragging.current = { id, startX: e.clientX, startY: e.clientY, origX: win.x, origY: win.y }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const { id, startX, startY, origX, origY } = dragging.current
      const dx = ((e.clientX - startX) / window.innerWidth) * 100
      const dy = ((e.clientY - startY) / window.innerHeight) * 100
      setWindows(prev => prev.map(w =>
        w.id === id ? { ...w, x: origX + dx, y: origY + dy } : w
      ))
    }
    const handleMouseUp = () => { dragging.current = null }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const closeWindow = (id: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, visible: false } : w))
  }

  return (
    <>
      {windows.filter(w => w.visible).map(win => (
        <div
          key={win.id}
          style={{
            position: 'absolute',
            left: `${win.x}%`,
            top: `${win.y}%`,
            zIndex: win.zIndex,
            opacity: win.visible ? 1 : 0,
            transform: win.visible ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            userSelect: 'none',
            width: `${win.width}px`,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)',
            border: '1px solid #888',
          }}
        >
          {/* Barra superior */}
          <div
            onMouseDown={(e) => handleMouseDown(e, win.id)}
            style={{
              background: 'linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 40%, #b8b8b8 100%)',
              padding: '6px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'grab',
              borderBottom: '1px solid #999',
              position: 'relative',
            }}
          >
            <button
              onClick={() => closeWindow(win.id)}
              style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ff6b6b, #cc1100)', border: '1px solid #aa0000', cursor: 'pointer', padding: 0, flexShrink: 0, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)' }}
            />
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ffdd57, #e6a800)', border: '1px solid #cc8800', flexShrink: 0, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)' }} />
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #69db7c, #15e012)', border: '1px solid #0a9e08', flexShrink: 0, boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)' }} />
            <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#333', letterSpacing: '0.05em', fontWeight: 600, whiteSpace: 'nowrap' }}>
              {win.title}
            </span>
          </div>

          {/* Imagen */}
          <div style={{ width: '100%', height: `${Math.round(win.width * 0.6)}px`, overflow: 'hidden', background: '#fff' }}>
            <img src={win.img} alt={win.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
          </div>

          {/* Barra inferior */}
          <div style={{ background: 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)', padding: '3px 8px', borderTop: '1px solid #999', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '10px', height: '10px', backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)', backgroundSize: '3px 3px', opacity: 0.6 }} />
          </div>
        </div>
      ))}
    </>
  )
}

export default FloatingWindows
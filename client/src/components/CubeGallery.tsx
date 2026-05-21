import { useState, useEffect, useRef } from 'react'

const FACES = [
    { color: '#0c0c0c', label: 'ARCHIVE' },
    { color: '#15e012', label: 'CREATIVE' },
    { color: '#0c0c0c', label: 'DIGITAL' },
    { color: '#15e012', label: 'LIMINAL' },
    ]

    const CubeGallery = () => {
    const [rotY, setRotY] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)
    const lastMouse = useRef({ x: 0 })
    const lastTouch = useRef({ x: 0 })
    const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth <= 480)
        setIsTablet(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        autoRef.current = setInterval(() => {
        if (!isDragging) setRotY(prev => prev - 90)
        }, 5000)
        return () => { if (autoRef.current) clearInterval(autoRef.current) }
    }, [isDragging])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        lastMouse.current = { x: e.clientX }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        const dx = e.clientX - lastMouse.current.x
        setRotY(prev => prev + dx * 0.5)
        lastMouse.current = { x: e.clientX }
    }

    const handleMouseUp = () => setIsDragging(false)

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true)
        lastTouch.current = { x: e.touches[0].clientX }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return
        const dx = e.touches[0].clientX - lastTouch.current.x
        setRotY(prev => prev + dx * 0.5)
        lastTouch.current = { x: e.touches[0].clientX }
    }

    const handleTouchEnd = () => setIsDragging(false)

    const cubeW = isMobile ? 320 : isTablet ? 560 : 800
    const cubeH = Math.round(cubeW * 9 / 16)
    const halfW = cubeW / 2

    const faceStyle = (bg: string): React.CSSProperties => ({
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    })

    const labelStyle = (color: string): React.CSSProperties => ({
        fontFamily: 'var(--font-principal)',
        fontSize: isMobile ? '28px' : isTablet ? '48px' : '72px',
        fontWeight: 700,
        color,
        letterSpacing: '-0.02em',
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
            width: `${cubeW}px`,
            height: `${cubeH}px`,
            perspective: '1400px',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            }}
        >
            <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotY}deg)`,
            transition: isDragging ? 'none' : 'transform 1.2s cubic-bezier(0.76, 0, 0.24, 1)',
            }}>

            {/* Frontal */}
            <div style={{ ...faceStyle(FACES[0].color), transform: `translateZ(${halfW}px)` }}>
                <span style={labelStyle('#f2f2f2')}>{FACES[0].label}</span>
            </div>

            {/* Derecha */}
            <div style={{
                ...faceStyle(FACES[1].color),
                width: `${cubeW}px`,
                left: 0,
                transform: `rotateY(90deg) translateZ(${halfW}px)`,
            }}>
                <span style={labelStyle('#0c0c0c')}>{FACES[1].label}</span>
            </div>

            {/* Trasera */}
            <div style={{
                ...faceStyle(FACES[2].color),
                transform: `rotateY(180deg) translateZ(${halfW}px)`,
            }}>
                <span style={labelStyle('#f2f2f2')}>{FACES[2].label}</span>
            </div>

            {/* Izquierda */}
            <div style={{
                ...faceStyle(FACES[3].color),
                width: `${cubeW}px`,
                left: 0,
                transform: `rotateY(-90deg) translateZ(${halfW}px)`,
            }}>
                <span style={labelStyle('#0c0c0c')}>{FACES[3].label}</span>
            </div>

            </div>
        </div>

        <div style={{
            marginTop: '24px',
            fontFamily: 'var(--font-secundaria)',
            fontSize: '10px',
            color: 'var(--negro)',
            opacity: 0.4,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
        }}>
            Drag to rotate
        </div>
        </div>
    )
}

export default CubeGallery;
import { useState, useEffect, useRef } from 'react'

const FACES = [
    { img: 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779445358/b35cd3f55e8a577831fc0fe1b25eb848_ujlddp.jpg' },
    { img: 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779445358/61bb1e33367282437bbf37fd100b93d7_hyuxzu.jpg' },
    { img: 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779445358/c5fd25c7f6027c5e2f5c1d0902efe0fd_rxmohb.jpg' },
    { img: 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779445358/b2157cc0b1032861897c52ed3366d561_gssq4p.jpg' },
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

    const cubeW = isMobile ? 320 : isTablet ? 560 : 680
    const cubeH = Math.round(cubeW * 9 / 16)
    const halfW = cubeW / 2

const faceStyle = (): React.CSSProperties => ({
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
                <div style={{ ...faceStyle(), transform: `translateZ(${halfW}px)` }}>
                    <img src={FACES[0].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Derecha */}
                <div style={{ ...faceStyle(), width: `${cubeW}px`, left: 0, transform: `rotateY(90deg) translateZ(${halfW}px)` }}>
                    <img src={FACES[1].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Trasera */}
                <div style={{ ...faceStyle(), transform: `rotateY(180deg) translateZ(${halfW}px)` }}>
                    <img src={FACES[2].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Izquierda */}
                <div style={{ ...faceStyle(), width: `${cubeW}px`, left: 0, transform: `rotateY(-90deg) translateZ(${halfW}px)` }}>
                    <img src={FACES[3].img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
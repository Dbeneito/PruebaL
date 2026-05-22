import { useEffect, useState } from 'react'
import CubeGallery from '../../components/CubeGallery'
import FloatingWindows from '../../components/FloatingWindows'

const Landing = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth <= 480)
        setIsTablet(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        setTimeout(() => setVisible(true), 100)
    }, [])

    const isSmall = isMobile || isTablet

    return (
        <div style={{
        width: '100%',
        background: 'var(--blanco)',
        overflowX: 'hidden',
        position: 'relative',
        }}>

        {/* ══ SECCIÓN 1 — HERO ══ */}
        <div style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isSmall ? '80px 20px 60px' : '80px 40px 60px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease',
            zIndex: 1,
            gap: '24px',
        }}>

            {!isSmall && <FloatingWindows />}

            <div style={{ position: 'relative', zIndex: 3 }}>
            <CubeGallery />
            </div>

            {/* Hook debajo del cubo */}
            <p style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '22px',
                color: 'var(--negro)',
                letterSpacing: '-0.02em',
                textAlign: 'center',
                margin: 0,
                marginTop: '48px',
                opacity: 0.7,
                maxWidth: '600px',
                zIndex: 3,
                position: 'relative',
            }}>
                El único archivo que realmente importa.
            </p>

        </div>

        </div>
    )
}

export default Landing
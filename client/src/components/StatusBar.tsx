import { useState, useEffect } from 'react'

interface LocationData {
    city: string
    country: string
    }

    const StatusBar = () => {
    const [location, setLocation] = useState<LocationData>({ city: '...', country: '...' })
    const [time, setTime] = useState('')
    const [coords, setCoords] = useState({ x: 0, y: 0 })
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)

    useEffect(() => {
        fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            setLocation({
            city: data.city || 'Unknown',
            country: data.country_name || 'Unknown'
            })
        })
        .catch(() => {
            setLocation({ city: 'Unknown', country: 'Unknown' })
        })
    }, [])

    useEffect(() => {
        const updateTime = () => {
        const now = new Date()
        const h = String(now.getHours()).padStart(2, '0')
        const m = String(now.getMinutes()).padStart(2, '0')
        const s = String(now.getSeconds()).padStart(2, '0')
        setTime(`${h}:${m}:${s}`)
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
        setCoords({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth <= 480)
        setIsTablet(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const isSmallScreen = isMobile || isTablet

    const textStyle: React.CSSProperties = {
        fontFamily: 'var(--font-secundaria)',
        fontSize: isMobile ? '9px' : '11px',
        color: 'var(--negro)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontWeight: 900,
        whiteSpace: 'nowrap',
    }

    return (
        <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 998,
        height: isMobile ? '28px' : '32px',
        background: 'var(--verde)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        }}>

        {/* Izquierda — ubicación siempre visible */}
        <span style={textStyle}>
            {location.city}, {location.country}
        </span>

        {/* Centro en escritorio — hora / Derecha en móvil y tablet */}
        {isSmallScreen ? (
            <span style={textStyle}>
            {time}
            </span>
        ) : (
            <>
            <span style={{
                ...textStyle,
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
            }}>
                {time}
            </span>

            {/* Derecha — coordenadas solo en escritorio */}
            <span style={textStyle}>
                X: {String(coords.x).padStart(4, '0')} Y: {String(coords.y).padStart(4, '0')}
            </span>
            </>
        )}
        </div>
    )
}

export default StatusBar
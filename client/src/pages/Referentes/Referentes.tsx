import { useState, useEffect } from 'react'
import axios from 'axios'
import FolderIcon from '../../components/FolderIcon'

interface Referent {
    id: number
    name: string
    slug: string
    discipline: string
    origin_country: string
    birth_year: number
    death_year: number | null
}

const Referentes = () => {
    const [referents, setReferents] = useState<Referent[]>([])
    const [loading, setLoading] = useState(true)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth <= 480)
        setIsTablet(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        axios.get('http://localhost:3000/api/referents')
        .then(res => {
            setReferents(res.data)
            setLoading(false)
        })
        .catch(() => setLoading(false))
    }, [])

    const folderSize = isMobile ? 60 : isTablet ? 72 : 90

    return (
        <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--blanco)',
        padding: isMobile ? '90px 16px 60px' : '100px 60px 60px',
        boxSizing: 'border-box',
        }}>

        {/* Header */}
        <div style={{ marginBottom: '60px', borderBottom: '1px solid var(--negro)', paddingBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
            <h1 style={{
                fontFamily: 'var(--font-principal)',
                fontSize: isMobile ? 'clamp(48px, 14vw, 72px)' : 'clamp(64px, 8vw, 100px)',
                fontWeight: 700,
                color: 'var(--negro)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                margin: 0,
            }}>
                REFERENTES
            </h1>
            <p style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '11px',
                color: '#888',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginTop: '12px',
            }}>
                Creativos que han marcado la historia del diseño
            </p>
            </div>
            <span style={{
            fontFamily: 'var(--font-secundaria)',
            fontSize: '11px',
            color: '#888',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            }}>
            {referents.length} referentes
            </span>
        </div>

        {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
            <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Cargando...
            </span>
            </div>
        ) : (
            <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile
                ? 'repeat(3, 1fr)'
                : isTablet
                ? 'repeat(4, 1fr)'
                : 'repeat(6, 1fr)',
            gap: isMobile ? '16px' : '24px',
            }}>
            {referents.map(ref => (
                <FolderIcon
                key={ref.slug}
                name={ref.name.replace(' ', '_')}
                slug={ref.slug}
                size={folderSize}
                />
            ))}
            </div>
        )}
        </div>
    )
}

export default Referentes
import { useState, useEffect } from 'react'
import axios from 'axios'
import FolderIcon from '../../components/FolderIcon'
import { API_URL } from '../../config/api'

interface Referent {
    id: number
    name: string
    slug: string
    discipline: string
    origin_country: string
    birth_year: number
    death_year: number | null
}

// Rotaciones predefinidas para que no sean caóticas
const ROTATIONS = [-3, 2, -5, 4, -2, 6, -4, 3, -6, 2, -3, 5]

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
        axios.get(`${API_URL}/api/referents`)
        .then(res => {
            setReferents(res.data)
            setLoading(false)
        })
        .catch(() => setLoading(false))
    }, [])

    const folderSize = isMobile ? 64 : isTablet ? 80 : 100

    return (
        <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--blanco)',
        padding: isMobile ? '90px 16px 60px' : '100px 60px 60px',
        boxSizing: 'border-box',
        }}>

        {/* Header */}
        <div style={{
            marginBottom: '60px',
            borderBottom: '1px solid var(--negro)',
            paddingBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '12px',
        }}>
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
                marginBottom: 0,
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
                ? 'repeat(2, 1fr)'
                : isTablet
                ? 'repeat(3, 1fr)'
                : 'repeat(5, 1fr)',
            gap: isMobile ? '24px 16px' : '48px 24px',
            padding: isMobile ? '16px 0' : '32px 0',
            }}>
            {referents.map((ref, i) => (
                <div
                key={ref.slug}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: i % 2 === 1 ? (isMobile ? '16px' : '32px') : '0',
                }}
                >
                <FolderIcon
                    name={ref.name.replace(/ /g, '_')}
                    slug={ref.slug}
                    size={folderSize}
                    rotation={ROTATIONS[i % ROTATIONS.length]}
                    shadow
                />
                </div>
            ))}
            </div>
        )}
        </div>
    )
}

export default Referentes
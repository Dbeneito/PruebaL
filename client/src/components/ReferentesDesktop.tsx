import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import FolderIcon from './FolderIcon'
import { API_URL } from '../config/api'

interface Referent {
    id: number
    name: string
    slug: string
    discipline: string
}

const POSITIONS = [
    { x: 6, y: 8, size: 100, rotation: -4 },
    { x: 22, y: 52, size: 85, rotation: 3 },
    { x: 40, y: 12, size: 110, rotation: -2 },
    { x: 58, y: 50, size: 90, rotation: 5 },
    { x: 74, y: 10, size: 95, rotation: -6 },
    ]

const ReferentesDesktop = () => {
    const [referents, setReferents] = useState<Referent[]>([])

    useEffect(() => {
        axios.get(`${API_URL}/api/referents`)
        .then(res => setReferents(res.data.slice(0, 5)))
        .catch(() => {})
    }, [])

    return (
        <div style={{
        width: '100%',
        position: 'relative',
        height: '420px',
        background: 'var(--blanco)',
        }}>
        {referents.map((ref, i) => {
            const pos = POSITIONS[i]
            if (!pos) return null
            return (
            <div
                key={ref.slug}
                style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                }}
            >
                <FolderIcon
                name={ref.name.replace(/ /g, '_')}
                slug={ref.slug}
                size={pos.size}
                rotation={pos.rotation}
                shadow
                />
            </div>
            )
        })}

        {/* Botón ver todos */}
        <Link
            to="/referentes"
            style={{
            position: 'absolute',
            bottom: '24px',
            right: '32px',
            fontFamily: 'var(--font-secundaria)',
            fontSize: '11px',
            color: 'var(--negro)',
            textDecoration: 'none',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            opacity: 0.5,
            borderBottom: '1px solid var(--negro)',
            paddingBottom: '2px',
            transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}
        >
            Ver todos los referentes →
        </Link>
        </div>
    )
}

export default ReferentesDesktop
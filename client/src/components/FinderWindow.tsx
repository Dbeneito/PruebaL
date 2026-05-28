import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import MacWindow from './MacWindows'
import { API_URL } from '../config/api'

interface Project {
    id: number
    title: string
    cover_url: string
}

const toFileName = (title: string) =>
    title.trim().replace(/\s+/g, '_') + '.jpg'

const FinderWindow = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [isSmall, setIsSmall] = useState(window.innerWidth <= 768)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)

    useEffect(() => {
        const handleResize = () => {
        setIsSmall(window.innerWidth <= 768)
        setIsMobile(window.innerWidth <= 480)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        axios
        .get(`${API_URL}/api/projects`)
        .then(res => setProjects(res.data))
        .catch(() => {})
    }, [])

return (
    <MacWindow
        title="LIMINAL — Archivo"
        width="100%"
        rightAction={
            <Link
            to="/archivo"
            style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '10px',
                color: '#555',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
            }}
            >
            {isSmall ? '→' : 'Ver todo →'}
            </Link>
        }
        >
        <div style={{ margin: '-24px' }}>
            
            {/* Cuerpo */}
            <div
            className={`grid bg-[#f0f0f0] ${
                isSmall
                ? 'grid-cols-1 min-h-[320px]'
                : 'grid-cols-1 min-h-[480px]'
            }`}
            >
            {/* Grid proyectos */}
            <div
                className={`bg-[#f5f5f5] overflow-y-auto grid content-start ${
                isSmall
                    ? 'p-3 gap-2 max-h-[320px] grid-cols-2'
                    : 'p-5 gap-3 max-h-[480px] grid-cols-6'
                }`}
            >
                {projects.length > 0 ? (
                projects.map(project => (
                    <Link
                    key={project.id}
                    to={`/proyecto/${project.id}`}
                    style={{
                        textDecoration: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        padding: isMobile ? '6px 2px' : '8px 4px',
                        transition: 'background 0.15s',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={e =>
                        (e.currentTarget.style.background =
                        'rgba(0, 255, 26, 0.34)')
                    }
                    onMouseLeave={e =>
                        (e.currentTarget.style.background = 'transparent')
                    }
                    >
                    <div
                        style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.15)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                        }}
                    >
                        <img
                        src={
                            project.cover_url ||
                            `https://picsum.photos/seed/${project.id}/400/300`
                        }
                        alt={project.title}
                        draggable={false}
                        onDragStart={e => e.preventDefault()}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            border: '5px solid white',
                        }}
                        />
                    </div>
                    <p
                        style={{
                        fontFamily: 'var(--font-secundaria)',
                        fontSize: isMobile ? '9px' : '10px',
                        color: '#222',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                        margin: 0,
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        }}
                    >
                        {toFileName(project.title)}
                    </p>
                    </Link>
                ))
                ) : (
                <div
                    style={{
                    gridColumn: '1 / -1',
                    padding: '32px',
                    textAlign: 'center',
                    }}
                >
                    <p
                    style={{
                        fontFamily: 'var(--font-secundaria)',
                        fontSize: '11px',
                        color: '#888',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        margin: 0,
                    }}
                    >
                    Sin proyectos
                    </p>
                </div>
                )}
            </div>
            </div>

            {/* Barra inferior */}
            <div
            style={{
                background: 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)',
                padding: '4px 16px',
                borderTop: '1px solid #999',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
            >
            <span
                style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '10px',
                color: '#555',
                letterSpacing: '0.05em',
                }}
            >
                {projects.length} proyectos
            </span>
            <div
                style={{
                width: '10px',
                height: '10px',
                backgroundImage:
                    'radial-gradient(circle, #999 1px, transparent 1px)',
                backgroundSize: '3px 3px',
                opacity: 0.6,
                }}
            />
            </div>
        </div>
    </MacWindow>
    )
}

export default FinderWindow
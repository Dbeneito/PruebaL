import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Button from '../../components/Button'
import { API_URL } from '../../config/api'

interface Project {
    id: number
    title: string
    cover_url: string
    username: string
    likes_count: number
    published_at: string
}

interface Creator {
    id: number
    username: string
    avatar_url: string | null
    bio: string | null
    discipline: string | null
    location: string | null
    projects_count: number
    followers_count: number
}

type Section = 'tendencias' | 'recientes' | 'creadores'

const DISCIPLINES = ['Todos', 'Diseño Gráfico', 'Moda', 'Arquitectura', 'Ilustración', 'Tipografía', 'Motion', 'Fotografía', 'Branding', 'Arte']

const Comunidad = () => {
    const [projects, setProjects] = useState<Project[]>([])
    const [creators, setCreators] = useState<Creator[]>([])
    const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
    const [section, setSection] = useState<Section>('tendencias')
    const [discipline, setDiscipline] = useState('Todos')
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        axios.get(`${API_URL}/api/projects`)
        .then(res => setProjects(res.data))
        .catch(() => {})

        axios.get(`${API_URL}/api/users/featured`)
        .then(res => {
            setCreators(res.data)
            if (res.data.length > 0) setSelectedCreator(res.data[0])
        })
        .catch(() => {})
    }, [])

    const trending = [...projects].sort((a, b) => b.likes_count - a.likes_count).slice(0, 6)
    const recent = [...projects].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0, 6)
    const filteredCreators = creators.filter(c => discipline === 'Todos' || c.discipline === discipline)

    const labelStyle: React.CSSProperties = {
        fontFamily: 'var(--font-secundaria)',
        fontSize: '10px',
        color: '#888',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    }

    const ProjectGrid = ({ items }: { items: Project[] }) => (
        <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: 'var(--negro)',
        border: '1px solid var(--negro)',
        }}>
        {items.map(p => (
            <Link key={p.id} to={`/proyecto/${p.id}`} style={{ textDecoration: 'none', display: 'block', position: 'relative', overflow: 'hidden', background: 'var(--blanco)' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden' }}>
                <img
                src={p.cover_url || `https://picsum.photos/seed/${p.id}/400/300`}
                alt={p.title}
                draggable={false}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '6px 8px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                }}>
                <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: 'white', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    {p.title}
                </span>
                <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: 'var(--verde)', flexShrink: 0 }}>
                    ★ {p.likes_count}
                </span>
                </div>
            </div>
            </Link>
        ))}
        </div>
    )

    const renderRight = () => {
        switch (section) {
        case 'tendencias':
            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
                <span style={{ fontFamily: 'var(--font-principal)', fontSize: '28px', fontWeight: 700, color: 'var(--negro)', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Tendencias
                </span>
                <ProjectGrid items={trending} />
            </div>
            )
        case 'recientes':
            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px' }}>
                <span style={{ fontFamily: 'var(--font-principal)', fontSize: '28px', fontWeight: 700, color: 'var(--negro)', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1 }}>
                Recientes
                </span>
                <ProjectGrid items={recent} />
            </div>
            )
        case 'creadores':
            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {/* Filtros disciplina */}
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--negro)', display: 'flex', gap: '4px', flexWrap: 'wrap', background: 'var(--blanco)' }}>
                {DISCIPLINES.map(d => (
                    <button
                    key={d}
                    onClick={() => setDiscipline(d)}
                    style={{
                        fontFamily: 'var(--font-secundaria)',
                        fontSize: '9px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        border: '1px solid var(--negro)',
                        background: discipline === d ? 'var(--negro)' : 'transparent',
                        color: discipline === d ? 'var(--blanco)' : 'var(--negro)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                    }}
                    >
                    {d}
                    </button>
                ))}
                </div>

                {/* Lista creadores */}
                <div style={{ overflowY: 'auto', flex: 1 }}>
                {filteredCreators.map((creator, i) => (
                    <div
                    key={creator.id}
                    onClick={() => setSelectedCreator(creator)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                        background: selectedCreator?.id === creator.id ? 'rgba(21,224,18,0.08)' : 'transparent',
                        transition: 'background 0.15s',
                        position: 'relative',
                    }}
                    onMouseEnter={e => { if (selectedCreator?.id !== creator.id) e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
                    onMouseLeave={e => { if (selectedCreator?.id !== creator.id) e.currentTarget.style.background = 'transparent' }}
                    >
                    {selectedCreator?.id === creator.id && (
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'var(--verde)' }} />
                    )}
                    <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#ccc', width: '20px', flexShrink: 0, textAlign: 'center' }}>
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d0d0d0', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: selectedCreator?.id === creator.id ? '2px solid var(--verde)' : '2px solid transparent' }}>
                        {creator.avatar_url
                        ? <img src={creator.avatar_url} alt={creator.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontFamily: 'var(--font-principal)', fontSize: '16px', fontWeight: 700, color: '#888' }}>{creator.username[0].toUpperCase()}</span>
                        }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '12px', fontWeight: 700, color: 'var(--negro)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        @{creator.username}
                        </p>
                        <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', margin: 0, letterSpacing: '0.05em' }}>
                        {creator.discipline || 'Creativo'}{creator.location ? ` · ${creator.location}` : ''}
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0, gap: '2px' }}>
                        <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', fontWeight: 700, color: 'var(--negro)' }}>
                        {creator.projects_count} proyectos
                        </span>
                        <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: 'var(--verde)', fontWeight: 600 }}>
                        {creator.followers_count} seguidores
                        </span>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )
        }
    }

    return (
        <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        background: 'var(--blanco)',
        overflow: 'hidden',
        paddingTop: '80px',
        boxSizing: 'border-box',
        }}>

        {/* ══ PANEL IZQUIERDO ══ */}
        <div style={{
            width: isMobile ? '100%' : '40%',
            height: isMobile ? '50vh' : '100%',
            borderRight: isMobile ? 'none' : '1px solid var(--negro)',
            borderBottom: isMobile ? '1px solid var(--negro)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flexShrink: 0,
        }}>
            {selectedCreator ? (
            <>
                {/* Avatar grande */}
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#e0e0e0', minHeight: 0 }}>
                {selectedCreator.avatar_url ? (
                    <img src={selectedCreator.avatar_url} alt={selectedCreator.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e0e0, #c8c8c8)' }}>
                    <span style={{ fontFamily: 'var(--font-principal)', fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 700, color: '#aaa', letterSpacing: '-0.05em' }}>
                        {selectedCreator.username[0].toUpperCase()}
                    </span>
                    </div>
                )}
                {selectedCreator.discipline && (
                    <div style={{ position: 'absolute', top: '12px', left: '16px', background: 'var(--verde)', padding: '3px 10px' }}>
                    <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', fontWeight: 700, color: 'var(--negro)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {selectedCreator.discipline}
                    </span>
                    </div>
                )}
                </div>

                {/* Info */}
                <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', borderTop: '1px solid var(--negro)', background: 'var(--blanco)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                    <p style={{ fontFamily: 'var(--font-principal)', fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: 'var(--negro)', margin: 0, letterSpacing: '-0.02em' }}>
                        @{selectedCreator.username}
                    </p>
                    {selectedCreator.location && (
                        <p style={{ ...labelStyle, marginTop: '2px' }}>{selectedCreator.location}</p>
                    )}
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-principal)', fontSize: '18px', fontWeight: 700, color: 'var(--negro)', margin: 0, lineHeight: 1 }}>{selectedCreator.projects_count}</p>
                        <p style={{ ...labelStyle, margin: '2px 0 0' }}>Proyectos</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-principal)', fontSize: '18px', fontWeight: 700, color: 'var(--verde)', margin: 0, lineHeight: 1 }}>{selectedCreator.followers_count}</p>
                        <p style={{ ...labelStyle, margin: '2px 0 0' }}>Seguidores</p>
                    </div>
                    </div>
                </div>

                {selectedCreator.bio && (
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#666', lineHeight: 1.6, margin: '0 0 10px' }}>
                    {selectedCreator.bio}
                    </p>
                )}

                <Link to={`/perfil/${selectedCreator.username}`} style={{ textDecoration: 'none' }}>
                    <Button size="sm" color="#0c0c0c" shadowColor="0,0,0" textColor="white" fullWidth>
                    Ver perfil completo
                    </Button>
                </Link>
                </div>
            </>
            ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ ...labelStyle }}>Selecciona un creador</span>
            </div>
            )}
        </div>

        {/* ══ PANEL DERECHO ══ */}
        <div style={{
            flex: 1,
            height: isMobile ? '50vh' : '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: 0,
        }}>

            {/* Navbar secciones */}
            <div style={{
            padding: '0',
            borderBottom: '1px solid var(--negro)',
            display: 'flex',
            background: 'var(--blanco)',
            flexShrink: 0,
            }}>
            {([
                { id: 'tendencias', label: 'Tendencias' },
                { id: 'recientes', label: 'Recientes' },
                { id: 'creadores', label: 'Creadores' },
            ] as { id: Section, label: string }[]).map((s, i) => (
                <button
                key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                    flex: 1,
                    padding: '12px 8px',
                    fontFamily: 'var(--font-secundaria)',
                    fontSize: '11px',
                    fontWeight: section === s.id ? 700 : 400,
                    color: section === s.id ? 'var(--negro)' : '#888',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: section === s.id ? '2px solid var(--verde)' : '2px solid transparent',
                    borderRight: i < 2 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 0.15s',
                }}
                >
                {s.label}
                </button>
            ))}
            </div>

            {/* Contenido */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {renderRight()}
            </div>

            {/* Footer */}
            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--negro)', background: 'var(--blanco)', flexShrink: 0, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ ...labelStyle }}>{projects.length} proyectos · {creators.length} creadores</span>
            <Link to="/registro" style={{ ...labelStyle, textDecoration: 'none', color: 'var(--verde)', fontWeight: 700 }}>
                Unirse →
            </Link>
            </div>

        </div>
        </div>
    )
}

export default Comunidad
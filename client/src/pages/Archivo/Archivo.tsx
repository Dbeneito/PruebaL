import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../config/api'

interface Project {
  id: number
  title: string
  description: string
  cover_url: string
  username: string
  avatar_url: string | null
  likes_count: number
  categories: { id: number; name: string; slug: string }[]
}

const SORT_OPTIONS = ['Recientes', 'Más_NoLikes', 'Menos_NoLikes']

const Archivo = () => {
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [selected, setSelected] = useState<Project | null>(null)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [sortBy, setSortBy] = useState('Recientes')
  const [liked, setLiked] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    axios.get(`${API_URL}/api/projects`)
      .then(res => {
        setProjects(res.data)
        if (res.data.length > 0) setSelected(res.data[0])
      })
      .catch(() => {})
  }, [])

  const categories = ['Todos', ...Array.from(new Set(
    projects.flatMap(p => p.categories?.map(c => c.name) ?? [])
  ))]

  const filtered = projects
    .filter(p => activeCategory === 'Todos' || p.categories?.some(c => c.name === activeCategory))
    .sort((a, b) => {
      if (sortBy === 'Más_NoLikes') return b.likes_count - a.likes_count
      if (sortBy === 'Menos_NoLikes') return a.likes_count - b.likes_count
      return 0
    })

  const handleLike = async () => {
    if (!token || !selected) return
    try {
      await axios.post(`${API_URL}/api/projects/${selected.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLiked(!liked)
      setProjects(prev => prev.map(p =>
        p.id === selected.id
          ? { ...p, likes_count: liked ? p.likes_count - 1 : p.likes_count + 1 }
          : p
      ))
      setSelected(prev => prev ? {
        ...prev,
        likes_count: liked ? prev.likes_count - 1 : prev.likes_count + 1
      } : prev)
    } catch {}
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '10px',
    color: 'var(--negro)',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    opacity: 0.4,
  }

  const valueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    color: 'var(--negro)',
    letterSpacing: '0.05em',
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
        width: isMobile ? '100%' : '45%',
        height: isMobile ? '50vh' : '100%',
        borderRight: isMobile ? 'none' : '1px solid var(--negro)',
        borderBottom: isMobile ? '1px solid var(--negro)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
        minHeight: 0,
      }}>
        {selected ? (
          <>
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
              <img
                src={selected.cover_url || `https://picsum.photos/seed/${selected.id}/800/600`}
                alt={selected.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                draggable={false}
              />
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '16px',
                fontFamily: 'var(--font-secundaria)',
                fontSize: '11px',
                color: 'var(--blanco)',
                letterSpacing: '0.15em',
                background: 'rgba(0,0,0,0.5)',
                padding: '2px 8px',
              }}>
                {String(selected.id).padStart(3, '0')}
              </span>
            </div>

            <div style={{
              padding: isMobile ? '12px 16px' : '20px 24px',
              borderTop: '1px solid var(--negro)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'var(--blanco)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ ...valueStyle, fontSize: isMobile ? '14px' : '18px', fontWeight: 700, margin: 0 }}>
                    {selected.title}
                  </p>
                  <p style={{ ...labelStyle, marginTop: '4px' }}>@{selected.username}</p>
                </div>
                <button
                  onClick={handleLike}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: liked ? 'var(--negro)' : 'transparent',
                    border: '1px solid var(--negro)',
                    padding: '6px 12px',
                    cursor: token ? 'pointer' : 'default',
                    fontFamily: 'var(--font-secundaria)',
                    fontSize: '11px',
                    color: liked ? 'var(--blanco)' : 'var(--negro)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                >
                  <span>{liked ? '★' : '☆'}</span>
                  <span>{selected.likes_count} NoLikes</span>
                </button>
              </div>

              {selected.description && (
                <p style={{ ...valueStyle, opacity: 0.6, lineHeight: 1.6, margin: 0, fontSize: '12px' }}>
                  {selected.description}
                </p>
              )}

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selected.categories?.map(cat => (
                  <span key={cat.id} style={{
                    fontFamily: 'var(--font-secundaria)',
                    fontSize: '10px',
                    color: 'var(--negro)',
                    border: '1px solid var(--negro)',
                    padding: '2px 8px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={labelStyle}>Selecciona un proyecto</p>
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

        {/* Toolbar */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--negro)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          background: 'var(--blanco)',
          flexShrink: 0,
        }}>
          <span style={{ ...labelStyle, opacity: 1, cursor: 'pointer' }}>
            Select: all
          </span>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1, justifyContent: 'center' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--font-secundaria)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  border: '1px solid var(--negro)',
                  background: activeCategory === cat ? 'var(--negro)' : 'transparent',
                  color: activeCategory === cat ? 'var(--blanco)' : 'var(--negro)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              fontFamily: 'var(--font-secundaria)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              padding: '3px 8px',
              border: '1px solid var(--negro)',
              background: 'var(--blanco)',
              color: 'var(--negro)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
            ))}
          </select>
        </div>

        {/* Grid scroll */}
        <div style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'var(--negro)',
          alignContent: 'start',
        }}>
          {filtered.map(project => (
  <div
    key={project.id}
    onClick={() => setSelected(project)}
    style={{
      position: 'relative',
      width: '100%',
      paddingBottom: '75%',
      overflow: 'hidden',
      cursor: 'pointer',
      background: 'var(--blanco)',
    }}
  >
    <img
      src={project.cover_url || `https://picsum.photos/seed/${project.id}/400/300`}
      alt={project.title}
      draggable={false}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'opacity 0.2s',
        opacity: selected?.id === project.id ? 0.6 : 1,
      }}
    />

              {selected?.id === project.id && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  border: '3px solid var(--verde)',
                  pointerEvents: 'none',
                }} />
              )}

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '6px 8px',
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: 'var(--font-secundaria)',
                  fontSize: '9px',
                  color: 'var(--blanco)',
                  letterSpacing: '0.08em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '70%',
                }}>
                  {project.title}
                </span>
                <span style={{
                  fontFamily: 'var(--font-secundaria)',
                  fontSize: '9px',
                  color: 'var(--verde)',
                  letterSpacing: '0.08em',
                  flexShrink: 0,
                }}>
                  ★ {project.likes_count}
                </span>
              </div>

              <span style={{
                position: 'absolute',
                top: '6px',
                left: '8px',
                fontFamily: 'var(--font-secundaria)',
                fontSize: '9px',
                color: 'var(--blanco)',
                letterSpacing: '0.1em',
                background: 'rgba(0,0,0,0.5)',
                padding: '1px 5px',
              }}>
                {String(project.id).padStart(3, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Archivo
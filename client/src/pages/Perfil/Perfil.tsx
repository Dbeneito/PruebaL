import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import MacWindow from '../../components/MacWindows'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import { API_URL } from '../../config/api'

interface Project {
  id: number
  title: string
  cover_url: string
  likes_count: number
  published_at: string
}

interface UserProfile {
  id: number
  username: string
  bio: string | null
  avatar_url: string | null
  discipline: string | null
  location: string | null
  birth_year: number | null
  created_at: string
  followers_count: number
  following_count: number
  projects: Project[]
}

const toFileName = (title: string) =>
  title.trim().replace(/\s+/g, '_') + '.jpg'

const Perfil = () => {
  const { username } = useParams<{ username: string }>()
  const { token, user: authUser } = useAuth()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [following, setFollowing] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!username) return
    setLoading(true)
    axios.get(`${API_URL}/api/users/${username}`)
      .then(res => {
        setUser(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Usuario no encontrado')
        setLoading(false)
      })
  }, [username])

  const handleFollow = async () => {
    if (!token || !user) return
    try {
      await axios.post(`${API_URL}/api/users/${user.id}/follow`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFollowing(!following)
      setUser(prev => prev ? {
        ...prev,
        followers_count: following ? prev.followers_count - 1 : prev.followers_count + 1
      } : prev)
    } catch {}
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '10px',
    color: '#888',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '2px',
  }

  const valueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    color: '#222',
    letterSpacing: '0.03em',
  }

  if (loading) return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blanco)', paddingTop: '80px' }}>
      <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cargando...</span>
    </div>
  )

  if (error || !user) return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blanco)', paddingTop: '80px' }}>
      <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#cc1100', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{error}</span>
    </div>
  )

  const age = user.birth_year ? new Date().getFullYear() - user.birth_year : null
  const joinedYear = new Date(user.created_at).getFullYear()
  const isOwnProfile = authUser?.username === username

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--blanco)',
      padding: isMobile ? '90px 16px 60px' : '100px 24px 60px',
      boxSizing: 'border-box',
    }}>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'var(--font-principal)',
          fontSize: isMobile ? 'clamp(48px, 15vw, 72px)' : 'clamp(64px, 8vw, 100px)',
          fontWeight: 700,
          color: 'var(--negro)',
          lineHeight: 0.9,
          letterSpacing: '-0.03em',
          textTransform: 'lowercase',
          margin: 0,
        }}>
          @{user.username}
        </h1>
      </div>

      {/* Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '16px',
        alignItems: 'start',
        width: '100%',
      }}>

        {/* ══ COLUMNA IZQUIERDA — Info ══ */}
        <MacWindow title={`${user.username} — info`} width="100%">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', margin: '-24px' }}>

            {/* Avatar */}
            <div style={{
              width: '100%',
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #e0e0e0, #c8c8c8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderBottom: '1px solid #ccc',
            }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-principal)', fontSize: '80px', fontWeight: 700, color: '#aaa' }}>
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Info rows */}
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <div style={{ paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                <span style={labelStyle}>Usuario</span>
                <span style={{ ...valueStyle, fontWeight: 700, fontSize: '14px' }}>@{user.username}</span>
              </div>

              <div style={{ paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                <span style={labelStyle}>Bio</span>
                <p style={{ ...valueStyle, lineHeight: 1.7, margin: 0 }}>
                  {user.bio || '—'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                <div>
                  <span style={labelStyle}>Disciplina</span>
                  <span style={valueStyle}>{user.discipline || '—'}</span>
                </div>
                <div>
                  <span style={labelStyle}>Ubicación</span>
                  <span style={valueStyle}>{user.location || '—'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                <div>
                  <span style={labelStyle}>Edad</span>
                  <span style={valueStyle}>{age ? `${age} años` : '—'}</span>
                </div>
                <div>
                  <span style={labelStyle}>Miembro desde</span>
                  <span style={valueStyle}>{joinedYear}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
                {[
                  { label: 'Proyectos', value: user.projects?.length ?? 0 },
                  { label: 'Seguidores', value: user.followers_count },
                  { label: 'Siguiendo', value: user.following_count },
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center', background: '#e8e8e8', borderRadius: '4px', padding: '8px 4px', border: '1px solid #d0d0d0' }}>
                    <p style={{ fontFamily: 'var(--font-principal)', fontSize: '22px', fontWeight: 700, color: 'var(--negro)', margin: 0, lineHeight: 1 }}>
                      {stat.value}
                    </p>
                    <p style={{ ...labelStyle, margin: '4px 0 0', textAlign: 'center' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {!isOwnProfile && token && (
                <Button
                  size="sm"
                  fullWidth
                  color={following ? '#0c0c0c' : '#15e012'}
                  shadowColor={following ? '0,0,0' : '21,224,18'}
                  textColor="white"
                  unfollowMode={following}
                  onClick={handleFollow}
                >
                  {following ? 'Siguiendo' : 'Seguir'}
                </Button>
              )}

              {isOwnProfile && (
                <Link to="/mi-perfil" style={{ textDecoration: 'none' }}>
                  <Button size="sm" fullWidth color="#0c0c0c" shadowColor="0,0,0">
                    Editar perfil
                  </Button>
                </Link>
              )}

            </div>
          </div>
        </MacWindow>

        {/* ══ COLUMNA DERECHA — Proyectos ══ */}
        <MacWindow title={`${user.username} — proyectos`} width="100%">
          <div style={{ margin: '-24px' }}>

            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #ccc',
              background: 'linear-gradient(to bottom, #e8e8e8, #d8d8d8)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ ...labelStyle, margin: 0 }}>
                {user.projects?.length ?? 0} proyectos publicados
              </span>
            </div>

            {user.projects && user.projects.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1px',
                background: '#ccc',
              }}>
                {user.projects.map(project => (
                  <Link
                    key={project.id}
                    to={`/proyecto/${project.id}`}
                    style={{ textDecoration: 'none', display: 'block', background: '#f5f5f5' }}
                  >
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden' }}>
                      <img
                        src={project.cover_url || `https://picsum.photos/seed/${project.id}/400/300`}
                        alt={project.title}
                        draggable={false}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        padding: '6px 8px',
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: '#fff', letterSpacing: '0.05em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                          {toFileName(project.title)}
                        </span>
                        <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: 'var(--verde)', flexShrink: 0 }}>
                          ★ {project.likes_count}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <p style={{ ...labelStyle, textAlign: 'center' }}>
                  Este usuario no ha publicado proyectos todavía
                </p>
              </div>
            )}

          </div>
        </MacWindow>

      </div>
    </div>
  )
}

export default Perfil
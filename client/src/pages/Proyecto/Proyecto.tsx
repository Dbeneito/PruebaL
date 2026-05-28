import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import MacWindow from '../../components/MacWindows'
import Button from '../../components/Button'
import { API_URL } from '../../config/api'

interface Comment {
  id: number
  content: string
  created_at: string
  author_id: number
  username: string
  avatar_url: string | null
}

interface Project {
  id: number
  title: string
  description: string
  cover_url: string
  username: string
  avatar_url: string | null
  likes_count: number
  comments_count: number
  published_at: string
  categories: { id: number; name: string; slug: string }[]
  images: { id: number; image_url: string; order_index: number }[]
  comments: Comment[]
}

const Proyecto = () => {
  const { id } = useParams<{ id: string }>()
  const { token, user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedImg, setSelectedImg] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axios.get(`${API_URL}/api/projects/${id}`)
      .then(res => {
        setProject(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Proyecto no encontrado')
        setLoading(false)
      })
  }, [id])

  const handleLike = async () => {
    if (!token || !project) return
    try {
      await axios.post(`${API_URL}/api/projects/${project.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLiked(!liked)
      setProject(prev => prev ? {
        ...prev,
        likes_count: liked ? prev.likes_count - 1 : prev.likes_count + 1
      } : prev)
    } catch {}
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !project || !comment.trim()) return
    setSubmitting(true)
    try {
      await axios.post(`${API_URL}/api/projects/${project.id}/comments`, { content: comment }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setProject(prev => prev ? {
        ...prev,
        comments: [...prev.comments, {
          id: Date.now(),
          content: comment,
          created_at: new Date().toISOString(),
          author_id: user!.id,
          username: user!.username,
          avatar_url: null,
        }]
      } : prev)
      setComment('')
    } catch {}
    setSubmitting(false)
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '10px',
    color: '#888',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '4px',
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

  if (error || !project) return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blanco)', paddingTop: '80px' }}>
      <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#cc1100', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{error}</span>
    </div>
  )

  const allImages = [
    { image_url: project.cover_url, order_index: -1 },
    ...project.images
  ].filter(img => img.image_url)

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--blanco)',
      padding: isMobile ? '90px 16px 60px' : '100px 24px 60px',
      boxSizing: 'border-box',
    }}>

      {/* Título */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-principal)',
          fontSize: isMobile ? 'clamp(40px, 12vw, 64px)' : 'clamp(56px, 7vw, 96px)',
          fontWeight: 700,
          color: 'var(--negro)',
          lineHeight: 0.9,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          {project.title}
        </h1>
        <p style={{ ...valueStyle, opacity: 0.5, marginTop: '8px' }}>
          LMN_{String(project.id).padStart(3, '0')} — {new Date(project.published_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Layout principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 340px',
        gap: '16px',
        alignItems: 'start',
      }}>

        {/* ══ COLUMNA IZQUIERDA — Imágenes ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* Imagen principal */}
          <MacWindow title={`${project.title} — imagen ${selectedImg + 1}/${allImages.length}`} width="100%">
            <div style={{ margin: '-24px' }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '66%', overflow: 'hidden', background: '#e0e0e0' }}>
                <img
                  src={allImages[selectedImg]?.image_url || `https://picsum.photos/seed/${project.id}/800/600`}
                  alt={project.title}
                  draggable={false}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </MacWindow>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '4px 0' }}>
              {allImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  style={{
                    flexShrink: 0,
                    width: '72px',
                    height: '54px',
                    overflow: 'hidden',
                    border: i === selectedImg ? '2px solid var(--verde)' : '2px solid transparent',
                    cursor: 'pointer',
                    borderRadius: '2px',
                  }}
                >
                  <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
                </div>
              ))}
            </div>
          )}

          {/* Comentarios */}
          <MacWindow title="Comentarios" width="100%">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {project.comments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                  {project.comments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d0d0d0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-principal)', fontSize: '14px', fontWeight: 700, color: '#888' }}>
                          {c.username[0].toUpperCase()}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Link to={`/perfil/${c.username}`} style={{ ...valueStyle, fontWeight: 700, textDecoration: 'none', fontSize: '11px' }}>
                            @{c.username}
                          </Link>
                          <span style={{ ...labelStyle, marginBottom: 0 }}>
                            {new Date(c.created_at).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <p style={{ ...valueStyle, margin: 0, lineHeight: 1.6 }}>{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ ...labelStyle, textAlign: 'center', padding: '16px 0' }}>
                  Sin comentarios todavía
                </p>
              )}

              {token ? (
                <form onSubmit={handleComment} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      fontFamily: 'var(--font-secundaria)',
                      fontSize: '12px',
                      color: '#222',
                      background: 'white',
                      border: '1px solid #bbb',
                      borderRadius: '4px',
                      outline: 'none',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
                    }}
                    required
                  />
                  <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)">
                    {submitting ? '...' : 'Enviar'}
                  </Button>
                </form>
              ) : (
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button size="sm" color="#0c0c0c" shadowColor="0,0,0" textColor="white" fullWidth>
                    Inicia sesión para comentar
                  </Button>
                </Link>
              )}

            </div>
          </MacWindow>
        </div>

        {/* ══ COLUMNA DERECHA — Info ══ */}
        <MacWindow title="Info del proyecto" width="100%">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Autor */}
            <div style={{ paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
              <span style={labelStyle}>Autor</span>
              <Link to={`/perfil/${project.username}`} style={{ textDecoration: 'none' }}>
                <span style={{ ...valueStyle, fontWeight: 700, color: 'var(--negro)' }}>@{project.username}</span>
              </Link>
            </div>

            {/* Descripción */}
            <div style={{ paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
              <span style={labelStyle}>Descripción</span>
              <p style={{ ...valueStyle, lineHeight: 1.7, margin: 0 }}>
                {project.description || '—'}
              </p>
            </div>

            {/* Categorías */}
            <div style={{ paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
              <span style={labelStyle}>Categorías</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {project.categories?.map(cat => (
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

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #ddd' }}>
              <div style={{ textAlign: 'center', background: '#e8e8e8', borderRadius: '4px', padding: '10px', border: '1px solid #d0d0d0' }}>
                <p style={{ fontFamily: 'var(--font-principal)', fontSize: '24px', fontWeight: 700, color: 'var(--negro)', margin: 0, lineHeight: 1 }}>
                  {project.likes_count}
                </p>
                <p style={{ ...labelStyle, margin: '4px 0 0', textAlign: 'center' }}>NoLikes</p>
              </div>
              <div style={{ textAlign: 'center', background: '#e8e8e8', borderRadius: '4px', padding: '10px', border: '1px solid #d0d0d0' }}>
                <p style={{ fontFamily: 'var(--font-principal)', fontSize: '24px', fontWeight: 700, color: 'var(--negro)', margin: 0, lineHeight: 1 }}>
                  {project.comments.length}
                </p>
                <p style={{ ...labelStyle, margin: '4px 0 0', textAlign: 'center' }}>Comentarios</p>
              </div>
            </div>

            {/* NoLike button */}
            <Button
              size="sm"
              fullWidth
              color={liked ? '#0c0c0c' : '#15e012'}
              shadowColor={liked ? '0,0,0' : '21,224,18'}
              textColor={liked ? 'white' : 'var(--negro)'}
              unfollowMode={false}
              onClick={handleLike}
            >
              {liked ? '★ NoLike dado' : '☆ Dar NoLike'}
            </Button>

            {/* Fecha */}
            <div>
              <span style={labelStyle}>Publicado</span>
              <span style={valueStyle}>
                {new Date(project.published_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

          </div>
        </MacWindow>

      </div>
    </div>
  )
}

export default Proyecto
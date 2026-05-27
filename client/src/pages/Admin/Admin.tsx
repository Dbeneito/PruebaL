import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import MacWindow from '../../components/MacWindows'
import Button from '../../components/Button'

type Section = 'stats' | 'usuarios' | 'proyectos' | 'referentes' | 'categorias'

const SECTIONS = [
  { id: 'stats', label: 'Estadísticas' },
  { id: 'usuarios', label: 'Usuarios' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'referentes', label: 'Referentes' },
  { id: 'categorias', label: 'Categorías' },
]

const Admin = () => {
  const { user, token, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('stats')
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)

  const [stats, setStats] = useState({ users: 0, projects: 0, referents: 0, categories: 0, likes: 0, comments: 0 })
  const [users, setUsers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [referents, setReferents] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [refForm, setRefForm] = useState({ name: '', slug: '', discipline: '', origin_country: '', birth_year: '', death_year: '', bio: '', cover_url: '', quote: '' })
  const [catForm, setCatForm] = useState({ name: '', slug: '' })
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth <= 768)
      setIsMobile(window.innerWidth <= 480)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Protección con delay para esperar que el contexto cargue del localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!token) { navigate('/login'); return }
      if (!isAdmin) { navigate('/'); return }
      setReady(true)
      setChecking(false)
    }, 150)
    return () => clearTimeout(timer)
  }, [token, isAdmin])

  useEffect(() => {
    if (!ready || !token) return
    const headers = { Authorization: `Bearer ${token}` }
    axios.get('http://localhost:3000/api/users', { headers }).then(res => setUsers(res.data)).catch(() => {})
    axios.get('http://localhost:3000/api/projects').then(res => setProjects(res.data)).catch(() => {})
    axios.get('http://localhost:3000/api/referents').then(res => setReferents(res.data)).catch(() => {})
    axios.get('http://localhost:3000/api/categories').then(res => setCategories(res.data)).catch(() => {})
  }, [ready, token])

  useEffect(() => {
    setStats({
      users: users.length,
      projects: projects.length,
      referents: referents.length,
      categories: categories.length,
      likes: projects.reduce((acc, p) => acc + (p.likes_count || 0), 0),
      comments: projects.reduce((acc, p) => acc + (p.comments_count || 0), 0),
    })
  }, [users, projects, referents, categories])

  const headers = { Authorization: `Bearer ${token}` }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`, { headers })
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch { setMsg('Error al eliminar usuario') }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm('¿Eliminar este proyecto?')) return
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`, { headers })
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch { setMsg('Error al eliminar proyecto') }
  }

  const handleDeleteReferent = async (id: number) => {
    if (!confirm('¿Eliminar este referente?')) return
    try {
      await axios.delete(`http://localhost:3000/api/referents/${id}`, { headers })
      setReferents(prev => prev.filter(r => r.id !== id))
    } catch { setMsg('Error al eliminar referente') }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`, { headers })
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch { setMsg('Error al eliminar categoría') }
  }

  const handleCreateReferent = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    try {
      await axios.post('http://localhost:3000/api/referents', {
        ...refForm,
        birth_year: refForm.birth_year ? parseInt(refForm.birth_year) : null,
        death_year: refForm.death_year ? parseInt(refForm.death_year) : null,
      }, { headers })
      setMsg('Referente creado correctamente')
      setRefForm({ name: '', slug: '', discipline: '', origin_country: '', birth_year: '', death_year: '', bio: '', cover_url: '', quote: '' })
      axios.get('http://localhost:3000/api/referents').then(res => setReferents(res.data)).catch(() => {})
    } catch { setMsg('Error al crear referente') }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    try {
      await axios.post('http://localhost:3000/api/categories', catForm, { headers })
      setMsg('Categoría creada correctamente')
      setCatForm({ name: '', slug: '' })
      axios.get('http://localhost:3000/api/categories').then(res => setCategories(res.data)).catch(() => {})
    } catch { setMsg('Error al crear categoría') }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    color: '#222',
    background: 'white',
    border: '1px solid #bbb',
    borderRadius: '4px',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
    boxSizing: 'border-box' as const,
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '11px',
    color: '#444',
    letterSpacing: '0.03em',
    display: 'block',
    marginBottom: '4px',
  }

  const tableHeader: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '10px',
    color: '#888',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '8px 12px',
    borderBottom: '1px solid #ccc',
    background: 'linear-gradient(to bottom, #e8e8e8, #d8d8d8)',
    textAlign: 'left' as const,
  }

  const tableCell: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '11px',
    color: '#222',
    padding: '8px 12px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle' as const,
  }

  const renderContent = () => {
    switch (section) {

      case 'stats':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={{ fontFamily: 'var(--font-principal)', fontSize: '24px', fontWeight: 700, color: 'var(--negro)', margin: 0, letterSpacing: '-0.02em' }}>
              Panel de control
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'Usuarios', value: stats.users, color: 'var(--negro)' },
                { label: 'Proyectos', value: stats.projects, color: 'var(--negro)' },
                { label: 'Referentes', value: stats.referents, color: 'var(--negro)' },
                { label: 'Categorías', value: stats.categories, color: 'var(--negro)' },
                { label: 'NoLikes totales', value: stats.likes, color: 'var(--verde)' },
                { label: 'Comentarios', value: stats.comments, color: 'var(--negro)' },
              ].map((stat, i) => (
                <div key={i} style={{ background: '#e8e8e8', border: '1px solid #d0d0d0', borderRadius: '6px', padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-principal)', fontSize: '40px', fontWeight: 700, color: stat.color, margin: 0, lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '6px 0 0' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SECTIONS.filter(s => s.id !== 'stats').map(s => (
                <Button key={s.id} size="sm" color="#0c0c0c" shadowColor="0,0,0" textColor="white" onClick={() => setSection(s.id as Section)}>
                  Gestionar {s.label}
                </Button>
              ))}
            </div>
          </div>
        )

      case 'usuarios':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              {users.length} usuarios registrados
            </p>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>ID</th>
                    <th style={tableHeader}>Usuario</th>
                    <th style={tableHeader}>Email</th>
                    <th style={tableHeader}>Rol</th>
                    <th style={tableHeader}>Registro</th>
                    <th style={tableHeader}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ background: u.role === 'admin' ? 'rgba(21,224,18,0.05)' : 'white' }}>
                      <td style={tableCell}>{u.id}</td>
                      <td style={{ ...tableCell, fontWeight: 600 }}>@{u.username}</td>
                      <td style={{ ...tableCell, opacity: 0.7 }}>{u.email}</td>
                      <td style={tableCell}>
                        <span style={{
                          fontFamily: 'var(--font-secundaria)',
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          background: u.role === 'admin' ? 'var(--verde)' : '#e0e0e0',
                          color: u.role === 'admin' ? 'var(--negro)' : '#666',
                          borderRadius: '2px',
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...tableCell, opacity: 0.6 }}>
                        {new Date(u.created_at).toLocaleDateString('es-ES')}
                      </td>
                      <td style={tableCell}>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#cc1100', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'proyectos':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              {projects.length} proyectos publicados
            </p>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead>
                  <tr>
                    <th style={tableHeader}>ID</th>
                    <th style={tableHeader}>Título</th>
                    <th style={tableHeader}>Autor</th>
                    <th style={tableHeader}>NoLikes</th>
                    <th style={tableHeader}>Estado</th>
                    <th style={tableHeader}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => (
                    <tr key={p.id} style={{ background: 'white' }}>
                      <td style={tableCell}>{String(p.id).padStart(3, '0')}</td>
                      <td style={{ ...tableCell, fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </td>
                      <td style={tableCell}>@{p.username}</td>
                      <td style={{ ...tableCell, color: 'var(--verde)', fontWeight: 700 }}>★ {p.likes_count}</td>
                      <td style={tableCell}>
                        <span style={{
                          fontFamily: 'var(--font-secundaria)',
                          fontSize: '9px',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          padding: '2px 6px',
                          background: p.status === 'published' ? 'var(--verde)' : '#e0e0e0',
                          color: p.status === 'published' ? 'var(--negro)' : '#666',
                          borderRadius: '2px',
                        }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={tableCell}>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#cc1100', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'referentes':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                {referents.length} referentes
              </p>
              <div style={{ overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                  <thead>
                    <tr>
                      <th style={tableHeader}>Nombre</th>
                      <th style={tableHeader}>Disciplina</th>
                      <th style={tableHeader}>País</th>
                      <th style={tableHeader}>Años</th>
                      <th style={tableHeader}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referents.map(r => (
                      <tr key={r.id} style={{ background: 'white' }}>
                        <td style={{ ...tableCell, fontWeight: 600 }}>{r.name}</td>
                        <td style={tableCell}>{r.discipline}</td>
                        <td style={tableCell}>{r.origin_country}</td>
                        <td style={tableCell}>{r.birth_year}{r.death_year ? ` — ${r.death_year}` : ' — presente'}</td>
                        <td style={tableCell}>
                          <button
                            onClick={() => handleDeleteReferent(r.id)}
                            style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#cc1100', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em' }}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: '#ebebeb', border: '1px solid #c0c0c0', borderRadius: '8px', padding: '16px' }}>
              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', fontWeight: 700, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                Añadir referente
              </p>
              <form onSubmit={handleCreateReferent} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
                {[
                  { key: 'name', label: 'Nombre', placeholder: 'Virgil Abloh', required: true },
                  { key: 'slug', label: 'Slug', placeholder: 'virgil-abloh', required: true },
                  { key: 'discipline', label: 'Disciplina', placeholder: 'Diseño / Moda' },
                  { key: 'origin_country', label: 'País de origen', placeholder: 'Estados Unidos' },
                  { key: 'birth_year', label: 'Año nacimiento', placeholder: '1980' },
                  { key: 'death_year', label: 'Año fallecimiento', placeholder: '2021 (opcional)' },
                  { key: 'cover_url', label: 'URL imagen', placeholder: 'https://...' },
                  { key: 'quote', label: 'Cita', placeholder: 'Su frase más conocida' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={(refForm as any)[field.key]}
                      onChange={e => setRefForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={inputStyle}
                      required={field.required}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                  <label style={labelStyle}>Biografía</label>
                  <textarea
                    placeholder="Descripción del referente..."
                    value={refForm.bio}
                    onChange={e => setRefForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, borderRadius: '4px', resize: 'vertical' }}
                  />
                </div>
                {msg && (
                  <p style={{ gridColumn: isMobile ? '1' : '1 / -1', fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: msg.includes('Error') ? '#cc1100' : '#15e012', margin: 0 }}>
                    {msg}
                  </p>
                )}
                <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                  <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)">
                    Crear referente
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )

      case 'categorias':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                {categories.length} categorías
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '8px' }}>
                {categories.map(cat => (
                  <div key={cat.id} style={{ background: '#e8e8e8', border: '1px solid #d0d0d0', borderRadius: '4px', padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '12px', fontWeight: 600, color: 'var(--negro)', margin: 0 }}>{cat.name}</p>
                      <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', margin: 0, letterSpacing: '0.05em' }}>{cat.slug}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#cc1100', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#ebebeb', border: '1px solid #c0c0c0', borderRadius: '8px', padding: '16px' }}>
              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', fontWeight: 700, color: '#333', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                Añadir categoría
              </p>
              <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={labelStyle}>Nombre</label>
                    <input
                      type="text"
                      placeholder="Diseño Gráfico"
                      value={catForm.name}
                      onChange={e => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Slug</label>
                    <input
                      type="text"
                      placeholder="diseno-grafico"
                      value={catForm.slug}
                      onChange={e => setCatForm(prev => ({ ...prev, slug: e.target.value }))}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>
                {msg && (
                  <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: msg.includes('Error') ? '#cc1100' : '#15e012', margin: 0 }}>
                    {msg}
                  </p>
                )}
                <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)">
                  Crear categoría
                </Button>
              </form>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (checking) return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blanco)' }}>
      <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Verificando acceso...
      </span>
    </div>
  )

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--blanco)',
      padding: isMobile ? '90px 16px 60px' : '100px 24px 60px',
      boxSizing: 'border-box',
    }}>
      <MacWindow title="LIMINAL — Admin Panel" width="100%">
        <div style={{ margin: '-24px' }}>

          {isSmall && (
            <div style={{ background: 'linear-gradient(to right, #e0e0e0, #e8e8e8)', borderBottom: '1px solid #ccc', display: 'flex', overflowX: 'auto', padding: '8px 12px', gap: '6px', scrollbarWidth: 'none' as const }}>
              {SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id as Section)}
                  style={{
                    flexShrink: 0,
                    padding: '4px 12px',
                    fontFamily: 'var(--font-secundaria)',
                    fontSize: '10px',
                    color: section === s.id ? '#1a4d19' : '#333',
                    background: section === s.id ? 'linear-gradient(to bottom, #4dff4a, #15e012)' : 'rgba(0,0,0,0.06)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '180px 1fr', background: '#f0f0f0', minHeight: '600px' }}>

            {!isSmall && (
              <div style={{ borderRight: '1px solid #ccc', background: 'linear-gradient(to right, #e0e0e0, #e8e8e8)', padding: '12px 0' }}>
                <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 16px', margin: '0 0 8px' }}>
                  Admin
                </p>
                {SECTIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id as Section)}
                    style={{
                      width: section === s.id ? 'calc(100% - 8px)' : '100%',
                      textAlign: 'left',
                      padding: '6px 16px',
                      fontFamily: 'var(--font-secundaria)',
                      fontSize: '11px',
                      color: section === s.id ? '#1a4d19' : '#333',
                      background: section === s.id ? 'linear-gradient(to bottom, #4dff4a, #15e012)' : 'transparent',
                      border: 'none',
                      borderRadius: section === s.id ? '4px' : '0',
                      margin: section === s.id ? '0 4px' : '0',
                      cursor: 'pointer',
                      letterSpacing: '0.03em',
                      display: 'block',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <div style={{ padding: '24px', background: '#f5f5f5', overflowY: 'auto' }}>
              {renderContent()}
            </div>

          </div>

          <div style={{ background: 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)', padding: '4px 16px', borderTop: '1px solid #999', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#555', letterSpacing: '0.05em' }}>
              @{user?.username} — Admin — LIMINAL™
            </span>
            <div style={{ width: '10px', height: '10px', backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)', backgroundSize: '3px 3px', opacity: 0.6 }} />
          </div>

        </div>
      </MacWindow>
    </div>
  )
}

export default Admin
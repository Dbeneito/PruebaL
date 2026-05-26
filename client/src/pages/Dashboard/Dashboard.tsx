import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import MacWindow from '../../components/MacWindows'
import Button from '../../components/Button'

type Section = 'resumen' | 'proyectos' | 'nolikes' | 'publicar' | 'ajustes'

const SECTIONS = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'proyectos', label: 'Mis_Proyectos' },
    { id: 'nolikes', label: 'Mis_NoLikes' },
    { id: 'publicar', label: 'Publicar' },
    { id: 'ajustes', label: 'Ajustes' },
    ]

const toFileName = (title: string) =>
    title.trim().replace(/\s+/g, '_') + '.jpg'

const Dashboard = () => {
    const { user, token, logout } = useAuth()
    const navigate = useNavigate()
    const [section, setSection] = useState<Section>('resumen')
    const [isSmall, setIsSmall] = useState(window.innerWidth <= 768)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
    const [projects, setProjects] = useState<any[]>([])
    const [likedProjects, setLikedProjects] = useState<any[]>([])
    const [stats, setStats] = useState({ projects: 0, likes: 0, followers: 0 })
    const [publishForm, setPublishForm] = useState({ title: '', description: '', cover_url: '', status: 'published', categories: [] as number[] })
    const [categories, setCategories] = useState<any[]>([])
    const [publishMsg, setPublishMsg] = useState('')
    const [ajustesForm, setAjustesForm] = useState({ bio: '', avatar_url: '', location: '', discipline: '' })
    const [ajustesMsg, setAjustesMsg] = useState('')

    useEffect(() => {
        const handleResize = () => {
        setIsSmall(window.innerWidth <= 768)
        setIsMobile(window.innerWidth <= 480)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!token || !user) return

        axios.get(`http://localhost:3000/api/users/${user.username}`)
        .then(res => {
            setProjects(res.data.projects || [])
            setStats({
            projects: res.data.projects?.length || 0,
            likes: res.data.projects?.reduce((acc: number, p: any) => acc + p.likes_count, 0) || 0,
            followers: res.data.followers_count || 0,
            })
            setAjustesForm({
            bio: res.data.bio || '',
            avatar_url: res.data.avatar_url || '',
            location: res.data.location || '',
            discipline: res.data.discipline || '',
            })
        })
        .catch(() => {})

        axios.get('http://localhost:3000/api/users/saved', {
        headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setLikedProjects(res.data))
        .catch(() => {})

        axios.get('http://localhost:3000/api/categories')
        .then(res => setCategories(res.data))
        .catch(() => {})
    }, [token, user])

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        setPublishMsg('')
        try {
        await axios.post('http://localhost:3000/api/projects', publishForm, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setPublishMsg('Proyecto publicado correctamente')
        setPublishForm({ title: '', description: '', cover_url: '', status: 'published', categories: [] })
        } catch {
        setPublishMsg('Error al publicar el proyecto')
        }
    }

    const handleAjustes = async (e: React.FormEvent) => {
        e.preventDefault()
        setAjustesMsg('')
        try {
        await axios.put('http://localhost:3000/api/users/profile', ajustesForm, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setAjustesMsg('Perfil actualizado correctamente')
        } catch {
        setAjustesMsg('Error al actualizar el perfil')
        }
    }

    const handleDeleteProject = async (id: number) => {
        if (!confirm('¿Eliminar este proyecto?')) return
        try {
        await axios.delete(`http://localhost:3000/api/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        setProjects(prev => prev.filter(p => p.id !== id))
        setStats(prev => ({ ...prev, projects: prev.projects - 1 }))
        } catch {}
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

    const CategoryButton = ({ id, label, active, onClick }: any) => (
        <button
        onClick={onClick}
        style={{
            padding: '4px 12px',
            fontFamily: 'var(--font-secundaria)',
            fontSize: '10px',
            color: active ? '#1a4d19' : '#333',
            background: active
            ? 'linear-gradient(to bottom, #4dff4a, #15e012)'
            : 'rgba(0,0,0,0.06)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
        }}
        >
        {label}
        </button>
    )

    const renderContent = () => {
        switch (section) {

        case 'resumen':
            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p style={{ fontFamily: 'var(--font-principal)', fontSize: '28px', fontWeight: 700, color: 'var(--negro)', margin: 0, letterSpacing: '-0.02em' }}>
                Hola, @{user?.username}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                    { label: 'Proyectos', value: stats.projects },
                    { label: 'NoLikes recibidos', value: stats.likes },
                    { label: 'Seguidores', value: stats.followers },
                ].map((stat, i) => (
                    <div key={i} style={{ background: '#e8e8e8', border: '1px solid #d0d0d0', borderRadius: '6px', padding: '16px', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-principal)', fontSize: '36px', fontWeight: 700, color: 'var(--negro)', margin: 0, lineHeight: 1 }}>
                        {stat.value}
                    </p>
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '6px 0 0' }}>
                        {stat.label}
                    </p>
                    </div>
                ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {/* Verde — texto negro */}
                <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)" onClick={() => setSection('publicar')}>
                    Publicar proyecto
                </Button>
                <Link to={`/perfil/${user?.username}`} style={{ textDecoration: 'none' }}>
                    <Button size="sm" color="#0c0c0c" shadowColor="0,0,0" textColor="white">
                    Ver mi perfil público
                    </Button>
                </Link>
                </div>

                {projects.length > 0 && (
                <div>
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Proyectos recientes
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '1px', background: '#ccc', border: '1px solid #ccc' }}>
                    {projects.slice(0, 4).map(p => (
                        <div key={p.id} style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden', background: '#f5f5f5' }}>
                        <img
                            src={p.cover_url || `https://picsum.photos/seed/${p.id}/400/300`}
                            alt={p.title}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(0,0,0,0.6)' }}>
                            <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: '#fff', letterSpacing: '0.05em' }}>
                            {toFileName(p.title)}
                            </span>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>
            )

        case 'proyectos':
            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                {projects.length} proyectos publicados
                </p>

                {projects.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '1px', background: '#ccc', border: '1px solid #ccc' }}>
                    {projects.map(p => (
                    <div key={p.id} style={{ position: 'relative', background: '#f5f5f5' }}>
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden' }}>
                        <img
                            src={p.cover_url || `https://picsum.photos/seed/${p.id}/400/300`}
                            alt={p.title}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        </div>
                        <div style={{ padding: '8px', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {toFileName(p.title)}
                        </span>
                        <button
                            onClick={() => handleDeleteProject(p.id)}
                            style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: '#cc1100', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, letterSpacing: '0.05em' }}
                        >
                            ✕
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    No has publicado proyectos todavía
                    </p>
                    <div style={{ marginTop: '16px' }}>
                    <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)" onClick={() => setSection('publicar')}>
                        Publicar ahora
                    </Button>
                    </div>
                </div>
                )}
            </div>
            )

        case 'nolikes':
            return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                Proyectos que te han gustado
                </p>

                {likedProjects.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '1px', background: '#ccc', border: '1px solid #ccc' }}>
                    {likedProjects.map((p: any) => (
                    <Link key={p.id} to={`/proyecto/${p.id}`} style={{ textDecoration: 'none', display: 'block', background: '#f5f5f5' }}>
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', overflow: 'hidden' }}>
                        <img
                            src={p.cover_url || `https://picsum.photos/seed/${p.id}/400/300`}
                            alt={p.title}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: '#fff' }}>{toFileName(p.title)}</span>
                            <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '9px', color: 'var(--verde)' }}>★ {p.likes_count}</span>
                        </div>
                        </div>
                    </Link>
                    ))}
                </div>
                ) : (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    No has dado NoLikes todavía
                    </p>
                </div>
                )}
            </div>
            )

        case 'publicar':
            return (
            <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                <label style={labelStyle}>Título del proyecto</label>
                <input
                    type="text"
                    placeholder="Mi proyecto"
                    value={publishForm.title}
                    onChange={e => setPublishForm({ ...publishForm, title: e.target.value })}
                    style={inputStyle}
                    required
                />
                </div>

                <div>
                <label style={labelStyle}>Descripción</label>
                <textarea
                    placeholder="Describe tu proyecto..."
                    value={publishForm.description}
                    onChange={e => setPublishForm({ ...publishForm, description: e.target.value })}
                    rows={4}
                    style={{ ...inputStyle, borderRadius: '4px', resize: 'vertical' }}
                />
                </div>

                <div>
                <label style={labelStyle}>URL de imagen de portada</label>
                <input
                    type="url"
                    placeholder="https://..."
                    value={publishForm.cover_url}
                    onChange={e => setPublishForm({ ...publishForm, cover_url: e.target.value })}
                    style={inputStyle}
                />
                {publishForm.cover_url && (
                    <div style={{ marginTop: '8px', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <img src={publishForm.cover_url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                )}
                </div>

                <div>
                <label style={labelStyle}>Categorías</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {categories.map(cat => (
                    <CategoryButton
                        key={cat.id}
                        id={cat.id}
                        label={cat.name}
                        active={publishForm.categories.includes(cat.id)}
                        onClick={() => {
                        const already = publishForm.categories.includes(cat.id)
                        setPublishForm(prev => ({
                            ...prev,
                            categories: already
                            ? prev.categories.filter(id => id !== cat.id)
                            : [...prev.categories, cat.id]
                        }))
                        }}
                    />
                    ))}
                </div>
                </div>

                <div>
                <label style={labelStyle}>Estado</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['published', 'draft'].map(s => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setPublishForm({ ...publishForm, status: s })}
                        style={{
                        padding: '5px 16px',
                        fontFamily: 'var(--font-secundaria)',
                        fontSize: '11px',
                        color: publishForm.status === s ? '#1a4d19' : '#333',
                        background: publishForm.status === s
                            ? 'linear-gradient(to bottom, #4dff4a, #15e012)'
                            : 'rgba(0,0,0,0.06)',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        }}
                    >
                        {s === 'published' ? 'Publicar' : 'Borrador'}
                    </button>
                    ))}
                </div>
                </div>

                {publishMsg && (
                <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: publishMsg.includes('Error') ? '#cc1100' : '#15e012', margin: 0 }}>
                    {publishMsg}
                </p>
                )}

                <div style={{ height: '1px', background: '#ccc' }} />
                {/* Verde — texto negro */}
                <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)">
                Publicar proyecto
                </Button>
            </form>
            )

        case 'ajustes':
            return (
            <form onSubmit={handleAjustes} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                <label style={labelStyle}>Avatar URL</label>
                <input
                    type="url"
                    placeholder="https://..."
                    value={ajustesForm.avatar_url}
                    onChange={e => setAjustesForm({ ...ajustesForm, avatar_url: e.target.value })}
                    style={inputStyle}
                />
                </div>

                <div>
                <label style={labelStyle}>Bio</label>
                <textarea
                    placeholder="Cuéntanos algo sobre ti..."
                    value={ajustesForm.bio}
                    onChange={e => setAjustesForm({ ...ajustesForm, bio: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, borderRadius: '4px', resize: 'vertical' }}
                />
                </div>

                <div>
                <label style={labelStyle}>Disciplina</label>
                <select
                    value={ajustesForm.discipline}
                    onChange={e => setAjustesForm({ ...ajustesForm, discipline: e.target.value })}
                    style={{ ...inputStyle }}
                >
                    <option value="">Selecciona una disciplina</option>
                    <option>Diseño Gráfico</option>
                    <option>Moda</option>
                    <option>Arquitectura</option>
                    <option>Ilustración</option>
                    <option>Tipografía</option>
                    <option>Motion</option>
                    <option>Fotografía</option>
                    <option>Branding</option>
                    <option>Arte</option>
                    <option>Otro</option>
                </select>
                </div>

                <div>
                <label style={labelStyle}>Ubicación</label>
                <input
                    type="text"
                    placeholder="Ciudad, País"
                    value={ajustesForm.location}
                    onChange={e => setAjustesForm({ ...ajustesForm, location: e.target.value })}
                    style={inputStyle}
                />
                </div>

                {ajustesMsg && (
                <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: ajustesMsg.includes('Error') ? '#cc1100' : '#15e012', margin: 0 }}>
                    {ajustesMsg}
                </p>
                )}

                <div style={{ height: '1px', background: '#ccc' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Verde — texto negro */}
                <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)">
                    Guardar cambios
                </Button>
                <button
                    type="button"
                    onClick={() => { logout(); navigate('/') }}
                    style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#cc1100', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                    Cerrar sesión
                </button>
                </div>
            </form>
            )

        default:
            return null
        }
    }

    return (
        <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--blanco)',
        padding: isMobile ? '90px 16px 60px' : '100px 24px 60px',
        boxSizing: 'border-box',
        }}>
        <MacWindow title={`LIMINAL —  @${user?.username}`} width="100%">
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
                        background: section === s.id
                        ? 'linear-gradient(to bottom, #4dff4a, #15e012)'
                        : 'rgba(0,0,0,0.06)',
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
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 16px', margin: '0 0 8px 0' }}>
                    Dashboard
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
                        background: section === s.id
                            ? 'linear-gradient(to bottom, #4dff4a, #15e012)'
                            : 'transparent',
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
                @{user?.username} — LIMINAL™
                </span>
                <div style={{ width: '10px', height: '10px', backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)', backgroundSize: '3px 3px', opacity: 0.6 }} />
            </div>

            </div>
        </MacWindow>
        </div>
    )
}

export default Dashboard
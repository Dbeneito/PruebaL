import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

interface Referent {
  id: number
  name: string
  slug: string
  discipline: string
  origin_country: string
  birth_year: number
  death_year: number | null
  bio: string
  cover_url: string
  quote: string
}

const ReferenteDetalle = () => {
  const { slug } = useParams<{ slug: string }>()
  const [referent, setReferent] = useState<Referent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [activeTab, setActiveTab] = useState('Overview')

  const tabs = ['Overview', 'Biografía', 'Obras', 'Contacto']

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!slug) return
    axios.get(`http://localhost:3000/api/referents/${slug}`)
      .then(res => { setReferent(res.data); setLoading(false) })
      .catch(() => { setError('Referente no encontrado'); setLoading(false) })
  }, [slug])

  if (loading) return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blanco)', paddingTop: '80px' }}>
      <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Cargando...</span>
    </div>
  )

  if (error || !referent) return (
    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--blanco)', paddingTop: '80px' }}>
      <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#cc1100', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{error}</span>
    </div>
  )

  const years = referent.death_year
    ? `${referent.birth_year} — ${referent.death_year}`
    : `${referent.birth_year} — presente`

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '16px',
    padding: '8px 0',
    borderBottom: '1px solid #e0e0e0',
  }

  const rowLabelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--negro)',
    letterSpacing: '0.03em',
    flexShrink: 0,
    width: '120px',
    textAlign: 'right',
  }

  const rowValueStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    color: '#444',
    letterSpacing: '0.03em',
    flex: 1,
  }

  const macBtnStyle: React.CSSProperties = {
    padding: '5px 20px',
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    color: '#333',
    background: 'linear-gradient(to bottom, #f5f5f5, #dedede)',
    border: '1px solid #aaa',
    borderRadius: '6px',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.1)',
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--blanco)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '90px 16px 60px' : '100px 40px 60px',
      boxSizing: 'border-box',
    }}>

      {/* Ventana Mac "About This Referent" */}
      <div style={{
        width: '100%',
        maxWidth: '800px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #888',
      }}>

        {/* Barra superior */}
        <div style={{
          background: 'linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 40%, #b8b8b8 100%)',
          padding: '8px 16px 0',
          borderBottom: '1px solid #999',
        }}>
          {/* Botones + título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Link to="/referentes" style={{ textDecoration: 'none' }}>
              <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ff6b6b, #cc1100)', border: '1px solid #aa0000', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)', flexShrink: 0, cursor: 'pointer' }} />
            </Link>
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ffdd57, #e6a800)', border: '1px solid #cc8800', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)', flexShrink: 0 }} />
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #69db7c, #15e012)', border: '1px solid #0a9e08', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)', flexShrink: 0 }} />

            <span style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-secundaria)',
              fontSize: '11px',
              color: '#333',
              fontWeight: 600,
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}>
              About {referent.name}
            </span>

            {/* Links derecha */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
              <a href="#" style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#555', textDecoration: 'none', letterSpacing: '0.05em' }}>Support</a>
              <a href="#" style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#555', textDecoration: 'none', letterSpacing: '0.05em' }}>Archive</a>
            </div>
          </div>

          {/* Tabs estilo About This Mac */}
          <div style={{ display: 'flex', gap: '0' }}>
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '6px 20px',
                  fontFamily: 'var(--font-secundaria)',
                  fontSize: '12px',
                  color: activeTab === tab ? '#222' : '#666',
                  background: activeTab === tab
                    ? 'linear-gradient(to bottom, #f5f5f5, #e8e8e8)'
                    : 'transparent',
                  border: 'none',
                  borderLeft: i > 0 ? '1px solid #bbb' : 'none',
                  borderBottom: activeTab === tab ? '1px solid #f0f0f0' : 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  fontWeight: activeTab === tab ? 600 : 400,
                  borderRadius: activeTab === tab ? '4px 4px 0 0' : '0',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cuerpo */}
        <div style={{
          background: 'linear-gradient(to bottom, #f0f0f0, #e8e8e8)',
          padding: isMobile ? '24px 16px' : '40px',
          minHeight: '400px',
        }}>

          {activeTab === 'Overview' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '40px',
              alignItems: 'center',
            }}>
              {/* Imagen */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                  width: isMobile ? '200px' : '260px',
                  height: isMobile ? '200px' : '260px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  filter: 'grayscale(20%)',
                }}>
                  <img
                    src={referent.cover_url || `https://picsum.photos/seed/${referent.slug}/400/400`}
                    alt={referent.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                  />
                </div>
              </div>

              {/* Info */}
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-principal)',
                  fontSize: isMobile ? '32px' : '48px',
                  fontWeight: 700,
                  color: 'var(--negro)',
                  margin: '0 0 4px 0',
                  letterSpacing: '-0.02em',
                }}>
                  {referent.name}
                </h2>
                <p style={{
                  fontFamily: 'var(--font-secundaria)',
                  fontSize: '14px',
                  color: '#888',
                  margin: '0 0 24px 0',
                  letterSpacing: '0.03em',
                }}>
                  {years}
                </p>

                {/* Rows */}
                <div>
                  {[
                    { label: 'Disciplina', value: referent.discipline },
                    { label: 'País', value: referent.origin_country },
                    { label: 'Nacimiento', value: String(referent.birth_year) },
                    { label: referent.death_year ? 'Fallecimiento' : 'Estado', value: referent.death_year ? String(referent.death_year) : 'Activo' },
                    { label: 'ID Archivo', value: `REF_${String(referent.id).padStart(3, '0')}` },
                  ].map((row, i) => (
                    <div key={i} style={rowStyle}>
                      <span style={rowLabelStyle}>{row.label}</span>
                      <span style={rowValueStyle}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                  <button style={macBtnStyle} onClick={() => setActiveTab('Biografía')}>
                    Leer biografía...
                  </button>
                  <button style={macBtnStyle} onClick={() => setActiveTab('Contacto')}>
                    Ver recursos...
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Biografía' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '14px',
                color: '#333',
                lineHeight: 1.9,
                margin: 0,
              }}>
                {referent.bio}
              </p>

              {referent.quote && (
                <div style={{ padding: '20px 24px', borderLeft: '3px solid var(--verde)', background: '#e8e8e8' }}>
                  <p style={{
                    fontFamily: 'var(--font-principal)',
                    fontSize: '20px',
                    fontWeight: 400,
                    color: 'var(--negro)',
                    lineHeight: 1.4,
                    margin: 0,
                    fontStyle: 'italic',
                  }}>
                    "{referent.quote}"
                  </p>
                  <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '10px 0 0' }}>
                    — {referent.name}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Obras' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Próximamente — obras y proyectos de {referent.name}
              </p>
            </div>
          )}

          {activeTab === 'Contacto' && (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              {[
                { label: 'Wikipedia', value: `wikipedia.org/wiki/${referent.name.replace(' ', '_')}` },
                { label: 'Instagram', value: `@${referent.slug.replace('-', '_')}` },
                { label: 'Archivo LIMINAL', value: `REF_${String(referent.id).padStart(3, '0')}` },
              ].map((row, i) => (
                <div key={i} style={rowStyle}>
                  <span style={rowLabelStyle}>{row.label}</span>
                  <span style={{ ...rowValueStyle, color: '#4a7db5' }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Barra inferior */}
        <div style={{
          background: 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)',
          padding: '4px 16px',
          borderTop: '1px solid #999',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{ width: '10px', height: '10px', backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)', backgroundSize: '3px 3px', opacity: 0.6 }} />
        </div>

      </div>
    </div>
  )
}

export default ReferenteDetalle
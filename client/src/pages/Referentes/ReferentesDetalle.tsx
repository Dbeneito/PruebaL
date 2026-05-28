import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Button from '../../components/Button'
import { API_URL } from '../../config/api'

type Tab = 'perfil' | 'biografia' | 'obras'

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
  const navigate = useNavigate()
  const [referent, setReferent] = useState<Referent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('perfil')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!slug) return
    axios.get(`${API_URL}/api/referents/${slug}`)
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

  const infoRows = [
    { label: 'Disciplina', value: referent.discipline },
    { label: 'País de origen', value: referent.origin_country },
    { label: 'Años activo', value: years },
    { label: 'ID Archivo', value: `REF_${String(referent.id).padStart(3, '0')}` },
  ]

  const renderTabContent = () => {
    switch (tab) {
      case 'perfil':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
            gap: isMobile ? '24px' : '40px',
            alignItems: 'flex-start',
          }}>
            {/* Imagen izquierda */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: isMobile ? '140px' : '180px',
                height: isMobile ? '140px' : '180px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                border: '1px solid rgba(0,0,0,0.1)',
              }}>
                <img
                  src={referent.cover_url || `https://picsum.photos/seed/${referent.slug}/400/400`}
                  alt={referent.name}
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
                />
              </div>
            </div>

            {/* Info derecha */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h1 style={{
                fontFamily: 'var(--font-principal)',
                fontSize: isMobile ? '32px' : '40px',
                fontWeight: 700,
                color: '#1a1a1a',
                margin: '0 0 4px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>
                {referent.name}
              </h1>

              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '14px', color: '#888', margin: '0 0 20px 0', letterSpacing: '0.02em' }}>
                {referent.discipline}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {infoRows.map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', minWidth: '120px', flexShrink: 0 }}>
                      {row.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '13px', color: '#333' }}>
                      {row.value}
                    </span>
                  </div>
                ))}

                {referent.quote && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '13px', fontWeight: 700, color: '#1a1a1a', minWidth: '120px', flexShrink: 0 }}>
                      Cita
                    </span>
                    <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '13px', color: '#333', fontStyle: 'italic' }}>
                      "{referent.quote}"
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button
                  size="sm"
                  color="#0c0c0c"
                  shadowColor="0,0,0"
                  textColor="white"
                  onClick={() => navigate('/archivo')}
                >
                  Ver proyectos inspirados
                </Button>
                <Button
                  size="sm"
                  color="#15e012"
                  shadowColor="21,224,18"
                  textColor="var(--negro)"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(referent.name)}`, '_blank')}
                >
                  Buscar en web
                </Button>
              </div>
            </div>
          </div>
        )

      case 'biografia':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-principal)', fontSize: '24px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                Sobre {referent.name}
              </h2>
              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '13px', color: '#444', lineHeight: 1.9, margin: 0 }}>
                {referent.bio}
              </p>
            </div>

            {referent.quote && (
              <div style={{ padding: '20px 24px', borderLeft: '3px solid var(--verde)', background: '#e8e8e8' }}>
                <p style={{ fontFamily: 'var(--font-principal)', fontSize: '18px', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.5, margin: '0 0 8px', fontStyle: 'italic' }}>
                  "{referent.quote}"
                </p>
                <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  — {referent.name}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Disciplina', value: referent.discipline },
                { label: 'País de origen', value: referent.origin_country },
                { label: 'Período activo', value: years },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 0', borderBottom: '1px solid #d0d0d0' }}>
                  <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '12px', fontWeight: 700, color: '#1a1a1a', minWidth: '120px', flexShrink: 0 }}>
                    {row.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '12px', color: '#444' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )

      case 'obras':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              Proyectos de LIMINAL inspirados en {referent.name}
            </p>

            <div style={{ padding: '48px 0', textAlign: 'center', background: '#e8e8e8', borderRadius: '6px', border: '1px solid #d0d0d0' }}>
              <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '12px', color: '#888', margin: '0 0 16px', letterSpacing: '0.05em' }}>
                Próximamente — los usuarios podrán etiquetar proyectos inspirados en este referente
              </p>
              <Button
                size="sm"
                color="#15e012"
                shadowColor="21,224,18"
                textColor="var(--negro)"
                href="/archivo"
              >
                Explorar archivo
              </Button>
            </div>
          </div>
        )
    }
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
      <div style={{ width: '100%', maxWidth: '720px' }}>

        {/* Ventana Mac */}
        <div style={{
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #888',
        }}>

          {/* Barra superior */}
          <div style={{
            background: 'linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 40%, #b8b8b8 100%)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            borderBottom: '1px solid #999',
            position: 'relative',
          }}>
            {/* Botones Mac — el rojo vuelve a referentes */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <div
                onClick={() => navigate('/referentes')}
                style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ff6b6b, #cc1100)', border: '1px solid #aa0000', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)', cursor: 'pointer' }}
                title="Volver a Referentes"
              />
              <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ffdd57, #e6a800)', border: '1px solid #cc8800', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)' }} />
              <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #69db7c, #15e012)', border: '1px solid #0a9e08', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)' }} />
            </div>

            {/* Tabs funcionales */}
            <div style={{ display: 'flex', gap: '0' }}>
              {(['perfil', 'biografia', 'obras'] as Tab[]).map((t, i) => (
                <div
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    padding: '3px 16px',
                    fontFamily: 'var(--font-secundaria)',
                    fontSize: '11px',
                    color: tab === t ? '#222' : '#666',
                    borderRight: i < 2 ? '1px solid #999' : 'none',
                    cursor: 'pointer',
                    letterSpacing: '0.03em',
                    background: tab === t ? 'rgba(255,255,255,0.4)' : 'transparent',
                    borderRadius: tab === t ? '3px 3px 0 0' : '0',
                    fontWeight: tab === t ? 600 : 400,
                    transition: 'background 0.15s',
                    textTransform: 'capitalize',
                  }}
                >
                  {t === 'perfil' ? 'Perfil' : t === 'biografia' ? 'Biografía' : 'Obras'}
                </div>
              ))}
            </div>
          </div>

          {/* Cuerpo */}
          <div style={{
            background: '#ececec',
            padding: isMobile ? '24px 20px' : '32px 40px',
            minHeight: '300px',
          }}>
            {renderTabContent()}
          </div>

          {/* Barra inferior */}
          <div style={{
            background: 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)',
            padding: '4px 16px',
            borderTop: '1px solid #999',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#555', letterSpacing: '0.05em' }}>
              {referent.name} — REF_{String(referent.id).padStart(3, '0')}
            </span>
            <div style={{ width: '10px', height: '10px', backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)', backgroundSize: '3px 3px', opacity: 0.6 }} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default ReferenteDetalle
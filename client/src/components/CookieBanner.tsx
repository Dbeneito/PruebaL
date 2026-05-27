import { useState, useEffect } from 'react'
import Button from './Button'
import { Link } from 'react-router-dom'

const CookieBanner = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const accepted = localStorage.getItem('cookies_accepted')
        if (!accepted) setVisible(true)
    }, [])

    const accept = () => {
        localStorage.setItem('cookies_accepted', 'true')
        setVisible(false)
    }

    const reject = () => {
        localStorage.setItem('cookies_accepted', 'false')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <>
        {/* Overlay fondo verde semitransparente */}
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(21, 224, 18, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 9998,
        }} />

        {/* Banner centrado */}
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            width: 'min(480px, 90vw)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #888',
        }}>

            {/* Barra superior Mac */}
            <div style={{
            background: 'linear-gradient(to bottom, #e8e8e8 0%, #c8c8c8 40%, #b8b8b8 100%)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid #999',
            position: 'relative',
            }}>
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ff6b6b, #cc1100)', border: '1px solid #aa0000', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)', flexShrink: 0 }} />
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
                LIMINAL — Cookies
            </span>
            </div>

            {/* Contenido */}
            <div style={{
            background: '#f0f0f0',
            padding: '28px 28px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            }}>

            {/* Icono + título */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{
                fontFamily: 'var(--font-principal)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--negro)',
                margin: 0,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                }}>
                Cookies
                </p>
                <p style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '12px',
                color: '#444',
                lineHeight: 1.8,
                margin: 0,
                letterSpacing: '0.02em',
                }}>
                LIMINAL usa cookies técnicas esenciales para mantener tu sesión activa. No usamos cookies de seguimiento ni publicidad de ningún tipo.
                </p>
            </div>

            {/* Separador */}
            <div style={{ height: '1px', background: '#ccc' }} />

            {/* Botones */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <Link
                to="/cookies"
                style={{
                    fontFamily: 'var(--font-secundaria)',
                    fontSize: '10px',
                    color: '#888',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    borderBottom: '1px solid #ccc',
                }}
                >
                Más información
                </Link>
                <div style={{ display: 'flex', gap: '8px' }}>
                <Button size="sm" color="#888" shadowColor="136,136,136" textColor="var(--negro)" onClick={reject}>
                    Rechazar
                </Button>
                <Button size="sm" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)" onClick={accept}>
                    Aceptar
                </Button>
                </div>
            </div>
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
        </>
    )
}

export default CookieBanner
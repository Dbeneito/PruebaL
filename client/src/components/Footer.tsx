import { Link } from 'react-router-dom'

const LINKS = {
    'Explorar': [
        { label: 'Archivo', to: '/archivo' },
        { label: 'Comunidad', to: '/comunidad' },
        { label: 'Referentes', to: '/referentes' },
    ],
    'Cuenta': [
        { label: 'Iniciar sesión', to: '/login' },
        { label: 'Registrarse', to: '/registro' },
        { label: 'Dashboard', to: '/dashboard' },
    ],
    'Legal': [
        { label: 'Política de privacidad', to: '/privacidad' },
        { label: 'Términos de uso', to: '/terminos' },
        { label: 'Política de cookies', to: '/cookies' },
    ],
    'Redes': [
        { label: '@glax.xyz', href: 'https://instagram.com/glax.xyz' },
        { label: '@liminal.archive', href: 'https://instagram.com/glax.xyz' },
    ],
    }

import { useState, useEffect } from 'react'

const Footer = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
    const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => {
        setIsMobile(window.innerWidth <= 480)
        setIsTablet(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const isSmall = isMobile || isTablet

    return (
        <footer style={{
        width: '100%',
        background: 'linear-gradient(to bottom, var(--blanco) 0%, rgba(21,224,18,0.08) 60%, rgba(21,224,18,0.18) 100%)',
        borderTop: '1px solid var(--negro)',
        padding: isSmall ? '40px 24px 50px' : '60px 60px 32px',
        boxSizing: 'border-box',
        }}>

        {/* Grid de links */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isSmall ? '32px 24px' : '40px',
            marginBottom: isSmall ? '48px' : '80px',
        }}>
            {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
                <p style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--negro)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                margin: '0 0 12px',
                }}>
                {section}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {links.map((link: any) => (
                    link.href ? (
                    <a  
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                        fontFamily: 'var(--font-secundaria)',
                        fontSize: '12px',
                        color: 'var(--negro)',
                        textDecoration: 'none',
                        letterSpacing: '0.03em',
                        opacity: 0.6,
                        transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                    >
                        {link.label}
                    </a>
                    ) : (
                    <Link
                        key={link.label}
                        to={link.to}
                        style={{
                        fontFamily: 'var(--font-secundaria)',
                        fontSize: '12px',
                        color: 'var(--negro)',
                        textDecoration: 'none',
                        letterSpacing: '0.03em',
                        opacity: 0.6,
                        transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                    >
                        {link.label}
                    </Link>
                    )
                ))}
                </div>
            </div>
            ))}
        </div>

        {/* Logo grande */}
        <div style={{
            display: 'flex',
            flexDirection: isSmall ? 'column' : 'row',
            alignItems: isSmall ? 'flex-start' : 'flex-end',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            paddingTop: '24px',
            gap: isSmall ? '16px' : '0',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
                src="https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779351951/LIMINAL_kqqbun.svg"
                alt="LIMINAL"
                style={{ height: isSmall ? '80px' : '150px', width: 'auto' }}
            />
            <h2 style={{
                fontFamily: 'var(--font-principal)',
                fontSize: isSmall ? 'clamp(40px, 12vw, 72px)' : 'clamp(48px, 8vw, 120px)',
                fontWeight: 450,
                color: 'var(--negro)',
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                lineHeight: 0.85,
                margin: 0,
            }}>
                LIMINAL
            </h2>
            </div>

            <p style={{
            fontFamily: 'var(--font-secundaria)',
            fontSize: '11px',
            color: 'var(--negro)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.4,
            margin: 0,
            textAlign: isSmall ? 'left' : 'right',
            }}>
            © 2025 — LIMINAL™<br />
            All rights reserved
            </p>
        </div>

        </footer>
    )
}

export default Footer
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

const MENU_CHARS = '!@#$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MENU_WORD = 'MENU'
const CERRAR_WORD = 'CERRAR'

const scramble = (target: string, progress: number): string => {
  return target.split('').map((char, i) => {
    if (i < Math.floor(progress * target.length)) return char
    return MENU_CHARS[Math.floor(Math.random() * MENU_CHARS.length)]
  }).join('')
}

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuText, setMenuText] = useState(MENU_WORD)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 768)
  const [lang, setLang] = useState<'es' | 'en'>('es')
  const [offsetY, setOffsetY] = useState(0)
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const targetOffsetY = useRef(0)
  const currentOffsetY = useRef(0)
  const rafRef = useRef<number | null>(null)

  const links = [
    { label: t('archivo'), path: '/archivo' },
    { label: t('referentes'), path: '/referentes' },
    { label: t('comunidad'), path: '/comunidad' },
    { label: t('about'), path: '/about' },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480)
      setIsTablet(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    let progress = 0
    const target = menuOpen ? CERRAR_WORD : MENU_WORD
    if (animRef.current) clearInterval(animRef.current)
    animRef.current = setInterval(() => {
      progress += 0.07
      setMenuText(scramble(target, progress))
      if (progress >= 1) {
        setMenuText(target)
        clearInterval(animRef.current!)
      }
    }, 40)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const handleMouseMove = (e: MouseEvent) => {
      const centerY = window.innerHeight / 2
      const relY = (e.clientY - centerY) / centerY
      targetOffsetY.current = relY * (isMobile ? -60 : -120)
    }

    const animate = () => {
      currentOffsetY.current += (targetOffsetY.current - currentOffsetY.current) * 0.08
      setOffsetY(currentOffsetY.current)
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      targetOffsetY.current = 0
      currentOffsetY.current = 0
      setOffsetY(0)
    }
  }, [menuOpen, isMobile])

  const handleMenuHover = () => {
    let progress = 0
    const target = menuOpen ? CERRAR_WORD : MENU_WORD
    if (animRef.current) clearInterval(animRef.current)
    animRef.current = setInterval(() => {
      progress += 0.07
      setMenuText(scramble(target, progress))
      if (progress >= 1) {
        setMenuText(target)
        clearInterval(animRef.current!)
      }
    }, 40)
  }

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const toggleLang = (l: 'es' | 'en') => {
    setLang(l)
    i18n.changeLanguage(l)
  }

  const navWidth = isMobile ? '90%' : isTablet ? '70%' : '40%'

  const linkBaseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-principal)',
    fontSize: isMobile
      ? 'clamp(72px, 22vw, 120px)'
      : isTablet
      ? 'clamp(100px, 18vw, 180px)'
      : 'clamp(140px, 15vw, 300px)',
    fontWeight: 350,
    color: 'var(--negro)',
    textDecoration: 'none',
    lineHeight: 0.85,
    letterSpacing: '-0.03em',
    textTransform: 'uppercase',
    textAlign: 'center',
    display: 'block',
    width: '100%',
    whiteSpace: 'nowrap',
    transition: 'opacity 0.2s',
  }

  return (
    <>
      {/* NAVBAR PÍLDORA */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: navWidth,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '60px',
        borderRadius: '15px',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(0, 0, 0, 0.05)',
      }}>

        <Link to="/" style={{
          fontFamily: 'var(--font-secundaria)',
          fontSize: isMobile ? '10px' : '12px',
          color: 'var(--negro)',
          textDecoration: 'none',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          LIMINAL
        </Link>

        <Link to="/" style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}>
          <img
            src="https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779351951/LIMINAL_kqqbun.svg"
            alt="LIMINAL"
            style={{ height: isMobile ? '40px' : '70px' }}
          />
        </Link>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          onMouseEnter={handleMenuHover}
          style={{
            fontFamily: 'var(--font-secundaria)',
            fontSize: isMobile ? '10px' : '12px',
            color: 'var(--negro)',
            letterSpacing: '0.2em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {menuText}
        </button>
      </div>

      {/* MENÚ DESPLEGADO */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        background: 'var(--verde)',
        display: 'flex',
        flexDirection: 'column',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
        overflow: 'hidden',
      }}>

        {/* Arriba izquierda — selector idioma */}
        <div style={{
          position: 'absolute',
          top: isMobile ? '20px' : '32px',
          left: isMobile ? '20px' : '32px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          zIndex: 10,
        }}>
          {(['es', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => toggleLang(l)}
              style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: isMobile ? '10px' : '12px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--negro)',
                opacity: lang === l ? 1 : 0.35,
                fontWeight: lang === l ? 600 : 400,
                padding: 0,
                transition: 'opacity 0.2s',
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Arriba derecha — ENTRAR / SALIR */}
        {!isAuthenticated ? (
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: isMobile ? '16px' : '28px',
              right: isMobile ? '20px' : '32px',
              fontFamily: 'var(--font-secundaria)',
              fontSize: isMobile ? '10px' : '14px',
              fontWeight: 600,
              color: 'var(--negro)',
              textDecoration: 'none',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              zIndex: 10,
            }}
          >
            {t('entrar')}
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              position: 'absolute',
              top: isMobile ? '16px' : '28px',
              right: isMobile ? '20px' : '32px',
              fontFamily: 'var(--font-secundaria)',
              fontSize: isMobile ? '10px' : '14px',
              fontWeight: 600,
              color: 'var(--negro)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              zIndex: 10,
            }}
          >
            {t('salir')}
          </button>
        )}

        {/* Links con parallax vertical */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: `translateY(calc(-50% + ${offsetY}px))`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          height: isMobile ? '160vh' : isTablet ? '170vh' : '180vh',
          willChange: 'transform',
        }}>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={linkBaseStyle}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.4')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              style={{
                ...linkBaseStyle,
                fontSize: isMobile ? 'clamp(28px, 8vw, 48px)' : 'clamp(40px, 8vw, 100px)',
                opacity: 0.5,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
            >
              {user?.username?.toUpperCase()}
            </Link>
          )}
        </div>

        {/* Info esquinas abajo */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          fontFamily: 'var(--font-secundaria)',
          fontSize: isMobile ? '9px' : '11px',
          color: 'var(--negro)',
          opacity: 0.6,
          letterSpacing: '0.1em',
          zIndex: 10,
        }}>
          LIMINAL™ — 2025
        </div>
        <div style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          fontFamily: 'var(--font-secundaria)',
          fontSize: isMobile ? '9px' : '11px',
          color: 'var(--negro)',
          opacity: 0.6,
          letterSpacing: '0.1em',
          zIndex: 10,
          textAlign: 'right',
        }}>
          {t('liminal_desc')}
        </div>
      </div>
    </>
  )
}

export default Navbar
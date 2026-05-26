import type { ReactNode } from 'react'

interface MacWindowProps {
    title: string
    children: ReactNode
    width?: string
    rightAction?: ReactNode
}

export const macInput: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    color: '#333',
    background: 'white',
    border: '1px solid #aaa',
    borderRadius: '4px',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
    letterSpacing: '0.03em',
    boxSizing: 'border-box' as const,
}

export const macLabel: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '11px',
    color: '#444',
    letterSpacing: '0.05em',
    marginBottom: '4px',
    display: 'block',
}

export const macButton: React.CSSProperties = {
    padding: '6px 20px',
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    fontWeight: 600,
    color: 'white',
    background: 'linear-gradient(to bottom, #4dff4a, #15e012 50%, #0ab008)',
    border: '1px solid #0a9e08',
    borderRadius: '6px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.15)',
    transition: 'opacity 0.15s',
}

    export const macButtonSecondary: React.CSSProperties = {
    padding: '6px 20px',
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    fontWeight: 600,
    color: '#333',
    background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
    border: '1px solid #aaa',
    borderRadius: '6px',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.1)',
    transition: 'opacity 0.15s',
}

const MacWindow = ({ title, children, width = '420px', rightAction }: MacWindowProps) => {
    return (
        <div style={{
        width,
        maxWidth: '95vw',
        borderRadius: '8px',
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
            {title}
            </span>
        </div>

        {/* Contenido */}
        <div style={{
            background: '#f0f0f0',
            padding: '24px',
        }}>
            {children}
        </div>

        {/* Barra inferior */}
        <div style={{
            background: 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)',
            padding: '4px 16px',
            borderTop: '1px solid #999',
            display: 'flex',
            justifyContent: 'flex-end',
        }}>
            <div style={{
            width: '10px',
            height: '10px',
            backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)',
            backgroundSize: '3px 3px',
            opacity: 0.6,
            }} />
        </div>
        </div>
    )
}

export default MacWindow
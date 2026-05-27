import Button from '../../components/Button'

const NotFound = () => (
    <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--blanco)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        boxSizing: 'border-box',
        gap: '32px',
    }}>
        <h1 style={{
        fontFamily: 'var(--font-principal)',
        fontSize: 'clamp(80px, 20vw, 200px)',
        fontWeight: 700,
        color: 'var(--negro)',
        letterSpacing: '-0.05em',
        lineHeight: 1,
        margin: 0,
        }}>
        404
        </h1>

        <div style={{ textAlign: 'center' }}>
        <p style={{
            fontFamily: 'var(--font-principal)',
            fontSize: 'clamp(24px, 5vw, 48px)',
            fontWeight: 700,
            color: 'var(--negro)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            margin: '0 0 12px',
        }}>
            Archivo no encontrado
        </p>
        <p style={{
            fontFamily: 'var(--font-secundaria)',
            fontSize: '13px',
            color: '#888',
            letterSpacing: '0.05em',
            margin: 0,
        }}>
            Esta página no existe o ha sido eliminada del archivo.
        </p>
        </div>

        <Button href="/" color="#15e012" shadowColor="21,224,18" textColor="var(--negro)">
        Volver al inicio
        </Button>
    </div>
)

export default NotFound
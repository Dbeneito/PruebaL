import CubeGallery from '../../components/CubeGallery'

const Landing = () => {
    return (
        <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--blanco)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 40px 60px',
        }}>
        <CubeGallery />
        </div>
    )
}

export default Landing
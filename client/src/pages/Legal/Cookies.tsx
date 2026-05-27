import MacWindow from '../../components/MacWindows'

const Cookies = () => (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--blanco)', padding: '100px 60px 60px', boxSizing: 'border-box' }}>
        <MacWindow title="LIMINAL — Política de Cookies" width="100%">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
                <h1 style={{ fontFamily: 'var(--font-principal)', fontSize: '40px', fontWeight: 700, color: 'var(--negro)', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Cookies
                </h1>

                {[
                { title: '¿Qué son las cookies?', content: 'Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas una web. Permiten que la web recuerde información sobre tu visita.' },
                { title: 'Cookies que usamos', content: 'LIMINAL utiliza únicamente cookies técnicas esenciales: una cookie de sesión para mantener tu login activo. No usamos cookies de análisis, publicidad ni seguimiento de terceros.' },
                { title: 'Cookie de sesión', content: 'Al iniciar sesión, guardamos un token JWT en el localStorage de tu navegador para mantenerte autenticado. Este token expira a los 7 días.' },
                { title: 'Cómo desactivarlas', content: 'Puedes eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que si eliminas el token de sesión, tendrás que volver a iniciar sesión.' },
                { title: 'Cookies de terceros', content: 'No utilizamos cookies de terceros. Las imágenes servidas desde Cloudinary pueden registrar accesos en sus propios logs, sujetos a su propia política de privacidad.' },
                ].map((section, i) => (
                <div key={i} style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '12px', fontWeight: 700, color: 'var(--negro)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 8px' }}>
                    {section.title}
                    </p>
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '13px', color: '#444', lineHeight: 1.8, margin: 0 }}>
                    {section.content}
                    </p>
                </div>
                ))}
            </div>
        </MacWindow>
    </div>
)

export default Cookies
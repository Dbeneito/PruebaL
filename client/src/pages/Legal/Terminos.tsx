import MacWindow from '../../components/MacWindows'

const Terminos = () => (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--blanco)', padding: '100px 60px 60px', boxSizing: 'border-box' }}>
        <MacWindow title="LIMINAL — Términos de Uso" width="100%">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
                <h1 style={{ fontFamily: 'var(--font-principal)', fontSize: '40px', fontWeight: 700, color: 'var(--negro)', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Términos de uso
                </h1>

                {[
                { title: '1. Aceptación', content: 'Al usar LIMINAL aceptas estos términos. Si no estás de acuerdo, por favor no uses la plataforma. LIMINAL es un proyecto académico sin fines comerciales.' },
                { title: '2. Uso de la plataforma', content: 'LIMINAL es un archivo digital creativo. Puedes publicar proyectos propios, explorar el trabajo de otros creativos y dar NoLikes a los proyectos que te inspiren.' },
                { title: '3. Contenido publicado', content: 'Al publicar contenido en LIMINAL, confirmas que tienes los derechos sobre ese contenido. No se permite publicar contenido que infrinja derechos de autor, sea ofensivo o inapropiado.' },
                { title: '4. Cuentas de usuario', content: 'Eres responsable de mantener la confidencialidad de tu contraseña. No compartas tu cuenta con terceros. Nos reservamos el derecho de suspender cuentas que incumplan estos términos.' },
                { title: '5. Limitación de responsabilidad', content: 'LIMINAL se proporciona tal como es, sin garantías de ningún tipo. Al ser un proyecto académico, puede contener errores o interrupciones del servicio.' },
                { title: '6. Modificaciones', content: 'Estos términos pueden actualizarse en cualquier momento. El uso continuado de la plataforma implica la aceptación de los términos vigentes.' },
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

export default Terminos
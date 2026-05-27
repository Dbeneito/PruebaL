import MacWindow from '../../components/MacWindows'

const Privacidad = () => (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--blanco)', padding: '100px 60px 60px', boxSizing: 'border-box' }}>
        <MacWindow title="LIMINAL — Política de Privacidad" width="100%">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>
                <h1 style={{ fontFamily: 'var(--font-principal)', fontSize: '40px', fontWeight: 700, color: 'var(--negro)', margin: 0, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                Privacidad
                </h1>

                {[
                { title: '1. Responsable del tratamiento', content: 'LIMINAL es un proyecto académico desarrollado como Trabajo de Fin de Grado (TFG) en CEI Sevilla. Los datos recogidos son tratados únicamente con fines demostrativos y académicos.' },
                { title: '2. Datos que recogemos', content: 'Recogemos los datos que el usuario proporciona voluntariamente al registrarse: nombre de usuario, dirección de email, contraseña (cifrada), disciplina creativa, ubicación y año de nacimiento.' },
                { title: '3. Finalidad del tratamiento', content: 'Los datos se utilizan exclusivamente para el funcionamiento de la plataforma: autenticación, personalización del perfil y publicación de proyectos creativos.' },
                { title: '4. Almacenamiento', content: 'Los datos se almacenan en una base de datos MySQL. Las contraseñas están cifradas con bcrypt y nunca se almacenan en texto plano.' },
                { title: '5. Derechos del usuario', content: 'Puedes solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento desde el panel de ajustes o contactando con el administrador.' },
                { title: '6. Cookies', content: 'LIMINAL utiliza únicamente cookies técnicas necesarias para el funcionamiento de la sesión. No se utilizan cookies de seguimiento ni publicidad.' },
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

export default Privacidad
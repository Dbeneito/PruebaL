import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import MacWindow from '../../components/MacWindows'
import Button from '../../components/Button'
import { API_URL } from '../../config/api'

type Tab = 'login' | 'registro'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({
    email: '',
    username: '',
    password: '',
    confirm: '',
    discipline: '',
    location: '',
    birth_year: '',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, loginForm)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (regForm.password !== regForm.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (regForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        email: regForm.email,
        username: regForm.username,
        password: regForm.password,
        discipline: regForm.discipline || null,
        location: regForm.location || null,
        birth_year: regForm.birth_year ? parseInt(regForm.birth_year) : null,
      })
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '5px 10px',
    fontFamily: 'var(--font-secundaria)',
    fontSize: '12px',
    color: '#222',
    background: 'white',
    border: '1px solid #bbb',
    borderRadius: '20px',
    outline: 'none',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
    boxSizing: 'border-box' as const,
  }

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    borderRadius: '6px',
    appearance: 'auto' as any,
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-secundaria)',
    fontSize: '11px',
    color: '#444',
    letterSpacing: '0.03em',
    display: 'block',
    marginBottom: '4px',
    paddingLeft: '4px',
  }

  const progressPct = (Object.values(regForm).filter(v => v.length > 0).length / 7) * 100

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: 'var(--blanco)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 16px 60px',
    }}>
      <MacWindow title="LIMINAL" width="min(400px, 95vw)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex',
              background: 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)',
              border: '1px solid #999',
              borderRadius: '8px',
              padding: '2px',
              gap: '2px',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
            }}>
              {(['login', 'registro'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError('') }}
                  style={{
                    padding: '4px 24px',
                    fontFamily: 'var(--font-secundaria)',
                    fontSize: '12px',
                    fontWeight: tab === t ? 600 : 400,
                    color: tab === t ? 'white' : '#444',
                    background: tab === t
                      ? 'linear-gradient(to bottom, #4dff4a, #15e012 50%, #0ab008)'
                      : 'transparent',
                    border: tab === t ? '1px solid #0a9e08' : '1px solid transparent',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    boxShadow: tab === t ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {t === 'login' ? 'Entrar' : 'Registrarse'}
                </button>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div style={{
            background: '#ebebeb',
            border: '1px solid #c0c0c0',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
          }}>

            {/* LOGIN */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>

                {error && (
                  <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#cc1100', margin: 0, textAlign: 'center' }}>
                    {error}
                  </p>
                )}

                <div style={{ height: '1px', background: '#c0c0c0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <Button onClick={() => setTab('registro')} size="sm" color="#888" shadowColor="136,136,136">
                    No tengo cuenta
                  </Button>
                  <Button size="sm">
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </div>
              </form>
            )}

            {/* REGISTRO */}
            {tab === 'registro' && (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                <div>
                  <label style={labelStyle}>Usuario</label>
                  <input
                    type="text"
                    placeholder="tu_usuario"
                    value={regForm.username}
                    onChange={e => setRegForm({ ...regForm, username: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={regForm.email}
                    onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={regForm.password}
                    onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: regForm.password.length > 0 && regForm.password.length < 6 ? '#cc1100' : '#bbb',
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Confirmar contraseña</label>
                  <input
                    type="password"
                    placeholder="Repite la contraseña"
                    value={regForm.confirm}
                    onChange={e => setRegForm({ ...regForm, confirm: e.target.value })}
                    style={{
                      ...inputStyle,
                      borderColor: regForm.confirm.length > 0 && regForm.confirm !== regForm.password ? '#cc1100' : '#bbb',
                    }}
                    required
                  />
                  {regForm.confirm.length > 0 && regForm.confirm !== regForm.password && (
                    <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#cc1100', margin: '4px 0 0 4px' }}>
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Disciplina</label>
                  <select
                    value={regForm.discipline}
                    onChange={e => setRegForm({ ...regForm, discipline: e.target.value })}
                    style={selectStyle}
                  >
                    <option value="">Selecciona una disciplina</option>
                    <option>Diseño Gráfico</option>
                    <option>Moda</option>
                    <option>Arquitectura</option>
                    <option>Ilustración</option>
                    <option>Tipografía</option>
                    <option>Motion</option>
                    <option>Fotografía</option>
                    <option>Branding</option>
                    <option>Arte</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Ubicación</label>
                  <input
                    type="text"
                    placeholder="Ciudad, País"
                    value={regForm.location}
                    onChange={e => setRegForm({ ...regForm, location: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Año de nacimiento</label>
                  <input
                    type="number"
                    placeholder="1990"
                    min="1930"
                    max="2010"
                    value={regForm.birth_year}
                    onChange={e => setRegForm({ ...regForm, birth_year: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Progress bar */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: '6px' }}>Progreso</label>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#ddd',
                    borderRadius: '20px',
                    border: '1px solid #bbb',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${progressPct}%`,
                      background: progressPct === 100
                        ? 'linear-gradient(to right, #4dff4a, #15e012)'
                        : 'linear-gradient(to right, #ffdd57, #e6a800)',
                      borderRadius: '20px',
                      transition: 'width 0.3s ease, background 0.3s ease',
                    }} />
                  </div>
                </div>

                {error && (
                  <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: '#cc1100', margin: 0, textAlign: 'center' }}>
                    {error}
                  </p>
                )}

                <div style={{ height: '1px', background: '#c0c0c0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <Button onClick={() => setTab('login')} size="sm" color="#888" shadowColor="136,136,136">
                    Ya tengo cuenta
                  </Button>
                  <Button size="sm">
                    {loading ? 'Creando...' : 'Crear cuenta'}
                  </Button>
                </div>

              </form>
            )}

          </div>
        </div>
      </MacWindow>
    </div>
  )
}

export default Login
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div style={{ paddingTop: '52px' }}>
          <AppRouter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
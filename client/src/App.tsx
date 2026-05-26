import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import StatusBar from './components/StatusBar'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div style={{ paddingTop: '10px', paddingBottom: '32px' }}>
          <AppRouter />
        </div>
        <StatusBar />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
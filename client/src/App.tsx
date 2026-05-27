import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import StatusBar from './components/StatusBar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'

function App() {
  return (
    <BrowserRouter>
    <CookieBanner />
      <AuthProvider>
        <Navbar />
        <div style={{ paddingTop: '10px', paddingBottom: '32px' }}>
          <AppRouter />
        </div>
        <Footer />
        <StatusBar />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
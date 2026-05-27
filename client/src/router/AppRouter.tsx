import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import Landing from '../pages/Landing/Landing'
import Archivo from '../pages/Archivo/Archivo'
import Proyecto from '../pages/Proyecto/Proyecto'
import Perfil from '../pages/Perfil/Perfil'
import Referentes from '../pages/Referentes/Referentes'
import ReferenteDetalle from '../pages/Referentes/ReferentesDetalle'
import Comunidad from '../pages/Comunidad/Comunidad'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import Publicar from '../pages/Publicar/Publicar'
import Admin from '../pages/Admin/Admin'
import Privacidad from '../pages/Legal/Privacidad'
import Terminos from '../pages/Legal/Terminos'
import Cookies from '../pages/Legal/Cookies'
import NotFound from '../pages/NotFound/NotFound'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const AppRouter = () => {
    return (
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/archivo" element={<Archivo />} />
        <Route path="/proyecto/:id" element={<Proyecto />} />
        <Route path="/perfil/:username" element={<Perfil />} />
        <Route path="/referentes" element={<Referentes />} />
        <Route path="/referentes/:slug" element={<ReferenteDetalle />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Login />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/publicar" element={
            <PrivateRoute><Publicar /></PrivateRoute>
        } />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
    )
    }

export default AppRouter
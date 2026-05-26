import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import Landing from '../pages/Landing/Landing'
import Archivo from '../pages/Archivo/Archivo'
import Proyecto from '../pages/Proyecto/Proyecto'
import Perfil from '../pages/Perfil/Perfil'
import Referentes from '../pages/Referentes/Referentes'
import Comunidad from '../pages/Comunidad/Comunidad'
import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import Publicar from '../pages/Publicar/Publicar'
import Admin from '../pages/Admin/Admin'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth()
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAdmin } = useAuth()
    return isAdmin ? <>{children}</> : <Navigate to="/" />
}

const AppRouter = () => {
    return (
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/archivo" element={<Archivo />} />
        <Route path="/proyecto/:id" element={<Proyecto />} />
        <Route path="/perfil/:username" element={<Perfil />} />
        <Route path="/referentes" element={<Referentes />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Login />} />
        <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/publicar" element={
            <PrivateRoute><Publicar /></PrivateRoute>
        } />
        <Route path="/admin" element={
            <AdminRoute><Admin /></AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AppRouter
import { useEffect, useState } from 'react'
import CubeGallery from '../../components/CubeGallery'
import FloatingWindows from '../../components/FloatingWindows'
import Button from '../../components/Button'
import FinderWindow from '../../components/FinderWindow'
import ReferentesDesktop from '../../components/ReferentesDesktop'
import { Link } from 'react-router-dom'

const TAGS = ['EST. 2025', 'VALENCIA — ES', 'ARCHIVO DIGITAL', 'COMUNIDAD CREATIVA']

const Landing = () => {
  const [isSmall, setIsSmall] = useState(window.innerWidth <= 480)
  
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsSmall(window.innerWidth <= 480)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <div className="w-full bg-[var(--blanco)] mt-12 overflow-x-hidden relative">

      {/* SECCIÓN 1 — HERO */}
      <div className={`
        relative w-full min-h-screen flex flex-col items-center justify-center gap-6 z-10
        transition-opacity duration-700 ease-in
        ${isSmall ? 'px-5 py-20' : 'px-10 py-20'}
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}>
        {!isSmall && <FloatingWindows />}
        <div className="relative z-0">
          <CubeGallery />
        </div>
        <p className="font-[var(--font-secundaria)] text-[22px] text-black tracking-[-0.12em] text-center mt-12 opacity-90 max-w-[600px] relative z-30">
          El único archivo que realmente importa.
        </p>
        <Link
            to="/login">
          <Button   size={isSmall ? 'sm' : 'md'}>
            Entrar / Registrarse
          </Button>
        </Link>
      </div>

      {/* SECCIÓN 2 — BIO EDITORIAL */}
      <div className={`w-full bg-[var(--blanco)] border-t border-[var(--negro)] grid relative z-10 ${isSmall ? 'grid-cols-1' : 'grid-cols-[80px_1fr]'}`}>

        {!isSmall && (
          <div className="border-r border-[var(--negro)] flex items-center justify-center py-10">
            <span className="font-[var(--font-secundaria)] text-[10px] text-[var(--negro)] tracking-[0.2em] uppercase opacity-40 [writing-mode:vertical-rl] rotate-180">
              LIMINAL™ — 001
            </span>
          </div>
        )}

        <div className={`flex flex-col gap-12 ${isSmall ? 'px-6 py-16' : 'px-16 py-20'}`}>

          <div className="flex flex-wrap gap-6 pb-8 border-b border-black/10">
            {TAGS.map(tag => (
              <span key={tag} className="font-[var(--font-secundaria)] text-[10px] text-[var(--negro)] tracking-[0.2em] uppercase opacity-40">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-6 max-w-[680px]">
            <p className={`font-[var(--font-secundaria)] text-[var(--negro)] leading-[1.9] tracking-[0.03em] m-0 ${isSmall ? 'text-[13px]' : 'text-[15px]'}`}>
              LIMINAL es un archivo digital de proyectos creativos contemporáneos.
              Un espacio donde diseñadores, artistas y creativos de todo el mundo
              documentan, comparten y construyen referencias visuales colectivamente.
            </p>
            <p className={`font-[var(--font-secundaria)] text-[var(--negro)] leading-[1.9] tracking-[0.03em] m-0 opacity-50 ${isSmall ? 'text-[13px]' : 'text-[15px]'}`}>
              No es una red social. No es un portfolio. Es el espacio entre
              la idea y el archivo — donde la creatividad se preserva,
              evoluciona y se comparte sin restricciones ni fronteras.
            </p>
          </div>

          <p className={`font-[var(--font-secundaria)] text-[#CC1100] tracking-[0.15em] uppercase m-0 pt-8 border-t border-black/10 ${isSmall ? 'text-[12px]' : 'text-[13px]'}`}>
            "THE SPACE BETWEEN THE IDEA AND THE ARCHIVE."
          </p>

          <div className="flex justify-between flex-wrap gap-4 pt-8 border-t border-[var(--negro)] mt-4">
            {['Based in Valencia, Spain', 'By glax.xyz', 'LIMINAL™ — All rights reserved 2025'].map(text => (
              <p key={text} className="font-[var(--font-secundaria)] text-[10px] text-[var(--negro)] tracking-[0.1em] uppercase m-0 opacity-40">
                {text}
              </p>
            ))}
          </div>

        </div>
      </div>

      {/* SECCIÓN 3 — FINDER WINDOW */}
      <div className={`w-full  border-t border-[var(--negro)] relative z-10 ${isSmall ? 'px-6 py-16' : 'px-20 py-24'}`}>
        <FinderWindow />
      </div>

      {/* SECCIÓN 4 — REFERENTES */}
      <div className="w-full  relative z-10">

        <div className={`flex justify-between items-end ${isSmall ? 'px-6 py-10 pb-6 gap-5' : 'px-20 py-16 pb-10'}`}>
          <span className={`font-[var(--font-principal)] font-bold text-[var(--negro)] tracking-[-0.02em] uppercase leading-none ${isSmall ? 'text-[32px]' : 'text-[56px]'}`}>
            REFERENTES
          </span>
          <span className="font-[var(--font-secundaria)] text-[11px] text-[var(--negro)] tracking-[0.1em] uppercase opacity-40">
            Creativos que nos inspiran
          </span>
        </div>

        <ReferentesDesktop />

      </div>

    </div>
  )
}

export default Landing
import { useState, useEffect } from 'react'
import MacWindow from './MacWindows'
import ProjectCard from './ProjectCard'
import { Link } from 'react-router-dom'

const CATEGORIES = [
    { label: 'Diseño_Gráfico' },
    { label: 'Moda' },
    { label: 'Arquitectura' },
    { label: 'Tipografía' },
    { label: 'Motion' },
    { label: 'Fotografía' },
    ]

    const PROJECTS = [
    { id: 1,  title: 'Identidad visual',   img: 'https://picsum.photos/seed/p1/400/300'  },
    { id: 2,  title: 'Colección SS26',     img: 'https://picsum.photos/seed/p2/400/300'  },
    { id: 3,  title: 'Pabellón efímero',   img: 'https://picsum.photos/seed/p3/400/300'  },
    { id: 4,  title: 'Typeface Grau',      img: 'https://picsum.photos/seed/p4/400/300'  },
    { id: 5,  title: 'Branding editorial', img: 'https://picsum.photos/seed/p5/400/300'  },
    { id: 6,  title: 'Fragmentos',         img: 'https://picsum.photos/seed/p6/400/300'  },
    { id: 7,  title: 'Serie documental',   img: 'https://picsum.photos/seed/p7/400/300'  },
    { id: 8,  title: 'Zine post modern',   img: 'https://picsum.photos/seed/p8/400/300'  },
    { id: 9,  title: 'Cartel soviético',   img: 'https://picsum.photos/seed/p9/400/300'  },
    { id: 10, title: 'Sistema señalética', img: 'https://picsum.photos/seed/p10/400/300' },
    { id: 11, title: 'Packaging minimal',  img: 'https://picsum.photos/seed/p11/400/300' },
    { id: 12, title: 'Ilustración urbana', img: 'https://picsum.photos/seed/p12/400/300' },
    ]

    const CategoryButton = ({
    label, active, onClick, className = '',
    }: { label: string; active: boolean; onClick: () => void; className?: string }) => (
    <button
        onClick={onClick}
        className={`font-[var(--font-secundaria)] tracking-wide cursor-pointer border-none ${active ? 'bg-gradient-to-b from-[#4dff4a] to-[#15e012] text-[#1a4d19]' : 'bg-black/[0.06] text-[#333]'} ${className}`}
    >
        {label}
    </button>
    )

    const FinderWindow = () => {
    const [activeCategory, setActiveCategory] = useState('Diseño_Gráfico')
    const [isSmall, setIsSmall] = useState(window.innerWidth <= 768)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480)

    useEffect(() => {
        const handleResize = () => {
        setIsSmall(window.innerWidth <= 768)
        setIsMobile(window.innerWidth <= 480)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <MacWindow
        title="LIMINAL — Archivo"
        width="100%"
        rightAction={
            <Link
            to="/archivo"
            style={{
                fontFamily: 'var(--font-secundaria)',
                fontSize: '10px',
                color: '#555',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
            }}
            >
            {isSmall ? '→' : 'Ver todo →'}
            </Link>
        }
        >
        <div style={{ margin: '-24px' }}>

            {/* Categorías móvil/tablet */}
            {isSmall && (
            <div className="bg-gradient-to-r from-[#e0e0e0] to-[#e8e8e8] border-b border-[#ccc] flex overflow-x-auto px-3 py-2 gap-1.5 [scrollbar-width:none]">
                {CATEGORIES.map(cat => (
                <CategoryButton
                    key={cat.label}
                    label={cat.label}
                    active={activeCategory === cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className="shrink-0 px-3 py-1 text-[10px] rounded"
                />
                ))}
            </div>
            )}

            {/* Cuerpo */}
            <div className={`grid bg-[#f0f0f0] ${isSmall ? 'grid-cols-1 min-h-[320px]' : 'grid-cols-[180px_1fr] min-h-[480px]'}`}>

            {/* Sidebar escritorio */}
            {!isSmall && (
                <div className="border-r border-[#ccc] bg-gradient-to-r from-[#e0e0e0] to-[#e8e8e8] py-3">
                <p className="font-[var(--font-secundaria)] text-[10px] text-[#888] tracking-[0.1em] uppercase px-4 mb-2">
                    Categorías
                </p>
                {CATEGORIES.map(cat => (
                    <CategoryButton
                    key={cat.label}
                    label={cat.label}
                    active={activeCategory === cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`w-full text-left px-4 py-1.5 text-[11px] block ${activeCategory === cat.label ? 'rounded mx-1 !w-[calc(100%-8px)]' : 'rounded-none'}`}
                    />
                ))}
                </div>
            )}

            {/* Grid proyectos */}
            <div className={`bg-[#f5f5f5] overflow-y-auto grid content-start ${isSmall ? 'p-3 gap-2 max-h-[320px] grid-cols-2' : 'p-5 gap-3 max-h-[480px] grid-cols-6'}`}>
                {PROJECTS.map(project => (
                <ProjectCard key={project.id} {...project} isMobile={isMobile} />
                ))}
            </div>

            </div>

        </div>
        </MacWindow>
    )
}

export default FinderWindow
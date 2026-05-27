import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FolderIconProps {
    name: string
    slug: string
    size?: number
    rotation?: number
    shadow?: boolean
}

const ICON_CLOSED = 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779530783/folders_Folders_Set_Multiple_Styles_zronex.svg'
const ICON_OPEN   = 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779530783/folders-02_gah1ah.svg'

const FolderIcon = ({ name, slug, size = 80, rotation = 0, shadow = false }: FolderIconProps) => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => {
        navigate(`/referentes/${slug}`)
        }, 400)
    }

    return (
        
        <a
        href={`/referentes/${slug}`}
        onClick={handleClick}
        style={{
            transform: `rotate(${rotation}deg)`,
            filter: shadow ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))' : 'none',
            transition: 'transform 0.2s, filter 0.2s',
            display: 'inline-block',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)'
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`
        }}
        className="no-underline flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md transition-colors hover:bg-[rgba(21,224,18,0.12)]"
        >
        <img
            src={open ? ICON_OPEN : ICON_CLOSED}
            alt={name}
            width={size}
            height={size * 0.8}
            className="transition-all duration-200"
        />
        <span
            className="font-[var(--font-secundaria)] text-[11px] text-[var(--negro)] tracking-[0.05em] text-center truncate"
            style={{ maxWidth: size + 20 }}
        >
            {name}
        </span>
        </a>
    )
}

export default FolderIcon
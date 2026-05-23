import { useState } from 'react'

interface FolderIconProps {
    name: string
    slug: string
    size?: number
    }

const ICON_CLOSED = 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779530783/folders_Folders_Set_Multiple_Styles_zronex.svg'
const ICON_OPEN   = 'https://res.cloudinary.com/dcgb3jhf3/image/upload/v1779530783/folders-02_gah1ah.svg'

const FolderIcon = ({ name, slug, size = 80 }: FolderIconProps) => {
const [open, setOpen] = useState(false)

const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => {
        window.location.href = `/referentes/${slug}`
        }, 1000)
}

    return (
    <a    
        href={`/referentes/${slug}`}
        onClick={handleClick}
        className="no-underline flex flex-col items-center gap-2 cursor-pointer p-2 rounded-md transition-colors hover:bg-[rgba(21,224,18,0.12)]">

            <img
                src={open ? ICON_OPEN : ICON_CLOSED}
                alt={name}
                width={size}
                height={size * 0.8}
                className="transition-all duration-200"/>
            
            <span
                className="font-[var(--font-secundaria)] text-[11px] text-[var(--negro)] tracking-[0.05em] text-center truncate"
                style={{ maxWidth: size + 20 }}>
                {name}
            </span>
    </a>
    )
}

export default FolderIcon
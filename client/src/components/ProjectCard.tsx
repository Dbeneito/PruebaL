const toFileName = (title: string) => title.trim().replace(/\s+/g, '_') + '.jpg'

const ProjectCard = ({ id, title, img, isMobile }: {
    id: number
    title: string
    img: string
    isMobile: boolean
}) => (

    <a href={`/proyecto/${id}`}
    className="no-underline flex flex-col items-center gap-1.5 p-2 rounded transition-colors hover:bg-[rgba(21,224,18,0.12)]">
        <div className="w-full aspect-[4/3] rounded overflow-hidden border-4 border-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] ">
            <img
                src={img}
                alt={title}
                draggable={false}
                onDragStart={e => e.preventDefault()}
                className="w-full h-full object-cover"
            />
        </div>
        <p className={`font-[var(--font-secundaria)] font-medium tracking-[0.02em] text-[#222] text-center truncate w-full m-0 ${isMobile ? 'text-[9px]' : 'text-[10px]'}`}>
            {toFileName(title)}
        </p>
    </a>
)

export default ProjectCard
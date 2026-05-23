import FolderIcon from './FolderIcon'

const REFERENTES = [
    { name: 'Virgil_Abloh',        slug: 'virgil-abloh',        x: 8,  y: 12, size: 90 },
    { name: 'Dieter_Rams',         slug: 'dieter-rams',         x: 22, y: 45, size: 75 },
    { name: 'El_Lissitzky',        slug: 'el-lissitzky',        x: 5,  y: 68, size: 80 },
    { name: 'Bodys_Isek_Kingelez', slug: 'bodys-isek-kingelez', x: 38, y: 8,  size: 85 },
    { name: 'Iris_van_Herpen',     slug: 'iris-van-herpen',     x: 55, y: 55, size: 70 },
    { name: 'Paul_Rand',           slug: 'paul-rand',           x: 62, y: 20, size: 80 },
    { name: 'Wim_Crouwel',         slug: 'wim-crouwel',         x: 75, y: 68, size: 75 },
    { name: 'April_Greiman',       slug: 'april-greiman',       x: 82, y: 35, size: 70 },
    { name: 'Neville_Brody',       slug: 'neville-brody',       x: 42, y: 72, size: 85 },
    ]

const ReferentesDesktop = () => (
    <div className="w-full relative h-[500px] bg-[var(--blanco)]">
        {REFERENTES.map(({ slug, x, y, ...rest }) => (
            <div key={slug} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
                <FolderIcon slug={slug} {...rest} />
            </div>
        ))}
    </div>
)

export default ReferentesDesktop
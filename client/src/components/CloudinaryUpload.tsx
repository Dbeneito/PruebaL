import { useRef, useState } from 'react'

interface CloudinaryUploadProps {
    onUpload: (url: string) => void
    label?: string
}

const CLOUD_NAME = 'dcgb3jhf3'
const UPLOAD_PRESET = 'ml_default'

const CloudinaryUpload = ({ onUpload, label = 'Subir imagen' }: CloudinaryUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [error, setError] = useState('')

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = ev => setPreview(ev.target?.result as string)
        reader.readAsDataURL(file)

        setUploading(true)
        setError('')

        try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)
        formData.append('folder', 'liminal')

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData,
        })

        const data = await res.json()

        if (data.secure_url) {
            onUpload(data.secure_url)
            setPreview(data.secure_url)
        } else {
            setError('Error al subir la imagen')
        }
        } catch {
        setError('Error de conexión con Cloudinary')
        } finally {
        setUploading(false)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Preview */}
        {preview && (
            <div style={{
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            borderRadius: '4px',
            border: '1px solid #ccc',
            position: 'relative',
            }}>
            <img
                src={preview}
                alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {uploading && (
                <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}>
                <span style={{ fontFamily: 'var(--font-secundaria)', fontSize: '11px', color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Subiendo...
                </span>
                </div>
            )}
            </div>
        )}

        {/* Botón upload */}
        <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            style={{ display: 'none' }}
        />
        <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{
            width: '100%',
            padding: '10px',
            fontFamily: 'var(--font-secundaria)',
            fontSize: '11px',
            color: uploading ? '#888' : '#333',
            background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
            border: '1px solid #bbb',
            borderRadius: '4px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            }}
        >
            <span>{uploading ? '⏳ Subiendo...' : `📁 ${label}`}</span>
        </button>

        {error && (
            <p style={{ fontFamily: 'var(--font-secundaria)', fontSize: '10px', color: '#cc1100', margin: 0, letterSpacing: '0.05em' }}>
            {error}
            </p>
        )}
        </div>
    )
}

export default CloudinaryUpload
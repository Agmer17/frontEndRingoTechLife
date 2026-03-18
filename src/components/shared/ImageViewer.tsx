"use client"

import { X, ZoomIn, ZoomOut } from "lucide-react"
import { useState } from "react"

interface Props {
    src: string
    onClose: () => void
}

export function ImageViewer({ src, onClose }: Props) {

    const [zoom, setZoom] = useState(1)

    const zoomIn = () => setZoom((z) => z + 0.2)
    const zoomOut = () => setZoom((z) => Math.max(1, z - 0.2))

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">

            <button
                onClick={onClose}
                className="absolute top-6 right-6 btn btn-error border border-black"
            >
                <X />
            </button>

            <div className="flex flex-col items-center gap-4">

                <img
                    src={src}
                    style={{ transform: `scale(${zoom})` }}
                    className="max-h-[80vh]"
                />

                <div className="flex gap-2">

                    <button
                        onClick={zoomIn}
                        className="btn btn-primary border border-black flex gap-2"
                    >
                        <ZoomIn size={16} />
                        Zoom
                    </button>

                    <button
                        onClick={zoomOut}
                        className="btn btn-warning border border-black flex gap-2"
                    >
                        <ZoomOut size={16} />
                        Out
                    </button>

                </div>

            </div>

        </div>
    )
}
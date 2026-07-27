'use client'

import { Minus, Plus, RotateCcw } from 'lucide-react'
import { useControls } from 'react-zoom-pan-pinch'

interface PreviewToolbarProps {
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
}

export function PreviewToolbar({ zoomIn, zoomOut, resetTransform }: PreviewToolbarProps) {
  const { state } = useControls()

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white/90 px-3 py-2 shadow-lg backdrop-blur">

      <button
        onClick={() => zoomOut()}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
        title="Zoom Out"
      >
        <Minus size={18} />
      </button>

      <span className="min-w-[55px] text-center text-sm font-semibold">
        {Math.round(state.scale * 100)}%
      </span>

      <button
        onClick={() => zoomIn()}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
        title="Zoom In"
      >
        <Plus size={18} />
      </button>

      <button
        onClick={() => resetTransform()}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
        title="Reset"
      >
        <RotateCcw size={18} />
      </button>

    </div>
  )
}
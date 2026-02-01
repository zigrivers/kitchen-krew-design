import { useState } from 'react'
import {
  X,
  Download,
  Link2,
  Check,
  QrCode,
  Calendar,
  MapPin,
  Users,
  Loader2,
  ScanLine,
  UserCheck,
} from 'lucide-react'
import type { EventQRCode, Event } from '@/../product/sections/events/types'

// =============================================================================
// Props
// =============================================================================

export interface EventQRCodeModalProps {
  qrCode: EventQRCode | null
  event: Event
  isGenerating: boolean
  onDownload?: (format: 'png' | 'svg') => void
  onCopyLink?: () => void
  onClose?: () => void
}

// =============================================================================
// QR Code Placeholder (simulated QR code visual)
// =============================================================================

function QRCodePlaceholder({ size = 200 }: { size?: number }) {
  // Create a grid pattern that looks like a QR code
  const gridSize = 25
  const cellSize = size / gridSize

  // Generate deterministic "random" pattern
  const pattern: boolean[][] = []
  for (let i = 0; i < gridSize; i++) {
    pattern[i] = []
    for (let j = 0; j < gridSize; j++) {
      // Always have finder patterns in corners
      const isFinderPattern =
        (i < 7 && j < 7) || // top-left
        (i < 7 && j >= gridSize - 7) || // top-right
        (i >= gridSize - 7 && j < 7) // bottom-left

      if (isFinderPattern) {
        // Create finder pattern
        const isOuter = i === 0 || i === 6 || j === 0 || j === 6 ||
                       (i < 7 && (j === gridSize - 7 || j === gridSize - 1)) ||
                       (j >= gridSize - 7 && (i === 0 || i === 6)) ||
                       (i >= gridSize - 7 && (j === 0 || j === 6))
        const isInner = (i >= 2 && i <= 4 && j >= 2 && j <= 4) ||
                       (i >= 2 && i <= 4 && j >= gridSize - 5 && j <= gridSize - 3) ||
                       (i >= gridSize - 5 && i <= gridSize - 3 && j >= 2 && j <= 4)
        pattern[i][j] = isOuter || isInner
      } else {
        // Random-ish data pattern
        pattern[i][j] = ((i * 7 + j * 13 + i * j) % 3) === 0
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-lg">
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, i) =>
        row.map((cell, j) =>
          cell ? (
            <rect
              key={`${i}-${j}`}
              x={j * cellSize}
              y={i * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0f172a"
            />
          ) : null
        )
      )}
    </svg>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function EventQRCodeModal({
  qrCode,
  event,
  isGenerating,
  onDownload,
  onCopyLink,
  onClose,
}: EventQRCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | null>(null)

  const handleCopyLink = () => {
    onCopyLink?.()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (format: 'png' | 'svg') => {
    setDownloadFormat(format)
    onDownload?.(format)
    setTimeout(() => setDownloadFormat(null), 1000)
  }

  const isRegistrationQR = qrCode?.type === 'event_registration'
  const isCheckInQR = qrCode?.type === 'check_in'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isCheckInQR ? 'bg-sky-100 dark:bg-sky-900/30' : 'bg-lime-100 dark:bg-lime-900/30'}`}>
              {isCheckInQR ? (
                <UserCheck className={`w-5 h-5 text-sky-600 dark:text-sky-400`} />
              ) : (
                <QrCode className={`w-5 h-5 text-lime-600 dark:text-lime-400`} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isCheckInQR ? 'Check-in QR Code' : 'Registration QR Code'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isCheckInQR ? 'Players scan to check in' : 'Share to invite players'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Display */}
        <div className="px-6 py-6">
          <div className="flex flex-col items-center">
            {/* QR Code Container */}
            <div className="relative p-4 bg-white rounded-2xl shadow-lg border border-slate-200">
              {isGenerating ? (
                <div className="w-[200px] h-[200px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-lime-500 animate-spin" />
                </div>
              ) : (
                <QRCodePlaceholder size={200} />
              )}

              {/* Center icon overlay */}
              {!isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`p-2 rounded-lg bg-white shadow-md ${isCheckInQR ? 'text-sky-500' : 'text-lime-500'}`}>
                    {isCheckInQR ? (
                      <UserCheck className="w-6 h-6" />
                    ) : (
                      <ScanLine className="w-6 h-6" />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="mt-4 text-center">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {event.name}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.startDateTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.venue.name}
                </span>
              </div>
            </div>

            {/* Stats (only for existing QR codes) */}
            {qrCode && !isGenerating && (
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <ScanLine className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {qrCode.scanCount} scans
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-100 dark:bg-lime-900/30">
                  <Users className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  <span className="text-lime-700 dark:text-lime-400">
                    {qrCode.conversionCount} {isCheckInQR ? 'checked in' : 'registered'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          {/* Download buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownload('png')}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              {downloadFormat === 'png' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              PNG
            </button>
            <button
              onClick={() => handleDownload('svg')}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {downloadFormat === 'svg' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              SVG
            </button>
          </div>

          {/* Copy link button */}
          <button
            onClick={handleCopyLink}
            disabled={isGenerating}
            className={`
              w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all
              ${
                copied
                  ? 'bg-lime-500 text-white'
                  : 'border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }
              disabled:opacity-50
            `}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>

          {/* Link preview */}
          {qrCode && (
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 truncate">
              {qrCode.targetUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

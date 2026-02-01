import { useState } from 'react'
import {
  X,
  MessageCircle,
  Mail,
  Link2,
  Check,
  Share2,
  Calendar,
  MapPin,
} from 'lucide-react'
import type { ShareEventData, ShareMethod } from '@/../product/sections/events/types'

// =============================================================================
// Props
// =============================================================================

export interface ShareEventModalProps {
  shareData: ShareEventData
  isOpen: boolean
  onShare?: (method: ShareMethod) => void
  onClose?: () => void
}

// =============================================================================
// Main Component
// =============================================================================

export function ShareEventModal({
  shareData,
  isOpen,
  onShare,
  onClose,
}: ShareEventModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = () => {
    onShare?.('copy_link')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOptions = [
    {
      id: 'sms' as ShareMethod,
      icon: MessageCircle,
      label: 'Text Message',
      description: 'Share via SMS',
      color: 'lime',
    },
    {
      id: 'email' as ShareMethod,
      icon: Mail,
      label: 'Email',
      description: 'Send via email',
      color: 'sky',
    },
  ]

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
            <div className="p-2 rounded-xl bg-lime-100 dark:bg-lime-900/30">
              <Share2 className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Share Event
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Invite friends to join
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

        {/* Event Preview Card */}
        <div className="px-6 py-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
              {shareData.eventName}
            </h3>
            <div className="flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {shareData.eventDate}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                {shareData.venueName}
              </span>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="px-6 pb-4 space-y-3">
          {shareOptions.map((option) => {
            const Icon = option.icon
            return (
              <button
                key={option.id}
                onClick={() => onShare?.(option.id)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                  ${
                    option.color === 'lime'
                      ? 'border-slate-200 dark:border-slate-700 hover:border-lime-300 dark:hover:border-lime-700 hover:bg-lime-50 dark:hover:bg-lime-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50 dark:hover:bg-sky-900/20'
                  }
                `}
              >
                <div
                  className={`
                    p-3 rounded-xl
                    ${
                      option.color === 'lime'
                        ? 'bg-lime-100 dark:bg-lime-900/30'
                        : 'bg-sky-100 dark:bg-sky-900/30'
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-5 h-5
                      ${
                        option.color === 'lime'
                          ? 'text-lime-600 dark:text-lime-400'
                          : 'text-sky-600 dark:text-sky-400'
                      }
                    `}
                  />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {option.label}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {option.description}
                  </p>
                </div>
              </button>
            )
          })}

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`
              w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all
              ${
                copied
                  ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
              }
            `}
          >
            <div
              className={`
                p-3 rounded-xl transition-colors
                ${
                  copied
                    ? 'bg-lime-500'
                    : 'bg-slate-100 dark:bg-slate-800'
                }
              `}
            >
              {copied ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Link2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-slate-900 dark:text-white">
                {copied ? 'Copied!' : 'Copy Link'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                {shareData.shareUrl}
              </p>
            </div>
          </button>
        </div>

        {/* Message Preview */}
        <div className="px-6 pb-6">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Message preview:
          </p>
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400">
            {shareData.defaultMessage}
          </div>
        </div>
      </div>
    </div>
  )
}

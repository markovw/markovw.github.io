import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { shouldCenterElementInViewport } from './viewport'
import styles from './Generate.module.css'

const PROXY_URL =
  (import.meta.env.VITE_PROXY_URL as string | undefined) ??
  'https://gemini-image-proxy.keybananchik.workers.dev'
const CACHE_KEY = 'generator_last_image'

type OutputState = 'placeholder' | 'loading' | 'image' | 'error'

const RATIO_MAP: Record<string, [number, number]> = {
  '1:1':  [1, 1],
  '16:9': [16, 9],
  '9:16': [9, 16],
  '4:3':  [4, 3],
  '3:4':  [3, 4],
}

interface CacheEntry {
  b64: string
  mimeType: string
  prompt: string
  ratio: string
  model: string
}

interface GeneratedImage {
  blobUrl: string
  prompt: string
  ratio: string
  model: string
  mimeType: string
  restored: boolean
}

type ApiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: { data?: string; mimeType?: string }
      }>
    }
  }>
}

function b64ToBlobUrl(b64: string, mimeType: string): string {
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
  const blob = new Blob([bytes], { type: mimeType })
  return URL.createObjectURL(blob)
}

function saveCache(entry: CacheEntry) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...entry, ts: Date.now() }))
  } catch {
    /* QuotaExceededError — silently skip */
  }
}

function resizeTextarea(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

export default function Generate() {
  const [prompt, setPrompt] = useState('')
  const [ratio, setRatio] = useState('1:1')
  const [outputState, setOutputState] = useState<OutputState>('placeholder')
  const [imageData, setImageData] = useState<GeneratedImage | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const abortRef = useRef<AbortController | null>(null)
  const blobUrlRef = useRef<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)

  function revokeBlobUrl() {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }

  function commitImage(
    b64: string,
    mimeType: string,
    promptText: string,
    ratioStr: string,
    model: string,
    restored: boolean
  ) {
    revokeBlobUrl()
    const url = b64ToBlobUrl(b64, mimeType)
    blobUrlRef.current = url
    setImgLoaded(false)
    setImageData({ blobUrl: url, prompt: promptText, ratio: ratioStr, model, mimeType, restored })
    setOutputState('image')
  }

  // Restore from cache on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return
      const entry = JSON.parse(raw) as CacheEntry
      if (!entry.b64) return
      setPrompt(entry.prompt ?? '')
      if (entry.ratio) setRatio(entry.ratio)
      requestAnimationFrame(() => {
        if (textareaRef.current) resizeTextarea(textareaRef.current)
      })
      commitImage(entry.b64, entry.mimeType, entry.prompt, entry.ratio, entry.model, true)
    } catch {
      /* silently ignore corrupt cache */
    }
  // commitImage is defined in render scope; only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Revoke blob URL on unmount
  useEffect(() => {
    return () => revokeBlobUrl()
  }, [])

  async function generate() {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || isLoading) return

    const model = 'gemini-2.5-flash-image'
    const currentRatio = ratio

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()
    const { signal } = abortRef.current

    setIsLoading(true)
    setOutputState('loading')

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: trimmedPrompt, model, ratio: currentRatio }),
        signal,
      })

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as { error?: { message?: string } }
        const msg = errBody?.error?.message ?? `API error ${res.status}`
        throw new Error(msg)
      }

      const data = await res.json() as ApiResponse
      const parts = data?.candidates?.[0]?.content?.parts ?? []
      const imagePart = parts.find((p) => p.inlineData?.data)

      if (!imagePart?.inlineData?.data) {
        throw new Error('No image returned by the API. Try a different prompt.')
      }

      const { mimeType = 'image/png', data: b64 } = imagePart.inlineData

      saveCache({ b64, mimeType, prompt: trimmedPrompt, ratio: currentRatio, model })
      commitImage(b64, mimeType, trimmedPrompt, currentRatio, model, false)

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setOutputState('placeholder')
        setIsLoading(false)
        abortRef.current = null
        return
      }
      setError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
      setOutputState('error')
    }

    setIsLoading(false)
    abortRef.current = null
  }

  function handleTextareaChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setPrompt(e.target.value)
    resizeTextarea(e.target)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      void generate()
    }
  }

  function handleGeneratedImageLoad() {
    setImgLoaded(true)

    const wrap = imageWrapRef.current
    if (!wrap) return

    const rect = wrap.getBoundingClientRect()
    if (shouldCenterElementInViewport(rect, window.innerHeight)) {
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const [rw, rh] = RATIO_MAP[ratio] ?? [1, 1]
  const skeletonAspect = `${rw} / ${rh}`
  const ext = imageData?.mimeType.split('/')[1] ?? 'png'

  return (
    <div className={styles.pageWrap}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to home">
          <span className={styles.backArrow} aria-hidden="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </span>
          Back
        </Link>
        <p className={styles.pageTitle}>Image Generator</p>
      </div>

      {/* Prompt */}
      <div>
        <p className={styles.promptLabel}>Prompt</p>
        <textarea
          ref={textareaRef}
          className={styles.promptTextarea}
          placeholder="Describe your image..."
          rows={3}
          aria-label="Image prompt"
          spellCheck={false}
          value={prompt}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
        />
        <p className={styles.kbdHint}>
          <kbd>Cmd</kbd> + <kbd>Enter</kbd> to generate
        </p>
      </div>

      {/* Controls */}
      <div className={styles.controlsRow} role="group" aria-label="Generation options">
        <div className={styles.selectWrap} style={{ pointerEvents: 'none', opacity: 0.7 }}>
          <select aria-label="AI model" disabled style={{ paddingRight: '14px' }}>
            <option value="gemini-2.5-flash-image">Gemini 2.5 Flash</option>
          </select>
        </div>

        <div className={styles.selectWrap}>
          <label htmlFor="ratioSelect" className="sr-only">Aspect ratio</label>
          <select
            id="ratioSelect"
            aria-label="Aspect ratio"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
          >
            <option value="1:1">1:1 — Square</option>
            <option value="16:9">16:9 — Landscape</option>
            <option value="9:16">9:16 — Portrait</option>
            <option value="4:3">4:3 — Standard</option>
            <option value="3:4">3:4 — Portrait</option>
          </select>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <button
          className={styles.btnGenerate}
          type="button"
          aria-live="polite"
          disabled={isLoading}
          onClick={() => void generate()}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Generating…
            </>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      {/* Output */}
      <div className={styles.outputArea}>

        {outputState === 'placeholder' && (
          <div className={styles.outputPlaceholder} aria-hidden="true">
            <div className={styles.placeholderIcon}>🎨</div>
            <p className={styles.placeholderText}>Your image will appear here</p>
            <p className={styles.placeholderHint}>Enter a prompt above and press Generate</p>
          </div>
        )}

        {outputState === 'loading' && (
          <div className={styles.outputSkeleton} aria-hidden="true">
            <div className={styles.skeletonInner} style={{ aspectRatio: skeletonAspect }} />
            <p className={styles.skeletonLabel}>
              <span className={styles.skeletonSpinner} aria-hidden="true" />
              Generating...
            </p>
          </div>
        )}

        {outputState === 'image' && imageData && (
          <div
            ref={imageWrapRef}
            className={`${styles.outputImageStage} ${imgLoaded ? styles.outputImageStageLoaded : ''}`}
          >
            <img
              className={`${styles.outputImg} ${imgLoaded ? styles.outputImgLoaded : ''}`}
              src={imageData.blobUrl}
              alt={`Generated: ${imageData.prompt}`}
              onLoad={handleGeneratedImageLoad}
            />
            <div className={styles.outputMeta}>
              <div className={styles.metaInfo}>
                Model: <span>{imageData.model}</span>
                &nbsp;|&nbsp;
                Ratio: <span>{imageData.ratio}</span>
                &nbsp;|&nbsp;
                Format: <span>{imageData.mimeType.split('/')[1]?.toUpperCase()}</span>
                {imageData.restored && (
                  <span style={{ color: 'var(--c-text-3)', fontSize: '10px' }}>
                    &nbsp;&nbsp;↩ last session
                  </span>
                )}
              </div>
              <a
                className={styles.btnDownload}
                href={imageData.blobUrl}
                download={`generated-${Date.now()}.${ext}`}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </a>
            </div>
          </div>
        )}

        {outputState === 'error' && (
          <div className={styles.outputError} role="alert" aria-live="assertive">
            <span className={styles.errorIcon} aria-hidden="true">⚠</span>
            <div className={styles.errorText}>
              <strong>Generation failed</strong>
              <span>{error || 'Something went wrong. Please try again.'}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

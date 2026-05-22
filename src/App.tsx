import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import './App.css'
import ModeSwitch, { type ClockMode } from './components/ModeSwitch'
import StopwatchPanel from './components/StopwatchPanel'
import TimerPanel from './components/TimerPanel'

const MAX_TIMER_HOURS = 99
const MAX_TIMER_MINUTES = 59
const MAX_TIMER_SECONDS = 59

const pad2 = (value: number): string => value.toString().padStart(2, '0')

const formatMs = (valueMs: number): string => {
  const clamped = Math.max(0, Math.floor(valueMs))
  const totalSeconds = Math.floor(clamped / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
}

const sanitizeNumericInput = (raw: string): string => raw.replace(/\D/g, '')

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const inputToNumber = (value: string): number => {
  if (!value) {
    return 0
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? 0 : parsed
}

function App() {
  const [mode, setMode] = useState<ClockMode>('stopwatch')

  const [stopwatchElapsedMs, setStopwatchElapsedMs] = useState<number>(0)
  const [stopwatchRunning, setStopwatchRunning] = useState<boolean>(false)
  const stopwatchStartRef = useRef<number | null>(null)
  const stopwatchCarryRef = useRef<number>(0)

  const [hoursInput, setHoursInput] = useState<string>('00')
  const [minutesInput, setMinutesInput] = useState<string>('05')
  const [secondsInput, setSecondsInput] = useState<string>('00')

  const [timerRemainingMs, setTimerRemainingMs] = useState<number>(5 * 60 * 1000)
  const [timerInitialMs, setTimerInitialMs] = useState<number>(5 * 60 * 1000)
  const [timerRunning, setTimerRunning] = useState<boolean>(false)
  const timerEndRef = useRef<number | null>(null)
  const timerPausedRemainingRef = useRef<number>(5 * 60 * 1000)
  const [timerComplete, setTimerComplete] = useState<boolean>(false)

  const stopwatchIntervalRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)

  const timerInputTotalMs = useMemo(() => {
    const h = clamp(inputToNumber(hoursInput), 0, MAX_TIMER_HOURS)
    const m = clamp(inputToNumber(minutesInput), 0, MAX_TIMER_MINUTES)
    const s = clamp(inputToNumber(secondsInput), 0, MAX_TIMER_SECONDS)

    return ((h * 60 * 60) + (m * 60) + s) * 1000
  }, [hoursInput, minutesInput, secondsInput])

  useEffect(() => {
    if (!stopwatchRunning) {
      return
    }

    stopwatchIntervalRef.current = window.setInterval(() => {
      if (stopwatchStartRef.current === null) {
        return
      }

      const now = Date.now()
      setStopwatchElapsedMs(stopwatchCarryRef.current + (now - stopwatchStartRef.current))
    }, 40)

    return () => {
      if (stopwatchIntervalRef.current !== null) {
        window.clearInterval(stopwatchIntervalRef.current)
        stopwatchIntervalRef.current = null
      }
    }
  }, [stopwatchRunning])

  useEffect(() => {
    if (!timerRunning) {
      return
    }

    timerIntervalRef.current = window.setInterval(() => {
      if (timerEndRef.current === null) {
        return
      }

      const remaining = Math.max(0, timerEndRef.current - Date.now())
      setTimerRemainingMs(remaining)

      if (remaining <= 0) {
        setTimerRunning(false)
        setTimerComplete(true)
        timerPausedRemainingRef.current = 0
      }
    }, 60)

    return () => {
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }
  }, [timerRunning])

  useEffect(() => {
    if (!timerComplete) {
      return
    }

    if (typeof window === 'undefined' || !('AudioContext' in window || 'webkitAudioContext' in window)) {
      return
    }

    const AudioContextCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextCtor) {
      return
    }

    const audioCtx = new AudioContextCtor()
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    oscillator.type = 'square'
    oscillator.frequency.value = 740
    gainNode.gain.value = 0.05

    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.18)

    return () => {
      void audioCtx.close()
    }
  }, [timerComplete])

  useEffect(() => {
    return () => {
      if (stopwatchIntervalRef.current !== null) {
        window.clearInterval(stopwatchIntervalRef.current)
      }

      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  const stopwatchStartPause = (): void => {
    if (stopwatchRunning) {
      if (stopwatchStartRef.current !== null) {
        const now = Date.now()
        stopwatchCarryRef.current += now - stopwatchStartRef.current
        setStopwatchElapsedMs(stopwatchCarryRef.current)
      }

      stopwatchStartRef.current = null
      setStopwatchRunning(false)
      return
    }

    stopwatchStartRef.current = Date.now()
    setStopwatchRunning(true)
  }

  const stopwatchReset = (): void => {
    setStopwatchRunning(false)
    stopwatchStartRef.current = null
    stopwatchCarryRef.current = 0
    setStopwatchElapsedMs(0)
  }

  const updateInput = (
    updater: Dispatch<SetStateAction<string>>,
    rawValue: string,
    max: number,
  ): void => {
    const sanitized = sanitizeNumericInput(rawValue).slice(0, 2)
    const normalized = sanitized === '' ? '' : String(clamp(Number.parseInt(sanitized, 10), 0, max))
    updater(normalized)
  }

  const normalizeInputDisplay = (
    value: string,
    updater: Dispatch<SetStateAction<string>>,
    max: number,
  ): void => {
    const parsed = clamp(inputToNumber(value), 0, max)
    updater(pad2(parsed))
  }

  const applyTimerInputAsCurrent = (): void => {
    if (timerRunning) {
      return
    }

    const totalMs = timerInputTotalMs
    setTimerInitialMs(totalMs)
    setTimerRemainingMs(totalMs)
    timerPausedRemainingRef.current = totalMs
    setTimerComplete(false)
  }

  const timerStartPause = (): void => {
    if (timerRunning) {
      const remaining = timerEndRef.current === null ? timerRemainingMs : Math.max(0, timerEndRef.current - Date.now())
      timerPausedRemainingRef.current = remaining
      setTimerRemainingMs(remaining)
      setTimerRunning(false)
      timerEndRef.current = null
      return
    }

    const baseRemaining = timerRemainingMs > 0 ? timerRemainingMs : timerInputTotalMs

    if (baseRemaining <= 0) {
      return
    }

    timerEndRef.current = Date.now() + baseRemaining
    timerPausedRemainingRef.current = baseRemaining
    setTimerInitialMs((prev) => (prev === 0 ? baseRemaining : prev))
    setTimerRemainingMs(baseRemaining)
    setTimerComplete(false)
    setTimerRunning(true)
  }

  const timerReset = (): void => {
    setTimerRunning(false)
    timerEndRef.current = null

    const fromInput = timerInputTotalMs
    setTimerInitialMs(fromInput)
    setTimerRemainingMs(fromInput)
    timerPausedRemainingRef.current = fromInput
    setTimerComplete(false)
  }

  const timerProgress = useMemo(() => {
    if (timerInitialMs <= 0) {
      return 0
    }

    const progressed = timerInitialMs - timerRemainingMs
    return clamp((progressed / timerInitialMs) * 100, 0, 100)
  }, [timerInitialMs, timerRemainingMs])

  return (
    <main className="app-shell">
      <section className="clock-card" aria-label="Stopwatch and Timer panel">
        <ModeSwitch mode={mode} onModeChange={setMode} />

        <div className={`panel-wrap ${mode}`}>
          {mode === 'stopwatch' ? (
            <StopwatchPanel
              elapsedDisplay={formatMs(stopwatchElapsedMs)}
              isRunning={stopwatchRunning}
              onStartPause={stopwatchStartPause}
              onReset={stopwatchReset}
              resetDisabled={stopwatchElapsedMs === 0 && !stopwatchRunning}
            />
          ) : (
            <TimerPanel
              hoursInput={hoursInput}
              minutesInput={minutesInput}
              secondsInput={secondsInput}
              onHoursChange={(value) => updateInput(setHoursInput, value, MAX_TIMER_HOURS)}
              onMinutesChange={(value) => updateInput(setMinutesInput, value, MAX_TIMER_MINUTES)}
              onSecondsChange={(value) => updateInput(setSecondsInput, value, MAX_TIMER_SECONDS)}
              onHoursBlur={() => normalizeInputDisplay(hoursInput, setHoursInput, MAX_TIMER_HOURS)}
              onMinutesBlur={() => normalizeInputDisplay(minutesInput, setMinutesInput, MAX_TIMER_MINUTES)}
              onSecondsBlur={() => normalizeInputDisplay(secondsInput, setSecondsInput, MAX_TIMER_SECONDS)}
              timerRunning={timerRunning}
              timerComplete={timerComplete}
              remainingDisplay={formatMs(timerRemainingMs)}
              timerProgress={timerProgress}
              onStartPause={timerStartPause}
              onReset={timerReset}
              onApplyTime={applyTimerInputAsCurrent}
              startDisabled={!timerRunning && timerRemainingMs <= 0 && timerInputTotalMs <= 0}
              applyDisabled={timerRunning || timerInputTotalMs === timerRemainingMs}
            />
          )}
        </div>
      </section>
      <footer className="app-footer">For all time. Always.</footer>
    </main>
  )
}

export default App

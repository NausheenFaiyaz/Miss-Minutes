type TimerPanelProps = {
  hoursInput: string
  minutesInput: string
  secondsInput: string
  onHoursChange: (value: string) => void
  onMinutesChange: (value: string) => void
  onSecondsChange: (value: string) => void
  onHoursBlur: () => void
  onMinutesBlur: () => void
  onSecondsBlur: () => void
  timerRunning: boolean
  timerComplete: boolean
  remainingDisplay: string
  timerProgress: number
  onStartPause: () => void
  onReset: () => void
  onApplyTime: () => void
  startDisabled: boolean
  applyDisabled: boolean
}

function TimerPanel({
  hoursInput,
  minutesInput,
  secondsInput,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  onHoursBlur,
  onMinutesBlur,
  onSecondsBlur,
  timerRunning,
  timerComplete,
  remainingDisplay,
  timerProgress,
  onStartPause,
  onReset,
  onApplyTime,
  startDisabled,
  applyDisabled,
}: TimerPanelProps) {
  return (
    <div className="panel panel-animate" key="timer">
      <fieldset className="timer-inputs" disabled={timerRunning}>
        <label>
          Hours
          <input
            inputMode="numeric"
            value={hoursInput}
            onChange={(event) => onHoursChange(event.target.value)}
            onBlur={onHoursBlur}
            maxLength={2}
            aria-label="Timer hours"
          />
        </label>
        <label>
          Minutes
          <input
            inputMode="numeric"
            value={minutesInput}
            onChange={(event) => onMinutesChange(event.target.value)}
            onBlur={onMinutesBlur}
            maxLength={2}
            aria-label="Timer minutes"
          />
        </label>
        <label>
          Seconds
          <input
            inputMode="numeric"
            value={secondsInput}
            onChange={(event) => onSecondsChange(event.target.value)}
            onBlur={onSecondsBlur}
            maxLength={2}
            aria-label="Timer seconds"
          />
        </label>
      </fieldset>

      <p className={`display ${timerComplete ? 'complete' : ''}`} aria-live="polite">
        {remainingDisplay}
      </p>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-bar" style={{ width: `${timerProgress}%` }} />
      </div>

      <div className="controls">
        <button className="primary" onClick={onStartPause} disabled={startDisabled}>
          {timerRunning ? 'Pause' : 'Start'}
        </button>
        <button className="secondary" onClick={onReset}>
          Reset
        </button>
        <button className="secondary" onClick={onApplyTime} disabled={applyDisabled}>
          Apply Time
        </button>
      </div>

      {timerComplete ? <p className="status">Time is up.</p> : null}
    </div>
  )
}

export default TimerPanel

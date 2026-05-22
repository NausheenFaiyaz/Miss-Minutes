type StopwatchPanelProps = {
  elapsedDisplay: string
  isRunning: boolean
  onStartPause: () => void
  onReset: () => void
  resetDisabled: boolean
}

function StopwatchPanel({
  elapsedDisplay,
  isRunning,
  onStartPause,
  onReset,
  resetDisabled,
}: StopwatchPanelProps) {
  return (
    <div className="panel panel-animate" key="stopwatch">
      <p className="display" aria-live="polite">{elapsedDisplay}</p>
      <div className="controls">
        <button className="primary" onClick={onStartPause}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="secondary" onClick={onReset} disabled={resetDisabled}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default StopwatchPanel

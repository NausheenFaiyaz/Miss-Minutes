import missMinutesGif from '../assets/Miss Minutes.gif'

export type ClockMode = 'stopwatch' | 'timer'

type ModeSwitchProps = {
  mode: ClockMode
  onModeChange: (mode: ClockMode) => void
}

function ModeSwitch({ mode, onModeChange }: ModeSwitchProps) {
  return (
    <header className="mode-switch" role="tablist" aria-label="Clock mode selector">
      <img className="mode-gif" src={missMinutesGif} alt="Animated clock mascot" />
      <button
        className={`mode-pill ${mode === 'stopwatch' ? 'active' : ''}`}
        role="tab"
        aria-selected={mode === 'stopwatch'}
        onClick={() => onModeChange('stopwatch')}
      >
        Stopwatch
      </button>
      <button
        className={`mode-pill ${mode === 'timer' ? 'active' : ''}`}
        role="tab"
        aria-selected={mode === 'timer'}
        onClick={() => onModeChange('timer')}
      >
        Timer
      </button>
    </header>
  )
}

export default ModeSwitch

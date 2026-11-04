import { SITE } from '../../config/site.js'
import './Legal.css'

// Required by the Planspiel guidelines: the official disclaimer at the top of every page.
// On narrow screens it runs as a single scrolling line instead of wrapping; the copy is
// duplicated so the loop is seamless, and the duplicate is hidden from screen readers.
function DisclaimerBar() {
  return (
    <div className="disclaimer-bar" role="note">
      <div className="disclaimer-bar__track">
        <span className="disclaimer-bar__text">{SITE.disclaimer}</span>
        <span className="disclaimer-bar__text disclaimer-bar__copy" aria-hidden="true">
          {SITE.disclaimer}
        </span>
      </div>
    </div>
  )
}

export default DisclaimerBar

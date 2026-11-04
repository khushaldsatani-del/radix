import { navigate } from '../lib/router.js'

// An in-app link: plain <a> for crawlers and new tabs, client-side navigation for normal clicks.
function Link({ to, onClick, ...props }) {
  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...props} />
}

export default Link

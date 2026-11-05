// Opens the contact panel from anywhere. Used as an onClick on "Contact us" buttons:
// the button keeps a normal href as a fallback, and this replaces it when JavaScript runs.
export function openContact(e) {
  e?.preventDefault()
  window.dispatchEvent(new CustomEvent('contact:open'))
}

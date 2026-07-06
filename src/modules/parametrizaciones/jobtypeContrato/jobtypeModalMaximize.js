const MODAL_SELECTOR = '.jobtype-modal'
const HEADER_SELECTOR = '.jobtype-modal-header'
const CLOSE_SELECTOR = '.jobtype-modal-close'
const MAXIMIZE_CLASS = 'jobtype-modal-maximize'
const EXPANDED_CLASS = 'jobtype-modal--expanded'
const CMO_ALTA_SELECTOR = '.cmo-actividad-modal--alta'

const createToggle = () => {
  const toggle = document.createElement('span')
  toggle.setAttribute('role', 'button')
  toggle.setAttribute('tabindex', '0')
  toggle.setAttribute('aria-label', 'Maximizar')
  toggle.setAttribute('title', 'Maximizar')
  toggle.className = MAXIMIZE_CLASS

  const icon = document.createElement('i')
  icon.className = 'pi pi-window-maximize'
  icon.setAttribute('aria-hidden', 'true')
  toggle.appendChild(icon)

  return toggle
}

const setImportant = (element, property, value) => {
  if (!element) return
  element.style.setProperty(property, value, 'important')
}

const setToggleState = (modal, toggle) => {
  const isExpanded = modal.classList.contains(EXPANDED_CLASS)
  const icon = toggle.querySelector('i')

  toggle.setAttribute('aria-label', isExpanded ? 'Minimizar' : 'Maximizar')
  toggle.setAttribute('title', isExpanded ? 'Minimizar' : 'Maximizar')

  if (icon) {
    icon.className = isExpanded ? 'pi pi-window-minimize' : 'pi pi-window-maximize'
  }
}

const fixCmoActividadPopup = (modal) => {
  if (!modal.matches(CMO_ALTA_SELECTOR)) return

  const shell = modal.querySelector('.cmo-actividad-popup-grid-shell')
  const table = modal.querySelector('.cmo-actividad-popup-datatable')
  const wrappers = modal.querySelectorAll('.cmo-actividad-popup-datatable .p-datatable-wrapper, .cmo-actividad-popup-datatable .p-datatable-table-container')
  const empty = modal.querySelector('.cmo-actividad-popup-datatable .jobtype-popup-grid-empty, .cmo-actividad-popup-datatable .p-datatable-empty-message')
  const isExpanded = modal.classList.contains(EXPANDED_CLASS)
  const isEmpty = Boolean(empty)
  const bodyHeight = isEmpty ? (isExpanded ? '210px' : '170px') : (isExpanded ? '382px' : '210px')
  const emptyHeight = isEmpty ? (isExpanded ? '146px' : '106px') : null

  if (shell) {
    shell.classList.toggle('cmo-actividad-popup-grid-shell--empty', isEmpty)
    shell.classList.toggle('cmo-actividad-popup-grid-shell--filled', !isEmpty)
    setImportant(shell, 'border-left-width', '1px')
    setImportant(shell, 'border-left-style', 'solid')
    setImportant(shell, 'border-left-color', '#00a9bd')
    setImportant(shell, 'background', '#ffffff')
    setImportant(shell, 'overflow', 'hidden')
  }

  if (table) {
    setImportant(table, 'width', '100%')
    setImportant(table, 'max-width', '100%')
    setImportant(table, 'min-width', '0')
    setImportant(table, 'background', '#ffffff')
    setImportant(table, 'border-left-width', '0')
  }

  wrappers.forEach((wrapper) => {
    setImportant(wrapper, 'height', bodyHeight)
    setImportant(wrapper, 'min-height', bodyHeight)
    setImportant(wrapper, 'max-height', bodyHeight)
    setImportant(wrapper, 'background', '#ffffff')
    setImportant(wrapper, 'overflow-x', 'hidden')
    setImportant(wrapper, 'overflow-y', isEmpty ? 'hidden' : 'auto')
    setImportant(wrapper, 'border-left-width', '0')
    setImportant(wrapper, 'border-left-style', 'none')
  })

  modal.querySelectorAll('.cmo-actividad-popup-datatable .p-datatable-tbody, .cmo-actividad-popup-datatable .p-datatable-tbody > tr, .cmo-actividad-popup-datatable .p-datatable-tbody > tr > td').forEach((node) => {
    setImportant(node, 'background', '#ffffff')
  })

  if (emptyHeight) {
    modal.querySelectorAll('.cmo-actividad-popup-datatable .p-datatable-empty-message > td, .cmo-actividad-popup-datatable .jobtype-popup-grid-empty').forEach((node) => {
      setImportant(node, 'height', emptyHeight)
      setImportant(node, 'min-height', emptyHeight)
      setImportant(node, 'max-height', emptyHeight)
      setImportant(node, 'padding', isExpanded ? '48px 12px' : '28px 12px')
      setImportant(node, 'background', '#ffffff')
    })
  }
}

const fixKnownModals = () => {
  document.querySelectorAll(MODAL_SELECTOR).forEach(fixCmoActividadPopup)
}

const toggleModalSize = (toggle) => {
  const modal = toggle.closest(MODAL_SELECTOR)
  if (!modal) return

  modal.classList.toggle(EXPANDED_CLASS)
  setToggleState(modal, toggle)
  window.requestAnimationFrame(() => fixCmoActividadPopup(modal))
}

const enhanceModal = (modal) => {
  const header = modal.querySelector(HEADER_SELECTOR)
  if (!header) return

  let toggle = header.querySelector(`.${MAXIMIZE_CLASS}`)

  if (!toggle) {
    const close = header.querySelector(CLOSE_SELECTOR)
    toggle = createToggle()

    toggle.addEventListener('click', () => toggleModalSize(toggle))
    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleModalSize(toggle)
      }
    })

    if (close) {
      header.insertBefore(toggle, close)
    } else {
      header.appendChild(toggle)
    }
  }

  setToggleState(modal, toggle)
  fixCmoActividadPopup(modal)
}

const enhanceOpenModals = () => {
  document.querySelectorAll(MODAL_SELECTOR).forEach(enhanceModal)
  fixKnownModals()
}

export const initJobtypeModalMaximize = () => {
  if (typeof window === 'undefined') return

  enhanceOpenModals()

  const observer = new MutationObserver(() => {
    enhanceOpenModals()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

export default initJobtypeModalMaximize

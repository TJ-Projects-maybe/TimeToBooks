/**
 * Accessibility utilities
 */

/**
 * Generate a unique ID for aria-labelledby and aria-describedby
 */
export const generateId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create proper aria-label for icons
 */
export const getIconAriaLabel = (iconName: string, action?: string): string => {
  const labels: Record<string, string> = {
    plus: 'Ajouter',
    minus: 'Retirer',
    edit: 'Modifier',
    delete: 'Supprimer',
    trash: 'Supprimer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    close: 'Fermer',
    menu: 'Menu',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    refresh: 'Rafraîchir',
    download: 'Télécharger',
    upload: 'Importer',
    share: 'Partager',
    favorite: 'Ajouter aux favoris',
    unfavorite: 'Retirer des favoris',
    like: 'Aimer',
    dislike: 'Ne pas aimer',
    star: 'Étoiler',
    unstar: 'Retirer l\'étoile',
    check: 'Valider',
    x: 'Fermer',
    arrowLeft: 'Précédent',
    arrowRight: 'Suivant',
    arrowUp: 'Monter',
    arrowDown: 'Descendre',
    chevronLeft: 'Précédent',
    chevronRight: 'Suivant',
    chevronUp: 'Monter',
    chevronDown: 'Descendre',
    eye: 'Voir',
    eyeOff: 'Masquer',
    user: 'Profil',
    settings: 'Paramètres',
    help: 'Aide',
    info: 'Informations',
    warning: 'Attention',
    error: 'Erreur',
    success: 'Succès',
    bell: 'Notifications',
    calendar: 'Calendrier',
    clock: 'Heure',
    book: 'Livre',
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    projects: 'Projets',
    sessions: 'Sessions',
    logout: 'Se déconnecter',
    login: 'Se connecter',
    register: 'S\'inscrire',
  }

  const baseLabel = labels[iconName.toLowerCase()] || iconName
  return action ? `${action} ${baseLabel}` : baseLabel
}

/**
 * Create proper aria-label for buttons with icons
 */
export const getButtonAriaLabel = (
  iconName: string,
  action?: string,
  additionalInfo?: string
): string => {
  const iconLabel = getIconAriaLabel(iconName, action)
  const parts = [iconLabel]
  
  if (additionalInfo) {
    parts.push(additionalInfo)
  }
  
  return parts.join(' ')
}

/**
 * Check if an element is focusable
 */
export const isFocusable = (element: Element): boolean => {
  const focusableElements = [
    'A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'DETAILS',
    '[tabindex]:not([tabindex="-1"])'
  ]
  
  const selector = focusableElements.join(', ')
  return element.matches(selector)
}

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: Element | Document = document): Element[] => {
  const focusableElements = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'details',
    '[tabindex]:not([tabindex="-1"])'
  ]
  
  return Array.from(container.querySelectorAll(focusableElements.join(', ')))
}

/**
 * Trap focus within an element (for modals, dialogs, etc.)
 */
export const trapFocus = (element: HTMLElement, onEscape?: () => void) => {
  const focusableElements = getFocusableElements(element)
  const firstFocusable = focusableElements[0] as HTMLElement
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && onEscape) {
      onEscape()
      return
    }

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    }
  }

  const handleFocus = (e: FocusEvent) => {
    if (!element.contains(e.target as Node)) {
      e.preventDefault()
      firstFocusable.focus()
    }
  }

  element.addEventListener('keydown', handleKeyDown)
  document.addEventListener('focusin', handleFocus)

  // Focus the first focusable element initially
  firstFocusable?.focus()

  return () => {
    element.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('focusin', handleFocus)
  }
}

/**
 * Announce a message to screen readers
 */
export const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
  // Check if there's already a live region
  let liveRegion = document.getElementById('a11y-live-region')
  
  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.id = 'a11y-live-region'
    liveRegion.setAttribute('aria-live', politeness)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `
    document.body.appendChild(liveRegion)
  }

  // Clear and set the message
  liveRegion.textContent = ''
  setTimeout(() => {
    liveRegion.textContent = message
  }, 100)
}

/**
 * Create a visually hidden element for screen readers
 */
export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    }}
    aria-hidden="false"
  >
    {children}
  </span>
)

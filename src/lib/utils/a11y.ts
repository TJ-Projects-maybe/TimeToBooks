/**
 * Accessibility utilities
 */

/**
 * Generate a unique ID for aria-labelledby and aria-describedby
 */
export const generateId = (prefix: string = "a11y"): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Create proper aria-label for icons
 */
export const getIconAriaLabel = (iconName: string, action?: string): string => {
  const labels: Record<string, string> = {
    google: "Se connecter avec Google",
    plus: "Ajouter",
    minus: "Retirer",
    edit: "Modifier",
    delete: "Supprimer",
    trash: "Supprimer",
    save: "Enregistrer",
    cancel: "Annuler",
    close: "Fermer",
    menu: "Menu",
    search: "Rechercher",
    filter: "Filtrer",
    sort: "Trier",
    refresh: "Rafraîchir",
  }
  const actionText = action ? `${action} ` : ""
  const baseLabel = labels[iconName.toLowerCase()] || iconName
  return `${actionText}${baseLabel}`.trim()
}

/**
 * Announce a message to screen readers
 */
export const announceToScreenReader = (message: string): void => {
  const liveRegion = document.createElement("div")
  liveRegion.setAttribute("role", "status")
  liveRegion.setAttribute("aria-live", "polite")
  liveRegion.setAttribute("aria-atomic", "true")
  liveRegion.style.cssText = "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"
  document.body.appendChild(liveRegion)
  liveRegion.textContent = ""
  setTimeout(() => { liveRegion.textContent = message }, 100)
}

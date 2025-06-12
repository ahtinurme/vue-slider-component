import { Direction } from '../typings'

interface IPosObject {
  x: number
  y: number
}

export const getSize = (value: number | string): string => {
  return typeof value === 'number' ? `${value}px` : value
}

/** Get the distance of the element from the top/left of the page */
export const getOffset = (elem: HTMLDivElement): IPosObject => {
  const doc = document.documentElement as HTMLElement
  const body = document.body as HTMLElement
  const rect = elem.getBoundingClientRect()
  const offset: IPosObject = {
    y: rect.top + (window.pageYOffset || doc.scrollTop) - (doc.clientTop || body.clientTop || 0),
    x:
      rect.left + (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || body.clientLeft || 0),
  }
  return offset
}

/**
 * Get the position of the mouse/finger in the element
 * @param e Trigger event
 * @param elem Container element
 * @param isReverse From the right/bottom
 */
export const getPos = (
  e: MouseEvent | TouchEvent,
  elem: HTMLDivElement,
  isReverse: boolean,
): IPosObject => {
  const event = 'targetTouches' in e ? e.targetTouches[0] : e
  const offset = getOffset(elem)
  const posObj = {
    x: event.pageX - offset.x,
    y: event.pageY - offset.y,
  }
  return {
    x: isReverse ? elem.offsetWidth - posObj.x : posObj.x,
    y: isReverse ? elem.offsetHeight - posObj.y : posObj.y,
  }
}

function getKeyFromKeyCode(keyCode: number): string | null {
  switch (keyCode) {
    case 33: return 'PageUp'
    case 34: return 'PageDown'
    case 35: return 'End'
    case 36: return 'Home'
    case 37: return 'ArrowLeft'
    case 38: return 'ArrowUp'
    case 39: return 'ArrowRight'
    case 40: return 'ArrowDown'
    default: return null
  }
}
export type HandleFunction = (index: number) => number
export const getKeyboardHandleFunc = (
  e: KeyboardEvent,
  params: {
    direction: Direction
    max: number
    min: number
    hook: (e: KeyboardEvent) => HandleFunction | boolean
  },
): HandleFunction | null => {
  if (params.hook) {
    const result = params.hook(e)
    if (typeof result === 'function') return result
    if (!result) return null
  }

  // Use e.key if available (modern browsers), fallback to e.keyCode for older browsers
  const key = e.key || (e.keyCode && getKeyFromKeyCode(e.keyCode))

  switch (key) {
    case 'ArrowUp':
      return (i) => (params.direction === 'ttb' ? i - 1 : i + 1)
    case 'ArrowRight':
      return (i) => (params.direction === 'rtl' ? i - 1 : i + 1)
    case 'ArrowDown':
      return (i) => (params.direction === 'ttb' ? i + 1 : i - 1)
    case 'ArrowLeft':
      return (i) => (params.direction === 'rtl' ? i + 1 : i - 1)

    case 'End':
      return () => params.max
    case 'Home':
      return () => params.min

    case 'PageUp':
      return (i) => i + 10
    case 'PageDown':
      return (i) => i - 10

    default:
      return null
  }
}
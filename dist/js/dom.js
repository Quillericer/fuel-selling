export function position(el, relativeTo) {
  if (!relativeTo) {
    relativeTo = document.body
  }
  let rect = el.getBoundingClientRect()
  let relRect = relativeTo.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top - relRect.top,
    left: rect.left - relRect.left,
    bottom: relRect.bottom - rect.bottom,
    right: relRect.right - rect.right
  }
}

/**
 * Get scroll values for page or an element.
 *
 * Scroll values is the scroll offset from the given side.
 * Scroll dimensions is the size of all of the box's content, including
 * the parts that are currently hidden outside the scrolling area.
 *
 * NB: if the element has no associated CSS layout box
 * or if the CSS layout box is inline, scroll dimensions will be zero.
 *
 * ![SA#21064101 answer](https://i.stack.imgur.com/5AAyW.png)
 * @param {?HTMLElement} el Element.
 */
export function getScroll(el = null) {
  if (el)
    return {
      top   : el.scrollTop || 0,
      left  : el.scrollLeft || 0,
      height: el.scrollHeight || 0,
      width : el.scrollWidth || 0,
    }
  return {
    top   : window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
    left  : window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
    height: document.documentElement.scrollHeight || document.body.scrollHeight || 0,
    width : document.documentElement.scrollWidth || document.body.scrollWidth || 0,
  }
}

/**
 * Get offset values for an element.
 * Offset values is the offset to the given side (taking into account margin)
 * from the closest relatively positioned parent element.
 * Offset __dimensions__ is the size of the visual box including all borders (but
 * __excluding margin__).
 *
 * ![SA#21064101 answer](https://i.stack.imgur.com/5AAyW.png)
 * @param {HTMLElement} el Element.
 */
export function getOffset(el) {
  return {
    top   : el.offsetTop || 0,
    left  : el.offsetLeft || 0,
    height: el.offsetHeight || 0,
    width : el.offsetWidth || 0,
  }
}

/**
 * Get client values for an element.
 * Client values is the size of border and scrollbar (if present).
 * Client dimensions is the visual portion of the box content,
 * not including borders or scrollbars, but includes padding.
 *
 * NB: if the element has no associated CSS layout box
 * or if the CSS layout box is inline, client dimensions will be zero.
 *
 * ![SA#21064101 answer](https://i.stack.imgur.com/5AAyW.png)
 * @param {HTMLElement} el Element.
 */
export function getClient(el) {
  return {
    top   : el.clientTop || 0,
    left  : el.clientLeft || 0,
    height: el.clientHeight || 0,
    width : el.clientWidth || 0,
  }
}

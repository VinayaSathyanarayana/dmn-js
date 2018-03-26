import {
  closest,
  matches,
  query
} from 'min-dom';

import {
  setRange,
  getRange
} from 'selection-ranges';

export const SELECTABLE_SELECTOR = '[contenteditable]';

export const ELEMENT_SELECTOR = '[data-element-id]';


export function getElementId(node) {
  return node.getAttribute('data-element-id');
}

export function getElementCoords(node) {
  const coordsAttr = node.getAttribute('data-coords');

  if (!coordsAttr) {
    return null;
  }

  const [ row, col ] = coordsAttr.split(':');

  return {
    row,
    col
  };
}

export function getNodeByCoords(elementCoords, container) {
  const coordsAttr = `${elementCoords.row}:${elementCoords.col}`;

  return query(`[data-coords="${coordsAttr}"]`, container);
}

export function getNodeById(elementId, container) {
  return query(`[data-element-id="${elementId}"]`, container);
}

export function isUnselectableNode(node) {
  return closest(node, '.no-deselect', true);
}

/**
 * Find semantically _selectable_ element in the nodes ancestors.
 *
 * @param {Element} node
 *
 * @return {Element} node
 */
export function findSelectableAncestor(node) {
  return closest(node, ELEMENT_SELECTOR, true);
}


/**
 * Ensure element or element childNode has the proper focus.
 *
 * @param {Element} el
 */
export function ensureFocus(el) {

  const selector = SELECTABLE_SELECTOR;

  const focusEl = (
    matches(el, selector)
      ? el
      : query(selector, el)
  );

  if (!focusEl) {
    return;
  }

  // QUIRK: otherwise range and focus related actions may
  // yield errors in older browsers (PhantomJS / IE)
  if (!document.body.contains(focusEl)) {
    return;
  }

  // (1) focus
  focusEl.focus();

  // (2) set cursor to element end
  const range = getRange(focusEl);

  if (!range || range.end === 0) {
    setRange(focusEl, { start: 5000, end: 5000 });
  }
}
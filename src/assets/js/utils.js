let count = 0;
export function getUuid(prefix = '') {
  if(typeof Symbol === 'function') {
    return Symbol(prefix)
  } else {
    return prefix + (++count);
  }
}
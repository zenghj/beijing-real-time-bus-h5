export default {
  bind() {},
  inserted(el, binding) {
    let hideFn = binding.value;
    if(typeof hideFn === 'function') {
      let handleClickOutside = function handleClickOutside(e) {
        if(!el.contains(e.target)) {
          hideFn()
        }
      }
      document.addEventListener('click', handleClickOutside)
      el.__clickOutsideHandler__ = handleClickOutside;
    }
  },
  update() {},
  componentUpdated() {},
  unbind(el) {
    if(el.__clickOutsideHandler__) {
      document.removeEventListener('click', el.__clickOutsideHandler__)
      delete el.__clickOutsideHandler__;
    }
  },
};
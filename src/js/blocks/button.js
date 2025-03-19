window.buttonToggleLoading = (elem) => {
  elem.toggleAttribute('disabled')
  elem.classList.toggle('btn--loading');
}
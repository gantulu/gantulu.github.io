function showDiv(selectedId) {
  const allDivs = document.querySelectorAll('.color-div');
  allDivs.forEach(div => div.style.display = 'none');

  const targetDiv = document.getElementById(selectedId + 'Div');
  if (targetDiv) {
    targetDiv.style.display = 'block';
  }
}

exports.printDayBlocks = function() {
  let carousel = document.querySelector('.block-date-scroll');
  for(let i = 1; i <= 30; i++){
    let div = document.createElement("div");
    div.classList.add("carousel-cell");
    div.innerHTML = `<span>${i}</span>`;
    carousel.appendChild(div);
  }
}
const carousel = document.querySelector('.block-date-scroll');
const messagesContainer = document.querySelector('.center-messages-content');

exports.printDayBlocks = function() {
  for(let i = 1; i <= 30; i++){
    let div = document.createElement("div");
    div.classList.add("carousel-cell");
    div.innerHTML = `<span>${i}</span>`;
    carousel.appendChild(div);
  }
}

exports.printMessages = function() {
  console.log(messagesContainer)
  let html = '';
  let open = '';
  for(let i = 1; i <= 30; i++){
    open = (i == 30) ? "open": "";
    html +=  `<details class="${open} day-wrapper" ${open}>
                <summary class="day-title">Messages by ${i}.01.2018</summary>
                  <div class="message-wrapper">
                    <span class="message-date-sent">${i}.02.18 at 14:38</span>
                    <div class="message-avatar"><img src="../assets/icon.png"></div>
                    <div class="message-username">Yevhen Orlov</div>
                    <span class="message-markup">lorem lorem lorem lorem lorem lorem lorem 
                    lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem 
                    lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem </span>
                  </div>
                  <div class="message-wrapper">
                  <span class="message-date-sent">${i}.02.18 at 14:38</span>
                  <div class="message-avatar"><img src="../assets/icon.png"></div>
                  <div class="message-username">Yevhen Orlov</div>
                  <span class="message-markup">lorem lorem lorem lorem lorem lorem lorem 
                  lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem 
                  lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem </span>
                </div>
              </details>`;
  }
  messagesContainer.innerHTML = html;
}
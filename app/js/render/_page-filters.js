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
  for(let i = 1; i <= 30; i++){
    html +=  `<details class="day-wrapper" open>
                <summary class="day-title">Messages by ${i}.01.2018</summary>
                  <div class="message-wrapper">
                    <span class="message-date-sent">sdf</span>
                    <div class="message-avatar"><img src="https://avatars1.githubusercontent.com/u/2997359?v=4&s=30"></div>
                    <span class="message-markup">dfgdfgdfgdfgdfg</span>
                  </div>
              </details>`;
  }
  messagesContainer.innerHTML = html;
}
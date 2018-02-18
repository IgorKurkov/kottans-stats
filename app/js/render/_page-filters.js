const request        = require('../_request');

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

// function formatDate(sent, splitter) {
//   var dateSentFormatted = sent.getFullYear() +splitter+ 
//       ("0"+ (sent.getMonth() + 1)).slice(-2) +splitter+ 
//       ("0"+ sent.getDate()).slice(-2) +" "+ 
//       ("0"+ sent.getHours()).slice(-2) +":"+ 
//       ("0"+ sent.getMinutes()).slice(-2);
//   return dateSentFormatted;
// }


function drawMessages(data) {
  console.log(data);
}


exports.drawCalendar = function (activityArr) {
  let buildedArr = [];
  activityArr.forEach(function(dayObj) {
    buildedArr.push({
      "date": dayObj._id,
      "badge": false,
      "title": `${dayObj.count} messages`,
      "classname": `day-block-${(dayObj.count > 100) ? 110 : dayObj.count }`,
    });
  });
console.log(buildedArr)


  $(document).ready(function () {
      $("#my-calendar").zabuto_calendar({
          action: function () {
              return myDateFunction(this.id, false);
          },
          
          data: buildedArr, //eventData,
          modal: false,
          legend: [

            {type: "text", label: "less 10 messages"},
            // {type: "spacer"},
            {type: "list", list: ["day-block-20", "day-block-35", "day-block-45", "day-block-65", "day-block-75", "day-block-95"]},
            // {type: "spacer"},
            {type: "text", label: "more 100 messages"},
            {type: "spacer"},
          ],
          cell_border: true,
          today: true,
          // show_days: false,
          // weekstartson: 0,
          nav_icon: {
            prev: '<i class="fa fa-chevron-circle-left"></i>',
            next: '<i class="fa fa-chevron-circle-right"></i>'
          }
          
      });
      function myDateFunction(id, fromModal) {
        $("#date-popover").hide();
        if (fromModal) {
            $("#" + id + "_modal").modal("hide");
        }
        var date = $("#" + id).data("date");
        var hasEvent = $("#" + id).data("hasEvent");
        console.log(date)

        request.request("perdate", drawMessages, {
          method: "POST",
          body: date
        });

        if (hasEvent && !fromModal) {
            return false;
        }
        $("#date-popover-content").html('You clicked on date ' + date);
        $("#date-popover").show();
        return true;
      } 
    
 });
 
}




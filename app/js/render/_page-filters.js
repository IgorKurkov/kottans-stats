import { request as getMessages } from "../_request-new";

const carousel = document.querySelector(".block-date-scroll");
const mainMessagesContainer = document.querySelector(".center-messages-content");
const mainSearchInput = document.querySelector(".search-by-wtwr");
const usernameSearchInput = document.querySelector(".search-by-username");
const usernameAutocompleteContainer = document.querySelector(".easy-autocomplete-container");
const filtersContainer = document.querySelector(".button-filters");
const signupBlock = document.querySelector(".signup");
const favoritesBlock = document.querySelector(".favorites-wrapper");
const favoritesBlockTitle = document.querySelector(".favorites-title");
const favoriteWindow = document.querySelector(".favorites-section");
const savedContainer = document.querySelector(".saved-messages-container");
const doneContainer = document.querySelector(".done-messages-container");
const ENTER = 13;

let allowTwitterPreview = false;
let allowYoutubePreview = false;

let userCredentials = JSON.parse(localStorage.getItem('favorites'));
if(userCredentials && userCredentials.email){
  let username = userCredentials.email.split('@')[0];
  favoritesBlockTitle.innerHTML = 
        `Hello ${username}! <a class="signout-button">Sign out!</a>`;
}


function formatDate(sent, splitter) {
  var dateSentFormatted =
    sent.getFullYear() +
    splitter +
    ("0" + (sent.getMonth() + 1)).slice(-2) +
    splitter +
    ("0" + sent.getDate()).slice(-2) +
    " " +
    ("0" + sent.getHours()).slice(-2) +
    ":" +
    ("0" + sent.getMinutes()).slice(-2);
  return dateSentFormatted;
}

const twitterFormatter = (url) => {
  if(/twitter/ig.test(url)){
    //https://twitframe.com/#sizing
    return `<iframe border=0 frameborder=0 height=300 width=550 
      src="https://twitframe.com/show?url=${encodeURI(url.trim().substring(7, url.length))}"></iframe>`;
  } else {return '';}
}

const youtubeFormatter = (url) => {
  let yturl = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w\-]{10,12})(?:&feature=related)?(?:[\w\-]{0})?/g;
  let iframeString = '<iframe width="420" height="345" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';
  if(yturl.test(url)){
    //try to generate thumbnails
    // return `<br><img src="${Youtube.thumb(url)}" title="youtube thumbnail">`;
    let ytIframe = url.replace(yturl, iframeString);
    return ytIframe.substring(6, ytIframe.length);
  } else {return '';}
}

//http://jsfiddle.net/8TaS8/6/ extract thumbnails 
var Youtube = (function () {
  'use strict';
  var video, results;
  var getThumb = function (url, size) {
      if (url === null) {
          return '';
      }
      size = (size === null) ? 'big' : size;
      // let yturl = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w\-]{10,12})(?:&feature=related)?(?:[\w\-]{0})?/g;
      results = url.match('[\\?&]v=([^&#]*)');
      video = (results === null) ? url : results[1];
      if (size === 'small') {
          return 'http://img.youtube.com/vi/' + video + '/2.jpg';
      }
      return 'http://img.youtube.com/vi/' + video + '/0.jpg';
  };
  return {
      thumb: getThumb
  };
}());


const markSearchedValuesInHtml = (messageHtml, postValue) => {
  let ytIframe = '';
  let twitterIframe = '';
  let replacedValue = `<b><mark>${postValue}</mark></b>`;
  //redraw all
  if(postValue && postValue != 'src') {
    let regextemp = postValue.replace(/\./ig, "\\\.");
    messageHtml = messageHtml.replace(new RegExp(regextemp, 'ig'), replacedValue);
  }
  //search for whatever urls
  let urls = messageHtml.match(/href="(.*?)"/g);  
  let cleanedHtml = messageHtml;
  if(urls) {
    urls.forEach(url => {
      if(allowTwitterPreview)
        twitterIframe = twitterFormatter(url);
      if(allowYoutubePreview)
        ytIframe = youtubeFormatter(url);
      let newUrl = url.split(replacedValue).join(postValue);
      cleanedHtml = cleanedHtml.split(url).join(newUrl)
    });
    return cleanedHtml+ytIframe+twitterIframe;
  }
  else {
    return messageHtml+ytIframe+twitterIframe;
  }
}

export const drawMessages = (data, postValue, container) => {
  let messagesContainer;
  if(container) {
    messagesContainer = container;
  }else {
    messagesContainer = mainMessagesContainer;
  }
  messagesContainer.style.opacity = 0;
  let html = "";
  let open = "";
  // console.log(postValue)
  setTimeout(() => {
  if (data && data[0] == undefined) {
    postValue = postValue ? `with word <b>${postValue}</b>` : '';
    html += `<div><center><h3>No messages ${postValue}</h3></center></div>`;
    messagesContainer.innerHTML = html;
    messagesContainer.style.opacity = 1;
    return;
  }
  open = "open";
  html += `
      <div class="day-title">
        Found <b>${data.length}</b> messages for <b>${postValue}</b>
      </div>
    `; 
  data.forEach(message => {
    html += `
          <div class="message-wrapper">
            <span class="message-date-sent">
              ${formatDate(new Date(message.sent), ".")}
            </span>
            <div class="message-avatar tooltip">
              

              <img class="avatar " src="${message.avatarUrl}">
              
              <div class="tooltiptext">
                <img class="tooltip-avatar" src="${ message.avatarUrlMedium }">
                <a title="search mentions by ${ message.username}" class="title message-username">${ message.username}</a>
                <a class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" target="_blank" title="go to ${
                message.username
              } github repo" href="https://github.com${message.url}">Open profile</a>

            </div>
            </div>
            <div class="text-wrapper">
              <a title="search mentions by ${ message.username}" class="message-username">
                ${ message.username}
              </a>
              <div class="message-markup">
                ${markSearchedValuesInHtml(message.html, postValue)}
              </div>
              
              <button id="${message.messageId}" class="${container ? "del-from-favorites-button" : "add-to-favorites-button"}" >
                <!-- <i id="${message.messageId}" ${container ? `class="fa fa-trash-o" title="delete from favorites"` : `class="fa fa-plus" title="add to favorites"`} aria-hidden="true"></i> -->
              </button>
              
              <button id="${message.messageId}" class="${container ? message.checked ? "done-favorites-button" : "check-favorites-button" : "hide-button"}" >
              <!-- <i id="${message.messageId}" class="fa ${container ? message.checked ? "fa-check-square-o" : "fa-square-o" :  "fa-square-o"}" aria-hidden="true"></i> -->
              </button>
              
            </div>
          </div>`;
  });

  messagesContainer.innerHTML = html;
  
  // INIT HIGHLIGHT.JS FOR CODE BLOCKS IN MESSAGES
  $(document).ready(function() {
    $("pre code").each(function(i, block) {
      hljs.highlightBlock(block);
    });
  });
  messagesContainer.style.opacity = 1;
    }, 100);
};

export const drawCalendar = activityArr => {
  let buildedArr = [];
  // console.log(activityArr[0])
  activityArr.forEach(function(dayObj) {
    let dateString = dayObj._id.split('.').join('-');
    buildedArr.push({
      date: dateString,
      badge: false,
      title: `${dayObj.count} messages`,
      classname: `day-block-${dayObj.count > 100 ? 110 : dayObj.count}`
    });
  });
  // console.log(buildedArr)
  $(document).ready(function() {
    $("#my-calendar").zabuto_calendar({
      action: function() {
        return myDateFunction(this.id, false);
      },
      data: buildedArr, //eventData,
      modal: false,
      legend: [
        { type: "text", label: "less 10" },
        {
          type: "list",
          list: [
            "day-block-20",
            "day-block-35",
            "day-block-45",
            "day-block-65",
            "day-block-75",
            "day-block-95"
          ]
        },
        { type: "text", label: "more 100" }
      ],
      cell_border: true,
      today: true,
      nav_icon: {
        prev: '<i class="fa fa-chevron-circle-left"></i>',
        next: '<i class="fa fa-chevron-circle-right"></i>'
      }
    });
  });
};

function myDateFunction(id, fromModal) {
  var date = $("#" + id).data("date");
  date = date.split('-').join('.');
  var hasEvent = $("#" + id).data("hasEvent");
  // console.log(date)
  getMessages("perdate", date).then(data => drawMessages(data, date));
}



////
const leftSidebarOpen = document.querySelector(".open");
const leftSidebarClose = document.querySelector(".close");
const leftSidebar = document.querySelector(".left-sidebar");


leftSidebarOpen.scrollTop = leftSidebarOpen.scrollHeight;
leftSidebarOpen.addEventListener("click", () => {
  if(leftSidebar.style.marginLeft != "0px"){

    leftSidebar.style.marginLeft = "0px";
    leftSidebarOpen.style.display = "none";
    leftSidebarClose.style.display = "block";
  }
});

leftSidebarClose.addEventListener("click", () => {
  if(leftSidebar.style.marginLeft == "0px"){
    leftSidebar.style.marginLeft = "-100%";
    leftSidebarOpen.style.display = "block";
  }
});



mainSearchInput.addEventListener("keydown", e => {
  let postValue = e.target.value.trim();
  if (e.keyCode == ENTER) {
    (!!postValue) && getMessages("search", postValue).then(data => {
      drawMessages(data, postValue);
    });
  }
});

usernameSearchInput.addEventListener("keydown", e => {
  let postValue = e.target.value.trim();
  if (e.keyCode == ENTER) {
    (!!postValue) && getMessages("searchUsername", postValue).then(data => {
      drawMessages(data, postValue);
    });
  }
});

//http://easyautocomplete.com/guide#sec-functions
getMessages("authors").then(data => {
  var options = {
    data: data,
    list: {
      match: {
        enabled: true
      },
      onClickEvent: function() {
        let postValue = $(".search-by-username").getSelectedItemData();
        getMessages("searchUsername", postValue).then(data => {
          drawMessages(data, postValue);
        });
      },

    }
  };
  $(".search-by-username").easyAutocomplete(options);
});


signupBlock.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e.target)
  let email = e.target['0'].value;
  if(email && email != '') {
    signupBlock.innerHTML = `<center><h4>Thanks!</h4></center>`;
    userCredentials =  { email: email };
    localStorage.setItem('favorites', JSON.stringify(userCredentials));
    // userCredentials = localStorage.getItem('favorites');
    setTimeout(() => {
      let username = email.split('@')[0];
      favoritesBlockTitle.innerHTML = 
        `Hello ${username}! <a class="signout-button">Sign out!</a>`;

      
      signupBlock.style.display = 'none';
    }, 1000);
  }
});


mainMessagesContainer.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(e.target)
  if(e.target.classList.contains("message-date-sent")){
    let postDate = e.target.textContent.trim().substring(0,10);
    getMessages("perdate", postDate).then(data => drawMessages(data, postDate));
  }

  if(e.target.classList.contains("message-username")){
    let postUsername = e.target.textContent.trim();
    getMessages("search", postUsername).then(data => drawMessages(data, postUsername));
  }

  if(e.target.classList.contains("add-to-favorites-button")){
    changeMessageStateTo(e, 'saveToFavorites');
  }
});


const changeMessageStateTo = (e, saveToCommand) => {
  if(!userCredentials) {
    signupBlock.style.display = 'block';
  }
  else {
    let postMessageId = e.target.id.trim();
    //works
    getMessages("findbyId", postMessageId).then(message => {
      let postValue = {
        owner: userCredentials.email,
        messageId: message.messageId
      }
      //works
      getMessages(saveToCommand, JSON.stringify(postValue)).then((data) => {
        console.log('savetofavorites', data)
        let answer = (data == 'Already exist') ? data : 'Added';
        signupBlock.style.display = "block";
        signupBlock.innerHTML = `<center><h4>${answer}</h4></center>`;
        setTimeout(() => {signupBlock.style.display = "none";}, 1000);
      });
    });
  }
}


favoritesBlock.addEventListener('click', (e) => {

  if(e.target.classList.contains("signup-button")){ 
    signupBlock.classList.add('display-sign-block');
  }

  if(e.target.classList.contains("signout-button")){ 
    localStorage.removeItem('favorites');
    window.location.reload();
  }
  if(e.target.id == "view-favorites-button" || e.target.offsetParent.id == "view-favorites-button"){ 
    if(!userCredentials){
      signupBlock.classList.add('display-sign-block');
    }
    else {
      //works
      drawFavorites(userCredentials.email);
      favoriteWindow.style.display = "flex";
    }
  }
})

const drawFavorites = (email) => {
  getMessages('favgetByCred', email).then(data => {
    console.log('data', data)
    if(data.length) {
      let checked = data.filter(m => m.checked);
      let unchecked = data.filter(m => !m.checked);
      console.log('checked', checked);
      console.log('unchecked', unchecked);
      checked.length ? drawMessages(checked, email, doneContainer) :  doneContainer.innerHTML = `<h4>...empty yet... </h4>`;
      unchecked.length ? drawMessages(unchecked, email, savedContainer) : savedContainer.innerHTML = `<h4>...empty yet... </h4>`;
    } else {
      doneContainer.innerHTML = `<h4>...empty yet... </h4>`;
      savedContainer.innerHTML = `<h4>...empty yet... </h4>`;
    }
  });
}

favoriteWindow.addEventListener('click', (e) => {
  e.preventDefault();
  if(e.target.classList.contains("close-favorites-window")){ 
    favoriteWindow.style.display = "none";
  }

  if(e.target.classList.contains("del-from-favorites-button")){
    // e.srcElement.attributes.add('disabled')
    let postMessageId = e.target.id.trim();
    let postValue = {
      owner: userCredentials.email,
      messageId: postMessageId
    }
    getMessages("favDelOneFromList", JSON.stringify(postValue) ).then((data) => {
      return data;
    }).then(drawFavorites(userCredentials.email));
  }

  if(e.target.classList.contains("check-favorites-button")){
    let postMessageId = e.target.id.trim();
    let postValue = {
      owner: userCredentials.email,
      messageId: postMessageId
    }
    getMessages("favCheckDone", JSON.stringify(postValue) ).then((data) => {
      return true;
    }).then(drawFavorites(userCredentials.email));
  }
})

filtersContainer.addEventListener('click', (e) => {
  var id;
  if(e.srcElement && e.srcElement.offsetParent && e.srcElement.offsetParent.id) {
    id = e.srcElement.offsetParent.id;
  }
  if(e.target.id) {
    id = e.target.id;
  }
  
  if(id == "links-filter") {
    getMessages('search', 'http').then(data => drawMessages(data, 'messages with links'))
  }
  if(id == "youtube-filter") {
    getMessages('search', 'www.youtube').then(data => drawMessages(data, 'youtube videos'))
  }
  if(id == "github-filter") {
    getMessages('search', 'github').then(data => drawMessages(data, 'github links'))
  }
  if(id == "image-filter") {
    getMessages('search', 'img').then(data => drawMessages(data, 'images'))
  }
  if(id == "twitter-filter") {
    getMessages('search', 'twitter').then(data => drawMessages(data, 'twitter posts'))
  }
  if(id == "meetup-filter") {
    getMessages('search', 'meetup').then(data => drawMessages(data, 'meetups'))
  }
  if(id == "youtube-checkbox") {
    allowYoutubePreview = allowYoutubePreview ? false : true;
  }
  if(id == "twitter-checkbox") {
    allowTwitterPreview = allowTwitterPreview ? false : true;
  }
});


exports.drawPieChart = function(graphArr) {
  graphArr = graphArr.map(obj => {
    return [obj._id.name, obj.count]
  })
  graphArr.unshift(['User', 'Count of messages'])
  graphArr.length = 20;
  // console.log(graphArr)
  google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
          var data = google.visualization.arrayToDataTable(graphArr);

          var options = {
            chartArea: { left: '-5%', top: '12%', width: "90%", height: "90%" },
            title: 'Messaging activity',
            pieHole: 0.4,
          };

          var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
          chart.draw(data, options);
        }
    }


//totalBlock
const totalLinks         = document.querySelector(".total-links"),
      totalVideos        = document.querySelector(".total-videos"),
      totalGithub        = document.querySelector(".total-github"),
      totalImages        = document.querySelector(".total-images"),
      totalmentions      = document.querySelector(".total-mentions"),
      totalFinishedTasks = document.querySelector(".total-finished-tasks"),
      totalMessages      = document.querySelector(".total-messages"),
      totalDays          = document.querySelector(".total-days");


exports.renderTotalMediaSummaryBlock = () => {
  getMessages("count").then(data => {
    totalMessages.innerHTML = `<b>${data}</b>`;
  });
  getMessages("byDay").then(data => {
    totalDays.innerHTML = `<b>${Math.floor(data.length/30)} months & ${data.length % 30} days</b>`;
  });
  getMessages("search", 'http').then(data => {
    totalLinks.innerHTML = `<b>${data.length}</b> links`;
  });
  getMessages("search", '.youtube').then(data => {
    totalVideos.innerHTML = `<b>${data.length}</b> videos`;
  });
  getMessages("search", '.github').then(data => {
    totalGithub.innerHTML = `<b>${data.length}</b> videos`;
  });
  getMessages("search", 'http img').then(data => {
    totalImages.innerHTML = `<b>${data.length}</b> screenshots`;
  });
  getMessages("search", '@').then(data => {
    totalmentions.innerHTML = `<b>${data.length}</b> mentions`;
  });
  getMessages("finishedByTasks").then((data, html) => {
    totalFinishedTasks.innerHTML = `<b>${data.length}</b> finished tasks`;
  });
}
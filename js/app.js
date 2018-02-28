(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.vars = {
  hash: '7e16b5527c77ea58bac36dddda6f5b444f32e81b',
  domain: "https://secret-earth-50936.herokuapp.com/",
  // domain: "http://localhost:3000/",
  kottansRoom: {
    // id : "59b0f29bd73408ce4f74b06f",
    avatar: "https://avatars-02.gitter.im/group/iv/3/57542d27c43b8c601977a0b6"
  }
};

// var global = {
//   tokenString : "access_token=" + "9e13190a6f70e28b6e263011e63d4b34d26bd697",
//   roomUrlPrefix : "https://api.gitter.im/v1/rooms/"
// };

// function getAllRoomMessages(count, oldestId) {
//   if(oldestId){oldestId = "&beforeId="+oldestId;}
//   return global.roomUrlPrefix + kottansRoom.id +
//           "/chatMessages?limit="+ count + oldestId +"&" + global.tokenString;
//   };

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = require("./_config");

var request = function request(link, postValue) {
  var url = /http/.test(link) ? link : config.vars.domain + link + config.vars.hash;
  var options = {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: "value=" + postValue
  };
  // console.log(!!postValue)
  var requestObj = !!postValue ? new Request(url, options) : new Request(url);

  return fetch(requestObj).then(function (res) {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  })["catch"](function (error) {
    console.log(error);
  });
};
exports.request = request;

},{"./_config":1}],3:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _render_pageSearch = require("./render/_page-search");

var searchPage = _interopRequireWildcard(_render_pageSearch);

var _render_pageFilters = require("./render/_page-filters");

var filtersPage = _interopRequireWildcard(_render_pageFilters);

var _requestNew = require("./_request-new");

var countdown = require("./plugins/_countdown");
// const request        = require('./_request');
var pageStatistics = require("./render/_page-statistics");
var pageTimeline = require("./render/_page-timeline");
var pageSearch = require("./render/_page-search");

(0, _requestNew.request)("latest").then(init);

function init() {
  // Page Timeline
  (0, _requestNew.request)("finishedByTasks").then(pageTimeline.drawTimelineChart);

  //Page search finished tasks
  (0, _requestNew.request)("finishedByStudents").then(searchPage.insertTaskListToPage);

  //Page statistics
  // countdown.initTimer();
  pageStatistics.insertValuesToFeaturesCards();
  (0, _requestNew.request)("learners").then(pageStatistics.drawCountOfTasksPerUser_VerticalBar);
  (0, _requestNew.request)("activity").then(pageStatistics.drawActivity_LineChart);

  //Page filters
  var currentDate = new Date().toISOString().substring(0, 10).split('-').join('.');
  // console.log(new Date())
  (0, _requestNew.request)("perdate", currentDate).then(function (data) {
    return filtersPage.drawMessages(data, currentDate);
  });
  (0, _requestNew.request)("byDay").then(filtersPage.drawCalendar);

  filtersPage.renderTotalMediaSummaryBlock();
  (0, _requestNew.request)("peruser").then(function (data) {
    filtersPage.drawPieChart(data);
    // console.log(data)
  });
}

},{"./_request-new":2,"./plugins/_countdown":4,"./render/_page-filters":7,"./render/_page-search":8,"./render/_page-statistics":9,"./render/_page-timeline":10}],4:[function(require,module,exports){
//COUNTDOWN TIMER
//slickcitcular https://www.jqueryscript.net/demo/Slick-Circular-jQuery-Countdown-Plugin-Classy-Countdown/

"use strict";

exports.initTimer = function () {
  var timeEnd = Math.round((new Date("2018.02.10").getTime() - $.now()) / 1000);
  timeEnd = Math.floor(timeEnd / 86400) * 86400;

  $('#countdown-container').ClassyCountdown({
    theme: "white",
    end: $.now() + timeEnd, //end: $.now() + 645600,
    now: $.now(),
    // whether to display the days/hours/minutes/seconds labels.
    labels: true,
    // object that specifies different language phrases for says/hours/minutes/seconds as well as specific CSS styles.
    labelsOptions: {
      lang: {
        days: 'Days',
        hours: 'Hours',
        minutes: 'Minutes',
        seconds: 'Seconds'
      },
      style: 'font-size: 0.5em;'
    },
    // custom style for the countdown
    style: {
      element: '',
      labels: false,
      days: {
        gauge: {
          thickness: 0.02,
          bgColor: 'rgba(0, 0, 0, 0)',
          fgColor: '#1ABC9C', //'rgba(0, 0, 0, 1)',
          lineCap: 'butt'
        },
        textCSS: ''
      },
      hours: {
        gauge: {
          thickness: 0.02,
          bgColor: 'rgba(0, 0, 0, 0)',
          fgColor: '#2980B9',
          lineCap: 'butt'
        },
        textCSS: ''
      },
      minutes: {
        gauge: {
          thickness: 0.02,
          bgColor: 'rgba(0, 0, 0, 0)',
          fgColor: '#8E44AD',
          lineCap: 'butt'
        },
        textCSS: ''
      },
      seconds: {
        gauge: {
          thickness: 0.02,
          bgColor: 'rgba(0, 0, 0, 0)',
          fgColor: '#F39C12',
          lineCap: 'butt'
        },
        textCSS: ''
      }
    },

    // callback that is fired when the countdown reaches 0.
    onEndCallback: function onEndCallback() {}
  });
};

},{}],5:[function(require,module,exports){
"use strict";

exports.blocks = {
  messagesCount: document.querySelector(".count-messages"),
  starredRepo: document.querySelector(".starred-repo"),
  activeUsersCount: document.querySelector(".active-users"),
  blockLearners: document.querySelector(".learners")

};

},{}],6:[function(require,module,exports){
"use strict";

exports.myFunction = function () {
  // Declare variables
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};

exports.sortTable = function (n) {
  var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
};

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _requestNew = require("../_request-new");

var carousel = document.querySelector(".block-date-scroll");
var mainMessagesContainer = document.querySelector(".center-messages-content");
var mainSearchInput = document.querySelector(".search-by-wtwr");
var usernameSearchInput = document.querySelector(".search-by-username");
var usernameAutocompleteContainer = document.querySelector(".easy-autocomplete-container");
var filtersContainer = document.querySelector(".button-filters");
var signupBlock = document.querySelector(".signup");
var favoritesBlock = document.querySelector(".favorites-wrapper");
var favoritesBlockTitle = document.querySelector(".favorites-title");
var favoriteWindow = document.querySelector(".favorites-section");
var savedContainer = document.querySelector(".saved-messages-container");
var doneContainer = document.querySelector(".done-messages-container");
var ENTER = 13;

var allowTwitterPreview = false;
var allowYoutubePreview = false;

var userCredentials = JSON.parse(localStorage.getItem('favorites'));
if (userCredentials && userCredentials.email) {
  var username = userCredentials.email.split('@')[0];
  favoritesBlockTitle.innerHTML = "Hello " + username + "! <a class=\"signout-button\">Sign out!</a>";
}

function formatDate(sent, splitter) {
  var dateSentFormatted = sent.getFullYear() + splitter + ("0" + (sent.getMonth() + 1)).slice(-2) + splitter + ("0" + sent.getDate()).slice(-2) + " " + ("0" + sent.getHours()).slice(-2) + ":" + ("0" + sent.getMinutes()).slice(-2);
  return dateSentFormatted;
}

var twitterFormatter = function twitterFormatter(url) {
  if (/twitter/ig.test(url)) {
    //https://twitframe.com/#sizing
    return "<iframe border=0 frameborder=0 height=300 width=550 \n      src=\"https://twitframe.com/show?url=" + encodeURI(url.trim().substring(7, url.length)) + "\"></iframe>";
  } else {
    return '';
  }
};

var youtubeFormatter = function youtubeFormatter(url) {
  var yturl = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w\-]{10,12})(?:&feature=related)?(?:[\w\-]{0})?/g;
  var iframeString = '<iframe width="420" height="345" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>';
  if (yturl.test(url)) {
    //try to generate thumbnails
    // return `<br><img src="${Youtube.thumb(url)}" title="youtube thumbnail">`;
    var ytIframe = url.replace(yturl, iframeString);
    return ytIframe.substring(6, ytIframe.length);
  } else {
    return '';
  }
};

//http://jsfiddle.net/8TaS8/6/ extract thumbnails
var Youtube = (function () {
  'use strict';
  var video, results;
  var getThumb = function getThumb(url, size) {
    if (url === null) {
      return '';
    }
    size = size === null ? 'big' : size;
    // let yturl = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([\w\-]{10,12})(?:&feature=related)?(?:[\w\-]{0})?/g;
    results = url.match('[\\?&]v=([^&#]*)');
    video = results === null ? url : results[1];
    if (size === 'small') {
      return 'http://img.youtube.com/vi/' + video + '/2.jpg';
    }
    return 'http://img.youtube.com/vi/' + video + '/0.jpg';
  };
  return {
    thumb: getThumb
  };
})();

var markSearchedValuesInHtml = function markSearchedValuesInHtml(messageHtml, postValue) {
  var ytIframe = '';
  var twitterIframe = '';
  var replacedValue = "<b><mark>" + postValue + "</mark></b>";
  //redraw all
  if (postValue && postValue != 'src') {
    var regextemp = postValue.replace(/\./ig, "\\\.");
    messageHtml = messageHtml.replace(new RegExp(regextemp, 'ig'), replacedValue);
  }
  //search for whatever urls
  var urls = messageHtml.match(/href="(.*?)"/g);
  var cleanedHtml = messageHtml;
  if (urls) {
    urls.forEach(function (url) {
      if (allowTwitterPreview) twitterIframe = twitterFormatter(url);
      if (allowYoutubePreview) ytIframe = youtubeFormatter(url);
      var newUrl = url.split(replacedValue).join(postValue);
      cleanedHtml = cleanedHtml.split(url).join(newUrl);
    });
    return cleanedHtml + ytIframe + twitterIframe;
  } else {
    return messageHtml + ytIframe + twitterIframe;
  }
};

var drawMessages = function drawMessages(data, postValue, container) {
  var messagesContainer = undefined;
  if (container) {
    messagesContainer = container;
  } else {
    messagesContainer = mainMessagesContainer;
  }
  messagesContainer.style.opacity = 0;
  var html = "";
  var open = "";
  // console.log(postValue)
  setTimeout(function () {
    if (data && data[0] == undefined) {
      postValue = postValue ? "with word <b>" + postValue + "</b>" : '';
      html += "<div><center><h3>No messages " + postValue + "</h3></center></div>";
      messagesContainer.innerHTML = html;
      messagesContainer.style.opacity = 1;
      return;
    }
    open = "open";
    html += "\n      <div class=\"day-title\">\n        Found <b>" + data.length + "</b> messages for <b>" + postValue + "</b>\n      </div>\n    ";
    data.forEach(function (message) {
      html += "\n          <div class=\"message-wrapper\">\n            <span class=\"message-date-sent\">\n              " + formatDate(new Date(message.sent), ".") + "\n            </span>\n            <div class=\"message-avatar tooltip\">\n              \n\n              <img class=\"avatar \" src=\"" + message.avatarUrl + "\">\n              \n              <div class=\"tooltiptext\">\n                <img class=\"tooltip-avatar\" src=\"" + message.avatarUrlMedium + "\">\n                <a title=\"search mentions by " + message.username + "\" class=\"title message-username\">" + message.username + "</a>\n                <a class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect\" target=\"_blank\" title=\"go to " + message.username + " github repo\" href=\"https://github.com" + message.url + "\">Open profile</a>\n\n            </div>\n            </div>\n            <div class=\"text-wrapper\">\n              <a title=\"search mentions by " + message.username + "\" class=\"message-username\">\n                " + message.username + "\n              </a>\n              <div class=\"message-markup\">\n                " + markSearchedValuesInHtml(message.html, postValue) + "\n              </div>\n              \n              <button id=\"" + message.messageId + "\" class=\"" + (container ? "del-from-favorites-button" : "add-to-favorites-button") + "\" >\n                <!-- <i id=\"" + message.messageId + "\" " + (container ? "class=\"fa fa-trash-o\" title=\"delete from favorites\"" : "class=\"fa fa-plus\" title=\"add to favorites\"") + " aria-hidden=\"true\"></i> -->\n              </button>\n              \n              <button id=\"" + message.messageId + "\" class=\"" + (container ? message.checked ? "done-favorites-button" : "check-favorites-button" : "hide-button") + "\" >\n              <!-- <i id=\"" + message.messageId + "\" class=\"fa " + (container ? message.checked ? "fa-check-square-o" : "fa-square-o" : "fa-square-o") + "\" aria-hidden=\"true\"></i> -->\n              </button>\n              \n            </div>\n          </div>";
    });

    messagesContainer.innerHTML = html;

    // INIT HIGHLIGHT.JS FOR CODE BLOCKS IN MESSAGES
    $(document).ready(function () {
      $("pre code").each(function (i, block) {
        hljs.highlightBlock(block);
      });
    });
    messagesContainer.style.opacity = 1;
  }, 100);
};

exports.drawMessages = drawMessages;
var drawCalendar = function drawCalendar(activityArr) {
  var buildedArr = [];
  // console.log(activityArr[0])
  activityArr.forEach(function (dayObj) {
    var dateString = dayObj._id.split('.').join('-');
    buildedArr.push({
      date: dateString,
      badge: false,
      title: dayObj.count + " messages",
      classname: "day-block-" + (dayObj.count > 100 ? 110 : dayObj.count)
    });
  });
  // console.log(buildedArr)
  $(document).ready(function () {
    $("#my-calendar").zabuto_calendar({
      action: function action() {
        return myDateFunction(this.id, false);
      },
      data: buildedArr, //eventData,
      modal: false,
      legend: [{ type: "text", label: "less 10" }, {
        type: "list",
        list: ["day-block-20", "day-block-35", "day-block-45", "day-block-65", "day-block-75", "day-block-95"]
      }, { type: "text", label: "more 100" }],
      cell_border: true,
      today: true,
      nav_icon: {
        prev: '<i class="fa fa-chevron-circle-left"></i>',
        next: '<i class="fa fa-chevron-circle-right"></i>'
      }
    });
  });
};

exports.drawCalendar = drawCalendar;
function myDateFunction(id, fromModal) {
  var date = $("#" + id).data("date");
  date = date.split('-').join('.');
  var hasEvent = $("#" + id).data("hasEvent");
  // console.log(date)
  (0, _requestNew.request)("perdate", date).then(function (data) {
    return drawMessages(data, date);
  });
}

////
var leftSidebarOpen = document.querySelector(".open");
var leftSidebarClose = document.querySelector(".close");
var leftSidebar = document.querySelector(".left-sidebar");

leftSidebarOpen.scrollTop = leftSidebarOpen.scrollHeight;
leftSidebarOpen.addEventListener("click", function () {
  if (leftSidebar.style.marginLeft != "0px") {

    leftSidebar.style.marginLeft = "0px";
    leftSidebarOpen.style.display = "none";
    leftSidebarClose.style.display = "block";
  }
});

leftSidebarClose.addEventListener("click", function () {
  if (leftSidebar.style.marginLeft == "0px") {
    leftSidebar.style.marginLeft = "-100%";
    leftSidebarOpen.style.display = "block";
  }
});

mainSearchInput.addEventListener("keydown", function (e) {
  var postValue = e.target.value.trim();
  if (e.keyCode == ENTER) {
    !!postValue && (0, _requestNew.request)("search", postValue).then(function (data) {
      drawMessages(data, postValue);
    });
  }
});

usernameSearchInput.addEventListener("keydown", function (e) {
  var postValue = e.target.value.trim();
  if (e.keyCode == ENTER) {
    !!postValue && (0, _requestNew.request)("searchUsername", postValue).then(function (data) {
      drawMessages(data, postValue);
    });
  }
});

//http://easyautocomplete.com/guide#sec-functions
(0, _requestNew.request)("authors").then(function (data) {
  var options = {
    data: data,
    list: {
      match: {
        enabled: true
      },
      onClickEvent: function onClickEvent() {
        var postValue = $(".search-by-username").getSelectedItemData();
        (0, _requestNew.request)("searchUsername", postValue).then(function (data) {
          drawMessages(data, postValue);
        });
      }

    }
  };
  $(".search-by-username").easyAutocomplete(options);
});

signupBlock.addEventListener('submit', function (e) {
  e.preventDefault();
  console.log(e.target);
  var email = e.target['0'].value;
  if (email && email != '') {
    signupBlock.innerHTML = "<center><h4>Thanks!</h4></center>";
    userCredentials = { email: email };
    localStorage.setItem('favorites', JSON.stringify(userCredentials));
    // userCredentials = localStorage.getItem('favorites');
    setTimeout(function () {
      var username = email.split('@')[0];
      favoritesBlockTitle.innerHTML = "Hello " + username + "! <a class=\"signout-button\">Sign out!</a>";

      signupBlock.style.display = 'none';
    }, 1000);
  }
});

mainMessagesContainer.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains("message-date-sent")) {
    (function () {
      var postDate = e.target.textContent.trim().substring(0, 10);
      (0, _requestNew.request)("perdate", postDate).then(function (data) {
        return drawMessages(data, postDate);
      });
    })();
  }

  if (e.target.classList.contains("message-username")) {
    (function () {
      var postUsername = e.target.textContent.trim();
      (0, _requestNew.request)("search", postUsername).then(function (data) {
        return drawMessages(data, postUsername);
      });
    })();
  }

  if (e.target.classList.contains("add-to-favorites-button")) {
    changeMessageStateTo(e, 'saveToFavorites');
  }
});

var changeMessageStateTo = function changeMessageStateTo(e, saveToCommand) {
  if (!userCredentials) {
    signupBlock.style.display = 'block';
  } else {
    var postMessageId = e.target.id.trim();
    //works
    (0, _requestNew.request)("findbyId", postMessageId).then(function (message) {
      var postValue = {
        owner: userCredentials.email,
        messageId: message.messageId
      };
      //works
      (0, _requestNew.request)(saveToCommand, JSON.stringify(postValue)).then(function (data) {
        console.log('savetofavorites', data);
        var answer = data == 'Already exist' ? data : 'Added';
        signupBlock.style.display = "block";
        signupBlock.innerHTML = "<center><h4>" + answer + "</h4></center>";
        setTimeout(function () {
          signupBlock.style.display = "none";
        }, 1000);
      });
    });
  }
};

favoritesBlock.addEventListener('click', function (e) {

  if (e.target.classList.contains("signup-button")) {
    signupBlock.classList.add('display-sign-block');
  }

  if (e.target.classList.contains("signout-button")) {
    localStorage.removeItem('favorites');
    window.location.reload();
  }
  if (e.target.id == "view-favorites-button" || e.target.offsetParent.id == "view-favorites-button") {
    if (!userCredentials) {
      signupBlock.classList.add('display-sign-block');
    } else {
      //works
      drawFavorites(userCredentials.email);
      favoriteWindow.style.display = "flex";
    }
  }
});

var drawFavorites = function drawFavorites(email) {
  (0, _requestNew.request)('favgetByCred', email).then(function (data) {
    console.log('data', data);
    if (data.length) {
      var checked = data.filter(function (m) {
        return m.checked;
      });
      var unchecked = data.filter(function (m) {
        return !m.checked;
      });
      console.log('checked', checked);
      console.log('unchecked', unchecked);
      checked.length ? drawMessages(checked, email, doneContainer) : doneContainer.innerHTML = "<h4>...empty yet... </h4>";
      unchecked.length ? drawMessages(unchecked, email, savedContainer) : savedContainer.innerHTML = "<h4>...empty yet... </h4>";
    } else {
      doneContainer.innerHTML = "<h4>...empty yet... </h4>";
      savedContainer.innerHTML = "<h4>...empty yet... </h4>";
    }
  });
};

favoriteWindow.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains("close-favorites-window")) {
    favoriteWindow.style.display = "none";
  }

  if (e.target.classList.contains("del-from-favorites-button")) {
    // e.srcElement.attributes.add('disabled')
    var postMessageId = e.target.id.trim();
    var postValue = {
      owner: userCredentials.email,
      messageId: postMessageId
    };
    (0, _requestNew.request)("favDelOneFromList", JSON.stringify(postValue)).then(function (data) {
      return data;
    }).then(drawFavorites(userCredentials.email));
  }

  if (e.target.classList.contains("check-favorites-button")) {
    var postMessageId = e.target.id.trim();
    var postValue = {
      owner: userCredentials.email,
      messageId: postMessageId
    };
    (0, _requestNew.request)("favCheckDone", JSON.stringify(postValue)).then(function (data) {
      return true;
    }).then(drawFavorites(userCredentials.email));
  }
});

filtersContainer.addEventListener('click', function (e) {
  var id;
  if (e.srcElement && e.srcElement.offsetParent && e.srcElement.offsetParent.id) {
    id = e.srcElement.offsetParent.id;
  }
  if (e.target.id) {
    id = e.target.id;
  }

  if (id == "links-filter") {
    (0, _requestNew.request)('search', 'http').then(function (data) {
      return drawMessages(data, 'messages with links');
    });
  }
  if (id == "youtube-filter") {
    (0, _requestNew.request)('search', 'www.youtube').then(function (data) {
      return drawMessages(data, 'youtube videos');
    });
  }
  if (id == "github-filter") {
    (0, _requestNew.request)('search', 'github').then(function (data) {
      return drawMessages(data, 'github links');
    });
  }
  if (id == "image-filter") {
    (0, _requestNew.request)('search', 'img').then(function (data) {
      return drawMessages(data, 'images');
    });
  }
  if (id == "twitter-filter") {
    (0, _requestNew.request)('search', 'twitter').then(function (data) {
      return drawMessages(data, 'twitter posts');
    });
  }
  if (id == "meetup-filter") {
    (0, _requestNew.request)('search', 'meetup').then(function (data) {
      return drawMessages(data, 'meetups');
    });
  }
  if (id == "youtube-checkbox") {
    allowYoutubePreview = allowYoutubePreview ? false : true;
  }
  if (id == "twitter-checkbox") {
    allowTwitterPreview = allowTwitterPreview ? false : true;
  }
});

exports.drawPieChart = function (graphArr) {
  graphArr = graphArr.map(function (obj) {
    return [obj._id.name, obj.count];
  });
  graphArr.unshift(['User', 'Count of messages']);
  graphArr.length = 20;
  // console.log(graphArr)
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var data = google.visualization.arrayToDataTable(graphArr);

    var options = {
      chartArea: { left: '-5%', top: '12%', width: "90%", height: "90%" },
      title: 'Messaging activity',
      pieHole: 0.4
    };

    var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    chart.draw(data, options);
  }
};

//totalBlock
var totalLinks = document.querySelector(".total-links"),
    totalVideos = document.querySelector(".total-videos"),
    totalGithub = document.querySelector(".total-github"),
    totalImages = document.querySelector(".total-images"),
    totalmentions = document.querySelector(".total-mentions"),
    totalFinishedTasks = document.querySelector(".total-finished-tasks"),
    totalMessages = document.querySelector(".total-messages"),
    totalDays = document.querySelector(".total-days");

exports.renderTotalMediaSummaryBlock = function () {
  (0, _requestNew.request)("count").then(function (data) {
    totalMessages.innerHTML = "<b>" + data + "</b>";
  });
  (0, _requestNew.request)("byDay").then(function (data) {
    totalDays.innerHTML = "<b>" + Math.floor(data.length / 30) + " months & " + data.length % 30 + " days</b>";
  });
  (0, _requestNew.request)("search", 'http').then(function (data) {
    totalLinks.innerHTML = "<b>" + data.length + "</b> references";
  });
  (0, _requestNew.request)("search", '.youtube').then(function (data) {
    totalVideos.innerHTML = "<b>" + data.length + "</b> videos";
  });
  (0, _requestNew.request)("search", '.github').then(function (data) {
    totalGithub.innerHTML = "<b>" + data.length + "</b> links to github";
  });
  (0, _requestNew.request)("search", 'http img').then(function (data) {
    totalImages.innerHTML = "<b>" + data.length + "</b> screenshots";
  });
  (0, _requestNew.request)("search", '@').then(function (data) {
    totalmentions.innerHTML = "<b>" + data.length + "</b> mentions";
  });
  (0, _requestNew.request)("finishedByTasks").then(function (data, html) {
    totalFinishedTasks.innerHTML = "<b>" + data.length + "</b> ready tasks";
  });
};

},{"../_request-new":2}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var config = require("../_config");
var table = require("../plugins/_table");

var insertTaskListToPage = function insertTaskListToPage(finishedArr) {
  var imageLogo = document.getElementById('main-logo');
  imageLogo.src = config.vars.kottansRoom.avatar;
  document.querySelector('#myInput').addEventListener('input', table.myFunction);

  var html = '';

  var divTable = document.getElementById('myTable');

  html += "<tr class=\"header\">\n        <th onclick=\"" + table.sortTable(1) + "\" style=\"width:5%;\">Name</th>\n        <th onclick=\"" + table.sortTable(2) + "\" style=\"width:5%;\">Nick</th>\n        <th onclick=\"" + table.sortTable(3) + "\" style=\"width:5%;\">Published</th>\n        <th style=\"width:80%;\">Text</th>\n    </tr>";

  for (var i = 0; i < finishedArr.length; i++) {
    html += "<tr>\n          <td><img src=\"" + finishedArr[i].avatarUrl + "\" class=\"user-icon\">" + finishedArr[i].displayName + "</td>\n          <td>(<a target=\"_blank\" href=\"https://github.com" + finishedArr[i].url + "\">" + finishedArr[i].username + "</a>)</td>\n          <td>" + finishedArr[i].sent + "</td>\n          <td>" + finishedArr[i].text + " </td>\n        </tr>";
  }
  divTable.innerHTML = html;
};
exports.insertTaskListToPage = insertTaskListToPage;

},{"../_config":1,"../plugins/_table":6}],9:[function(require,module,exports){
"use strict";

var _requestNew = require("../_request-new");

var config = require("../_config");
var sel = require('../plugins/_selectors');

exports.insertValuesToFeaturesCards = function () {
  // feature 1
  (0, _requestNew.request)('count').then(function (data) {
    sel.blocks.messagesCount.innerHTML = data;
  });

  // feature 2
  (0, _requestNew.request)("https://api.github.com/repos/kottans/frontend").then(function (data) {
    sel.blocks.starredRepo.innerHTML = data.stargazers_count == undefined ? "..." : data.stargazers_count;
  });

  // feature 3
  (0, _requestNew.request)("authors").then(function (data) {
    sel.blocks.activeUsersCount.innerHTML = data.length;
  });

  // feature 4
  (0, _requestNew.request)("https://api.github.com/search/issues?q=+type:pr+user:kottans&sort=created&%E2%80%8C%E2%80%8Border=asc").then(function (data) {
    var pullNumber = data.items.find(function (item) {
      return item.repository_url == "https://api.github.com/repos/kottans/mock-repo";
    });
    document.getElementsByClassName("pull-requests")[0].innerHTML = pullNumber.number;
  });

  // feature 5
  (0, _requestNew.request)("learners").then(function (data) {
    sel.blocks.blockLearners.innerHTML = data.length;
  });
};

exports.drawCountOfTasksPerUser_VerticalBar = function (users) {
  var graphArr = users.map(function (user) {
    return new Array(user.username + "", user.lessons.length, "lightblue");
  });
  google.charts.load('current', { packages: ['corechart', 'bar'] });
  google.charts.setOnLoadCallback(drawBasic);
  function drawBasic() {
    var container = document.getElementById('vertical_chart');
    var chart = new google.visualization.ColumnChart(container);
    graphArr.unshift(['User', 'Tasks', { role: 'style' }]);
    var data = google.visualization.arrayToDataTable(graphArr);
    var options = {
      animation: {
        duration: 2000,
        startup: true //This is the new option
      },
      title: 'Sum of finished tasks by each learner',
      // width: ($(window).width() < 800) ? $(window).width() : $(window).width()*0.5,
      width: $(window).width(),
      height: $(window).height() * 0.3,
      hAxis: {
        slantedText: true,
        slantedTextAngle: 90
      },
      vAxis: {
        //title: 'Sum of finished tasks'
      },
      animation: {
        duration: 1000,
        easing: 'out'
      }
    };
    chart.draw(data, options);
  }
};

////////////////////
exports.drawActivity_LineChart = function (activityArr) {
  activityArr.map(function (day) {
    day[0] = new Date(day[0]);
  });
  google.charts.load('current', { packages: ['corechart', 'line'] });
  google.charts.setOnLoadCallback(drawBasic);

  function drawBasic() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Days');
    data.addColumn('number', 'Messages');
    data.addRows(activityArr);
    var options = {
      title: "Activity of users in chat",
      animation: {
        duration: 2000,
        startup: true //This is the new option
      },
      //curveType: 'function',
      // width: ($(window).width() < 800) ? $(window).width() : $(window).width()*0.5,
      width: $(window).width(),
      height: $(window).height() * 0.3,
      hAxis: {
        slantedText: true,
        slantedTextAngle: 45
      },
      vAxis: {
        // title: 'Count of messa'
      }
    };
    var chart = new google.visualization.LineChart(document.getElementById('linechart'));
    chart.draw(data, options);
  }
};

},{"../_config":1,"../_request-new":2,"../plugins/_selectors":5}],10:[function(require,module,exports){
"use strict";

exports.drawTimelineChart = function (graphArr) {
  google.charts.load("current", { packages: ["timeline"] });
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var container = document.getElementById('timeline');
    container.innerHTML = '';
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Room' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });

    graphArr.map(function (element) {
      element[2] = new Date(element[2]);
      element[3] = new Date(element[3]);
    });
    dataTable.addRows(graphArr);

    var options = {
      width: $(window).width(),
      height: $(window).height(),
      timeline: { colorByRowLabel: true },
      hAxis: {
        minValue: new Date(2017, 9, 29),
        maxValue: new Date(new Date().getTime() + 1 * 60 * 60 * 100000)
      }
    };
    chart.draw(dataTable, options);
  }
};

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvX2NvbmZpZy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9fcmVxdWVzdC1uZXcuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvYXBwLmpzIiwiRzovRlJPTlRFTkQvUHJvamVjdHMvR2l0aHViL1JlYWwgcHJvamVjdHMva290dGFucy1zdGF0aXN0aWNzL2tvdHRhbnMtc3RhdHMvYXBwL2pzL3BsdWdpbnMvX2NvdW50ZG93bi5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9wbHVnaW5zL19zZWxlY3RvcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcGx1Z2lucy9fdGFibGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLWZpbHRlcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLXNlYXJjaC5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljcy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2UtdGltZWxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sQ0FBQyxJQUFJLEdBQUc7QUFDYixNQUFJLEVBQUUsMENBQTBDO0FBQ2hELFFBQU0sRUFBRSwyQ0FBMkM7O0FBRW5ELGFBQVcsRUFBRTs7QUFFWCxVQUFNLEVBQUcsa0VBQWtFO0dBQzVFO0NBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JGLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFN0IsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksSUFBSSxFQUFFLFNBQVMsRUFBSztBQUMxQyxNQUFJLEdBQUcsR0FBRyxBQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNwRixNQUFJLE9BQU8sR0FBRztBQUNaLFVBQU0sRUFBRSxNQUFNO0FBQ2QsV0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFO0FBQ2hFLFFBQUksRUFBRSxRQUFRLEdBQUMsU0FBUztHQUN6QixDQUFBOztBQUVELE1BQUksVUFBVSxHQUFHLEFBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTlFLFNBQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUNyQixJQUFJ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O0FBQ3hCLFlBQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQzFCLGNBQVEsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUU7QUFDbkMsV0FBSyxFQUFFO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUMvQixnQkFBUSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsTUFBTSxBQUFDLENBQUM7T0FDcEU7S0FDRixDQUFDO0FBQ0YsU0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDaEM7Q0FDRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMudmFycyA9IHtcclxuICBoYXNoOiAnN2UxNmI1NTI3Yzc3ZWE1OGJhYzM2ZGRkZGE2ZjViNDQ0ZjMyZTgxYicsXHJcbiAgZG9tYWluOiBcImh0dHBzOi8vc2VjcmV0LWVhcnRoLTUwOTM2Lmhlcm9rdWFwcC5jb20vXCIsXHJcbiAgLy8gZG9tYWluOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9cIixcclxuICBrb3R0YW5zUm9vbToge1xyXG4gICAgLy8gaWQgOiBcIjU5YjBmMjliZDczNDA4Y2U0Zjc0YjA2ZlwiLFxyXG4gICAgYXZhdGFyIDogXCJodHRwczovL2F2YXRhcnMtMDIuZ2l0dGVyLmltL2dyb3VwL2l2LzMvNTc1NDJkMjdjNDNiOGM2MDE5NzdhMGI2XCJcclxuICB9XHJcbn07XHJcbiBcclxuXHJcbi8vIHZhciBnbG9iYWwgPSB7XHJcbi8vICAgdG9rZW5TdHJpbmcgOiBcImFjY2Vzc190b2tlbj1cIiArIFwiOWUxMzE5MGE2ZjcwZTI4YjZlMjYzMDExZTYzZDRiMzRkMjZiZDY5N1wiLFxyXG4vLyAgIHJvb21VcmxQcmVmaXggOiBcImh0dHBzOi8vYXBpLmdpdHRlci5pbS92MS9yb29tcy9cIlxyXG4vLyB9O1xyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBnZXRBbGxSb29tTWVzc2FnZXMoY291bnQsIG9sZGVzdElkKSB7XHJcbi8vICAgaWYob2xkZXN0SWQpe29sZGVzdElkID0gXCImYmVmb3JlSWQ9XCIrb2xkZXN0SWQ7fSBcclxuLy8gICByZXR1cm4gZ2xvYmFsLnJvb21VcmxQcmVmaXggKyBrb3R0YW5zUm9vbS5pZCArXHJcbi8vICAgICAgICAgICBcIi9jaGF0TWVzc2FnZXM/bGltaXQ9XCIrIGNvdW50ICsgb2xkZXN0SWQgK1wiJlwiICsgZ2xvYmFsLnRva2VuU3RyaW5nO1xyXG4vLyAgIH07IFxyXG4iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi9fY29uZmlnXCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVlc3QgPSAobGluaywgcG9zdFZhbHVlKSA9PiB7XHJcbiAgdmFyIHVybCA9ICgvaHR0cC8udGVzdChsaW5rKSkgPyBsaW5rIDogY29uZmlnLnZhcnMuZG9tYWluICsgbGluayArIGNvbmZpZy52YXJzLmhhc2g7XHJcbiAgbGV0IG9wdGlvbnMgPSB7IFxyXG4gICAgbWV0aG9kOiBcIlBPU1RcIiwgXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxyXG4gICAgYm9keTogXCJ2YWx1ZT1cIitwb3N0VmFsdWVcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2coISFwb3N0VmFsdWUpXHJcbiAgbGV0IHJlcXVlc3RPYmogPSAoISFwb3N0VmFsdWUpID8gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zKSA6IG5ldyBSZXF1ZXN0KHVybCk7XHJcblxyXG4gIHJldHVybiBmZXRjaChyZXF1ZXN0T2JqKVxyXG4gICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcy5qc29uKClcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB9KTtcclxuICB9IFxyXG4iLCJjb25zdCBjb3VudGRvd24gICAgICA9IHJlcXVpcmUoXCIuL3BsdWdpbnMvX2NvdW50ZG93blwiKTtcclxuLy8gY29uc3QgcmVxdWVzdCAgICAgICAgPSByZXF1aXJlKCcuL19yZXF1ZXN0Jyk7XHJcbmNvbnN0IHBhZ2VTdGF0aXN0aWNzID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXN0YXRpc3RpY3NcIik7XHJcbmNvbnN0IHBhZ2VUaW1lbGluZSAgID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXRpbWVsaW5lXCIpO1xyXG5jb25zdCBwYWdlU2VhcmNoICAgICA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS1zZWFyY2hcIik7XHJcblxyXG5pbXBvcnQgKiBhcyBzZWFyY2hQYWdlIGZyb20gXCIuL3JlbmRlci9fcGFnZS1zZWFyY2hcIjtcclxuaW1wb3J0ICogYXMgZmlsdGVyc1BhZ2UgZnJvbSBcIi4vcmVuZGVyL19wYWdlLWZpbHRlcnNcIjtcclxuaW1wb3J0IHsgcmVxdWVzdCBhcyBnZXRNZXNzYWdlcyAgfSBmcm9tIFwiLi9fcmVxdWVzdC1uZXdcIjtcclxuXHJcblxyXG5cclxuZ2V0TWVzc2FnZXMoXCJsYXRlc3RcIikudGhlbihpbml0KTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgLy8gUGFnZSBUaW1lbGluZVxyXG4gIGdldE1lc3NhZ2VzKFwiZmluaXNoZWRCeVRhc2tzXCIpLnRoZW4ocGFnZVRpbWVsaW5lLmRyYXdUaW1lbGluZUNoYXJ0KTtcclxuICBcclxuICAvL1BhZ2Ugc2VhcmNoIGZpbmlzaGVkIHRhc2tzXHJcbiAgZ2V0TWVzc2FnZXMoXCJmaW5pc2hlZEJ5U3R1ZGVudHNcIikudGhlbihzZWFyY2hQYWdlLmluc2VydFRhc2tMaXN0VG9QYWdlKTtcclxuICBcclxuICAvL1BhZ2Ugc3RhdGlzdGljc1xyXG4gIC8vIGNvdW50ZG93bi5pbml0VGltZXIoKTtcclxuICBwYWdlU3RhdGlzdGljcy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMoKTtcclxuICBnZXRNZXNzYWdlcyhcImxlYXJuZXJzXCIpLnRoZW4ocGFnZVN0YXRpc3RpY3MuZHJhd0NvdW50T2ZUYXNrc1BlclVzZXJfVmVydGljYWxCYXIpO1xyXG4gIGdldE1lc3NhZ2VzKFwiYWN0aXZpdHlcIikudGhlbihwYWdlU3RhdGlzdGljcy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0KTtcclxuXHJcbiAgLy9QYWdlIGZpbHRlcnNcclxuICBsZXQgY3VycmVudERhdGUgPSAobmV3IERhdGUoKS50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCkuc3BsaXQoJy0nKS5qb2luKCcuJykpO1xyXG4gIC8vIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkpXHJcbiAgZ2V0TWVzc2FnZXMoXCJwZXJkYXRlXCIsIGN1cnJlbnREYXRlKS50aGVuKGRhdGEgPT4gZmlsdGVyc1BhZ2UuZHJhd01lc3NhZ2VzKGRhdGEsIGN1cnJlbnREYXRlKSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJieURheVwiKS50aGVuKGZpbHRlcnNQYWdlLmRyYXdDYWxlbmRhcik7XHJcblxyXG4gIGZpbHRlcnNQYWdlLnJlbmRlclRvdGFsTWVkaWFTdW1tYXJ5QmxvY2soKTtcclxuICBnZXRNZXNzYWdlcyhcInBlcnVzZXJcIikudGhlbihkYXRhID0+IHtcclxuICAgIGZpbHRlcnNQYWdlLmRyYXdQaWVDaGFydChkYXRhKTsgXHJcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKVxyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4iLCIvL0NPVU5URE9XTiBUSU1FUlxyXG4vL3NsaWNrY2l0Y3VsYXIgaHR0cHM6Ly93d3cuanF1ZXJ5c2NyaXB0Lm5ldC9kZW1vL1NsaWNrLUNpcmN1bGFyLWpRdWVyeS1Db3VudGRvd24tUGx1Z2luLUNsYXNzeS1Db3VudGRvd24vXHJcblxyXG5leHBvcnRzLmluaXRUaW1lciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB0aW1lRW5kID0gTWF0aC5yb3VuZCggKG5ldyBEYXRlKFwiMjAxOC4wMi4xMFwiKS5nZXRUaW1lKCkgLSAkLm5vdygpKSAvIDEwMDApO1xyXG4gICAgICB0aW1lRW5kID0gTWF0aC5mbG9vcih0aW1lRW5kIC8gODY0MDApICogODY0MDA7XHJcblxyXG4gICQoJyNjb3VudGRvd24tY29udGFpbmVyJykuQ2xhc3N5Q291bnRkb3duKHtcclxuICAgIHRoZW1lOiBcIndoaXRlXCIsIFxyXG4gICAgZW5kOiAkLm5vdygpICsgdGltZUVuZCwgLy9lbmQ6ICQubm93KCkgKyA2NDU2MDAsXHJcbiAgICBub3c6ICQubm93KCksXHJcbiAgICAvLyB3aGV0aGVyIHRvIGRpc3BsYXkgdGhlIGRheXMvaG91cnMvbWludXRlcy9zZWNvbmRzIGxhYmVscy5cclxuICAgIGxhYmVsczogdHJ1ZSxcclxuICAgIC8vIG9iamVjdCB0aGF0IHNwZWNpZmllcyBkaWZmZXJlbnQgbGFuZ3VhZ2UgcGhyYXNlcyBmb3Igc2F5cy9ob3Vycy9taW51dGVzL3NlY29uZHMgYXMgd2VsbCBhcyBzcGVjaWZpYyBDU1Mgc3R5bGVzLlxyXG4gICAgbGFiZWxzT3B0aW9uczoge1xyXG4gICAgICBsYW5nOiB7XHJcbiAgICAgICAgZGF5czogJ0RheXMnLFxyXG4gICAgICAgIGhvdXJzOiAnSG91cnMnLFxyXG4gICAgICAgIG1pbnV0ZXM6ICdNaW51dGVzJyxcclxuICAgICAgICBzZWNvbmRzOiAnU2Vjb25kcydcclxuICAgICAgfSxcclxuICAgICAgc3R5bGU6ICdmb250LXNpemU6IDAuNWVtOydcclxuICAgIH0sXHJcbiAgICAvLyBjdXN0b20gc3R5bGUgZm9yIHRoZSBjb3VudGRvd25cclxuICAgIHN0eWxlOiB7XHJcbiAgICAgIGVsZW1lbnQ6ICcnLFxyXG4gICAgICBsYWJlbHM6IGZhbHNlLFxyXG4gICAgICBkYXlzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjMUFCQzlDJywvLydyZ2JhKDAsIDAsIDAsIDEpJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfSxcclxuICAgICAgaG91cnM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyMyOTgwQjknLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBtaW51dGVzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjOEU0NEFEJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfSxcclxuICAgICAgc2Vjb25kczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnI0YzOUMxMicsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGJhY2sgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb3VudGRvd24gcmVhY2hlcyAwLlxyXG4gICAgb25FbmRDYWxsYmFjazogZnVuY3Rpb24oKSB7fVxyXG4gIH0pO1xyXG59IiwiZXhwb3J0cy5ibG9ja3MgPSB7XHJcbiAgbWVzc2FnZXNDb3VudDogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb3VudC1tZXNzYWdlc1wiKSxcclxuICBzdGFycmVkUmVwbzogICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJyZWQtcmVwb1wiKSxcclxuICBhY3RpdmVVc2Vyc0NvdW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS11c2Vyc1wiKSxcclxuICBibG9ja0xlYXJuZXJzOiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxlYXJuZXJzXCIpLFxyXG4gIFxyXG59ICIsImV4cG9ydHMubXlGdW5jdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIERlY2xhcmUgdmFyaWFibGVzIFxyXG4gIHZhciBpbnB1dCwgZmlsdGVyLCB0YWJsZSwgdHIsIHRkLCBpO1xyXG4gIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0XCIpO1xyXG4gIGZpbHRlciA9IGlucHV0LnZhbHVlLnRvVXBwZXJDYXNlKCk7XHJcbiAgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VGFibGVcIik7XHJcbiAgdHIgPSB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpO1xyXG5cclxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRhYmxlIHJvd3MsIGFuZCBoaWRlIHRob3NlIHdobyBkb24ndCBtYXRjaCB0aGUgc2VhcmNoIHF1ZXJ5XHJcbiAgZm9yIChpID0gMDsgaSA8IHRyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0ZCA9IHRyW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGRcIilbMF07XHJcbiAgICBpZiAodGQpIHtcclxuICAgICAgaWYgKHRkLmlubmVySFRNTC50b1VwcGVyQ2FzZSgpLmluZGV4T2YoZmlsdGVyKSA+IC0xKSB7XHJcbiAgICAgICAgdHJbaV0uc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdHJbaV0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICB9IFxyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydHMuc29ydFRhYmxlID0gZnVuY3Rpb24obikge1xyXG4gIHZhciB0YWJsZSwgcm93cywgc3dpdGNoaW5nLCBpLCB4LCB5LCBzaG91bGRTd2l0Y2gsIGRpciwgc3dpdGNoY291bnQgPSAwO1xyXG4gIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVRhYmxlXCIpO1xyXG4gIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgLy8gU2V0IHRoZSBzb3J0aW5nIGRpcmVjdGlvbiB0byBhc2NlbmRpbmc6XHJcbiAgZGlyID0gXCJhc2NcIjsgXHJcbiAgLyogTWFrZSBhIGxvb3AgdGhhdCB3aWxsIGNvbnRpbnVlIHVudGlsXHJcbiAgbm8gc3dpdGNoaW5nIGhhcyBiZWVuIGRvbmU6ICovXHJcbiAgd2hpbGUgKHN3aXRjaGluZykge1xyXG4gICAgLy8gU3RhcnQgYnkgc2F5aW5nOiBubyBzd2l0Y2hpbmcgaXMgZG9uZTpcclxuICAgIHN3aXRjaGluZyA9IGZhbHNlO1xyXG4gICAgcm93cyA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVFJcIik7XHJcbiAgICAvKiBMb29wIHRocm91Z2ggYWxsIHRhYmxlIHJvd3MgKGV4Y2VwdCB0aGVcclxuICAgIGZpcnN0LCB3aGljaCBjb250YWlucyB0YWJsZSBoZWFkZXJzKTogKi9cclxuICAgIGZvciAoaSA9IDE7IGkgPCAocm93cy5sZW5ndGggLSAxKTsgaSsrKSB7XHJcbiAgICAgIC8vIFN0YXJ0IGJ5IHNheWluZyB0aGVyZSBzaG91bGQgYmUgbm8gc3dpdGNoaW5nOlxyXG4gICAgICBzaG91bGRTd2l0Y2ggPSBmYWxzZTtcclxuICAgICAgLyogR2V0IHRoZSB0d28gZWxlbWVudHMgeW91IHdhbnQgdG8gY29tcGFyZSxcclxuICAgICAgb25lIGZyb20gY3VycmVudCByb3cgYW5kIG9uZSBmcm9tIHRoZSBuZXh0OiAqL1xyXG4gICAgICB4ID0gcm93c1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlREXCIpW25dO1xyXG4gICAgICB5ID0gcm93c1tpICsgMV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJURFwiKVtuXTtcclxuICAgICAgLyogQ2hlY2sgaWYgdGhlIHR3byByb3dzIHNob3VsZCBzd2l0Y2ggcGxhY2UsXHJcbiAgICAgIGJhc2VkIG9uIHRoZSBkaXJlY3Rpb24sIGFzYyBvciBkZXNjOiAqL1xyXG4gICAgICBpZiAoZGlyID09IFwiYXNjXCIpIHtcclxuICAgICAgICBpZiAoeC5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSA+IHkuaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgIC8vIElmIHNvLCBtYXJrIGFzIGEgc3dpdGNoIGFuZCBicmVhayB0aGUgbG9vcDpcclxuICAgICAgICAgIHNob3VsZFN3aXRjaD0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChkaXIgPT0gXCJkZXNjXCIpIHtcclxuICAgICAgICBpZiAoeC5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSA8IHkuaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgIC8vIElmIHNvLCBtYXJrIGFzIGEgc3dpdGNoIGFuZCBicmVhayB0aGUgbG9vcDpcclxuICAgICAgICAgIHNob3VsZFN3aXRjaD0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHNob3VsZFN3aXRjaCkge1xyXG4gICAgICAvKiBJZiBhIHN3aXRjaCBoYXMgYmVlbiBtYXJrZWQsIG1ha2UgdGhlIHN3aXRjaFxyXG4gICAgICBhbmQgbWFyayB0aGF0IGEgc3dpdGNoIGhhcyBiZWVuIGRvbmU6ICovXHJcbiAgICAgIHJvd3NbaV0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocm93c1tpICsgMV0sIHJvd3NbaV0pO1xyXG4gICAgICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gICAgICAvLyBFYWNoIHRpbWUgYSBzd2l0Y2ggaXMgZG9uZSwgaW5jcmVhc2UgdGhpcyBjb3VudCBieSAxOlxyXG4gICAgICBzd2l0Y2hjb3VudCArKzsgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKiBJZiBubyBzd2l0Y2hpbmcgaGFzIGJlZW4gZG9uZSBBTkQgdGhlIGRpcmVjdGlvbiBpcyBcImFzY1wiLFxyXG4gICAgICBzZXQgdGhlIGRpcmVjdGlvbiB0byBcImRlc2NcIiBhbmQgcnVuIHRoZSB3aGlsZSBsb29wIGFnYWluLiAqL1xyXG4gICAgICBpZiAoc3dpdGNoY291bnQgPT0gMCAmJiBkaXIgPT0gXCJhc2NcIikge1xyXG4gICAgICAgIGRpciA9IFwiZGVzY1wiO1xyXG4gICAgICAgIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyByZXF1ZXN0IGFzIGdldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL19yZXF1ZXN0LW5ld1wiO1xyXG5cclxuY29uc3QgY2Fyb3VzZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2NrLWRhdGUtc2Nyb2xsXCIpO1xyXG5jb25zdCBtYWluTWVzc2FnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNlbnRlci1tZXNzYWdlcy1jb250ZW50XCIpO1xyXG5jb25zdCBtYWluU2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1ieS13dHdyXCIpO1xyXG5jb25zdCB1c2VybmFtZVNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2gtYnktdXNlcm5hbWVcIik7XHJcbmNvbnN0IHVzZXJuYW1lQXV0b2NvbXBsZXRlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lYXN5LWF1dG9jb21wbGV0ZS1jb250YWluZXJcIik7XHJcbmNvbnN0IGZpbHRlcnNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvbi1maWx0ZXJzXCIpO1xyXG5jb25zdCBzaWdudXBCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2lnbnVwXCIpO1xyXG5jb25zdCBmYXZvcml0ZXNCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2b3JpdGVzLXdyYXBwZXJcIik7XHJcbmNvbnN0IGZhdm9yaXRlc0Jsb2NrVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZhdm9yaXRlcy10aXRsZVwiKTtcclxuY29uc3QgZmF2b3JpdGVXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZhdm9yaXRlcy1zZWN0aW9uXCIpO1xyXG5jb25zdCBzYXZlZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2F2ZWQtbWVzc2FnZXMtY29udGFpbmVyXCIpO1xyXG5jb25zdCBkb25lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb25lLW1lc3NhZ2VzLWNvbnRhaW5lclwiKTtcclxuY29uc3QgRU5URVIgPSAxMztcclxuXHJcbmxldCBhbGxvd1R3aXR0ZXJQcmV2aWV3ID0gZmFsc2U7XHJcbmxldCBhbGxvd1lvdXR1YmVQcmV2aWV3ID0gZmFsc2U7XHJcblxyXG5sZXQgdXNlckNyZWRlbnRpYWxzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZmF2b3JpdGVzJykpO1xyXG5pZih1c2VyQ3JlZGVudGlhbHMgJiYgdXNlckNyZWRlbnRpYWxzLmVtYWlsKXtcclxuICBsZXQgdXNlcm5hbWUgPSB1c2VyQ3JlZGVudGlhbHMuZW1haWwuc3BsaXQoJ0AnKVswXTtcclxuICBmYXZvcml0ZXNCbG9ja1RpdGxlLmlubmVySFRNTCA9IFxyXG4gICAgICAgIGBIZWxsbyAke3VzZXJuYW1lfSEgPGEgY2xhc3M9XCJzaWdub3V0LWJ1dHRvblwiPlNpZ24gb3V0ITwvYT5gO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZm9ybWF0RGF0ZShzZW50LCBzcGxpdHRlcikge1xyXG4gIHZhciBkYXRlU2VudEZvcm1hdHRlZCA9XHJcbiAgICBzZW50LmdldEZ1bGxZZWFyKCkgK1xyXG4gICAgc3BsaXR0ZXIgK1xyXG4gICAgKFwiMFwiICsgKHNlbnQuZ2V0TW9udGgoKSArIDEpKS5zbGljZSgtMikgK1xyXG4gICAgc3BsaXR0ZXIgK1xyXG4gICAgKFwiMFwiICsgc2VudC5nZXREYXRlKCkpLnNsaWNlKC0yKSArXHJcbiAgICBcIiBcIiArXHJcbiAgICAoXCIwXCIgKyBzZW50LmdldEhvdXJzKCkpLnNsaWNlKC0yKSArXHJcbiAgICBcIjpcIiArXHJcbiAgICAoXCIwXCIgKyBzZW50LmdldE1pbnV0ZXMoKSkuc2xpY2UoLTIpO1xyXG4gIHJldHVybiBkYXRlU2VudEZvcm1hdHRlZDtcclxufVxyXG5cclxuY29uc3QgdHdpdHRlckZvcm1hdHRlciA9ICh1cmwpID0+IHtcclxuICBpZigvdHdpdHRlci9pZy50ZXN0KHVybCkpe1xyXG4gICAgLy9odHRwczovL3R3aXRmcmFtZS5jb20vI3NpemluZ1xyXG4gICAgcmV0dXJuIGA8aWZyYW1lIGJvcmRlcj0wIGZyYW1lYm9yZGVyPTAgaGVpZ2h0PTMwMCB3aWR0aD01NTAgXHJcbiAgICAgIHNyYz1cImh0dHBzOi8vdHdpdGZyYW1lLmNvbS9zaG93P3VybD0ke2VuY29kZVVSSSh1cmwudHJpbSgpLnN1YnN0cmluZyg3LCB1cmwubGVuZ3RoKSl9XCI+PC9pZnJhbWU+YDtcclxuICB9IGVsc2Uge3JldHVybiAnJzt9XHJcbn1cclxuXHJcbmNvbnN0IHlvdXR1YmVGb3JtYXR0ZXIgPSAodXJsKSA9PiB7XHJcbiAgbGV0IHl0dXJsID0gLyg/Omh0dHBzPzpcXC9cXC8pPyg/Ond3d1xcLik/KD86eW91dHViZVxcLmNvbXx5b3V0dVxcLmJlKVxcLyg/OndhdGNoXFw/dj0pPyhbXFx3XFwtXXsxMCwxMn0pKD86JmZlYXR1cmU9cmVsYXRlZCk/KD86W1xcd1xcLV17MH0pPy9nO1xyXG4gIGxldCBpZnJhbWVTdHJpbmcgPSAnPGlmcmFtZSB3aWR0aD1cIjQyMFwiIGhlaWdodD1cIjM0NVwiIHNyYz1cImh0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJDFcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JztcclxuICBpZih5dHVybC50ZXN0KHVybCkpe1xyXG4gICAgLy90cnkgdG8gZ2VuZXJhdGUgdGh1bWJuYWlsc1xyXG4gICAgLy8gcmV0dXJuIGA8YnI+PGltZyBzcmM9XCIke1lvdXR1YmUudGh1bWIodXJsKX1cIiB0aXRsZT1cInlvdXR1YmUgdGh1bWJuYWlsXCI+YDtcclxuICAgIGxldCB5dElmcmFtZSA9IHVybC5yZXBsYWNlKHl0dXJsLCBpZnJhbWVTdHJpbmcpO1xyXG4gICAgcmV0dXJuIHl0SWZyYW1lLnN1YnN0cmluZyg2LCB5dElmcmFtZS5sZW5ndGgpO1xyXG4gIH0gZWxzZSB7cmV0dXJuICcnO31cclxufVxyXG5cclxuLy9odHRwOi8vanNmaWRkbGUubmV0LzhUYVM4LzYvIGV4dHJhY3QgdGh1bWJuYWlscyBcclxudmFyIFlvdXR1YmUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICB2YXIgdmlkZW8sIHJlc3VsdHM7XHJcbiAgdmFyIGdldFRodW1iID0gZnVuY3Rpb24gKHVybCwgc2l6ZSkge1xyXG4gICAgICBpZiAodXJsID09PSBudWxsKSB7XHJcbiAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuICAgICAgc2l6ZSA9IChzaXplID09PSBudWxsKSA/ICdiaWcnIDogc2l6ZTtcclxuICAgICAgLy8gbGV0IHl0dXJsID0gLyg/Omh0dHBzPzpcXC9cXC8pPyg/Ond3d1xcLik/KD86eW91dHViZVxcLmNvbXx5b3V0dVxcLmJlKVxcLyg/OndhdGNoXFw/dj0pPyhbXFx3XFwtXXsxMCwxMn0pKD86JmZlYXR1cmU9cmVsYXRlZCk/KD86W1xcd1xcLV17MH0pPy9nO1xyXG4gICAgICByZXN1bHRzID0gdXJsLm1hdGNoKCdbXFxcXD8mXXY9KFteJiNdKiknKTtcclxuICAgICAgdmlkZW8gPSAocmVzdWx0cyA9PT0gbnVsbCkgPyB1cmwgOiByZXN1bHRzWzFdO1xyXG4gICAgICBpZiAoc2l6ZSA9PT0gJ3NtYWxsJykge1xyXG4gICAgICAgICAgcmV0dXJuICdodHRwOi8vaW1nLnlvdXR1YmUuY29tL3ZpLycgKyB2aWRlbyArICcvMi5qcGcnO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAnaHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS8nICsgdmlkZW8gKyAnLzAuanBnJztcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICAgIHRodW1iOiBnZXRUaHVtYlxyXG4gIH07XHJcbn0oKSk7XHJcblxyXG5cclxuY29uc3QgbWFya1NlYXJjaGVkVmFsdWVzSW5IdG1sID0gKG1lc3NhZ2VIdG1sLCBwb3N0VmFsdWUpID0+IHtcclxuICBsZXQgeXRJZnJhbWUgPSAnJztcclxuICBsZXQgdHdpdHRlcklmcmFtZSA9ICcnO1xyXG4gIGxldCByZXBsYWNlZFZhbHVlID0gYDxiPjxtYXJrPiR7cG9zdFZhbHVlfTwvbWFyaz48L2I+YDtcclxuICAvL3JlZHJhdyBhbGxcclxuICBpZihwb3N0VmFsdWUgJiYgcG9zdFZhbHVlICE9ICdzcmMnKSB7XHJcbiAgICBsZXQgcmVnZXh0ZW1wID0gcG9zdFZhbHVlLnJlcGxhY2UoL1xcLi9pZywgXCJcXFxcXFwuXCIpO1xyXG4gICAgbWVzc2FnZUh0bWwgPSBtZXNzYWdlSHRtbC5yZXBsYWNlKG5ldyBSZWdFeHAocmVnZXh0ZW1wLCAnaWcnKSwgcmVwbGFjZWRWYWx1ZSk7XHJcbiAgfVxyXG4gIC8vc2VhcmNoIGZvciB3aGF0ZXZlciB1cmxzXHJcbiAgbGV0IHVybHMgPSBtZXNzYWdlSHRtbC5tYXRjaCgvaHJlZj1cIiguKj8pXCIvZyk7ICBcclxuICBsZXQgY2xlYW5lZEh0bWwgPSBtZXNzYWdlSHRtbDtcclxuICBpZih1cmxzKSB7XHJcbiAgICB1cmxzLmZvckVhY2godXJsID0+IHtcclxuICAgICAgaWYoYWxsb3dUd2l0dGVyUHJldmlldylcclxuICAgICAgICB0d2l0dGVySWZyYW1lID0gdHdpdHRlckZvcm1hdHRlcih1cmwpO1xyXG4gICAgICBpZihhbGxvd1lvdXR1YmVQcmV2aWV3KVxyXG4gICAgICAgIHl0SWZyYW1lID0geW91dHViZUZvcm1hdHRlcih1cmwpO1xyXG4gICAgICBsZXQgbmV3VXJsID0gdXJsLnNwbGl0KHJlcGxhY2VkVmFsdWUpLmpvaW4ocG9zdFZhbHVlKTtcclxuICAgICAgY2xlYW5lZEh0bWwgPSBjbGVhbmVkSHRtbC5zcGxpdCh1cmwpLmpvaW4obmV3VXJsKVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY2xlYW5lZEh0bWwreXRJZnJhbWUrdHdpdHRlcklmcmFtZTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZUh0bWwreXRJZnJhbWUrdHdpdHRlcklmcmFtZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkcmF3TWVzc2FnZXMgPSAoZGF0YSwgcG9zdFZhbHVlLCBjb250YWluZXIpID0+IHtcclxuICBsZXQgbWVzc2FnZXNDb250YWluZXI7XHJcbiAgaWYoY29udGFpbmVyKSB7XHJcbiAgICBtZXNzYWdlc0NvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICB9ZWxzZSB7XHJcbiAgICBtZXNzYWdlc0NvbnRhaW5lciA9IG1haW5NZXNzYWdlc0NvbnRhaW5lcjtcclxuICB9XHJcbiAgbWVzc2FnZXNDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgbGV0IGh0bWwgPSBcIlwiO1xyXG4gIGxldCBvcGVuID0gXCJcIjtcclxuICAvLyBjb25zb2xlLmxvZyhwb3N0VmFsdWUpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgaWYgKGRhdGEgJiYgZGF0YVswXSA9PSB1bmRlZmluZWQpIHtcclxuICAgIHBvc3RWYWx1ZSA9IHBvc3RWYWx1ZSA/IGB3aXRoIHdvcmQgPGI+JHtwb3N0VmFsdWV9PC9iPmAgOiAnJztcclxuICAgIGh0bWwgKz0gYDxkaXY+PGNlbnRlcj48aDM+Tm8gbWVzc2FnZXMgJHtwb3N0VmFsdWV9PC9oMz48L2NlbnRlcj48L2Rpdj5gO1xyXG4gICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBvcGVuID0gXCJvcGVuXCI7XHJcbiAgaHRtbCArPSBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJkYXktdGl0bGVcIj5cclxuICAgICAgICBGb3VuZCA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gbWVzc2FnZXMgZm9yIDxiPiR7cG9zdFZhbHVlfTwvYj5cclxuICAgICAgPC9kaXY+XHJcbiAgICBgOyBcclxuICBkYXRhLmZvckVhY2gobWVzc2FnZSA9PiB7XHJcbiAgICBodG1sICs9IGBcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlLXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtZXNzYWdlLWRhdGUtc2VudFwiPlxyXG4gICAgICAgICAgICAgICR7Zm9ybWF0RGF0ZShuZXcgRGF0ZShtZXNzYWdlLnNlbnQpLCBcIi5cIil9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2UtYXZhdGFyIHRvb2x0aXBcIj5cclxuICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgPGltZyBjbGFzcz1cImF2YXRhciBcIiBzcmM9XCIke21lc3NhZ2UuYXZhdGFyVXJsfVwiPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwdGV4dFwiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cInRvb2x0aXAtYXZhdGFyXCIgc3JjPVwiJHsgbWVzc2FnZS5hdmF0YXJVcmxNZWRpdW0gfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEgdGl0bGU9XCJzZWFyY2ggbWVudGlvbnMgYnkgJHsgbWVzc2FnZS51c2VybmFtZX1cIiBjbGFzcz1cInRpdGxlIG1lc3NhZ2UtdXNlcm5hbWVcIj4keyBtZXNzYWdlLnVzZXJuYW1lfTwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLXJhaXNlZCBtZGwtanMtcmlwcGxlLWVmZmVjdFwiIHRhcmdldD1cIl9ibGFua1wiIHRpdGxlPVwiZ28gdG8gJHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UudXNlcm5hbWVcclxuICAgICAgICAgICAgICB9IGdpdGh1YiByZXBvXCIgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbSR7bWVzc2FnZS51cmx9XCI+T3BlbiBwcm9maWxlPC9hPlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC13cmFwcGVyXCI+XHJcbiAgICAgICAgICAgICAgPGEgdGl0bGU9XCJzZWFyY2ggbWVudGlvbnMgYnkgJHsgbWVzc2FnZS51c2VybmFtZX1cIiBjbGFzcz1cIm1lc3NhZ2UtdXNlcm5hbWVcIj5cclxuICAgICAgICAgICAgICAgICR7IG1lc3NhZ2UudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlLW1hcmt1cFwiPlxyXG4gICAgICAgICAgICAgICAgJHttYXJrU2VhcmNoZWRWYWx1ZXNJbkh0bWwobWVzc2FnZS5odG1sLCBwb3N0VmFsdWUpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCIke21lc3NhZ2UubWVzc2FnZUlkfVwiIGNsYXNzPVwiJHtjb250YWluZXIgPyBcImRlbC1mcm9tLWZhdm9yaXRlcy1idXR0b25cIiA6IFwiYWRkLXRvLWZhdm9yaXRlcy1idXR0b25cIn1cIiA+XHJcbiAgICAgICAgICAgICAgICA8IS0tIDxpIGlkPVwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiAke2NvbnRhaW5lciA/IGBjbGFzcz1cImZhIGZhLXRyYXNoLW9cIiB0aXRsZT1cImRlbGV0ZSBmcm9tIGZhdm9yaXRlc1wiYCA6IGBjbGFzcz1cImZhIGZhLXBsdXNcIiB0aXRsZT1cImFkZCB0byBmYXZvcml0ZXNcImB9IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gLS0+XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgY2xhc3M9XCIke2NvbnRhaW5lciA/IG1lc3NhZ2UuY2hlY2tlZCA/IFwiZG9uZS1mYXZvcml0ZXMtYnV0dG9uXCIgOiBcImNoZWNrLWZhdm9yaXRlcy1idXR0b25cIiA6IFwiaGlkZS1idXR0b25cIn1cIiA+XHJcbiAgICAgICAgICAgICAgPCEtLSA8aSBpZD1cIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgY2xhc3M9XCJmYSAke2NvbnRhaW5lciA/IG1lc3NhZ2UuY2hlY2tlZCA/IFwiZmEtY2hlY2stc3F1YXJlLW9cIiA6IFwiZmEtc3F1YXJlLW9cIiA6ICBcImZhLXNxdWFyZS1vXCJ9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiAtLT5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5gO1xyXG4gIH0pO1xyXG5cclxuICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xyXG4gIFxyXG4gIC8vIElOSVQgSElHSExJR0hULkpTIEZPUiBDT0RFIEJMT0NLUyBJTiBNRVNTQUdFU1xyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJChcInByZSBjb2RlXCIpLmVhY2goZnVuY3Rpb24oaSwgYmxvY2spIHtcclxuICAgICAgaGxqcy5oaWdobGlnaHRCbG9jayhibG9jayk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuICBtZXNzYWdlc0NvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgIH0sIDEwMCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZHJhd0NhbGVuZGFyID0gYWN0aXZpdHlBcnIgPT4ge1xyXG4gIGxldCBidWlsZGVkQXJyID0gW107XHJcbiAgLy8gY29uc29sZS5sb2coYWN0aXZpdHlBcnJbMF0pXHJcbiAgYWN0aXZpdHlBcnIuZm9yRWFjaChmdW5jdGlvbihkYXlPYmopIHtcclxuICAgIGxldCBkYXRlU3RyaW5nID0gZGF5T2JqLl9pZC5zcGxpdCgnLicpLmpvaW4oJy0nKTtcclxuICAgIGJ1aWxkZWRBcnIucHVzaCh7XHJcbiAgICAgIGRhdGU6IGRhdGVTdHJpbmcsXHJcbiAgICAgIGJhZGdlOiBmYWxzZSxcclxuICAgICAgdGl0bGU6IGAke2RheU9iai5jb3VudH0gbWVzc2FnZXNgLFxyXG4gICAgICBjbGFzc25hbWU6IGBkYXktYmxvY2stJHtkYXlPYmouY291bnQgPiAxMDAgPyAxMTAgOiBkYXlPYmouY291bnR9YFxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgLy8gY29uc29sZS5sb2coYnVpbGRlZEFycilcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQoXCIjbXktY2FsZW5kYXJcIikuemFidXRvX2NhbGVuZGFyKHtcclxuICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbXlEYXRlRnVuY3Rpb24odGhpcy5pZCwgZmFsc2UpO1xyXG4gICAgICB9LFxyXG4gICAgICBkYXRhOiBidWlsZGVkQXJyLCAvL2V2ZW50RGF0YSxcclxuICAgICAgbW9kYWw6IGZhbHNlLFxyXG4gICAgICBsZWdlbmQ6IFtcclxuICAgICAgICB7IHR5cGU6IFwidGV4dFwiLCBsYWJlbDogXCJsZXNzIDEwXCIgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgIGxpc3Q6IFtcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stMjBcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stMzVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stNDVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stNjVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stNzVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stOTVcIlxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyB0eXBlOiBcInRleHRcIiwgbGFiZWw6IFwibW9yZSAxMDBcIiB9XHJcbiAgICAgIF0sXHJcbiAgICAgIGNlbGxfYm9yZGVyOiB0cnVlLFxyXG4gICAgICB0b2RheTogdHJ1ZSxcclxuICAgICAgbmF2X2ljb246IHtcclxuICAgICAgICBwcmV2OiAnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLWNpcmNsZS1sZWZ0XCI+PC9pPicsXHJcbiAgICAgICAgbmV4dDogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1jaXJjbGUtcmlnaHRcIj48L2k+J1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIG15RGF0ZUZ1bmN0aW9uKGlkLCBmcm9tTW9kYWwpIHtcclxuICB2YXIgZGF0ZSA9ICQoXCIjXCIgKyBpZCkuZGF0YShcImRhdGVcIik7XHJcbiAgZGF0ZSA9IGRhdGUuc3BsaXQoJy0nKS5qb2luKCcuJyk7XHJcbiAgdmFyIGhhc0V2ZW50ID0gJChcIiNcIiArIGlkKS5kYXRhKFwiaGFzRXZlbnRcIik7XHJcbiAgLy8gY29uc29sZS5sb2coZGF0ZSlcclxuICBnZXRNZXNzYWdlcyhcInBlcmRhdGVcIiwgZGF0ZSkudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCBkYXRlKSk7XHJcbn1cclxuXHJcblxyXG5cclxuLy8vL1xyXG5jb25zdCBsZWZ0U2lkZWJhck9wZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm9wZW5cIik7XHJcbmNvbnN0IGxlZnRTaWRlYmFyQ2xvc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsb3NlXCIpO1xyXG5jb25zdCBsZWZ0U2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGVmdC1zaWRlYmFyXCIpO1xyXG5cclxuXHJcbmxlZnRTaWRlYmFyT3Blbi5zY3JvbGxUb3AgPSBsZWZ0U2lkZWJhck9wZW4uc2Nyb2xsSGVpZ2h0O1xyXG5sZWZ0U2lkZWJhck9wZW4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZihsZWZ0U2lkZWJhci5zdHlsZS5tYXJnaW5MZWZ0ICE9IFwiMHB4XCIpe1xyXG5cclxuICAgIGxlZnRTaWRlYmFyLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xyXG4gICAgbGVmdFNpZGViYXJPcGVuLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGxlZnRTaWRlYmFyQ2xvc2Uuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB9XHJcbn0pO1xyXG5cclxubGVmdFNpZGViYXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmKGxlZnRTaWRlYmFyLnN0eWxlLm1hcmdpbkxlZnQgPT0gXCIwcHhcIil7XHJcbiAgICBsZWZ0U2lkZWJhci5zdHlsZS5tYXJnaW5MZWZ0ID0gXCItMTAwJVwiO1xyXG4gICAgbGVmdFNpZGViYXJPcGVuLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5cclxubWFpblNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xyXG4gIGxldCBwb3N0VmFsdWUgPSBlLnRhcmdldC52YWx1ZS50cmltKCk7XHJcbiAgaWYgKGUua2V5Q29kZSA9PSBFTlRFUikge1xyXG4gICAgKCEhcG9zdFZhbHVlKSAmJiBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCBwb3N0VmFsdWUpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0VmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcclxuXHJcbnVzZXJuYW1lU2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XHJcbiAgbGV0IHBvc3RWYWx1ZSA9IGUudGFyZ2V0LnZhbHVlLnRyaW0oKTtcclxuICBpZiAoZS5rZXlDb2RlID09IEVOVEVSKSB7XHJcbiAgICAoISFwb3N0VmFsdWUpICYmIGdldE1lc3NhZ2VzKFwic2VhcmNoVXNlcm5hbWVcIiwgcG9zdFZhbHVlKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFZhbHVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG4vL2h0dHA6Ly9lYXN5YXV0b2NvbXBsZXRlLmNvbS9ndWlkZSNzZWMtZnVuY3Rpb25zXHJcbmdldE1lc3NhZ2VzKFwiYXV0aG9yc1wiKS50aGVuKGRhdGEgPT4ge1xyXG4gIHZhciBvcHRpb25zID0ge1xyXG4gICAgZGF0YTogZGF0YSxcclxuICAgIGxpc3Q6IHtcclxuICAgICAgbWF0Y2g6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uQ2xpY2tFdmVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHBvc3RWYWx1ZSA9ICQoXCIuc2VhcmNoLWJ5LXVzZXJuYW1lXCIpLmdldFNlbGVjdGVkSXRlbURhdGEoKTtcclxuICAgICAgICBnZXRNZXNzYWdlcyhcInNlYXJjaFVzZXJuYW1lXCIsIHBvc3RWYWx1ZSkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgIGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgIH1cclxuICB9O1xyXG4gICQoXCIuc2VhcmNoLWJ5LXVzZXJuYW1lXCIpLmVhc3lBdXRvY29tcGxldGUob3B0aW9ucyk7XHJcbn0pO1xyXG5cclxuXHJcbnNpZ251cEJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGNvbnNvbGUubG9nKGUudGFyZ2V0KVxyXG4gIGxldCBlbWFpbCA9IGUudGFyZ2V0WycwJ10udmFsdWU7XHJcbiAgaWYoZW1haWwgJiYgZW1haWwgIT0gJycpIHtcclxuICAgIHNpZ251cEJsb2NrLmlubmVySFRNTCA9IGA8Y2VudGVyPjxoND5UaGFua3MhPC9oND48L2NlbnRlcj5gO1xyXG4gICAgdXNlckNyZWRlbnRpYWxzID0gIHsgZW1haWw6IGVtYWlsIH07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmF2b3JpdGVzJywgSlNPTi5zdHJpbmdpZnkodXNlckNyZWRlbnRpYWxzKSk7XHJcbiAgICAvLyB1c2VyQ3JlZGVudGlhbHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZmF2b3JpdGVzJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgbGV0IHVzZXJuYW1lID0gZW1haWwuc3BsaXQoJ0AnKVswXTtcclxuICAgICAgZmF2b3JpdGVzQmxvY2tUaXRsZS5pbm5lckhUTUwgPSBcclxuICAgICAgICBgSGVsbG8gJHt1c2VybmFtZX0hIDxhIGNsYXNzPVwic2lnbm91dC1idXR0b25cIj5TaWduIG91dCE8L2E+YDtcclxuXHJcbiAgICAgIFxyXG4gICAgICBzaWdudXBCbG9jay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfSwgMTAwMCk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5tYWluTWVzc2FnZXNDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBjb25zb2xlLmxvZyhlLnRhcmdldClcclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtZXNzYWdlLWRhdGUtc2VudFwiKSl7XHJcbiAgICBsZXQgcG9zdERhdGUgPSBlLnRhcmdldC50ZXh0Q29udGVudC50cmltKCkuc3Vic3RyaW5nKDAsMTApO1xyXG4gICAgZ2V0TWVzc2FnZXMoXCJwZXJkYXRlXCIsIHBvc3REYXRlKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3REYXRlKSk7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtZXNzYWdlLXVzZXJuYW1lXCIpKXtcclxuICAgIGxldCBwb3N0VXNlcm5hbWUgPSBlLnRhcmdldC50ZXh0Q29udGVudC50cmltKCk7XHJcbiAgICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCBwb3N0VXNlcm5hbWUpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFVzZXJuYW1lKSk7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhZGQtdG8tZmF2b3JpdGVzLWJ1dHRvblwiKSl7XHJcbiAgICBjaGFuZ2VNZXNzYWdlU3RhdGVUbyhlLCAnc2F2ZVRvRmF2b3JpdGVzJyk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5jb25zdCBjaGFuZ2VNZXNzYWdlU3RhdGVUbyA9IChlLCBzYXZlVG9Db21tYW5kKSA9PiB7XHJcbiAgaWYoIXVzZXJDcmVkZW50aWFscykge1xyXG4gICAgc2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbGV0IHBvc3RNZXNzYWdlSWQgPSBlLnRhcmdldC5pZC50cmltKCk7XHJcbiAgICAvL3dvcmtzXHJcbiAgICBnZXRNZXNzYWdlcyhcImZpbmRieUlkXCIsIHBvc3RNZXNzYWdlSWQpLnRoZW4obWVzc2FnZSA9PiB7XHJcbiAgICAgIGxldCBwb3N0VmFsdWUgPSB7XHJcbiAgICAgICAgb3duZXI6IHVzZXJDcmVkZW50aWFscy5lbWFpbCxcclxuICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2UubWVzc2FnZUlkXHJcbiAgICAgIH1cclxuICAgICAgLy93b3Jrc1xyXG4gICAgICBnZXRNZXNzYWdlcyhzYXZlVG9Db21tYW5kLCBKU09OLnN0cmluZ2lmeShwb3N0VmFsdWUpKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NhdmV0b2Zhdm9yaXRlcycsIGRhdGEpXHJcbiAgICAgICAgbGV0IGFuc3dlciA9IChkYXRhID09ICdBbHJlYWR5IGV4aXN0JykgPyBkYXRhIDogJ0FkZGVkJztcclxuICAgICAgICBzaWdudXBCbG9jay5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIHNpZ251cEJsb2NrLmlubmVySFRNTCA9IGA8Y2VudGVyPjxoND4ke2Fuc3dlcn08L2g0PjwvY2VudGVyPmA7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7c2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO30sIDEwMDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmZhdm9yaXRlc0Jsb2NrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2lnbnVwLWJ1dHRvblwiKSl7IFxyXG4gICAgc2lnbnVwQmxvY2suY2xhc3NMaXN0LmFkZCgnZGlzcGxheS1zaWduLWJsb2NrJyk7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaWdub3V0LWJ1dHRvblwiKSl7IFxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2Zhdm9yaXRlcycpO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gIH1cclxuICBpZihlLnRhcmdldC5pZCA9PSBcInZpZXctZmF2b3JpdGVzLWJ1dHRvblwiIHx8IGUudGFyZ2V0Lm9mZnNldFBhcmVudC5pZCA9PSBcInZpZXctZmF2b3JpdGVzLWJ1dHRvblwiKXsgXHJcbiAgICBpZighdXNlckNyZWRlbnRpYWxzKXtcclxuICAgICAgc2lnbnVwQmxvY2suY2xhc3NMaXN0LmFkZCgnZGlzcGxheS1zaWduLWJsb2NrJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy93b3Jrc1xyXG4gICAgICBkcmF3RmF2b3JpdGVzKHVzZXJDcmVkZW50aWFscy5lbWFpbCk7XHJcbiAgICAgIGZhdm9yaXRlV2luZG93LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5jb25zdCBkcmF3RmF2b3JpdGVzID0gKGVtYWlsKSA9PiB7XHJcbiAgZ2V0TWVzc2FnZXMoJ2ZhdmdldEJ5Q3JlZCcsIGVtYWlsKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxyXG4gICAgaWYoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgbGV0IGNoZWNrZWQgPSBkYXRhLmZpbHRlcihtID0+IG0uY2hlY2tlZCk7XHJcbiAgICAgIGxldCB1bmNoZWNrZWQgPSBkYXRhLmZpbHRlcihtID0+ICFtLmNoZWNrZWQpO1xyXG4gICAgICBjb25zb2xlLmxvZygnY2hlY2tlZCcsIGNoZWNrZWQpO1xyXG4gICAgICBjb25zb2xlLmxvZygndW5jaGVja2VkJywgdW5jaGVja2VkKTtcclxuICAgICAgY2hlY2tlZC5sZW5ndGggPyBkcmF3TWVzc2FnZXMoY2hlY2tlZCwgZW1haWwsIGRvbmVDb250YWluZXIpIDogIGRvbmVDb250YWluZXIuaW5uZXJIVE1MID0gYDxoND4uLi5lbXB0eSB5ZXQuLi4gPC9oND5gO1xyXG4gICAgICB1bmNoZWNrZWQubGVuZ3RoID8gZHJhd01lc3NhZ2VzKHVuY2hlY2tlZCwgZW1haWwsIHNhdmVkQ29udGFpbmVyKSA6IHNhdmVkQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aDQ+Li4uZW1wdHkgeWV0Li4uIDwvaDQ+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvbmVDb250YWluZXIuaW5uZXJIVE1MID0gYDxoND4uLi5lbXB0eSB5ZXQuLi4gPC9oND5gO1xyXG4gICAgICBzYXZlZENvbnRhaW5lci5pbm5lckhUTUwgPSBgPGg0Pi4uLmVtcHR5IHlldC4uLiA8L2g0PmA7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZhdm9yaXRlV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2xvc2UtZmF2b3JpdGVzLXdpbmRvd1wiKSl7IFxyXG4gICAgZmF2b3JpdGVXaW5kb3cuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGVsLWZyb20tZmF2b3JpdGVzLWJ1dHRvblwiKSl7XHJcbiAgICAvLyBlLnNyY0VsZW1lbnQuYXR0cmlidXRlcy5hZGQoJ2Rpc2FibGVkJylcclxuICAgIGxldCBwb3N0TWVzc2FnZUlkID0gZS50YXJnZXQuaWQudHJpbSgpO1xyXG4gICAgbGV0IHBvc3RWYWx1ZSA9IHtcclxuICAgICAgb3duZXI6IHVzZXJDcmVkZW50aWFscy5lbWFpbCxcclxuICAgICAgbWVzc2FnZUlkOiBwb3N0TWVzc2FnZUlkXHJcbiAgICB9XHJcbiAgICBnZXRNZXNzYWdlcyhcImZhdkRlbE9uZUZyb21MaXN0XCIsIEpTT04uc3RyaW5naWZ5KHBvc3RWYWx1ZSkgKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSkudGhlbihkcmF3RmF2b3JpdGVzKHVzZXJDcmVkZW50aWFscy5lbWFpbCkpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2hlY2stZmF2b3JpdGVzLWJ1dHRvblwiKSl7XHJcbiAgICBsZXQgcG9zdE1lc3NhZ2VJZCA9IGUudGFyZ2V0LmlkLnRyaW0oKTtcclxuICAgIGxldCBwb3N0VmFsdWUgPSB7XHJcbiAgICAgIG93bmVyOiB1c2VyQ3JlZGVudGlhbHMuZW1haWwsXHJcbiAgICAgIG1lc3NhZ2VJZDogcG9zdE1lc3NhZ2VJZFxyXG4gICAgfVxyXG4gICAgZ2V0TWVzc2FnZXMoXCJmYXZDaGVja0RvbmVcIiwgSlNPTi5zdHJpbmdpZnkocG9zdFZhbHVlKSApLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KS50aGVuKGRyYXdGYXZvcml0ZXModXNlckNyZWRlbnRpYWxzLmVtYWlsKSk7XHJcbiAgfVxyXG59KVxyXG5cclxuZmlsdGVyc0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgdmFyIGlkO1xyXG4gIGlmKGUuc3JjRWxlbWVudCAmJiBlLnNyY0VsZW1lbnQub2Zmc2V0UGFyZW50ICYmIGUuc3JjRWxlbWVudC5vZmZzZXRQYXJlbnQuaWQpIHtcclxuICAgIGlkID0gZS5zcmNFbGVtZW50Lm9mZnNldFBhcmVudC5pZDtcclxuICB9XHJcbiAgaWYoZS50YXJnZXQuaWQpIHtcclxuICAgIGlkID0gZS50YXJnZXQuaWQ7XHJcbiAgfVxyXG4gIFxyXG4gIGlmKGlkID09IFwibGlua3MtZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnaHR0cCcpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ21lc3NhZ2VzIHdpdGggbGlua3MnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJ5b3V0dWJlLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ3d3dy55b3V0dWJlJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAneW91dHViZSB2aWRlb3MnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJnaXRodWItZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnZ2l0aHViJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAnZ2l0aHViIGxpbmtzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwiaW1hZ2UtZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnaW1nJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAnaW1hZ2VzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwidHdpdHRlci1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICd0d2l0dGVyJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAndHdpdHRlciBwb3N0cycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcIm1lZXR1cC1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICdtZWV0dXAnKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICdtZWV0dXBzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwieW91dHViZS1jaGVja2JveFwiKSB7XHJcbiAgICBhbGxvd1lvdXR1YmVQcmV2aWV3ID0gYWxsb3dZb3V0dWJlUHJldmlldyA/IGZhbHNlIDogdHJ1ZTtcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJ0d2l0dGVyLWNoZWNrYm94XCIpIHtcclxuICAgIGFsbG93VHdpdHRlclByZXZpZXcgPSBhbGxvd1R3aXR0ZXJQcmV2aWV3ID8gZmFsc2UgOiB0cnVlO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuZXhwb3J0cy5kcmF3UGllQ2hhcnQgPSBmdW5jdGlvbihncmFwaEFycikge1xyXG4gIGdyYXBoQXJyID0gZ3JhcGhBcnIubWFwKG9iaiA9PiB7XHJcbiAgICByZXR1cm4gW29iai5faWQubmFtZSwgb2JqLmNvdW50XVxyXG4gIH0pXHJcbiAgZ3JhcGhBcnIudW5zaGlmdChbJ1VzZXInLCAnQ291bnQgb2YgbWVzc2FnZXMnXSlcclxuICBncmFwaEFyci5sZW5ndGggPSAyMDtcclxuICAvLyBjb25zb2xlLmxvZyhncmFwaEFycilcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoXCJjdXJyZW50XCIsIHtwYWNrYWdlczpbXCJjb3JlY2hhcnRcIl19KTtcclxuICAgICAgICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdDaGFydCk7XHJcbiAgICAgICAgZnVuY3Rpb24gZHJhd0NoYXJ0KCkge1xyXG4gICAgICAgICAgdmFyIGRhdGEgPSBnb29nbGUudmlzdWFsaXphdGlvbi5hcnJheVRvRGF0YVRhYmxlKGdyYXBoQXJyKTtcclxuXHJcbiAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2hhcnRBcmVhOiB7IGxlZnQ6ICctNSUnLCB0b3A6ICcxMiUnLCB3aWR0aDogXCI5MCVcIiwgaGVpZ2h0OiBcIjkwJVwiIH0sXHJcbiAgICAgICAgICAgIHRpdGxlOiAnTWVzc2FnaW5nIGFjdGl2aXR5JyxcclxuICAgICAgICAgICAgcGllSG9sZTogMC40LFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uUGllQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RvbnV0Y2hhcnQnKSk7XHJcbiAgICAgICAgICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4vL3RvdGFsQmxvY2tcclxuY29uc3QgdG90YWxMaW5rcyAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1saW5rc1wiKSxcclxuICAgICAgdG90YWxWaWRlb3MgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC12aWRlb3NcIiksXHJcbiAgICAgIHRvdGFsR2l0aHViICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtZ2l0aHViXCIpLFxyXG4gICAgICB0b3RhbEltYWdlcyAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWltYWdlc1wiKSxcclxuICAgICAgdG90YWxtZW50aW9ucyAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1tZW50aW9uc1wiKSxcclxuICAgICAgdG90YWxGaW5pc2hlZFRhc2tzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1maW5pc2hlZC10YXNrc1wiKSxcclxuICAgICAgdG90YWxNZXNzYWdlcyAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1tZXNzYWdlc1wiKSxcclxuICAgICAgdG90YWxEYXlzICAgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1kYXlzXCIpO1xyXG5cclxuXHJcbmV4cG9ydHMucmVuZGVyVG90YWxNZWRpYVN1bW1hcnlCbG9jayA9ICgpID0+IHtcclxuICBnZXRNZXNzYWdlcyhcImNvdW50XCIpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbE1lc3NhZ2VzLmlubmVySFRNTCA9IGA8Yj4ke2RhdGF9PC9iPmA7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJieURheVwiKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxEYXlzLmlubmVySFRNTCA9IGA8Yj4ke01hdGguZmxvb3IoZGF0YS5sZW5ndGgvMzApfSBtb250aHMgJiAke2RhdGEubGVuZ3RoICUgMzB9IGRheXM8L2I+YDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnaHR0cCcpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbExpbmtzLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gcmVmZXJlbmNlc2A7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJy55b3V0dWJlJykudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsVmlkZW9zLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gdmlkZW9zYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnLmdpdGh1YicpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbEdpdGh1Yi5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IGxpbmtzIHRvIGdpdGh1YmA7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJ2h0dHAgaW1nJykudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsSW1hZ2VzLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gc2NyZWVuc2hvdHNgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICdAJykudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsbWVudGlvbnMuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiBtZW50aW9uc2A7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJmaW5pc2hlZEJ5VGFza3NcIikudGhlbigoZGF0YSwgaHRtbCkgPT4ge1xyXG4gICAgdG90YWxGaW5pc2hlZFRhc2tzLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gcmVhZHkgdGFza3NgO1xyXG4gIH0pO1xyXG59IiwiY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL19jb25maWdcIik7XHJcbmNvbnN0IHRhYmxlID0gcmVxdWlyZShcIi4uL3BsdWdpbnMvX3RhYmxlXCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluc2VydFRhc2tMaXN0VG9QYWdlID0gKGZpbmlzaGVkQXJyKSA9PiB7XHJcbiAgdmFyIGltYWdlTG9nbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWxvZ28nKTtcclxuICBpbWFnZUxvZ28uc3JjID0gY29uZmlnLnZhcnMua290dGFuc1Jvb20uYXZhdGFyO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteUlucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0YWJsZS5teUZ1bmN0aW9uKTtcclxuXHJcbiAgdmFyIGh0bWwgPSAnJztcclxuXHJcbiAgdmFyIGRpdlRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215VGFibGUnKTtcclxuXHJcbiAgaHRtbCArPSBcclxuICAgIGA8dHIgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDEpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+TmFtZTwvdGg+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgyKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPk5pY2s8L3RoPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMyl9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5QdWJsaXNoZWQ8L3RoPlxyXG4gICAgICAgIDx0aCBzdHlsZT1cIndpZHRoOjgwJTtcIj5UZXh0PC90aD5cclxuICAgIDwvdHI+YDtcclxuICAgICAgICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmlzaGVkQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBodG1sICs9IFxyXG4gICAgICAgIGA8dHI+XHJcbiAgICAgICAgICA8dGQ+PGltZyBzcmM9XCIke2ZpbmlzaGVkQXJyW2ldLmF2YXRhclVybH1cIiBjbGFzcz1cInVzZXItaWNvblwiPiR7ZmluaXNoZWRBcnJbaV0uZGlzcGxheU5hbWV9PC90ZD5cclxuICAgICAgICAgIDx0ZD4oPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbSR7ZmluaXNoZWRBcnJbaV0udXJsfVwiPiR7ZmluaXNoZWRBcnJbaV0udXNlcm5hbWV9PC9hPik8L3RkPlxyXG4gICAgICAgICAgPHRkPiR7ZmluaXNoZWRBcnJbaV0uc2VudH08L3RkPlxyXG4gICAgICAgICAgPHRkPiR7ZmluaXNoZWRBcnJbaV0udGV4dH0gPC90ZD5cclxuICAgICAgICA8L3RyPmA7XHJcbiAgfVxyXG5kaXZUYWJsZS5pbm5lckhUTUwgPSBodG1sO1xyXG59IiwiY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL19jb25maWdcIik7XHJcbmNvbnN0IHNlbCA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvX3NlbGVjdG9ycycpO1xyXG5pbXBvcnQgeyByZXF1ZXN0IGFzIGdldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL19yZXF1ZXN0LW5ld1wiO1xyXG5cclxuZXhwb3J0cy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMgPSBmdW5jdGlvbigpIHtcclxuICAvLyBmZWF0dXJlIDFcclxuICBnZXRNZXNzYWdlcygnY291bnQnKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLm1lc3NhZ2VzQ291bnQuaW5uZXJIVE1MID0gZGF0YTtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSAyXHJcbiAgZ2V0TWVzc2FnZXMoXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2tvdHRhbnMvZnJvbnRlbmRcIikudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5zdGFycmVkUmVwby5pbm5lckhUTUwgPSAoZGF0YS5zdGFyZ2F6ZXJzX2NvdW50ID09IHVuZGVmaW5lZCkgPyBcIi4uLlwiIDogZGF0YS5zdGFyZ2F6ZXJzX2NvdW50O1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDNcclxuICBnZXRNZXNzYWdlcyhcImF1dGhvcnNcIikudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5hY3RpdmVVc2Vyc0NvdW50LmlubmVySFRNTCA9IGRhdGEubGVuZ3RoO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDRcclxuICBnZXRNZXNzYWdlcyhcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vc2VhcmNoL2lzc3Vlcz9xPSt0eXBlOnByK3VzZXI6a290dGFucyZzb3J0PWNyZWF0ZWQmJUUyJTgwJThDJUUyJTgwJThCb3JkZXI9YXNjXCIpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHZhciBwdWxsTnVtYmVyID0gZGF0YS5pdGVtcy5maW5kKChpdGVtKSA9PiB7cmV0dXJuIGl0ZW0ucmVwb3NpdG9yeV91cmwgPT0gXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2tvdHRhbnMvbW9jay1yZXBvXCI7fSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHVsbC1yZXF1ZXN0c1wiKVswXS5pbm5lckhUTUwgPSBwdWxsTnVtYmVyLm51bWJlcjtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSA1XHJcbiAgZ2V0TWVzc2FnZXMoXCJsZWFybmVyc1wiKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLmJsb2NrTGVhcm5lcnMuaW5uZXJIVE1MID0gZGF0YS5sZW5ndGg7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydHMuZHJhd0NvdW50T2ZUYXNrc1BlclVzZXJfVmVydGljYWxCYXIgPSBmdW5jdGlvbih1c2Vycykge1xyXG4gIGxldCBncmFwaEFyciA9IHVzZXJzLm1hcChmdW5jdGlvbih1c2VyKSB7XHJcbiAgICByZXR1cm4gbmV3IEFycmF5KHVzZXIudXNlcm5hbWUrXCJcIiwgdXNlci5sZXNzb25zLmxlbmd0aCwgXCJsaWdodGJsdWVcIik7XHJcbiAgfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKCdjdXJyZW50Jywge3BhY2thZ2VzOiBbJ2NvcmVjaGFydCcsICdiYXInXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0Jhc2ljKTtcclxuICBmdW5jdGlvbiBkcmF3QmFzaWMoKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRpY2FsX2NoYXJ0Jyk7XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ29sdW1uQ2hhcnQoY29udGFpbmVyKTtcclxuICAgIGdyYXBoQXJyLnVuc2hpZnQoWydVc2VyJywgJ1Rhc2tzJywgeyByb2xlOiAnc3R5bGUnIH1dKVxyXG4gICAgdmFyIGRhdGEgPSBnb29nbGUudmlzdWFsaXphdGlvbi5hcnJheVRvRGF0YVRhYmxlKGdyYXBoQXJyKTtcclxuICB2YXIgb3B0aW9ucyA9IHtcclxuICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICBkdXJhdGlvbjogMjAwMCxcclxuICAgICAgc3RhcnR1cDogdHJ1ZSAvL1RoaXMgaXMgdGhlIG5ldyBvcHRpb25cclxuICAgIH0sXHJcbiAgICB0aXRsZTogJ1N1bSBvZiBmaW5pc2hlZCB0YXNrcyBieSBlYWNoIGxlYXJuZXInLFxyXG4gICAgLy8gd2lkdGg6ICgkKHdpbmRvdykud2lkdGgoKSA8IDgwMCkgPyAkKHdpbmRvdykud2lkdGgoKSA6ICQod2luZG93KS53aWR0aCgpKjAuNSxcclxuICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpKjAuMyxcclxuICAgIGhBeGlzOiB7XHJcbiAgICAgIHNsYW50ZWRUZXh0OnRydWUsXHJcbiAgICAgIHNsYW50ZWRUZXh0QW5nbGU6OTAsICAgICAgICBcclxuICAgIH0sXHJcbiAgICB2QXhpczoge1xyXG4gICAgICAvL3RpdGxlOiAnU3VtIG9mIGZpbmlzaGVkIHRhc2tzJ1xyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvbjp7XHJcbiAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgICBlYXNpbmc6ICdvdXQnXHJcbiAgICB9LFxyXG4gIH07XHJcbiAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcclxuICB9XHJcbn0gXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuZXhwb3J0cy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0ID0gZnVuY3Rpb24oYWN0aXZpdHlBcnIpIHtcclxuICBhY3Rpdml0eUFyci5tYXAoZnVuY3Rpb24oZGF5KSB7XHJcbiAgICBkYXlbMF0gPSBuZXcgRGF0ZShkYXlbMF0pO1xyXG4gIH0pO1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZCgnY3VycmVudCcsIHtwYWNrYWdlczogWydjb3JlY2hhcnQnLCAnbGluZSddfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3QmFzaWMpO1xyXG5cclxuICBmdW5jdGlvbiBkcmF3QmFzaWMoKSB7XHJcbiAgICB2YXIgZGF0YSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIGRhdGEuYWRkQ29sdW1uKCdkYXRlJywgJ0RheXMnKTtcclxuICAgIGRhdGEuYWRkQ29sdW1uKCdudW1iZXInLCAnTWVzc2FnZXMnKTtcclxuICAgIGRhdGEuYWRkUm93cyhhY3Rpdml0eUFycik7XHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgdGl0bGU6IFwiQWN0aXZpdHkgb2YgdXNlcnMgaW4gY2hhdFwiLFxyXG4gICAgICBhbmltYXRpb246IHtcclxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcclxuICAgICAgICBzdGFydHVwOiB0cnVlIC8vVGhpcyBpcyB0aGUgbmV3IG9wdGlvblxyXG4gICAgICB9LFxyXG4gICAgICAvL2N1cnZlVHlwZTogJ2Z1bmN0aW9uJyxcclxuICAgICAgLy8gd2lkdGg6ICgkKHdpbmRvdykud2lkdGgoKSA8IDgwMCkgPyAkKHdpbmRvdykud2lkdGgoKSA6ICQod2luZG93KS53aWR0aCgpKjAuNSxcclxuICAgICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBcclxuICAgICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkqMC4zLFxyXG4gICAgICBoQXhpczoge1xyXG4gICAgICAgIHNsYW50ZWRUZXh0OnRydWUsXHJcbiAgICAgICAgc2xhbnRlZFRleHRBbmdsZTo0NSxcclxuICAgICAgfSxcclxuICAgICAgdkF4aXM6IHtcclxuICAgICAgICAvLyB0aXRsZTogJ0NvdW50IG9mIG1lc3NhJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkxpbmVDaGFydChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGluZWNoYXJ0JykpO1xyXG4gICAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcclxuICB9XHJcbn0iLCJleHBvcnRzLmRyYXdUaW1lbGluZUNoYXJ0ID0gZnVuY3Rpb24oZ3JhcGhBcnIpIHtcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoXCJjdXJyZW50XCIsIHtwYWNrYWdlczpbXCJ0aW1lbGluZVwiXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0NoYXJ0KTtcclxuICBmdW5jdGlvbiBkcmF3Q2hhcnQoKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVsaW5lJyk7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uVGltZWxpbmUoY29udGFpbmVyKTtcclxuICAgIHZhciBkYXRhVGFibGUgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKCk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ3N0cmluZycsIGlkOiAnUm9vbScgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ3N0cmluZycsIGlkOiAnTmFtZScgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ2RhdGUnLCBpZDogJ1N0YXJ0JyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnZGF0ZScsIGlkOiAnRW5kJyB9KTtcclxuICAgIFxyXG4gICAgZ3JhcGhBcnIubWFwKGVsZW1lbnQgPT4ge1xyXG4gICAgICBlbGVtZW50WzJdID0gbmV3IERhdGUoZWxlbWVudFsyXSk7XHJcbiAgICAgIGVsZW1lbnRbM10gPSBuZXcgRGF0ZShlbGVtZW50WzNdKTtcclxuICAgIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZFJvd3MoZ3JhcGhBcnIpO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICAgIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpLFxyXG4gICAgICB0aW1lbGluZTogeyBjb2xvckJ5Um93TGFiZWw6IHRydWUgfSxcclxuICAgICAgaEF4aXM6IHtcclxuICAgICAgICAgIG1pblZhbHVlOiBuZXcgRGF0ZSgyMDE3LCA5LCAyOSksXHJcbiAgICAgICAgICBtYXhWYWx1ZTogbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyAoMSAqIDYwICogNjAgKiAxMDAwMDApKVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgY2hhcnQuZHJhdyhkYXRhVGFibGUsIG9wdGlvbnMpO1xyXG4gIH1cclxufSJdfQ==

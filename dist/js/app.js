(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.vars = {
  hash: '7e16b5527c77ea58bac36dddda6f5b444f32e81b',
  // domain: "https://secret-earth-50936.herokuapp.com/",
  domain: "http://localhost:3000/",
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
  var currentDate = new Date().toLocaleDateString().substring(0, 10).split('-').join('.');
  // console.log(currentDate)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvX2NvbmZpZy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9fcmVxdWVzdC1uZXcuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvYXBwLmpzIiwiRzovRlJPTlRFTkQvUHJvamVjdHMvR2l0aHViL1JlYWwgcHJvamVjdHMva290dGFucy1zdGF0aXN0aWNzL2tvdHRhbnMtc3RhdHMvYXBwL2pzL3BsdWdpbnMvX2NvdW50ZG93bi5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9wbHVnaW5zL19zZWxlY3RvcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcGx1Z2lucy9fdGFibGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLWZpbHRlcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLXNlYXJjaC5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljcy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2UtdGltZWxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sQ0FBQyxJQUFJLEdBQUc7QUFDYixNQUFJLEVBQUUsMENBQTBDOztBQUVoRCxRQUFNLEVBQUUsd0JBQXdCO0FBQ2hDLGFBQVcsRUFBRTs7QUFFWCxVQUFNLEVBQUcsa0VBQWtFO0dBQzVFO0NBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JGLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFN0IsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksSUFBSSxFQUFFLFNBQVMsRUFBSztBQUMxQyxNQUFJLEdBQUcsR0FBRyxBQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNwRixNQUFJLE9BQU8sR0FBRztBQUNaLFVBQU0sRUFBRSxNQUFNO0FBQ2QsV0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFO0FBQ2hFLFFBQUksRUFBRSxRQUFRLEdBQUMsU0FBUztHQUN6QixDQUFBOztBQUVELE1BQUksVUFBVSxHQUFHLEFBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTlFLFNBQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUNyQixJQUFJ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LE9BQU8sR0FBRztBQUNaLFdBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFO0FBQ3hCLFlBQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQzFCLGNBQVEsRUFBRSxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUU7QUFDbkMsV0FBSyxFQUFFO0FBQ0gsZ0JBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUMvQixnQkFBUSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsTUFBTSxBQUFDLENBQUM7T0FDcEU7S0FDRixDQUFDO0FBQ0YsU0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDaEM7Q0FDRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMudmFycyA9IHtcclxuICBoYXNoOiAnN2UxNmI1NTI3Yzc3ZWE1OGJhYzM2ZGRkZGE2ZjViNDQ0ZjMyZTgxYicsXHJcbiAgLy8gZG9tYWluOiBcImh0dHBzOi8vc2VjcmV0LWVhcnRoLTUwOTM2Lmhlcm9rdWFwcC5jb20vXCIsXHJcbiAgZG9tYWluOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9cIixcclxuICBrb3R0YW5zUm9vbToge1xyXG4gICAgLy8gaWQgOiBcIjU5YjBmMjliZDczNDA4Y2U0Zjc0YjA2ZlwiLFxyXG4gICAgYXZhdGFyIDogXCJodHRwczovL2F2YXRhcnMtMDIuZ2l0dGVyLmltL2dyb3VwL2l2LzMvNTc1NDJkMjdjNDNiOGM2MDE5NzdhMGI2XCJcclxuICB9XHJcbn07XHJcbiBcclxuXHJcbi8vIHZhciBnbG9iYWwgPSB7XHJcbi8vICAgdG9rZW5TdHJpbmcgOiBcImFjY2Vzc190b2tlbj1cIiArIFwiOWUxMzE5MGE2ZjcwZTI4YjZlMjYzMDExZTYzZDRiMzRkMjZiZDY5N1wiLFxyXG4vLyAgIHJvb21VcmxQcmVmaXggOiBcImh0dHBzOi8vYXBpLmdpdHRlci5pbS92MS9yb29tcy9cIlxyXG4vLyB9O1xyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBnZXRBbGxSb29tTWVzc2FnZXMoY291bnQsIG9sZGVzdElkKSB7XHJcbi8vICAgaWYob2xkZXN0SWQpe29sZGVzdElkID0gXCImYmVmb3JlSWQ9XCIrb2xkZXN0SWQ7fSBcclxuLy8gICByZXR1cm4gZ2xvYmFsLnJvb21VcmxQcmVmaXggKyBrb3R0YW5zUm9vbS5pZCArXHJcbi8vICAgICAgICAgICBcIi9jaGF0TWVzc2FnZXM/bGltaXQ9XCIrIGNvdW50ICsgb2xkZXN0SWQgK1wiJlwiICsgZ2xvYmFsLnRva2VuU3RyaW5nO1xyXG4vLyAgIH07IFxyXG4iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi9fY29uZmlnXCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVlc3QgPSAobGluaywgcG9zdFZhbHVlKSA9PiB7XHJcbiAgdmFyIHVybCA9ICgvaHR0cC8udGVzdChsaW5rKSkgPyBsaW5rIDogY29uZmlnLnZhcnMuZG9tYWluICsgbGluayArIGNvbmZpZy52YXJzLmhhc2g7XHJcbiAgbGV0IG9wdGlvbnMgPSB7IFxyXG4gICAgbWV0aG9kOiBcIlBPU1RcIiwgXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxyXG4gICAgYm9keTogXCJ2YWx1ZT1cIitwb3N0VmFsdWVcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2coISFwb3N0VmFsdWUpXHJcbiAgbGV0IHJlcXVlc3RPYmogPSAoISFwb3N0VmFsdWUpID8gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zKSA6IG5ldyBSZXF1ZXN0KHVybCk7XHJcblxyXG4gIHJldHVybiBmZXRjaChyZXF1ZXN0T2JqKVxyXG4gICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcy5qc29uKClcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB9KTtcclxuICB9IFxyXG4iLCJjb25zdCBjb3VudGRvd24gICAgICA9IHJlcXVpcmUoXCIuL3BsdWdpbnMvX2NvdW50ZG93blwiKTtcclxuY29uc3QgcGFnZVN0YXRpc3RpY3MgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljc1wiKTtcclxuY29uc3QgcGFnZVRpbWVsaW5lICAgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2UtdGltZWxpbmVcIik7XHJcbmNvbnN0IHBhZ2VTZWFyY2ggICAgID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXNlYXJjaFwiKTtcclxuXHJcbmltcG9ydCAqIGFzIHNlYXJjaFBhZ2UgZnJvbSBcIi4vcmVuZGVyL19wYWdlLXNlYXJjaFwiO1xyXG5pbXBvcnQgKiBhcyBmaWx0ZXJzUGFnZSBmcm9tIFwiLi9yZW5kZXIvX3BhZ2UtZmlsdGVyc1wiO1xyXG5pbXBvcnQgeyByZXF1ZXN0IGFzIGdldE1lc3NhZ2VzICB9IGZyb20gXCIuL19yZXF1ZXN0LW5ld1wiO1xyXG5cclxuXHJcblxyXG5nZXRNZXNzYWdlcyhcImxhdGVzdFwiKS50aGVuKGluaXQpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAvLyBQYWdlIFRpbWVsaW5lXHJcbiAgZ2V0TWVzc2FnZXMoXCJmaW5pc2hlZEJ5VGFza3NcIikudGhlbihwYWdlVGltZWxpbmUuZHJhd1RpbWVsaW5lQ2hhcnQpO1xyXG4gIFxyXG4gIC8vUGFnZSBzZWFyY2ggZmluaXNoZWQgdGFza3NcclxuICBnZXRNZXNzYWdlcyhcImZpbmlzaGVkQnlTdHVkZW50c1wiKS50aGVuKHNlYXJjaFBhZ2UuaW5zZXJ0VGFza0xpc3RUb1BhZ2UpO1xyXG4gIFxyXG4gIC8vUGFnZSBzdGF0aXN0aWNzXHJcbiAgLy8gY291bnRkb3duLmluaXRUaW1lcigpO1xyXG4gIHBhZ2VTdGF0aXN0aWNzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcygpO1xyXG4gIGdldE1lc3NhZ2VzKFwibGVhcm5lcnNcIikudGhlbihwYWdlU3RhdGlzdGljcy5kcmF3Q291bnRPZlRhc2tzUGVyVXNlcl9WZXJ0aWNhbEJhcik7XHJcbiAgZ2V0TWVzc2FnZXMoXCJhY3Rpdml0eVwiKS50aGVuKHBhZ2VTdGF0aXN0aWNzLmRyYXdBY3Rpdml0eV9MaW5lQ2hhcnQpO1xyXG5cclxuICAvL1BhZ2UgZmlsdGVyc1xyXG4gIGxldCBjdXJyZW50RGF0ZSA9IChuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZygpLnN1YnN0cmluZygwLCAxMCkuc3BsaXQoJy0nKS5qb2luKCcuJykpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGN1cnJlbnREYXRlKVxyXG4gIGdldE1lc3NhZ2VzKFwicGVyZGF0ZVwiLCBjdXJyZW50RGF0ZSkudGhlbihkYXRhID0+IGZpbHRlcnNQYWdlLmRyYXdNZXNzYWdlcyhkYXRhLCBjdXJyZW50RGF0ZSkpO1xyXG4gIGdldE1lc3NhZ2VzKFwiYnlEYXlcIikudGhlbihmaWx0ZXJzUGFnZS5kcmF3Q2FsZW5kYXIpO1xyXG5cclxuICBmaWx0ZXJzUGFnZS5yZW5kZXJUb3RhbE1lZGlhU3VtbWFyeUJsb2NrKCk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJwZXJ1c2VyXCIpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICBmaWx0ZXJzUGFnZS5kcmF3UGllQ2hhcnQoZGF0YSk7IFxyXG4gICAgLy8gY29uc29sZS5sb2coZGF0YSlcclxuICB9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuIiwiLy9DT1VOVERPV04gVElNRVJcclxuLy9zbGlja2NpdGN1bGFyIGh0dHBzOi8vd3d3LmpxdWVyeXNjcmlwdC5uZXQvZGVtby9TbGljay1DaXJjdWxhci1qUXVlcnktQ291bnRkb3duLVBsdWdpbi1DbGFzc3ktQ291bnRkb3duL1xyXG5cclxuZXhwb3J0cy5pbml0VGltZXIgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgdGltZUVuZCA9IE1hdGgucm91bmQoIChuZXcgRGF0ZShcIjIwMTguMDIuMTBcIikuZ2V0VGltZSgpIC0gJC5ub3coKSkgLyAxMDAwKTtcclxuICAgICAgdGltZUVuZCA9IE1hdGguZmxvb3IodGltZUVuZCAvIDg2NDAwKSAqIDg2NDAwO1xyXG5cclxuICAkKCcjY291bnRkb3duLWNvbnRhaW5lcicpLkNsYXNzeUNvdW50ZG93bih7XHJcbiAgICB0aGVtZTogXCJ3aGl0ZVwiLCBcclxuICAgIGVuZDogJC5ub3coKSArIHRpbWVFbmQsIC8vZW5kOiAkLm5vdygpICsgNjQ1NjAwLFxyXG4gICAgbm93OiAkLm5vdygpLFxyXG4gICAgLy8gd2hldGhlciB0byBkaXNwbGF5IHRoZSBkYXlzL2hvdXJzL21pbnV0ZXMvc2Vjb25kcyBsYWJlbHMuXHJcbiAgICBsYWJlbHM6IHRydWUsXHJcbiAgICAvLyBvYmplY3QgdGhhdCBzcGVjaWZpZXMgZGlmZmVyZW50IGxhbmd1YWdlIHBocmFzZXMgZm9yIHNheXMvaG91cnMvbWludXRlcy9zZWNvbmRzIGFzIHdlbGwgYXMgc3BlY2lmaWMgQ1NTIHN0eWxlcy5cclxuICAgIGxhYmVsc09wdGlvbnM6IHtcclxuICAgICAgbGFuZzoge1xyXG4gICAgICAgIGRheXM6ICdEYXlzJyxcclxuICAgICAgICBob3VyczogJ0hvdXJzJyxcclxuICAgICAgICBtaW51dGVzOiAnTWludXRlcycsXHJcbiAgICAgICAgc2Vjb25kczogJ1NlY29uZHMnXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiAnZm9udC1zaXplOiAwLjVlbTsnXHJcbiAgICB9LFxyXG4gICAgLy8gY3VzdG9tIHN0eWxlIGZvciB0aGUgY291bnRkb3duXHJcbiAgICBzdHlsZToge1xyXG4gICAgICBlbGVtZW50OiAnJyxcclxuICAgICAgbGFiZWxzOiBmYWxzZSxcclxuICAgICAgZGF5czoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzFBQkM5QycsLy8ncmdiYSgwLCAwLCAwLCAxKScsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIGhvdXJzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjMjk4MEI5JyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfSxcclxuICAgICAgbWludXRlczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzhFNDRBRCcsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHNlY29uZHM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyNGMzlDMTInLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxiYWNrIHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgY291bnRkb3duIHJlYWNoZXMgMC5cclxuICAgIG9uRW5kQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge31cclxuICB9KTtcclxufSIsImV4cG9ydHMuYmxvY2tzID0ge1xyXG4gIG1lc3NhZ2VzQ291bnQ6ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY291bnQtbWVzc2FnZXNcIiksXHJcbiAgc3RhcnJlZFJlcG86ICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFycmVkLXJlcG9cIiksXHJcbiAgYWN0aXZlVXNlcnNDb3VudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdXNlcnNcIiksXHJcbiAgYmxvY2tMZWFybmVyczogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sZWFybmVyc1wiKSxcclxuICBcclxufSAiLCJleHBvcnRzLm15RnVuY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuICAvLyBEZWNsYXJlIHZhcmlhYmxlcyBcclxuICB2YXIgaW5wdXQsIGZpbHRlciwgdGFibGUsIHRyLCB0ZCwgaTtcclxuICBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dFwiKTtcclxuICBmaWx0ZXIgPSBpbnB1dC52YWx1ZS50b1VwcGVyQ2FzZSgpO1xyXG4gIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVRhYmxlXCIpO1xyXG4gIHRyID0gdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKTtcclxuXHJcbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0YWJsZSByb3dzLCBhbmQgaGlkZSB0aG9zZSB3aG8gZG9uJ3QgbWF0Y2ggdGhlIHNlYXJjaCBxdWVyeVxyXG4gIGZvciAoaSA9IDA7IGkgPCB0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgdGQgPSB0cltpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRkXCIpWzBdO1xyXG4gICAgaWYgKHRkKSB7XHJcbiAgICAgIGlmICh0ZC5pbm5lckhUTUwudG9VcHBlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSkge1xyXG4gICAgICAgIHRyW2ldLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRyW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgfSBcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnRzLnNvcnRUYWJsZSA9IGZ1bmN0aW9uKG4pIHtcclxuICB2YXIgdGFibGUsIHJvd3MsIHN3aXRjaGluZywgaSwgeCwgeSwgc2hvdWxkU3dpdGNoLCBkaXIsIHN3aXRjaGNvdW50ID0gMDtcclxuICB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTtcclxuICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gIC8vIFNldCB0aGUgc29ydGluZyBkaXJlY3Rpb24gdG8gYXNjZW5kaW5nOlxyXG4gIGRpciA9IFwiYXNjXCI7IFxyXG4gIC8qIE1ha2UgYSBsb29wIHRoYXQgd2lsbCBjb250aW51ZSB1bnRpbFxyXG4gIG5vIHN3aXRjaGluZyBoYXMgYmVlbiBkb25lOiAqL1xyXG4gIHdoaWxlIChzd2l0Y2hpbmcpIHtcclxuICAgIC8vIFN0YXJ0IGJ5IHNheWluZzogbm8gc3dpdGNoaW5nIGlzIGRvbmU6XHJcbiAgICBzd2l0Y2hpbmcgPSBmYWxzZTtcclxuICAgIHJvd3MgPSB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlRSXCIpO1xyXG4gICAgLyogTG9vcCB0aHJvdWdoIGFsbCB0YWJsZSByb3dzIChleGNlcHQgdGhlXHJcbiAgICBmaXJzdCwgd2hpY2ggY29udGFpbnMgdGFibGUgaGVhZGVycyk6ICovXHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgKHJvd3MubGVuZ3RoIC0gMSk7IGkrKykge1xyXG4gICAgICAvLyBTdGFydCBieSBzYXlpbmcgdGhlcmUgc2hvdWxkIGJlIG5vIHN3aXRjaGluZzpcclxuICAgICAgc2hvdWxkU3dpdGNoID0gZmFsc2U7XHJcbiAgICAgIC8qIEdldCB0aGUgdHdvIGVsZW1lbnRzIHlvdSB3YW50IHRvIGNvbXBhcmUsXHJcbiAgICAgIG9uZSBmcm9tIGN1cnJlbnQgcm93IGFuZCBvbmUgZnJvbSB0aGUgbmV4dDogKi9cclxuICAgICAgeCA9IHJvd3NbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJURFwiKVtuXTtcclxuICAgICAgeSA9IHJvd3NbaSArIDFdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVERcIilbbl07XHJcbiAgICAgIC8qIENoZWNrIGlmIHRoZSB0d28gcm93cyBzaG91bGQgc3dpdGNoIHBsYWNlLFxyXG4gICAgICBiYXNlZCBvbiB0aGUgZGlyZWN0aW9uLCBhc2Mgb3IgZGVzYzogKi9cclxuICAgICAgaWYgKGRpciA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgaWYgKHguaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkgPiB5LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAvLyBJZiBzbywgbWFyayBhcyBhIHN3aXRjaCBhbmQgYnJlYWsgdGhlIGxvb3A6XHJcbiAgICAgICAgICBzaG91bGRTd2l0Y2g9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoZGlyID09IFwiZGVzY1wiKSB7XHJcbiAgICAgICAgaWYgKHguaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkgPCB5LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAvLyBJZiBzbywgbWFyayBhcyBhIHN3aXRjaCBhbmQgYnJlYWsgdGhlIGxvb3A6XHJcbiAgICAgICAgICBzaG91bGRTd2l0Y2g9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChzaG91bGRTd2l0Y2gpIHtcclxuICAgICAgLyogSWYgYSBzd2l0Y2ggaGFzIGJlZW4gbWFya2VkLCBtYWtlIHRoZSBzd2l0Y2hcclxuICAgICAgYW5kIG1hcmsgdGhhdCBhIHN3aXRjaCBoYXMgYmVlbiBkb25lOiAqL1xyXG4gICAgICByb3dzW2ldLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHJvd3NbaSArIDFdLCByb3dzW2ldKTtcclxuICAgICAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAgICAgLy8gRWFjaCB0aW1lIGEgc3dpdGNoIGlzIGRvbmUsIGluY3JlYXNlIHRoaXMgY291bnQgYnkgMTpcclxuICAgICAgc3dpdGNoY291bnQgKys7IFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyogSWYgbm8gc3dpdGNoaW5nIGhhcyBiZWVuIGRvbmUgQU5EIHRoZSBkaXJlY3Rpb24gaXMgXCJhc2NcIixcclxuICAgICAgc2V0IHRoZSBkaXJlY3Rpb24gdG8gXCJkZXNjXCIgYW5kIHJ1biB0aGUgd2hpbGUgbG9vcCBhZ2Fpbi4gKi9cclxuICAgICAgaWYgKHN3aXRjaGNvdW50ID09IDAgJiYgZGlyID09IFwiYXNjXCIpIHtcclxuICAgICAgICBkaXIgPSBcImRlc2NcIjtcclxuICAgICAgICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgcmVxdWVzdCBhcyBnZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9fcmVxdWVzdC1uZXdcIjtcclxuXHJcbmNvbnN0IGNhcm91c2VsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5ibG9jay1kYXRlLXNjcm9sbFwiKTtcclxuY29uc3QgbWFpbk1lc3NhZ2VzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jZW50ZXItbWVzc2FnZXMtY29udGVudFwiKTtcclxuY29uc3QgbWFpblNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2gtYnktd3R3clwiKTtcclxuY29uc3QgdXNlcm5hbWVTZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoLWJ5LXVzZXJuYW1lXCIpO1xyXG5jb25zdCB1c2VybmFtZUF1dG9jb21wbGV0ZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWFzeS1hdXRvY29tcGxldGUtY29udGFpbmVyXCIpO1xyXG5jb25zdCBmaWx0ZXJzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idXR0b24tZmlsdGVyc1wiKTtcclxuY29uc3Qgc2lnbnVwQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNpZ251cFwiKTtcclxuY29uc3QgZmF2b3JpdGVzQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZhdm9yaXRlcy13cmFwcGVyXCIpO1xyXG5jb25zdCBmYXZvcml0ZXNCbG9ja1RpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXZvcml0ZXMtdGl0bGVcIik7XHJcbmNvbnN0IGZhdm9yaXRlV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXZvcml0ZXMtc2VjdGlvblwiKTtcclxuY29uc3Qgc2F2ZWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNhdmVkLW1lc3NhZ2VzLWNvbnRhaW5lclwiKTtcclxuY29uc3QgZG9uZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9uZS1tZXNzYWdlcy1jb250YWluZXJcIik7XHJcbmNvbnN0IEVOVEVSID0gMTM7XHJcblxyXG5sZXQgYWxsb3dUd2l0dGVyUHJldmlldyA9IGZhbHNlO1xyXG5sZXQgYWxsb3dZb3V0dWJlUHJldmlldyA9IGZhbHNlO1xyXG5cclxubGV0IHVzZXJDcmVkZW50aWFscyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Zhdm9yaXRlcycpKTtcclxuaWYodXNlckNyZWRlbnRpYWxzICYmIHVzZXJDcmVkZW50aWFscy5lbWFpbCl7XHJcbiAgbGV0IHVzZXJuYW1lID0gdXNlckNyZWRlbnRpYWxzLmVtYWlsLnNwbGl0KCdAJylbMF07XHJcbiAgZmF2b3JpdGVzQmxvY2tUaXRsZS5pbm5lckhUTUwgPSBcclxuICAgICAgICBgSGVsbG8gJHt1c2VybmFtZX0hIDxhIGNsYXNzPVwic2lnbm91dC1idXR0b25cIj5TaWduIG91dCE8L2E+YDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGUoc2VudCwgc3BsaXR0ZXIpIHtcclxuICB2YXIgZGF0ZVNlbnRGb3JtYXR0ZWQgPVxyXG4gICAgc2VudC5nZXRGdWxsWWVhcigpICtcclxuICAgIHNwbGl0dGVyICtcclxuICAgIChcIjBcIiArIChzZW50LmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpICtcclxuICAgIHNwbGl0dGVyICtcclxuICAgIChcIjBcIiArIHNlbnQuZ2V0RGF0ZSgpKS5zbGljZSgtMikgK1xyXG4gICAgXCIgXCIgK1xyXG4gICAgKFwiMFwiICsgc2VudC5nZXRIb3VycygpKS5zbGljZSgtMikgK1xyXG4gICAgXCI6XCIgK1xyXG4gICAgKFwiMFwiICsgc2VudC5nZXRNaW51dGVzKCkpLnNsaWNlKC0yKTtcclxuICByZXR1cm4gZGF0ZVNlbnRGb3JtYXR0ZWQ7XHJcbn1cclxuXHJcbmNvbnN0IHR3aXR0ZXJGb3JtYXR0ZXIgPSAodXJsKSA9PiB7XHJcbiAgaWYoL3R3aXR0ZXIvaWcudGVzdCh1cmwpKXtcclxuICAgIC8vaHR0cHM6Ly90d2l0ZnJhbWUuY29tLyNzaXppbmdcclxuICAgIHJldHVybiBgPGlmcmFtZSBib3JkZXI9MCBmcmFtZWJvcmRlcj0wIGhlaWdodD0zMDAgd2lkdGg9NTUwIFxyXG4gICAgICBzcmM9XCJodHRwczovL3R3aXRmcmFtZS5jb20vc2hvdz91cmw9JHtlbmNvZGVVUkkodXJsLnRyaW0oKS5zdWJzdHJpbmcoNywgdXJsLmxlbmd0aCkpfVwiPjwvaWZyYW1lPmA7XHJcbiAgfSBlbHNlIHtyZXR1cm4gJyc7fVxyXG59XHJcblxyXG5jb25zdCB5b3V0dWJlRm9ybWF0dGVyID0gKHVybCkgPT4ge1xyXG4gIGxldCB5dHVybCA9IC8oPzpodHRwcz86XFwvXFwvKT8oPzp3d3dcXC4pPyg/OnlvdXR1YmVcXC5jb218eW91dHVcXC5iZSlcXC8oPzp3YXRjaFxcP3Y9KT8oW1xcd1xcLV17MTAsMTJ9KSg/OiZmZWF0dXJlPXJlbGF0ZWQpPyg/OltcXHdcXC1dezB9KT8vZztcclxuICBsZXQgaWZyYW1lU3RyaW5nID0gJzxpZnJhbWUgd2lkdGg9XCI0MjBcIiBoZWlnaHQ9XCIzNDVcIiBzcmM9XCJodHRwOi8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyQxXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPic7XHJcbiAgaWYoeXR1cmwudGVzdCh1cmwpKXtcclxuICAgIC8vdHJ5IHRvIGdlbmVyYXRlIHRodW1ibmFpbHNcclxuICAgIC8vIHJldHVybiBgPGJyPjxpbWcgc3JjPVwiJHtZb3V0dWJlLnRodW1iKHVybCl9XCIgdGl0bGU9XCJ5b3V0dWJlIHRodW1ibmFpbFwiPmA7XHJcbiAgICBsZXQgeXRJZnJhbWUgPSB1cmwucmVwbGFjZSh5dHVybCwgaWZyYW1lU3RyaW5nKTtcclxuICAgIHJldHVybiB5dElmcmFtZS5zdWJzdHJpbmcoNiwgeXRJZnJhbWUubGVuZ3RoKTtcclxuICB9IGVsc2Uge3JldHVybiAnJzt9XHJcbn1cclxuXHJcbi8vaHR0cDovL2pzZmlkZGxlLm5ldC84VGFTOC82LyBleHRyYWN0IHRodW1ibmFpbHMgXHJcbnZhciBZb3V0dWJlID0gKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcbiAgdmFyIHZpZGVvLCByZXN1bHRzO1xyXG4gIHZhciBnZXRUaHVtYiA9IGZ1bmN0aW9uICh1cmwsIHNpemUpIHtcclxuICAgICAgaWYgKHVybCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICB9XHJcbiAgICAgIHNpemUgPSAoc2l6ZSA9PT0gbnVsbCkgPyAnYmlnJyA6IHNpemU7XHJcbiAgICAgIC8vIGxldCB5dHVybCA9IC8oPzpodHRwcz86XFwvXFwvKT8oPzp3d3dcXC4pPyg/OnlvdXR1YmVcXC5jb218eW91dHVcXC5iZSlcXC8oPzp3YXRjaFxcP3Y9KT8oW1xcd1xcLV17MTAsMTJ9KSg/OiZmZWF0dXJlPXJlbGF0ZWQpPyg/OltcXHdcXC1dezB9KT8vZztcclxuICAgICAgcmVzdWx0cyA9IHVybC5tYXRjaCgnW1xcXFw/Jl12PShbXiYjXSopJyk7XHJcbiAgICAgIHZpZGVvID0gKHJlc3VsdHMgPT09IG51bGwpID8gdXJsIDogcmVzdWx0c1sxXTtcclxuICAgICAgaWYgKHNpemUgPT09ICdzbWFsbCcpIHtcclxuICAgICAgICAgIHJldHVybiAnaHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS8nICsgdmlkZW8gKyAnLzIuanBnJztcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gJ2h0dHA6Ly9pbWcueW91dHViZS5jb20vdmkvJyArIHZpZGVvICsgJy8wLmpwZyc7XHJcbiAgfTtcclxuICByZXR1cm4ge1xyXG4gICAgICB0aHVtYjogZ2V0VGh1bWJcclxuICB9O1xyXG59KCkpO1xyXG5cclxuXHJcbmNvbnN0IG1hcmtTZWFyY2hlZFZhbHVlc0luSHRtbCA9IChtZXNzYWdlSHRtbCwgcG9zdFZhbHVlKSA9PiB7XHJcbiAgbGV0IHl0SWZyYW1lID0gJyc7XHJcbiAgbGV0IHR3aXR0ZXJJZnJhbWUgPSAnJztcclxuICBsZXQgcmVwbGFjZWRWYWx1ZSA9IGA8Yj48bWFyaz4ke3Bvc3RWYWx1ZX08L21hcms+PC9iPmA7XHJcbiAgLy9yZWRyYXcgYWxsXHJcbiAgaWYocG9zdFZhbHVlICYmIHBvc3RWYWx1ZSAhPSAnc3JjJykge1xyXG4gICAgbGV0IHJlZ2V4dGVtcCA9IHBvc3RWYWx1ZS5yZXBsYWNlKC9cXC4vaWcsIFwiXFxcXFxcLlwiKTtcclxuICAgIG1lc3NhZ2VIdG1sID0gbWVzc2FnZUh0bWwucmVwbGFjZShuZXcgUmVnRXhwKHJlZ2V4dGVtcCwgJ2lnJyksIHJlcGxhY2VkVmFsdWUpO1xyXG4gIH1cclxuICAvL3NlYXJjaCBmb3Igd2hhdGV2ZXIgdXJsc1xyXG4gIGxldCB1cmxzID0gbWVzc2FnZUh0bWwubWF0Y2goL2hyZWY9XCIoLio/KVwiL2cpOyAgXHJcbiAgbGV0IGNsZWFuZWRIdG1sID0gbWVzc2FnZUh0bWw7XHJcbiAgaWYodXJscykge1xyXG4gICAgdXJscy5mb3JFYWNoKHVybCA9PiB7XHJcbiAgICAgIGlmKGFsbG93VHdpdHRlclByZXZpZXcpXHJcbiAgICAgICAgdHdpdHRlcklmcmFtZSA9IHR3aXR0ZXJGb3JtYXR0ZXIodXJsKTtcclxuICAgICAgaWYoYWxsb3dZb3V0dWJlUHJldmlldylcclxuICAgICAgICB5dElmcmFtZSA9IHlvdXR1YmVGb3JtYXR0ZXIodXJsKTtcclxuICAgICAgbGV0IG5ld1VybCA9IHVybC5zcGxpdChyZXBsYWNlZFZhbHVlKS5qb2luKHBvc3RWYWx1ZSk7XHJcbiAgICAgIGNsZWFuZWRIdG1sID0gY2xlYW5lZEh0bWwuc3BsaXQodXJsKS5qb2luKG5ld1VybClcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGNsZWFuZWRIdG1sK3l0SWZyYW1lK3R3aXR0ZXJJZnJhbWU7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgcmV0dXJuIG1lc3NhZ2VIdG1sK3l0SWZyYW1lK3R3aXR0ZXJJZnJhbWU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZHJhd01lc3NhZ2VzID0gKGRhdGEsIHBvc3RWYWx1ZSwgY29udGFpbmVyKSA9PiB7XHJcbiAgbGV0IG1lc3NhZ2VzQ29udGFpbmVyO1xyXG4gIGlmKGNvbnRhaW5lcikge1xyXG4gICAgbWVzc2FnZXNDb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgfWVsc2Uge1xyXG4gICAgbWVzc2FnZXNDb250YWluZXIgPSBtYWluTWVzc2FnZXNDb250YWluZXI7XHJcbiAgfVxyXG4gIG1lc3NhZ2VzQ29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gIGxldCBodG1sID0gXCJcIjtcclxuICBsZXQgb3BlbiA9IFwiXCI7XHJcbiAgLy8gY29uc29sZS5sb2cocG9zdFZhbHVlKVxyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gIGlmIChkYXRhICYmIGRhdGFbMF0gPT0gdW5kZWZpbmVkKSB7XHJcbiAgICBwb3N0VmFsdWUgPSBwb3N0VmFsdWUgPyBgd2l0aCB3b3JkIDxiPiR7cG9zdFZhbHVlfTwvYj5gIDogJyc7XHJcbiAgICBodG1sICs9IGA8ZGl2PjxjZW50ZXI+PGgzPk5vIG1lc3NhZ2VzICR7cG9zdFZhbHVlfTwvaDM+PC9jZW50ZXI+PC9kaXY+YDtcclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICBtZXNzYWdlc0NvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgb3BlbiA9IFwib3BlblwiO1xyXG4gIGh0bWwgKz0gYFxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZGF5LXRpdGxlXCI+XHJcbiAgICAgICAgRm91bmQgPGI+JHtkYXRhLmxlbmd0aH08L2I+IG1lc3NhZ2VzIGZvciA8Yj4ke3Bvc3RWYWx1ZX08L2I+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYDsgXHJcbiAgZGF0YS5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xyXG4gICAgaHRtbCArPSBgXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZS13cmFwcGVyXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibWVzc2FnZS1kYXRlLXNlbnRcIj5cclxuICAgICAgICAgICAgICAke2Zvcm1hdERhdGUobmV3IERhdGUobWVzc2FnZS5zZW50KSwgXCIuXCIpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlLWF2YXRhciB0b29sdGlwXCI+XHJcbiAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJhdmF0YXIgXCIgc3JjPVwiJHttZXNzYWdlLmF2YXRhclVybH1cIj5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9vbHRpcHRleHRcIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJ0b29sdGlwLWF2YXRhclwiIHNyYz1cIiR7IG1lc3NhZ2UuYXZhdGFyVXJsTWVkaXVtIH1cIj5cclxuICAgICAgICAgICAgICAgIDxhIHRpdGxlPVwic2VhcmNoIG1lbnRpb25zIGJ5ICR7IG1lc3NhZ2UudXNlcm5hbWV9XCIgY2xhc3M9XCJ0aXRsZSBtZXNzYWdlLXVzZXJuYW1lXCI+JHsgbWVzc2FnZS51c2VybmFtZX08L2E+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm1kbC1idXR0b24gbWRsLWpzLWJ1dHRvbiBtZGwtYnV0dG9uLS1yYWlzZWQgbWRsLWpzLXJpcHBsZS1lZmZlY3RcIiB0YXJnZXQ9XCJfYmxhbmtcIiB0aXRsZT1cImdvIHRvICR7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlLnVzZXJuYW1lXHJcbiAgICAgICAgICAgICAgfSBnaXRodWIgcmVwb1wiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20ke21lc3NhZ2UudXJsfVwiPk9wZW4gcHJvZmlsZTwvYT5cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRleHQtd3JhcHBlclwiPlxyXG4gICAgICAgICAgICAgIDxhIHRpdGxlPVwic2VhcmNoIG1lbnRpb25zIGJ5ICR7IG1lc3NhZ2UudXNlcm5hbWV9XCIgY2xhc3M9XCJtZXNzYWdlLXVzZXJuYW1lXCI+XHJcbiAgICAgICAgICAgICAgICAkeyBtZXNzYWdlLnVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZS1tYXJrdXBcIj5cclxuICAgICAgICAgICAgICAgICR7bWFya1NlYXJjaGVkVmFsdWVzSW5IdG1sKG1lc3NhZ2UuaHRtbCwgcG9zdFZhbHVlKX1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiBjbGFzcz1cIiR7Y29udGFpbmVyID8gXCJkZWwtZnJvbS1mYXZvcml0ZXMtYnV0dG9uXCIgOiBcImFkZC10by1mYXZvcml0ZXMtYnV0dG9uXCJ9XCIgPlxyXG4gICAgICAgICAgICAgICAgPCEtLSA8aSBpZD1cIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgJHtjb250YWluZXIgPyBgY2xhc3M9XCJmYSBmYS10cmFzaC1vXCIgdGl0bGU9XCJkZWxldGUgZnJvbSBmYXZvcml0ZXNcImAgOiBgY2xhc3M9XCJmYSBmYS1wbHVzXCIgdGl0bGU9XCJhZGQgdG8gZmF2b3JpdGVzXCJgfSBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IC0tPlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCIke21lc3NhZ2UubWVzc2FnZUlkfVwiIGNsYXNzPVwiJHtjb250YWluZXIgPyBtZXNzYWdlLmNoZWNrZWQgPyBcImRvbmUtZmF2b3JpdGVzLWJ1dHRvblwiIDogXCJjaGVjay1mYXZvcml0ZXMtYnV0dG9uXCIgOiBcImhpZGUtYnV0dG9uXCJ9XCIgPlxyXG4gICAgICAgICAgICAgIDwhLS0gPGkgaWQ9XCIke21lc3NhZ2UubWVzc2FnZUlkfVwiIGNsYXNzPVwiZmEgJHtjb250YWluZXIgPyBtZXNzYWdlLmNoZWNrZWQgPyBcImZhLWNoZWNrLXNxdWFyZS1vXCIgOiBcImZhLXNxdWFyZS1vXCIgOiAgXCJmYS1zcXVhcmUtb1wifVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gLS0+XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+YDtcclxuICB9KTtcclxuXHJcbiAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcclxuICBcclxuICAvLyBJTklUIEhJR0hMSUdIVC5KUyBGT1IgQ09ERSBCTE9DS1MgSU4gTUVTU0FHRVNcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQoXCJwcmUgY29kZVwiKS5lYWNoKGZ1bmN0aW9uKGksIGJsb2NrKSB7XHJcbiAgICAgIGhsanMuaGlnaGxpZ2h0QmxvY2soYmxvY2spO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbiAgbWVzc2FnZXNDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICB9LCAxMDApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRyYXdDYWxlbmRhciA9IGFjdGl2aXR5QXJyID0+IHtcclxuICBsZXQgYnVpbGRlZEFyciA9IFtdO1xyXG4gIC8vIGNvbnNvbGUubG9nKGFjdGl2aXR5QXJyWzBdKVxyXG4gIGFjdGl2aXR5QXJyLmZvckVhY2goZnVuY3Rpb24oZGF5T2JqKSB7XHJcbiAgICBsZXQgZGF0ZVN0cmluZyA9IGRheU9iai5faWQuc3BsaXQoJy4nKS5qb2luKCctJyk7XHJcbiAgICBidWlsZGVkQXJyLnB1c2goe1xyXG4gICAgICBkYXRlOiBkYXRlU3RyaW5nLFxyXG4gICAgICBiYWRnZTogZmFsc2UsXHJcbiAgICAgIHRpdGxlOiBgJHtkYXlPYmouY291bnR9IG1lc3NhZ2VzYCxcclxuICAgICAgY2xhc3NuYW1lOiBgZGF5LWJsb2NrLSR7ZGF5T2JqLmNvdW50ID4gMTAwID8gMTEwIDogZGF5T2JqLmNvdW50fWBcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIC8vIGNvbnNvbGUubG9nKGJ1aWxkZWRBcnIpXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwiI215LWNhbGVuZGFyXCIpLnphYnV0b19jYWxlbmRhcih7XHJcbiAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG15RGF0ZUZ1bmN0aW9uKHRoaXMuaWQsIGZhbHNlKTtcclxuICAgICAgfSxcclxuICAgICAgZGF0YTogYnVpbGRlZEFyciwgLy9ldmVudERhdGEsXHJcbiAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgbGVnZW5kOiBbXHJcbiAgICAgICAgeyB0eXBlOiBcInRleHRcIiwgbGFiZWw6IFwibGVzcyAxMFwiIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICBsaXN0OiBbXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTIwXCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTM1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTQ1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTY1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTc1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTk1XCJcclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgdHlwZTogXCJ0ZXh0XCIsIGxhYmVsOiBcIm1vcmUgMTAwXCIgfVxyXG4gICAgICBdLFxyXG4gICAgICBjZWxsX2JvcmRlcjogdHJ1ZSxcclxuICAgICAgdG9kYXk6IHRydWUsXHJcbiAgICAgIG5hdl9pY29uOiB7XHJcbiAgICAgICAgcHJldjogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1jaXJjbGUtbGVmdFwiPjwvaT4nLFxyXG4gICAgICAgIG5leHQ6ICc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tY2lyY2xlLXJpZ2h0XCI+PC9pPidcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBteURhdGVGdW5jdGlvbihpZCwgZnJvbU1vZGFsKSB7XHJcbiAgdmFyIGRhdGUgPSAkKFwiI1wiICsgaWQpLmRhdGEoXCJkYXRlXCIpO1xyXG4gIGRhdGUgPSBkYXRlLnNwbGl0KCctJykuam9pbignLicpO1xyXG4gIHZhciBoYXNFdmVudCA9ICQoXCIjXCIgKyBpZCkuZGF0YShcImhhc0V2ZW50XCIpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGRhdGUpXHJcbiAgZ2V0TWVzc2FnZXMoXCJwZXJkYXRlXCIsIGRhdGUpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgZGF0ZSkpO1xyXG59XHJcblxyXG5cclxuXHJcbi8vLy9cclxuY29uc3QgbGVmdFNpZGViYXJPcGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vcGVuXCIpO1xyXG5jb25zdCBsZWZ0U2lkZWJhckNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKTtcclxuY29uc3QgbGVmdFNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxlZnQtc2lkZWJhclwiKTtcclxuXHJcblxyXG5sZWZ0U2lkZWJhck9wZW4uc2Nyb2xsVG9wID0gbGVmdFNpZGViYXJPcGVuLnNjcm9sbEhlaWdodDtcclxubGVmdFNpZGViYXJPcGVuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYobGVmdFNpZGViYXIuc3R5bGUubWFyZ2luTGVmdCAhPSBcIjBweFwiKXtcclxuXHJcbiAgICBsZWZ0U2lkZWJhci5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIwcHhcIjtcclxuICAgIGxlZnRTaWRlYmFyT3Blbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBsZWZ0U2lkZWJhckNsb3NlLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgfVxyXG59KTtcclxuXHJcbmxlZnRTaWRlYmFyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZihsZWZ0U2lkZWJhci5zdHlsZS5tYXJnaW5MZWZ0ID09IFwiMHB4XCIpe1xyXG4gICAgbGVmdFNpZGViYXIuc3R5bGUubWFyZ2luTGVmdCA9IFwiLTEwMCVcIjtcclxuICAgIGxlZnRTaWRlYmFyT3Blbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuXHJcbm1haW5TZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICBsZXQgcG9zdFZhbHVlID0gZS50YXJnZXQudmFsdWUudHJpbSgpO1xyXG4gIGlmIChlLmtleUNvZGUgPT0gRU5URVIpIHtcclxuICAgICghIXBvc3RWYWx1ZSkgJiYgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgcG9zdFZhbHVlKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFZhbHVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG51c2VybmFtZVNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xyXG4gIGxldCBwb3N0VmFsdWUgPSBlLnRhcmdldC52YWx1ZS50cmltKCk7XHJcbiAgaWYgKGUua2V5Q29kZSA9PSBFTlRFUikge1xyXG4gICAgKCEhcG9zdFZhbHVlKSAmJiBnZXRNZXNzYWdlcyhcInNlYXJjaFVzZXJuYW1lXCIsIHBvc3RWYWx1ZSkudGhlbihkYXRhID0+IHtcclxuICAgICAgZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3RWYWx1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy9odHRwOi8vZWFzeWF1dG9jb21wbGV0ZS5jb20vZ3VpZGUjc2VjLWZ1bmN0aW9uc1xyXG5nZXRNZXNzYWdlcyhcImF1dGhvcnNcIikudGhlbihkYXRhID0+IHtcclxuICB2YXIgb3B0aW9ucyA9IHtcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICBsaXN0OiB7XHJcbiAgICAgIG1hdGNoOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBwb3N0VmFsdWUgPSAkKFwiLnNlYXJjaC1ieS11c2VybmFtZVwiKS5nZXRTZWxlY3RlZEl0ZW1EYXRhKCk7XHJcbiAgICAgICAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hVc2VybmFtZVwiLCBwb3N0VmFsdWUpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICB9XHJcbiAgfTtcclxuICAkKFwiLnNlYXJjaC1ieS11c2VybmFtZVwiKS5lYXN5QXV0b2NvbXBsZXRlKG9wdGlvbnMpO1xyXG59KTtcclxuXHJcblxyXG5zaWdudXBCbG9jay5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBjb25zb2xlLmxvZyhlLnRhcmdldClcclxuICBsZXQgZW1haWwgPSBlLnRhcmdldFsnMCddLnZhbHVlO1xyXG4gIGlmKGVtYWlsICYmIGVtYWlsICE9ICcnKSB7XHJcbiAgICBzaWdudXBCbG9jay5pbm5lckhUTUwgPSBgPGNlbnRlcj48aDQ+VGhhbmtzITwvaDQ+PC9jZW50ZXI+YDtcclxuICAgIHVzZXJDcmVkZW50aWFscyA9ICB7IGVtYWlsOiBlbWFpbCB9O1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Zhdm9yaXRlcycsIEpTT04uc3RyaW5naWZ5KHVzZXJDcmVkZW50aWFscykpO1xyXG4gICAgLy8gdXNlckNyZWRlbnRpYWxzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Zhdm9yaXRlcycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxldCB1c2VybmFtZSA9IGVtYWlsLnNwbGl0KCdAJylbMF07XHJcbiAgICAgIGZhdm9yaXRlc0Jsb2NrVGl0bGUuaW5uZXJIVE1MID0gXHJcbiAgICAgICAgYEhlbGxvICR7dXNlcm5hbWV9ISA8YSBjbGFzcz1cInNpZ25vdXQtYnV0dG9uXCI+U2lnbiBvdXQhPC9hPmA7XHJcblxyXG4gICAgICBcclxuICAgICAgc2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH0sIDEwMDApO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxubWFpbk1lc3NhZ2VzQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgY29uc29sZS5sb2coZS50YXJnZXQpXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWVzc2FnZS1kYXRlLXNlbnRcIikpe1xyXG4gICAgbGV0IHBvc3REYXRlID0gZS50YXJnZXQudGV4dENvbnRlbnQudHJpbSgpLnN1YnN0cmluZygwLDEwKTtcclxuICAgIGdldE1lc3NhZ2VzKFwicGVyZGF0ZVwiLCBwb3N0RGF0ZSkudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0RGF0ZSkpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWVzc2FnZS11c2VybmFtZVwiKSl7XHJcbiAgICBsZXQgcG9zdFVzZXJuYW1lID0gZS50YXJnZXQudGV4dENvbnRlbnQudHJpbSgpO1xyXG4gICAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgcG9zdFVzZXJuYW1lKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3RVc2VybmFtZSkpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWRkLXRvLWZhdm9yaXRlcy1idXR0b25cIikpe1xyXG4gICAgY2hhbmdlTWVzc2FnZVN0YXRlVG8oZSwgJ3NhdmVUb0Zhdm9yaXRlcycpO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuY29uc3QgY2hhbmdlTWVzc2FnZVN0YXRlVG8gPSAoZSwgc2F2ZVRvQ29tbWFuZCkgPT4ge1xyXG4gIGlmKCF1c2VyQ3JlZGVudGlhbHMpIHtcclxuICAgIHNpZ251cEJsb2NrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGxldCBwb3N0TWVzc2FnZUlkID0gZS50YXJnZXQuaWQudHJpbSgpO1xyXG4gICAgLy93b3Jrc1xyXG4gICAgZ2V0TWVzc2FnZXMoXCJmaW5kYnlJZFwiLCBwb3N0TWVzc2FnZUlkKS50aGVuKG1lc3NhZ2UgPT4ge1xyXG4gICAgICBsZXQgcG9zdFZhbHVlID0ge1xyXG4gICAgICAgIG93bmVyOiB1c2VyQ3JlZGVudGlhbHMuZW1haWwsXHJcbiAgICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlLm1lc3NhZ2VJZFxyXG4gICAgICB9XHJcbiAgICAgIC8vd29ya3NcclxuICAgICAgZ2V0TWVzc2FnZXMoc2F2ZVRvQ29tbWFuZCwgSlNPTi5zdHJpbmdpZnkocG9zdFZhbHVlKSkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzYXZldG9mYXZvcml0ZXMnLCBkYXRhKVxyXG4gICAgICAgIGxldCBhbnN3ZXIgPSAoZGF0YSA9PSAnQWxyZWFkeSBleGlzdCcpID8gZGF0YSA6ICdBZGRlZCc7XHJcbiAgICAgICAgc2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBzaWdudXBCbG9jay5pbm5lckhUTUwgPSBgPGNlbnRlcj48aDQ+JHthbnN3ZXJ9PC9oND48L2NlbnRlcj5gO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge3NpZ251cEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjt9LCAxMDAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5mYXZvcml0ZXNCbG9jay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInNpZ251cC1idXR0b25cIikpeyBcclxuICAgIHNpZ251cEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXktc2lnbi1ibG9jaycpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2lnbm91dC1idXR0b25cIikpeyBcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdmYXZvcml0ZXMnKTtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICB9XHJcbiAgaWYoZS50YXJnZXQuaWQgPT0gXCJ2aWV3LWZhdm9yaXRlcy1idXR0b25cIiB8fCBlLnRhcmdldC5vZmZzZXRQYXJlbnQuaWQgPT0gXCJ2aWV3LWZhdm9yaXRlcy1idXR0b25cIil7IFxyXG4gICAgaWYoIXVzZXJDcmVkZW50aWFscyl7XHJcbiAgICAgIHNpZ251cEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXktc2lnbi1ibG9jaycpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIC8vd29ya3NcclxuICAgICAgZHJhd0Zhdm9yaXRlcyh1c2VyQ3JlZGVudGlhbHMuZW1haWwpO1xyXG4gICAgICBmYXZvcml0ZVdpbmRvdy5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuY29uc3QgZHJhd0Zhdm9yaXRlcyA9IChlbWFpbCkgPT4ge1xyXG4gIGdldE1lc3NhZ2VzKCdmYXZnZXRCeUNyZWQnLCBlbWFpbCkudGhlbihkYXRhID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkYXRhJywgZGF0YSlcclxuICAgIGlmKGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgIGxldCBjaGVja2VkID0gZGF0YS5maWx0ZXIobSA9PiBtLmNoZWNrZWQpO1xyXG4gICAgICBsZXQgdW5jaGVja2VkID0gZGF0YS5maWx0ZXIobSA9PiAhbS5jaGVja2VkKTtcclxuICAgICAgY29uc29sZS5sb2coJ2NoZWNrZWQnLCBjaGVja2VkKTtcclxuICAgICAgY29uc29sZS5sb2coJ3VuY2hlY2tlZCcsIHVuY2hlY2tlZCk7XHJcbiAgICAgIGNoZWNrZWQubGVuZ3RoID8gZHJhd01lc3NhZ2VzKGNoZWNrZWQsIGVtYWlsLCBkb25lQ29udGFpbmVyKSA6ICBkb25lQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aDQ+Li4uZW1wdHkgeWV0Li4uIDwvaDQ+YDtcclxuICAgICAgdW5jaGVja2VkLmxlbmd0aCA/IGRyYXdNZXNzYWdlcyh1bmNoZWNrZWQsIGVtYWlsLCBzYXZlZENvbnRhaW5lcikgOiBzYXZlZENvbnRhaW5lci5pbm5lckhUTUwgPSBgPGg0Pi4uLmVtcHR5IHlldC4uLiA8L2g0PmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb25lQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aDQ+Li4uZW1wdHkgeWV0Li4uIDwvaDQ+YDtcclxuICAgICAgc2F2ZWRDb250YWluZXIuaW5uZXJIVE1MID0gYDxoND4uLi5lbXB0eSB5ZXQuLi4gPC9oND5gO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mYXZvcml0ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNsb3NlLWZhdm9yaXRlcy13aW5kb3dcIikpeyBcclxuICAgIGZhdm9yaXRlV2luZG93LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB9XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRlbC1mcm9tLWZhdm9yaXRlcy1idXR0b25cIikpe1xyXG4gICAgLy8gZS5zcmNFbGVtZW50LmF0dHJpYnV0ZXMuYWRkKCdkaXNhYmxlZCcpXHJcbiAgICBsZXQgcG9zdE1lc3NhZ2VJZCA9IGUudGFyZ2V0LmlkLnRyaW0oKTtcclxuICAgIGxldCBwb3N0VmFsdWUgPSB7XHJcbiAgICAgIG93bmVyOiB1c2VyQ3JlZGVudGlhbHMuZW1haWwsXHJcbiAgICAgIG1lc3NhZ2VJZDogcG9zdE1lc3NhZ2VJZFxyXG4gICAgfVxyXG4gICAgZ2V0TWVzc2FnZXMoXCJmYXZEZWxPbmVGcm9tTGlzdFwiLCBKU09OLnN0cmluZ2lmeShwb3N0VmFsdWUpICkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0pLnRoZW4oZHJhd0Zhdm9yaXRlcyh1c2VyQ3JlZGVudGlhbHMuZW1haWwpKTtcclxuICB9XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNoZWNrLWZhdm9yaXRlcy1idXR0b25cIikpe1xyXG4gICAgbGV0IHBvc3RNZXNzYWdlSWQgPSBlLnRhcmdldC5pZC50cmltKCk7XHJcbiAgICBsZXQgcG9zdFZhbHVlID0ge1xyXG4gICAgICBvd25lcjogdXNlckNyZWRlbnRpYWxzLmVtYWlsLFxyXG4gICAgICBtZXNzYWdlSWQ6IHBvc3RNZXNzYWdlSWRcclxuICAgIH1cclxuICAgIGdldE1lc3NhZ2VzKFwiZmF2Q2hlY2tEb25lXCIsIEpTT04uc3RyaW5naWZ5KHBvc3RWYWx1ZSkgKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSkudGhlbihkcmF3RmF2b3JpdGVzKHVzZXJDcmVkZW50aWFscy5lbWFpbCkpO1xyXG4gIH1cclxufSlcclxuXHJcbmZpbHRlcnNDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gIHZhciBpZDtcclxuICBpZihlLnNyY0VsZW1lbnQgJiYgZS5zcmNFbGVtZW50Lm9mZnNldFBhcmVudCAmJiBlLnNyY0VsZW1lbnQub2Zmc2V0UGFyZW50LmlkKSB7XHJcbiAgICBpZCA9IGUuc3JjRWxlbWVudC5vZmZzZXRQYXJlbnQuaWQ7XHJcbiAgfVxyXG4gIGlmKGUudGFyZ2V0LmlkKSB7XHJcbiAgICBpZCA9IGUudGFyZ2V0LmlkO1xyXG4gIH1cclxuICBcclxuICBpZihpZCA9PSBcImxpbmtzLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ2h0dHAnKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICdtZXNzYWdlcyB3aXRoIGxpbmtzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwieW91dHViZS1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICd3d3cueW91dHViZScpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ3lvdXR1YmUgdmlkZW9zJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwiZ2l0aHViLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ2dpdGh1YicpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ2dpdGh1YiBsaW5rcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcImltYWdlLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ2ltZycpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ2ltYWdlcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcInR3aXR0ZXItZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAndHdpdHRlcicpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ3R3aXR0ZXIgcG9zdHMnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJtZWV0dXAtZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnbWVldHVwJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAnbWVldHVwcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcInlvdXR1YmUtY2hlY2tib3hcIikge1xyXG4gICAgYWxsb3dZb3V0dWJlUHJldmlldyA9IGFsbG93WW91dHViZVByZXZpZXcgPyBmYWxzZSA6IHRydWU7XHJcbiAgfVxyXG4gIGlmKGlkID09IFwidHdpdHRlci1jaGVja2JveFwiKSB7XHJcbiAgICBhbGxvd1R3aXR0ZXJQcmV2aWV3ID0gYWxsb3dUd2l0dGVyUHJldmlldyA/IGZhbHNlIDogdHJ1ZTtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydHMuZHJhd1BpZUNoYXJ0ID0gZnVuY3Rpb24oZ3JhcGhBcnIpIHtcclxuICBncmFwaEFyciA9IGdyYXBoQXJyLm1hcChvYmogPT4ge1xyXG4gICAgcmV0dXJuIFtvYmouX2lkLm5hbWUsIG9iai5jb3VudF1cclxuICB9KVxyXG4gIGdyYXBoQXJyLnVuc2hpZnQoWydVc2VyJywgJ0NvdW50IG9mIG1lc3NhZ2VzJ10pXHJcbiAgZ3JhcGhBcnIubGVuZ3RoID0gMjA7XHJcbiAgLy8gY29uc29sZS5sb2coZ3JhcGhBcnIpXHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKFwiY3VycmVudFwiLCB7cGFja2FnZXM6W1wiY29yZWNoYXJ0XCJdfSk7XHJcbiAgICAgICAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3Q2hhcnQpO1xyXG4gICAgICAgIGZ1bmN0aW9uIGRyYXdDaGFydCgpIHtcclxuICAgICAgICAgIHZhciBkYXRhID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZShncmFwaEFycik7XHJcblxyXG4gICAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNoYXJ0QXJlYTogeyBsZWZ0OiAnLTUlJywgdG9wOiAnMTIlJywgd2lkdGg6IFwiOTAlXCIsIGhlaWdodDogXCI5MCVcIiB9LFxyXG4gICAgICAgICAgICB0aXRsZTogJ01lc3NhZ2luZyBhY3Rpdml0eScsXHJcbiAgICAgICAgICAgIHBpZUhvbGU6IDAuNCxcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLlBpZUNoYXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb251dGNoYXJ0JykpO1xyXG4gICAgICAgICAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuLy90b3RhbEJsb2NrXHJcbmNvbnN0IHRvdGFsTGlua3MgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtbGlua3NcIiksXHJcbiAgICAgIHRvdGFsVmlkZW9zICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtdmlkZW9zXCIpLFxyXG4gICAgICB0b3RhbEdpdGh1YiAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWdpdGh1YlwiKSxcclxuICAgICAgdG90YWxJbWFnZXMgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1pbWFnZXNcIiksXHJcbiAgICAgIHRvdGFsbWVudGlvbnMgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtbWVudGlvbnNcIiksXHJcbiAgICAgIHRvdGFsRmluaXNoZWRUYXNrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtZmluaXNoZWQtdGFza3NcIiksXHJcbiAgICAgIHRvdGFsTWVzc2FnZXMgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtbWVzc2FnZXNcIiksXHJcbiAgICAgIHRvdGFsRGF5cyAgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtZGF5c1wiKTtcclxuXHJcblxyXG5leHBvcnRzLnJlbmRlclRvdGFsTWVkaWFTdW1tYXJ5QmxvY2sgPSAoKSA9PiB7XHJcbiAgZ2V0TWVzc2FnZXMoXCJjb3VudFwiKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxNZXNzYWdlcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhfTwvYj5gO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwiYnlEYXlcIikudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsRGF5cy5pbm5lckhUTUwgPSBgPGI+JHtNYXRoLmZsb29yKGRhdGEubGVuZ3RoLzMwKX0gbW9udGhzICYgJHtkYXRhLmxlbmd0aCAlIDMwfSBkYXlzPC9iPmA7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJ2h0dHAnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxMaW5rcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHJlZmVyZW5jZXNgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICcueW91dHViZScpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbFZpZGVvcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHZpZGVvc2A7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJy5naXRodWInKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxHaXRodWIuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiBsaW5rcyB0byBnaXRodWJgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICdodHRwIGltZycpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbEltYWdlcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHNjcmVlbnNob3RzYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnQCcpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbG1lbnRpb25zLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gbWVudGlvbnNgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwiZmluaXNoZWRCeVRhc2tzXCIpLnRoZW4oKGRhdGEsIGh0bWwpID0+IHtcclxuICAgIHRvdGFsRmluaXNoZWRUYXNrcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHJlYWR5IHRhc2tzYDtcclxuICB9KTtcclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCB0YWJsZSA9IHJlcXVpcmUoXCIuLi9wbHVnaW5zL190YWJsZVwiKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbnNlcnRUYXNrTGlzdFRvUGFnZSA9IChmaW5pc2hlZEFycikgPT4ge1xyXG4gIHZhciBpbWFnZUxvZ28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1sb2dvJyk7XHJcbiAgaW1hZ2VMb2dvLnNyYyA9IGNvbmZpZy52YXJzLmtvdHRhbnNSb29tLmF2YXRhcjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlJbnB1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGFibGUubXlGdW5jdGlvbik7XHJcblxyXG4gIHZhciBodG1sID0gJyc7XHJcblxyXG4gIHZhciBkaXZUYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteVRhYmxlJyk7XHJcblxyXG4gIGh0bWwgKz0gXHJcbiAgICBgPHRyIGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgxKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPk5hbWU8L3RoPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMil9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5OaWNrPC90aD5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDMpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+UHVibGlzaGVkPC90aD5cclxuICAgICAgICA8dGggc3R5bGU9XCJ3aWR0aDo4MCU7XCI+VGV4dDwvdGg+XHJcbiAgICA8L3RyPmA7XHJcbiAgICAgICAgXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5pc2hlZEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgaHRtbCArPSBcclxuICAgICAgICBgPHRyPlxyXG4gICAgICAgICAgPHRkPjxpbWcgc3JjPVwiJHtmaW5pc2hlZEFycltpXS5hdmF0YXJVcmx9XCIgY2xhc3M9XCJ1c2VyLWljb25cIj4ke2ZpbmlzaGVkQXJyW2ldLmRpc3BsYXlOYW1lfTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+KDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20ke2ZpbmlzaGVkQXJyW2ldLnVybH1cIj4ke2ZpbmlzaGVkQXJyW2ldLnVzZXJuYW1lfTwvYT4pPC90ZD5cclxuICAgICAgICAgIDx0ZD4ke2ZpbmlzaGVkQXJyW2ldLnNlbnR9PC90ZD5cclxuICAgICAgICAgIDx0ZD4ke2ZpbmlzaGVkQXJyW2ldLnRleHR9IDwvdGQ+XHJcbiAgICAgICAgPC90cj5gO1xyXG4gIH1cclxuZGl2VGFibGUuaW5uZXJIVE1MID0gaHRtbDtcclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCBzZWwgPSByZXF1aXJlKCcuLi9wbHVnaW5zL19zZWxlY3RvcnMnKTtcclxuaW1wb3J0IHsgcmVxdWVzdCBhcyBnZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9fcmVxdWVzdC1uZXdcIjtcclxuXHJcbmV4cG9ydHMuaW5zZXJ0VmFsdWVzVG9GZWF0dXJlc0NhcmRzID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gZmVhdHVyZSAxXHJcbiAgZ2V0TWVzc2FnZXMoJ2NvdW50JykudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5tZXNzYWdlc0NvdW50LmlubmVySFRNTCA9IGRhdGE7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgMlxyXG4gIGdldE1lc3NhZ2VzKFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9rb3R0YW5zL2Zyb250ZW5kXCIpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3Muc3RhcnJlZFJlcG8uaW5uZXJIVE1MID0gKGRhdGEuc3RhcmdhemVyc19jb3VudCA9PSB1bmRlZmluZWQpID8gXCIuLi5cIiA6IGRhdGEuc3RhcmdhemVyc19jb3VudDtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSAzXHJcbiAgZ2V0TWVzc2FnZXMoXCJhdXRob3JzXCIpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MuYWN0aXZlVXNlcnNDb3VudC5pbm5lckhUTUwgPSBkYXRhLmxlbmd0aDtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSA0XHJcbiAgZ2V0TWVzc2FnZXMoXCJodHRwczovL2FwaS5naXRodWIuY29tL3NlYXJjaC9pc3N1ZXM/cT0rdHlwZTpwcit1c2VyOmtvdHRhbnMmc29ydD1jcmVhdGVkJiVFMiU4MCU4QyVFMiU4MCU4Qm9yZGVyPWFzY1wiKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICB2YXIgcHVsbE51bWJlciA9IGRhdGEuaXRlbXMuZmluZCgoaXRlbSkgPT4ge3JldHVybiBpdGVtLnJlcG9zaXRvcnlfdXJsID09IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9rb3R0YW5zL21vY2stcmVwb1wiO30pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInB1bGwtcmVxdWVzdHNcIilbMF0uaW5uZXJIVE1MID0gcHVsbE51bWJlci5udW1iZXI7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgNVxyXG4gIGdldE1lc3NhZ2VzKFwibGVhcm5lcnNcIikudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5ibG9ja0xlYXJuZXJzLmlubmVySFRNTCA9IGRhdGEubGVuZ3RoO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnRzLmRyYXdDb3VudE9mVGFza3NQZXJVc2VyX1ZlcnRpY2FsQmFyID0gZnVuY3Rpb24odXNlcnMpIHtcclxuICBsZXQgZ3JhcGhBcnIgPSB1c2Vycy5tYXAoZnVuY3Rpb24odXNlcikge1xyXG4gICAgcmV0dXJuIG5ldyBBcnJheSh1c2VyLnVzZXJuYW1lK1wiXCIsIHVzZXIubGVzc29ucy5sZW5ndGgsIFwibGlnaHRibHVlXCIpO1xyXG4gIH0pO1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZCgnY3VycmVudCcsIHtwYWNrYWdlczogWydjb3JlY2hhcnQnLCAnYmFyJ119KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdCYXNpYyk7XHJcbiAgZnVuY3Rpb24gZHJhd0Jhc2ljKCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZXJ0aWNhbF9jaGFydCcpO1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNvbHVtbkNoYXJ0KGNvbnRhaW5lcik7XHJcbiAgICBncmFwaEFyci51bnNoaWZ0KFsnVXNlcicsICdUYXNrcycsIHsgcm9sZTogJ3N0eWxlJyB9XSlcclxuICAgIHZhciBkYXRhID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZShncmFwaEFycik7XHJcbiAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICBhbmltYXRpb246IHtcclxuICAgICAgZHVyYXRpb246IDIwMDAsXHJcbiAgICAgIHN0YXJ0dXA6IHRydWUgLy9UaGlzIGlzIHRoZSBuZXcgb3B0aW9uXHJcbiAgICB9LFxyXG4gICAgdGl0bGU6ICdTdW0gb2YgZmluaXNoZWQgdGFza3MgYnkgZWFjaCBsZWFybmVyJyxcclxuICAgIC8vIHdpZHRoOiAoJCh3aW5kb3cpLndpZHRoKCkgPCA4MDApID8gJCh3aW5kb3cpLndpZHRoKCkgOiAkKHdpbmRvdykud2lkdGgoKSowLjUsXHJcbiAgICB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSowLjMsXHJcbiAgICBoQXhpczoge1xyXG4gICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICBzbGFudGVkVGV4dEFuZ2xlOjkwLCAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgdkF4aXM6IHtcclxuICAgICAgLy90aXRsZTogJ1N1bSBvZiBmaW5pc2hlZCB0YXNrcydcclxuICAgIH0sXHJcbiAgICBhbmltYXRpb246e1xyXG4gICAgICBkdXJhdGlvbjogMTAwMCxcclxuICAgICAgZWFzaW5nOiAnb3V0J1xyXG4gICAgfSxcclxuICB9O1xyXG4gIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IFxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydHMuZHJhd0FjdGl2aXR5X0xpbmVDaGFydCA9IGZ1bmN0aW9uKGFjdGl2aXR5QXJyKSB7XHJcbiAgYWN0aXZpdHlBcnIubWFwKGZ1bmN0aW9uKGRheSkge1xyXG4gICAgZGF5WzBdID0gbmV3IERhdGUoZGF5WzBdKTtcclxuICB9KTtcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoJ2N1cnJlbnQnLCB7cGFja2FnZXM6IFsnY29yZWNoYXJ0JywgJ2xpbmUnXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0Jhc2ljKTtcclxuXHJcbiAgZnVuY3Rpb24gZHJhd0Jhc2ljKCkge1xyXG4gICAgdmFyIGRhdGEgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKCk7XHJcbiAgICBkYXRhLmFkZENvbHVtbignZGF0ZScsICdEYXlzJyk7XHJcbiAgICBkYXRhLmFkZENvbHVtbignbnVtYmVyJywgJ01lc3NhZ2VzJyk7XHJcbiAgICBkYXRhLmFkZFJvd3MoYWN0aXZpdHlBcnIpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgIHRpdGxlOiBcIkFjdGl2aXR5IG9mIHVzZXJzIGluIGNoYXRcIixcclxuICAgICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXHJcbiAgICAgICAgc3RhcnR1cDogdHJ1ZSAvL1RoaXMgaXMgdGhlIG5ldyBvcHRpb25cclxuICAgICAgfSxcclxuICAgICAgLy9jdXJ2ZVR5cGU6ICdmdW5jdGlvbicsXHJcbiAgICAgIC8vIHdpZHRoOiAoJCh3aW5kb3cpLndpZHRoKCkgPCA4MDApID8gJCh3aW5kb3cpLndpZHRoKCkgOiAkKHdpbmRvdykud2lkdGgoKSowLjUsXHJcbiAgICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgXHJcbiAgICAgIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpKjAuMyxcclxuICAgICAgaEF4aXM6IHtcclxuICAgICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICAgIHNsYW50ZWRUZXh0QW5nbGU6NDUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHZBeGlzOiB7XHJcbiAgICAgICAgLy8gdGl0bGU6ICdDb3VudCBvZiBtZXNzYSdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5MaW5lQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmVjaGFydCcpKTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IiwiZXhwb3J0cy5kcmF3VGltZWxpbmVDaGFydCA9IGZ1bmN0aW9uKGdyYXBoQXJyKSB7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKFwiY3VycmVudFwiLCB7cGFja2FnZXM6W1widGltZWxpbmVcIl19KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdDaGFydCk7XHJcbiAgZnVuY3Rpb24gZHJhd0NoYXJ0KCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lbGluZScpO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLlRpbWVsaW5lKGNvbnRhaW5lcik7XHJcbiAgICB2YXIgZGF0YVRhYmxlID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ1Jvb20nIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ05hbWUnIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdkYXRlJywgaWQ6ICdTdGFydCcgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ2RhdGUnLCBpZDogJ0VuZCcgfSk7XHJcbiAgICBcclxuICAgIGdyYXBoQXJyLm1hcChlbGVtZW50ID0+IHtcclxuICAgICAgZWxlbWVudFsyXSA9IG5ldyBEYXRlKGVsZW1lbnRbMl0pO1xyXG4gICAgICBlbGVtZW50WzNdID0gbmV3IERhdGUoZWxlbWVudFszXSk7XHJcbiAgICB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRSb3dzKGdyYXBoQXJyKTtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLFxyXG4gICAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSxcclxuICAgICAgdGltZWxpbmU6IHsgY29sb3JCeVJvd0xhYmVsOiB0cnVlIH0sXHJcbiAgICAgIGhBeGlzOiB7XHJcbiAgICAgICAgICBtaW5WYWx1ZTogbmV3IERhdGUoMjAxNywgOSwgMjkpLFxyXG4gICAgICAgICAgbWF4VmFsdWU6IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgKDEgKiA2MCAqIDYwICogMTAwMDAwKSlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YVRhYmxlLCBvcHRpb25zKTtcclxuICB9XHJcbn0iXX0=

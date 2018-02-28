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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvX2NvbmZpZy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9fcmVxdWVzdC1uZXcuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvYXBwLmpzIiwiRzovRlJPTlRFTkQvUHJvamVjdHMvR2l0aHViL1JlYWwgcHJvamVjdHMva290dGFucy1zdGF0aXN0aWNzL2tvdHRhbnMtc3RhdHMvYXBwL2pzL3BsdWdpbnMvX2NvdW50ZG93bi5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9wbHVnaW5zL19zZWxlY3RvcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcGx1Z2lucy9fdGFibGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLWZpbHRlcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLXNlYXJjaC5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljcy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2UtdGltZWxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sQ0FBQyxJQUFJLEdBQUc7QUFDYixNQUFJLEVBQUUsMENBQTBDO0FBQ2hELFFBQU0sRUFBRSwyQ0FBMkM7O0FBRW5ELGFBQVcsRUFBRTs7QUFFWCxVQUFNLEVBQUcsa0VBQWtFO0dBQzVFO0NBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1JGLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFN0IsSUFBTSxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksSUFBSSxFQUFFLFNBQVMsRUFBSztBQUMxQyxNQUFJLEdBQUcsR0FBRyxBQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztBQUNwRixNQUFJLE9BQU8sR0FBRztBQUNaLFVBQU0sRUFBRSxNQUFNO0FBQ2QsV0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFO0FBQ2hFLFFBQUksRUFBRSxRQUFRLEdBQUMsU0FBUztHQUN6QixDQUFBOztBQUVELE1BQUksVUFBVSxHQUFHLEFBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTlFLFNBQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUNyQixJQUFJ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RTtBQUN4QixZQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUMxQixjQUFRLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFO0FBQ25DLFdBQUssRUFBRTtBQUNILGdCQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDL0IsZ0JBQVEsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQUFBQyxDQUFDO09BQ3BFO0tBQ0YsQ0FBQztBQUNGLFNBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ2hDO0NBQ0YsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLnZhcnMgPSB7XHJcbiAgaGFzaDogJzdlMTZiNTUyN2M3N2VhNThiYWMzNmRkZGRhNmY1YjQ0NGYzMmU4MWInLFxyXG4gIGRvbWFpbjogXCJodHRwczovL3NlY3JldC1lYXJ0aC01MDkzNi5oZXJva3VhcHAuY29tL1wiLFxyXG4gIC8vIGRvbWFpbjogXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvXCIsXHJcbiAga290dGFuc1Jvb206IHtcclxuICAgIC8vIGlkIDogXCI1OWIwZjI5YmQ3MzQwOGNlNGY3NGIwNmZcIixcclxuICAgIGF2YXRhciA6IFwiaHR0cHM6Ly9hdmF0YXJzLTAyLmdpdHRlci5pbS9ncm91cC9pdi8zLzU3NTQyZDI3YzQzYjhjNjAxOTc3YTBiNlwiXHJcbiAgfVxyXG59O1xyXG4gXHJcblxyXG4vLyB2YXIgZ2xvYmFsID0ge1xyXG4vLyAgIHRva2VuU3RyaW5nIDogXCJhY2Nlc3NfdG9rZW49XCIgKyBcIjllMTMxOTBhNmY3MGUyOGI2ZTI2MzAxMWU2M2Q0YjM0ZDI2YmQ2OTdcIixcclxuLy8gICByb29tVXJsUHJlZml4IDogXCJodHRwczovL2FwaS5naXR0ZXIuaW0vdjEvcm9vbXMvXCJcclxuLy8gfTtcclxuXHJcblxyXG5cclxuLy8gZnVuY3Rpb24gZ2V0QWxsUm9vbU1lc3NhZ2VzKGNvdW50LCBvbGRlc3RJZCkge1xyXG4vLyAgIGlmKG9sZGVzdElkKXtvbGRlc3RJZCA9IFwiJmJlZm9yZUlkPVwiK29sZGVzdElkO30gXHJcbi8vICAgcmV0dXJuIGdsb2JhbC5yb29tVXJsUHJlZml4ICsga290dGFuc1Jvb20uaWQgK1xyXG4vLyAgICAgICAgICAgXCIvY2hhdE1lc3NhZ2VzP2xpbWl0PVwiKyBjb3VudCArIG9sZGVzdElkICtcIiZcIiArIGdsb2JhbC50b2tlblN0cmluZztcclxuLy8gICB9OyBcclxuIiwiY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4vX2NvbmZpZ1wiKTtcclxuXHJcbmV4cG9ydCBjb25zdCByZXF1ZXN0ID0gKGxpbmssIHBvc3RWYWx1ZSkgPT4ge1xyXG4gIHZhciB1cmwgPSAoL2h0dHAvLnRlc3QobGluaykpID8gbGluayA6IGNvbmZpZy52YXJzLmRvbWFpbiArIGxpbmsgKyBjb25maWcudmFycy5oYXNoO1xyXG4gIGxldCBvcHRpb25zID0geyBcclxuICAgIG1ldGhvZDogXCJQT1NUXCIsIFxyXG4gICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSxcclxuICAgIGJvZHk6IFwidmFsdWU9XCIrcG9zdFZhbHVlXHJcbiAgfVxyXG4gIC8vIGNvbnNvbGUubG9nKCEhcG9zdFZhbHVlKVxyXG4gIGxldCByZXF1ZXN0T2JqID0gKCEhcG9zdFZhbHVlKSA/IG5ldyBSZXF1ZXN0KHVybCwgb3B0aW9ucykgOiBuZXcgUmVxdWVzdCh1cmwpO1xyXG5cclxuICByZXR1cm4gZmV0Y2gocmVxdWVzdE9iailcclxuICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgIGlmICghcmVzLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlcy5zdGF0dXNUZXh0KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuanNvbigpXHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgfSk7XHJcbiAgfSBcclxuIiwiY29uc3QgY291bnRkb3duICAgICAgPSByZXF1aXJlKFwiLi9wbHVnaW5zL19jb3VudGRvd25cIik7XHJcbmNvbnN0IHBhZ2VTdGF0aXN0aWNzID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXN0YXRpc3RpY3NcIik7XHJcbmNvbnN0IHBhZ2VUaW1lbGluZSAgID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXRpbWVsaW5lXCIpO1xyXG5jb25zdCBwYWdlU2VhcmNoICAgICA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS1zZWFyY2hcIik7XHJcblxyXG5pbXBvcnQgKiBhcyBzZWFyY2hQYWdlIGZyb20gXCIuL3JlbmRlci9fcGFnZS1zZWFyY2hcIjtcclxuaW1wb3J0ICogYXMgZmlsdGVyc1BhZ2UgZnJvbSBcIi4vcmVuZGVyL19wYWdlLWZpbHRlcnNcIjtcclxuaW1wb3J0IHsgcmVxdWVzdCBhcyBnZXRNZXNzYWdlcyAgfSBmcm9tIFwiLi9fcmVxdWVzdC1uZXdcIjtcclxuXHJcblxyXG5cclxuZ2V0TWVzc2FnZXMoXCJsYXRlc3RcIikudGhlbihpbml0KTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgLy8gUGFnZSBUaW1lbGluZVxyXG4gIGdldE1lc3NhZ2VzKFwiZmluaXNoZWRCeVRhc2tzXCIpLnRoZW4ocGFnZVRpbWVsaW5lLmRyYXdUaW1lbGluZUNoYXJ0KTtcclxuICBcclxuICAvL1BhZ2Ugc2VhcmNoIGZpbmlzaGVkIHRhc2tzXHJcbiAgZ2V0TWVzc2FnZXMoXCJmaW5pc2hlZEJ5U3R1ZGVudHNcIikudGhlbihzZWFyY2hQYWdlLmluc2VydFRhc2tMaXN0VG9QYWdlKTtcclxuICBcclxuICAvL1BhZ2Ugc3RhdGlzdGljc1xyXG4gIC8vIGNvdW50ZG93bi5pbml0VGltZXIoKTtcclxuICBwYWdlU3RhdGlzdGljcy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMoKTtcclxuICBnZXRNZXNzYWdlcyhcImxlYXJuZXJzXCIpLnRoZW4ocGFnZVN0YXRpc3RpY3MuZHJhd0NvdW50T2ZUYXNrc1BlclVzZXJfVmVydGljYWxCYXIpO1xyXG4gIGdldE1lc3NhZ2VzKFwiYWN0aXZpdHlcIikudGhlbihwYWdlU3RhdGlzdGljcy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0KTtcclxuXHJcbiAgLy9QYWdlIGZpbHRlcnNcclxuICBsZXQgY3VycmVudERhdGUgPSAobmV3IERhdGUoKS50b0xvY2FsZURhdGVTdHJpbmcoKS5zdWJzdHJpbmcoMCwgMTApLnNwbGl0KCctJykuam9pbignLicpKTtcclxuICAvLyBjb25zb2xlLmxvZyhjdXJyZW50RGF0ZSlcclxuICBnZXRNZXNzYWdlcyhcInBlcmRhdGVcIiwgY3VycmVudERhdGUpLnRoZW4oZGF0YSA9PiBmaWx0ZXJzUGFnZS5kcmF3TWVzc2FnZXMoZGF0YSwgY3VycmVudERhdGUpKTtcclxuICBnZXRNZXNzYWdlcyhcImJ5RGF5XCIpLnRoZW4oZmlsdGVyc1BhZ2UuZHJhd0NhbGVuZGFyKTtcclxuXHJcbiAgZmlsdGVyc1BhZ2UucmVuZGVyVG90YWxNZWRpYVN1bW1hcnlCbG9jaygpO1xyXG4gIGdldE1lc3NhZ2VzKFwicGVydXNlclwiKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgZmlsdGVyc1BhZ2UuZHJhd1BpZUNoYXJ0KGRhdGEpOyBcclxuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbiIsIi8vQ09VTlRET1dOIFRJTUVSXHJcbi8vc2xpY2tjaXRjdWxhciBodHRwczovL3d3dy5qcXVlcnlzY3JpcHQubmV0L2RlbW8vU2xpY2stQ2lyY3VsYXItalF1ZXJ5LUNvdW50ZG93bi1QbHVnaW4tQ2xhc3N5LUNvdW50ZG93bi9cclxuXHJcbmV4cG9ydHMuaW5pdFRpbWVyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHRpbWVFbmQgPSBNYXRoLnJvdW5kKCAobmV3IERhdGUoXCIyMDE4LjAyLjEwXCIpLmdldFRpbWUoKSAtICQubm93KCkpIC8gMTAwMCk7XHJcbiAgICAgIHRpbWVFbmQgPSBNYXRoLmZsb29yKHRpbWVFbmQgLyA4NjQwMCkgKiA4NjQwMDtcclxuXHJcbiAgJCgnI2NvdW50ZG93bi1jb250YWluZXInKS5DbGFzc3lDb3VudGRvd24oe1xyXG4gICAgdGhlbWU6IFwid2hpdGVcIiwgXHJcbiAgICBlbmQ6ICQubm93KCkgKyB0aW1lRW5kLCAvL2VuZDogJC5ub3coKSArIDY0NTYwMCxcclxuICAgIG5vdzogJC5ub3coKSxcclxuICAgIC8vIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgZGF5cy9ob3Vycy9taW51dGVzL3NlY29uZHMgbGFiZWxzLlxyXG4gICAgbGFiZWxzOiB0cnVlLFxyXG4gICAgLy8gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIGRpZmZlcmVudCBsYW5ndWFnZSBwaHJhc2VzIGZvciBzYXlzL2hvdXJzL21pbnV0ZXMvc2Vjb25kcyBhcyB3ZWxsIGFzIHNwZWNpZmljIENTUyBzdHlsZXMuXHJcbiAgICBsYWJlbHNPcHRpb25zOiB7XHJcbiAgICAgIGxhbmc6IHtcclxuICAgICAgICBkYXlzOiAnRGF5cycsXHJcbiAgICAgICAgaG91cnM6ICdIb3VycycsXHJcbiAgICAgICAgbWludXRlczogJ01pbnV0ZXMnLFxyXG4gICAgICAgIHNlY29uZHM6ICdTZWNvbmRzJ1xyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZTogJ2ZvbnQtc2l6ZTogMC41ZW07J1xyXG4gICAgfSxcclxuICAgIC8vIGN1c3RvbSBzdHlsZSBmb3IgdGhlIGNvdW50ZG93blxyXG4gICAgc3R5bGU6IHtcclxuICAgICAgZWxlbWVudDogJycsXHJcbiAgICAgIGxhYmVsczogZmFsc2UsXHJcbiAgICAgIGRheXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyMxQUJDOUMnLC8vJ3JnYmEoMCwgMCwgMCwgMSknLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBob3Vyczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzI5ODBCOScsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIG1pbnV0ZXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyM4RTQ0QUQnLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBzZWNvbmRzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjRjM5QzEyJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsYmFjayB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGNvdW50ZG93biByZWFjaGVzIDAuXHJcbiAgICBvbkVuZENhbGxiYWNrOiBmdW5jdGlvbigpIHt9XHJcbiAgfSk7XHJcbn0iLCJleHBvcnRzLmJsb2NrcyA9IHtcclxuICBtZXNzYWdlc0NvdW50OiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvdW50LW1lc3NhZ2VzXCIpLFxyXG4gIHN0YXJyZWRSZXBvOiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnJlZC1yZXBvXCIpLFxyXG4gIGFjdGl2ZVVzZXJzQ291bnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXVzZXJzXCIpLFxyXG4gIGJsb2NrTGVhcm5lcnM6ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGVhcm5lcnNcIiksXHJcbiAgXHJcbn0gIiwiZXhwb3J0cy5teUZ1bmN0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gRGVjbGFyZSB2YXJpYWJsZXMgXHJcbiAgdmFyIGlucHV0LCBmaWx0ZXIsIHRhYmxlLCB0ciwgdGQsIGk7XHJcbiAgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXRcIik7XHJcbiAgZmlsdGVyID0gaW5wdXQudmFsdWUudG9VcHBlckNhc2UoKTtcclxuICB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTtcclxuICB0ciA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIik7XHJcblxyXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cywgYW5kIGhpZGUgdGhvc2Ugd2hvIGRvbid0IG1hdGNoIHRoZSBzZWFyY2ggcXVlcnlcclxuICBmb3IgKGkgPSAwOyBpIDwgdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIHRkID0gdHJbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZFwiKVswXTtcclxuICAgIGlmICh0ZCkge1xyXG4gICAgICBpZiAodGQuaW5uZXJIVE1MLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIpID4gLTEpIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0cy5zb3J0VGFibGUgPSBmdW5jdGlvbihuKSB7XHJcbiAgdmFyIHRhYmxlLCByb3dzLCBzd2l0Y2hpbmcsIGksIHgsIHksIHNob3VsZFN3aXRjaCwgZGlyLCBzd2l0Y2hjb3VudCA9IDA7XHJcbiAgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VGFibGVcIik7XHJcbiAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAvLyBTZXQgdGhlIHNvcnRpbmcgZGlyZWN0aW9uIHRvIGFzY2VuZGluZzpcclxuICBkaXIgPSBcImFzY1wiOyBcclxuICAvKiBNYWtlIGEgbG9vcCB0aGF0IHdpbGwgY29udGludWUgdW50aWxcclxuICBubyBzd2l0Y2hpbmcgaGFzIGJlZW4gZG9uZTogKi9cclxuICB3aGlsZSAoc3dpdGNoaW5nKSB7XHJcbiAgICAvLyBTdGFydCBieSBzYXlpbmc6IG5vIHN3aXRjaGluZyBpcyBkb25lOlxyXG4gICAgc3dpdGNoaW5nID0gZmFsc2U7XHJcbiAgICByb3dzID0gdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJUUlwiKTtcclxuICAgIC8qIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cyAoZXhjZXB0IHRoZVxyXG4gICAgZmlyc3QsIHdoaWNoIGNvbnRhaW5zIHRhYmxlIGhlYWRlcnMpOiAqL1xyXG4gICAgZm9yIChpID0gMTsgaSA8IChyb3dzLmxlbmd0aCAtIDEpOyBpKyspIHtcclxuICAgICAgLy8gU3RhcnQgYnkgc2F5aW5nIHRoZXJlIHNob3VsZCBiZSBubyBzd2l0Y2hpbmc6XHJcbiAgICAgIHNob3VsZFN3aXRjaCA9IGZhbHNlO1xyXG4gICAgICAvKiBHZXQgdGhlIHR3byBlbGVtZW50cyB5b3Ugd2FudCB0byBjb21wYXJlLFxyXG4gICAgICBvbmUgZnJvbSBjdXJyZW50IHJvdyBhbmQgb25lIGZyb20gdGhlIG5leHQ6ICovXHJcbiAgICAgIHggPSByb3dzW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVERcIilbbl07XHJcbiAgICAgIHkgPSByb3dzW2kgKyAxXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlREXCIpW25dO1xyXG4gICAgICAvKiBDaGVjayBpZiB0aGUgdHdvIHJvd3Mgc2hvdWxkIHN3aXRjaCBwbGFjZSxcclxuICAgICAgYmFzZWQgb24gdGhlIGRpcmVjdGlvbiwgYXNjIG9yIGRlc2M6ICovXHJcbiAgICAgIGlmIChkaXIgPT0gXCJhc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpID4geS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGRpciA9PSBcImRlc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpIDwgeS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoc2hvdWxkU3dpdGNoKSB7XHJcbiAgICAgIC8qIElmIGEgc3dpdGNoIGhhcyBiZWVuIG1hcmtlZCwgbWFrZSB0aGUgc3dpdGNoXHJcbiAgICAgIGFuZCBtYXJrIHRoYXQgYSBzd2l0Y2ggaGFzIGJlZW4gZG9uZTogKi9cclxuICAgICAgcm93c1tpXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyb3dzW2kgKyAxXSwgcm93c1tpXSk7XHJcbiAgICAgIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgICAgIC8vIEVhY2ggdGltZSBhIHN3aXRjaCBpcyBkb25lLCBpbmNyZWFzZSB0aGlzIGNvdW50IGJ5IDE6XHJcbiAgICAgIHN3aXRjaGNvdW50ICsrOyBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8qIElmIG5vIHN3aXRjaGluZyBoYXMgYmVlbiBkb25lIEFORCB0aGUgZGlyZWN0aW9uIGlzIFwiYXNjXCIsXHJcbiAgICAgIHNldCB0aGUgZGlyZWN0aW9uIHRvIFwiZGVzY1wiIGFuZCBydW4gdGhlIHdoaWxlIGxvb3AgYWdhaW4uICovXHJcbiAgICAgIGlmIChzd2l0Y2hjb3VudCA9PSAwICYmIGRpciA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgZGlyID0gXCJkZXNjXCI7XHJcbiAgICAgICAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsImltcG9ydCB7IHJlcXVlc3QgYXMgZ2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vX3JlcXVlc3QtbmV3XCI7XHJcblxyXG5jb25zdCBjYXJvdXNlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvY2stZGF0ZS1zY3JvbGxcIik7XHJcbmNvbnN0IG1haW5NZXNzYWdlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2VudGVyLW1lc3NhZ2VzLWNvbnRlbnRcIik7XHJcbmNvbnN0IG1haW5TZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoLWJ5LXd0d3JcIik7XHJcbmNvbnN0IHVzZXJuYW1lU2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1ieS11c2VybmFtZVwiKTtcclxuY29uc3QgdXNlcm5hbWVBdXRvY29tcGxldGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVhc3ktYXV0b2NvbXBsZXRlLWNvbnRhaW5lclwiKTtcclxuY29uc3QgZmlsdGVyc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYnV0dG9uLWZpbHRlcnNcIik7XHJcbmNvbnN0IHNpZ251cEJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zaWdudXBcIik7XHJcbmNvbnN0IGZhdm9yaXRlc0Jsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXZvcml0ZXMtd3JhcHBlclwiKTtcclxuY29uc3QgZmF2b3JpdGVzQmxvY2tUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2b3JpdGVzLXRpdGxlXCIpO1xyXG5jb25zdCBmYXZvcml0ZVdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2b3JpdGVzLXNlY3Rpb25cIik7XHJcbmNvbnN0IHNhdmVkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zYXZlZC1tZXNzYWdlcy1jb250YWluZXJcIik7XHJcbmNvbnN0IGRvbmVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRvbmUtbWVzc2FnZXMtY29udGFpbmVyXCIpO1xyXG5jb25zdCBFTlRFUiA9IDEzO1xyXG5cclxubGV0IGFsbG93VHdpdHRlclByZXZpZXcgPSBmYWxzZTtcclxubGV0IGFsbG93WW91dHViZVByZXZpZXcgPSBmYWxzZTtcclxuXHJcbmxldCB1c2VyQ3JlZGVudGlhbHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmYXZvcml0ZXMnKSk7XHJcbmlmKHVzZXJDcmVkZW50aWFscyAmJiB1c2VyQ3JlZGVudGlhbHMuZW1haWwpe1xyXG4gIGxldCB1c2VybmFtZSA9IHVzZXJDcmVkZW50aWFscy5lbWFpbC5zcGxpdCgnQCcpWzBdO1xyXG4gIGZhdm9yaXRlc0Jsb2NrVGl0bGUuaW5uZXJIVE1MID0gXHJcbiAgICAgICAgYEhlbGxvICR7dXNlcm5hbWV9ISA8YSBjbGFzcz1cInNpZ25vdXQtYnV0dG9uXCI+U2lnbiBvdXQhPC9hPmA7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlKHNlbnQsIHNwbGl0dGVyKSB7XHJcbiAgdmFyIGRhdGVTZW50Rm9ybWF0dGVkID1cclxuICAgIHNlbnQuZ2V0RnVsbFllYXIoKSArXHJcbiAgICBzcGxpdHRlciArXHJcbiAgICAoXCIwXCIgKyAoc2VudC5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSArXHJcbiAgICBzcGxpdHRlciArXHJcbiAgICAoXCIwXCIgKyBzZW50LmdldERhdGUoKSkuc2xpY2UoLTIpICtcclxuICAgIFwiIFwiICtcclxuICAgIChcIjBcIiArIHNlbnQuZ2V0SG91cnMoKSkuc2xpY2UoLTIpICtcclxuICAgIFwiOlwiICtcclxuICAgIChcIjBcIiArIHNlbnQuZ2V0TWludXRlcygpKS5zbGljZSgtMik7XHJcbiAgcmV0dXJuIGRhdGVTZW50Rm9ybWF0dGVkO1xyXG59XHJcblxyXG5jb25zdCB0d2l0dGVyRm9ybWF0dGVyID0gKHVybCkgPT4ge1xyXG4gIGlmKC90d2l0dGVyL2lnLnRlc3QodXJsKSl7XHJcbiAgICAvL2h0dHBzOi8vdHdpdGZyYW1lLmNvbS8jc2l6aW5nXHJcbiAgICByZXR1cm4gYDxpZnJhbWUgYm9yZGVyPTAgZnJhbWVib3JkZXI9MCBoZWlnaHQ9MzAwIHdpZHRoPTU1MCBcclxuICAgICAgc3JjPVwiaHR0cHM6Ly90d2l0ZnJhbWUuY29tL3Nob3c/dXJsPSR7ZW5jb2RlVVJJKHVybC50cmltKCkuc3Vic3RyaW5nKDcsIHVybC5sZW5ndGgpKX1cIj48L2lmcmFtZT5gO1xyXG4gIH0gZWxzZSB7cmV0dXJuICcnO31cclxufVxyXG5cclxuY29uc3QgeW91dHViZUZvcm1hdHRlciA9ICh1cmwpID0+IHtcclxuICBsZXQgeXR1cmwgPSAvKD86aHR0cHM/OlxcL1xcLyk/KD86d3d3XFwuKT8oPzp5b3V0dWJlXFwuY29tfHlvdXR1XFwuYmUpXFwvKD86d2F0Y2hcXD92PSk/KFtcXHdcXC1dezEwLDEyfSkoPzomZmVhdHVyZT1yZWxhdGVkKT8oPzpbXFx3XFwtXXswfSk/L2c7XHJcbiAgbGV0IGlmcmFtZVN0cmluZyA9ICc8aWZyYW1lIHdpZHRoPVwiNDIwXCIgaGVpZ2h0PVwiMzQ1XCIgc3JjPVwiaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8kMVwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nO1xyXG4gIGlmKHl0dXJsLnRlc3QodXJsKSl7XHJcbiAgICAvL3RyeSB0byBnZW5lcmF0ZSB0aHVtYm5haWxzXHJcbiAgICAvLyByZXR1cm4gYDxicj48aW1nIHNyYz1cIiR7WW91dHViZS50aHVtYih1cmwpfVwiIHRpdGxlPVwieW91dHViZSB0aHVtYm5haWxcIj5gO1xyXG4gICAgbGV0IHl0SWZyYW1lID0gdXJsLnJlcGxhY2UoeXR1cmwsIGlmcmFtZVN0cmluZyk7XHJcbiAgICByZXR1cm4geXRJZnJhbWUuc3Vic3RyaW5nKDYsIHl0SWZyYW1lLmxlbmd0aCk7XHJcbiAgfSBlbHNlIHtyZXR1cm4gJyc7fVxyXG59XHJcblxyXG4vL2h0dHA6Ly9qc2ZpZGRsZS5uZXQvOFRhUzgvNi8gZXh0cmFjdCB0aHVtYm5haWxzIFxyXG52YXIgWW91dHViZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciB2aWRlbywgcmVzdWx0cztcclxuICB2YXIgZ2V0VGh1bWIgPSBmdW5jdGlvbiAodXJsLCBzaXplKSB7XHJcbiAgICAgIGlmICh1cmwgPT09IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgfVxyXG4gICAgICBzaXplID0gKHNpemUgPT09IG51bGwpID8gJ2JpZycgOiBzaXplO1xyXG4gICAgICAvLyBsZXQgeXR1cmwgPSAvKD86aHR0cHM/OlxcL1xcLyk/KD86d3d3XFwuKT8oPzp5b3V0dWJlXFwuY29tfHlvdXR1XFwuYmUpXFwvKD86d2F0Y2hcXD92PSk/KFtcXHdcXC1dezEwLDEyfSkoPzomZmVhdHVyZT1yZWxhdGVkKT8oPzpbXFx3XFwtXXswfSk/L2c7XHJcbiAgICAgIHJlc3VsdHMgPSB1cmwubWF0Y2goJ1tcXFxcPyZddj0oW14mI10qKScpO1xyXG4gICAgICB2aWRlbyA9IChyZXN1bHRzID09PSBudWxsKSA/IHVybCA6IHJlc3VsdHNbMV07XHJcbiAgICAgIGlmIChzaXplID09PSAnc21hbGwnKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ2h0dHA6Ly9pbWcueW91dHViZS5jb20vdmkvJyArIHZpZGVvICsgJy8yLmpwZyc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuICdodHRwOi8vaW1nLnlvdXR1YmUuY29tL3ZpLycgKyB2aWRlbyArICcvMC5qcGcnO1xyXG4gIH07XHJcbiAgcmV0dXJuIHtcclxuICAgICAgdGh1bWI6IGdldFRodW1iXHJcbiAgfTtcclxufSgpKTtcclxuXHJcblxyXG5jb25zdCBtYXJrU2VhcmNoZWRWYWx1ZXNJbkh0bWwgPSAobWVzc2FnZUh0bWwsIHBvc3RWYWx1ZSkgPT4ge1xyXG4gIGxldCB5dElmcmFtZSA9ICcnO1xyXG4gIGxldCB0d2l0dGVySWZyYW1lID0gJyc7XHJcbiAgbGV0IHJlcGxhY2VkVmFsdWUgPSBgPGI+PG1hcms+JHtwb3N0VmFsdWV9PC9tYXJrPjwvYj5gO1xyXG4gIC8vcmVkcmF3IGFsbFxyXG4gIGlmKHBvc3RWYWx1ZSAmJiBwb3N0VmFsdWUgIT0gJ3NyYycpIHtcclxuICAgIGxldCByZWdleHRlbXAgPSBwb3N0VmFsdWUucmVwbGFjZSgvXFwuL2lnLCBcIlxcXFxcXC5cIik7XHJcbiAgICBtZXNzYWdlSHRtbCA9IG1lc3NhZ2VIdG1sLnJlcGxhY2UobmV3IFJlZ0V4cChyZWdleHRlbXAsICdpZycpLCByZXBsYWNlZFZhbHVlKTtcclxuICB9XHJcbiAgLy9zZWFyY2ggZm9yIHdoYXRldmVyIHVybHNcclxuICBsZXQgdXJscyA9IG1lc3NhZ2VIdG1sLm1hdGNoKC9ocmVmPVwiKC4qPylcIi9nKTsgIFxyXG4gIGxldCBjbGVhbmVkSHRtbCA9IG1lc3NhZ2VIdG1sO1xyXG4gIGlmKHVybHMpIHtcclxuICAgIHVybHMuZm9yRWFjaCh1cmwgPT4ge1xyXG4gICAgICBpZihhbGxvd1R3aXR0ZXJQcmV2aWV3KVxyXG4gICAgICAgIHR3aXR0ZXJJZnJhbWUgPSB0d2l0dGVyRm9ybWF0dGVyKHVybCk7XHJcbiAgICAgIGlmKGFsbG93WW91dHViZVByZXZpZXcpXHJcbiAgICAgICAgeXRJZnJhbWUgPSB5b3V0dWJlRm9ybWF0dGVyKHVybCk7XHJcbiAgICAgIGxldCBuZXdVcmwgPSB1cmwuc3BsaXQocmVwbGFjZWRWYWx1ZSkuam9pbihwb3N0VmFsdWUpO1xyXG4gICAgICBjbGVhbmVkSHRtbCA9IGNsZWFuZWRIdG1sLnNwbGl0KHVybCkuam9pbihuZXdVcmwpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjbGVhbmVkSHRtbCt5dElmcmFtZSt0d2l0dGVySWZyYW1lO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBtZXNzYWdlSHRtbCt5dElmcmFtZSt0d2l0dGVySWZyYW1lO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRyYXdNZXNzYWdlcyA9IChkYXRhLCBwb3N0VmFsdWUsIGNvbnRhaW5lcikgPT4ge1xyXG4gIGxldCBtZXNzYWdlc0NvbnRhaW5lcjtcclxuICBpZihjb250YWluZXIpIHtcclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gIH1lbHNlIHtcclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyID0gbWFpbk1lc3NhZ2VzQ29udGFpbmVyO1xyXG4gIH1cclxuICBtZXNzYWdlc0NvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICBsZXQgaHRtbCA9IFwiXCI7XHJcbiAgbGV0IG9wZW4gPSBcIlwiO1xyXG4gIC8vIGNvbnNvbGUubG9nKHBvc3RWYWx1ZSlcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICBpZiAoZGF0YSAmJiBkYXRhWzBdID09IHVuZGVmaW5lZCkge1xyXG4gICAgcG9zdFZhbHVlID0gcG9zdFZhbHVlID8gYHdpdGggd29yZCA8Yj4ke3Bvc3RWYWx1ZX08L2I+YCA6ICcnO1xyXG4gICAgaHRtbCArPSBgPGRpdj48Y2VudGVyPjxoMz5ObyBtZXNzYWdlcyAke3Bvc3RWYWx1ZX08L2gzPjwvY2VudGVyPjwvZGl2PmA7XHJcbiAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgbWVzc2FnZXNDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIG9wZW4gPSBcIm9wZW5cIjtcclxuICBodG1sICs9IGBcclxuICAgICAgPGRpdiBjbGFzcz1cImRheS10aXRsZVwiPlxyXG4gICAgICAgIEZvdW5kIDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiBtZXNzYWdlcyBmb3IgPGI+JHtwb3N0VmFsdWV9PC9iPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIGA7IFxyXG4gIGRhdGEuZm9yRWFjaChtZXNzYWdlID0+IHtcclxuICAgIGh0bWwgKz0gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2Utd3JhcHBlclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1lc3NhZ2UtZGF0ZS1zZW50XCI+XHJcbiAgICAgICAgICAgICAgJHtmb3JtYXREYXRlKG5ldyBEYXRlKG1lc3NhZ2Uuc2VudCksIFwiLlwiKX1cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZS1hdmF0YXIgdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiYXZhdGFyIFwiIHNyYz1cIiR7bWVzc2FnZS5hdmF0YXJVcmx9XCI+XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXB0ZXh0XCI+XHJcbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwidG9vbHRpcC1hdmF0YXJcIiBzcmM9XCIkeyBtZXNzYWdlLmF2YXRhclVybE1lZGl1bSB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSB0aXRsZT1cInNlYXJjaCBtZW50aW9ucyBieSAkeyBtZXNzYWdlLnVzZXJuYW1lfVwiIGNsYXNzPVwidGl0bGUgbWVzc2FnZS11c2VybmFtZVwiPiR7IG1lc3NhZ2UudXNlcm5hbWV9PC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0tcmFpc2VkIG1kbC1qcy1yaXBwbGUtZWZmZWN0XCIgdGFyZ2V0PVwiX2JsYW5rXCIgdGl0bGU9XCJnbyB0byAke1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZS51c2VybmFtZVxyXG4gICAgICAgICAgICAgIH0gZ2l0aHViIHJlcG9cIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tJHttZXNzYWdlLnVybH1cIj5PcGVuIHByb2ZpbGU8L2E+XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgICA8YSB0aXRsZT1cInNlYXJjaCBtZW50aW9ucyBieSAkeyBtZXNzYWdlLnVzZXJuYW1lfVwiIGNsYXNzPVwibWVzc2FnZS11c2VybmFtZVwiPlxyXG4gICAgICAgICAgICAgICAgJHsgbWVzc2FnZS51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2UtbWFya3VwXCI+XHJcbiAgICAgICAgICAgICAgICAke21hcmtTZWFyY2hlZFZhbHVlc0luSHRtbChtZXNzYWdlLmh0bWwsIHBvc3RWYWx1ZSl9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgY2xhc3M9XCIke2NvbnRhaW5lciA/IFwiZGVsLWZyb20tZmF2b3JpdGVzLWJ1dHRvblwiIDogXCJhZGQtdG8tZmF2b3JpdGVzLWJ1dHRvblwifVwiID5cclxuICAgICAgICAgICAgICAgIDwhLS0gPGkgaWQ9XCIke21lc3NhZ2UubWVzc2FnZUlkfVwiICR7Y29udGFpbmVyID8gYGNsYXNzPVwiZmEgZmEtdHJhc2gtb1wiIHRpdGxlPVwiZGVsZXRlIGZyb20gZmF2b3JpdGVzXCJgIDogYGNsYXNzPVwiZmEgZmEtcGx1c1wiIHRpdGxlPVwiYWRkIHRvIGZhdm9yaXRlc1wiYH0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiAtLT5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiBjbGFzcz1cIiR7Y29udGFpbmVyID8gbWVzc2FnZS5jaGVja2VkID8gXCJkb25lLWZhdm9yaXRlcy1idXR0b25cIiA6IFwiY2hlY2stZmF2b3JpdGVzLWJ1dHRvblwiIDogXCJoaWRlLWJ1dHRvblwifVwiID5cclxuICAgICAgICAgICAgICA8IS0tIDxpIGlkPVwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiBjbGFzcz1cImZhICR7Y29udGFpbmVyID8gbWVzc2FnZS5jaGVja2VkID8gXCJmYS1jaGVjay1zcXVhcmUtb1wiIDogXCJmYS1zcXVhcmUtb1wiIDogIFwiZmEtc3F1YXJlLW9cIn1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IC0tPlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PmA7XHJcbiAgfSk7XHJcblxyXG4gIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgXHJcbiAgLy8gSU5JVCBISUdITElHSFQuSlMgRk9SIENPREUgQkxPQ0tTIElOIE1FU1NBR0VTXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwicHJlIGNvZGVcIikuZWFjaChmdW5jdGlvbihpLCBibG9jaykge1xyXG4gICAgICBobGpzLmhpZ2hsaWdodEJsb2NrKGJsb2NrKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIG1lc3NhZ2VzQ29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgfSwgMTAwKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkcmF3Q2FsZW5kYXIgPSBhY3Rpdml0eUFyciA9PiB7XHJcbiAgbGV0IGJ1aWxkZWRBcnIgPSBbXTtcclxuICAvLyBjb25zb2xlLmxvZyhhY3Rpdml0eUFyclswXSlcclxuICBhY3Rpdml0eUFyci5mb3JFYWNoKGZ1bmN0aW9uKGRheU9iaikge1xyXG4gICAgbGV0IGRhdGVTdHJpbmcgPSBkYXlPYmouX2lkLnNwbGl0KCcuJykuam9pbignLScpO1xyXG4gICAgYnVpbGRlZEFyci5wdXNoKHtcclxuICAgICAgZGF0ZTogZGF0ZVN0cmluZyxcclxuICAgICAgYmFkZ2U6IGZhbHNlLFxyXG4gICAgICB0aXRsZTogYCR7ZGF5T2JqLmNvdW50fSBtZXNzYWdlc2AsXHJcbiAgICAgIGNsYXNzbmFtZTogYGRheS1ibG9jay0ke2RheU9iai5jb3VudCA+IDEwMCA/IDExMCA6IGRheU9iai5jb3VudH1gXHJcbiAgICB9KTtcclxuICB9KTtcclxuICAvLyBjb25zb2xlLmxvZyhidWlsZGVkQXJyKVxyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJChcIiNteS1jYWxlbmRhclwiKS56YWJ1dG9fY2FsZW5kYXIoe1xyXG4gICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiBteURhdGVGdW5jdGlvbih0aGlzLmlkLCBmYWxzZSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGE6IGJ1aWxkZWRBcnIsIC8vZXZlbnREYXRhLFxyXG4gICAgICBtb2RhbDogZmFsc2UsXHJcbiAgICAgIGxlZ2VuZDogW1xyXG4gICAgICAgIHsgdHlwZTogXCJ0ZXh0XCIsIGxhYmVsOiBcImxlc3MgMTBcIiB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHR5cGU6IFwibGlzdFwiLFxyXG4gICAgICAgICAgbGlzdDogW1xyXG4gICAgICAgICAgICBcImRheS1ibG9jay0yMFwiLFxyXG4gICAgICAgICAgICBcImRheS1ibG9jay0zNVwiLFxyXG4gICAgICAgICAgICBcImRheS1ibG9jay00NVwiLFxyXG4gICAgICAgICAgICBcImRheS1ibG9jay02NVwiLFxyXG4gICAgICAgICAgICBcImRheS1ibG9jay03NVwiLFxyXG4gICAgICAgICAgICBcImRheS1ibG9jay05NVwiXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IHR5cGU6IFwidGV4dFwiLCBsYWJlbDogXCJtb3JlIDEwMFwiIH1cclxuICAgICAgXSxcclxuICAgICAgY2VsbF9ib3JkZXI6IHRydWUsXHJcbiAgICAgIHRvZGF5OiB0cnVlLFxyXG4gICAgICBuYXZfaWNvbjoge1xyXG4gICAgICAgIHByZXY6ICc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tY2lyY2xlLWxlZnRcIj48L2k+JyxcclxuICAgICAgICBuZXh0OiAnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLWNpcmNsZS1yaWdodFwiPjwvaT4nXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gbXlEYXRlRnVuY3Rpb24oaWQsIGZyb21Nb2RhbCkge1xyXG4gIHZhciBkYXRlID0gJChcIiNcIiArIGlkKS5kYXRhKFwiZGF0ZVwiKTtcclxuICBkYXRlID0gZGF0ZS5zcGxpdCgnLScpLmpvaW4oJy4nKTtcclxuICB2YXIgaGFzRXZlbnQgPSAkKFwiI1wiICsgaWQpLmRhdGEoXCJoYXNFdmVudFwiKTtcclxuICAvLyBjb25zb2xlLmxvZyhkYXRlKVxyXG4gIGdldE1lc3NhZ2VzKFwicGVyZGF0ZVwiLCBkYXRlKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsIGRhdGUpKTtcclxufVxyXG5cclxuXHJcblxyXG4vLy8vXHJcbmNvbnN0IGxlZnRTaWRlYmFyT3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3BlblwiKTtcclxuY29uc3QgbGVmdFNpZGViYXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XHJcbmNvbnN0IGxlZnRTaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sZWZ0LXNpZGViYXJcIik7XHJcblxyXG5cclxubGVmdFNpZGViYXJPcGVuLnNjcm9sbFRvcCA9IGxlZnRTaWRlYmFyT3Blbi5zY3JvbGxIZWlnaHQ7XHJcbmxlZnRTaWRlYmFyT3Blbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmKGxlZnRTaWRlYmFyLnN0eWxlLm1hcmdpbkxlZnQgIT0gXCIwcHhcIil7XHJcblxyXG4gICAgbGVmdFNpZGViYXIuc3R5bGUubWFyZ2luTGVmdCA9IFwiMHB4XCI7XHJcbiAgICBsZWZ0U2lkZWJhck9wZW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgbGVmdFNpZGViYXJDbG9zZS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIH1cclxufSk7XHJcblxyXG5sZWZ0U2lkZWJhckNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYobGVmdFNpZGViYXIuc3R5bGUubWFyZ2luTGVmdCA9PSBcIjBweFwiKXtcclxuICAgIGxlZnRTaWRlYmFyLnN0eWxlLm1hcmdpbkxlZnQgPSBcIi0xMDAlXCI7XHJcbiAgICBsZWZ0U2lkZWJhck9wZW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcblxyXG5tYWluU2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XHJcbiAgbGV0IHBvc3RWYWx1ZSA9IGUudGFyZ2V0LnZhbHVlLnRyaW0oKTtcclxuICBpZiAoZS5rZXlDb2RlID09IEVOVEVSKSB7XHJcbiAgICAoISFwb3N0VmFsdWUpICYmIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsIHBvc3RWYWx1ZSkudGhlbihkYXRhID0+IHtcclxuICAgICAgZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3RWYWx1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5cclxudXNlcm5hbWVTZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICBsZXQgcG9zdFZhbHVlID0gZS50YXJnZXQudmFsdWUudHJpbSgpO1xyXG4gIGlmIChlLmtleUNvZGUgPT0gRU5URVIpIHtcclxuICAgICghIXBvc3RWYWx1ZSkgJiYgZ2V0TWVzc2FnZXMoXCJzZWFyY2hVc2VybmFtZVwiLCBwb3N0VmFsdWUpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0VmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vaHR0cDovL2Vhc3lhdXRvY29tcGxldGUuY29tL2d1aWRlI3NlYy1mdW5jdGlvbnNcclxuZ2V0TWVzc2FnZXMoXCJhdXRob3JzXCIpLnRoZW4oZGF0YSA9PiB7XHJcbiAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICBkYXRhOiBkYXRhLFxyXG4gICAgbGlzdDoge1xyXG4gICAgICBtYXRjaDoge1xyXG4gICAgICAgIGVuYWJsZWQ6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgb25DbGlja0V2ZW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgcG9zdFZhbHVlID0gJChcIi5zZWFyY2gtYnktdXNlcm5hbWVcIikuZ2V0U2VsZWN0ZWRJdGVtRGF0YSgpO1xyXG4gICAgICAgIGdldE1lc3NhZ2VzKFwic2VhcmNoVXNlcm5hbWVcIiwgcG9zdFZhbHVlKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3RWYWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcblxyXG4gICAgfVxyXG4gIH07XHJcbiAgJChcIi5zZWFyY2gtYnktdXNlcm5hbWVcIikuZWFzeUF1dG9jb21wbGV0ZShvcHRpb25zKTtcclxufSk7XHJcblxyXG5cclxuc2lnbnVwQmxvY2suYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgY29uc29sZS5sb2coZS50YXJnZXQpXHJcbiAgbGV0IGVtYWlsID0gZS50YXJnZXRbJzAnXS52YWx1ZTtcclxuICBpZihlbWFpbCAmJiBlbWFpbCAhPSAnJykge1xyXG4gICAgc2lnbnVwQmxvY2suaW5uZXJIVE1MID0gYDxjZW50ZXI+PGg0PlRoYW5rcyE8L2g0PjwvY2VudGVyPmA7XHJcbiAgICB1c2VyQ3JlZGVudGlhbHMgPSAgeyBlbWFpbDogZW1haWwgfTtcclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdmYXZvcml0ZXMnLCBKU09OLnN0cmluZ2lmeSh1c2VyQ3JlZGVudGlhbHMpKTtcclxuICAgIC8vIHVzZXJDcmVkZW50aWFscyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmYXZvcml0ZXMnKTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBsZXQgdXNlcm5hbWUgPSBlbWFpbC5zcGxpdCgnQCcpWzBdO1xyXG4gICAgICBmYXZvcml0ZXNCbG9ja1RpdGxlLmlubmVySFRNTCA9IFxyXG4gICAgICAgIGBIZWxsbyAke3VzZXJuYW1lfSEgPGEgY2xhc3M9XCJzaWdub3V0LWJ1dHRvblwiPlNpZ24gb3V0ITwvYT5gO1xyXG5cclxuICAgICAgXHJcbiAgICAgIHNpZ251cEJsb2NrLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICB9LCAxMDAwKTtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcbm1haW5NZXNzYWdlc0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGNvbnNvbGUubG9nKGUudGFyZ2V0KVxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm1lc3NhZ2UtZGF0ZS1zZW50XCIpKXtcclxuICAgIGxldCBwb3N0RGF0ZSA9IGUudGFyZ2V0LnRleHRDb250ZW50LnRyaW0oKS5zdWJzdHJpbmcoMCwxMCk7XHJcbiAgICBnZXRNZXNzYWdlcyhcInBlcmRhdGVcIiwgcG9zdERhdGUpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdERhdGUpKTtcclxuICB9XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcIm1lc3NhZ2UtdXNlcm5hbWVcIikpe1xyXG4gICAgbGV0IHBvc3RVc2VybmFtZSA9IGUudGFyZ2V0LnRleHRDb250ZW50LnRyaW0oKTtcclxuICAgIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsIHBvc3RVc2VybmFtZSkudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0VXNlcm5hbWUpKTtcclxuICB9XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImFkZC10by1mYXZvcml0ZXMtYnV0dG9uXCIpKXtcclxuICAgIGNoYW5nZU1lc3NhZ2VTdGF0ZVRvKGUsICdzYXZlVG9GYXZvcml0ZXMnKTtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IGNoYW5nZU1lc3NhZ2VTdGF0ZVRvID0gKGUsIHNhdmVUb0NvbW1hbmQpID0+IHtcclxuICBpZighdXNlckNyZWRlbnRpYWxzKSB7XHJcbiAgICBzaWdudXBCbG9jay5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBsZXQgcG9zdE1lc3NhZ2VJZCA9IGUudGFyZ2V0LmlkLnRyaW0oKTtcclxuICAgIC8vd29ya3NcclxuICAgIGdldE1lc3NhZ2VzKFwiZmluZGJ5SWRcIiwgcG9zdE1lc3NhZ2VJZCkudGhlbihtZXNzYWdlID0+IHtcclxuICAgICAgbGV0IHBvc3RWYWx1ZSA9IHtcclxuICAgICAgICBvd25lcjogdXNlckNyZWRlbnRpYWxzLmVtYWlsLFxyXG4gICAgICAgIG1lc3NhZ2VJZDogbWVzc2FnZS5tZXNzYWdlSWRcclxuICAgICAgfVxyXG4gICAgICAvL3dvcmtzXHJcbiAgICAgIGdldE1lc3NhZ2VzKHNhdmVUb0NvbW1hbmQsIEpTT04uc3RyaW5naWZ5KHBvc3RWYWx1ZSkpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnc2F2ZXRvZmF2b3JpdGVzJywgZGF0YSlcclxuICAgICAgICBsZXQgYW5zd2VyID0gKGRhdGEgPT0gJ0FscmVhZHkgZXhpc3QnKSA/IGRhdGEgOiAnQWRkZWQnO1xyXG4gICAgICAgIHNpZ251cEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgc2lnbnVwQmxvY2suaW5uZXJIVE1MID0gYDxjZW50ZXI+PGg0PiR7YW5zd2VyfTwvaDQ+PC9jZW50ZXI+YDtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtzaWdudXBCbG9jay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7fSwgMTAwMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuZmF2b3JpdGVzQmxvY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaWdudXAtYnV0dG9uXCIpKXsgXHJcbiAgICBzaWdudXBCbG9jay5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5LXNpZ24tYmxvY2snKTtcclxuICB9XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInNpZ25vdXQtYnV0dG9uXCIpKXsgXHJcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnZmF2b3JpdGVzJyk7XHJcbiAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XHJcbiAgfVxyXG4gIGlmKGUudGFyZ2V0LmlkID09IFwidmlldy1mYXZvcml0ZXMtYnV0dG9uXCIgfHwgZS50YXJnZXQub2Zmc2V0UGFyZW50LmlkID09IFwidmlldy1mYXZvcml0ZXMtYnV0dG9uXCIpeyBcclxuICAgIGlmKCF1c2VyQ3JlZGVudGlhbHMpe1xyXG4gICAgICBzaWdudXBCbG9jay5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5LXNpZ24tYmxvY2snKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAvL3dvcmtzXHJcbiAgICAgIGRyYXdGYXZvcml0ZXModXNlckNyZWRlbnRpYWxzLmVtYWlsKTtcclxuICAgICAgZmF2b3JpdGVXaW5kb3cuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcbmNvbnN0IGRyYXdGYXZvcml0ZXMgPSAoZW1haWwpID0+IHtcclxuICBnZXRNZXNzYWdlcygnZmF2Z2V0QnlDcmVkJywgZW1haWwpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnZGF0YScsIGRhdGEpXHJcbiAgICBpZihkYXRhLmxlbmd0aCkge1xyXG4gICAgICBsZXQgY2hlY2tlZCA9IGRhdGEuZmlsdGVyKG0gPT4gbS5jaGVja2VkKTtcclxuICAgICAgbGV0IHVuY2hlY2tlZCA9IGRhdGEuZmlsdGVyKG0gPT4gIW0uY2hlY2tlZCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjaGVja2VkJywgY2hlY2tlZCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1bmNoZWNrZWQnLCB1bmNoZWNrZWQpO1xyXG4gICAgICBjaGVja2VkLmxlbmd0aCA/IGRyYXdNZXNzYWdlcyhjaGVja2VkLCBlbWFpbCwgZG9uZUNvbnRhaW5lcikgOiAgZG9uZUNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGg0Pi4uLmVtcHR5IHlldC4uLiA8L2g0PmA7XHJcbiAgICAgIHVuY2hlY2tlZC5sZW5ndGggPyBkcmF3TWVzc2FnZXModW5jaGVja2VkLCBlbWFpbCwgc2F2ZWRDb250YWluZXIpIDogc2F2ZWRDb250YWluZXIuaW5uZXJIVE1MID0gYDxoND4uLi5lbXB0eSB5ZXQuLi4gPC9oND5gO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9uZUNvbnRhaW5lci5pbm5lckhUTUwgPSBgPGg0Pi4uLmVtcHR5IHlldC4uLiA8L2g0PmA7XHJcbiAgICAgIHNhdmVkQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aDQ+Li4uZW1wdHkgeWV0Li4uIDwvaDQ+YDtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZmF2b3JpdGVXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjbG9zZS1mYXZvcml0ZXMtd2luZG93XCIpKXsgXHJcbiAgICBmYXZvcml0ZVdpbmRvdy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkZWwtZnJvbS1mYXZvcml0ZXMtYnV0dG9uXCIpKXtcclxuICAgIC8vIGUuc3JjRWxlbWVudC5hdHRyaWJ1dGVzLmFkZCgnZGlzYWJsZWQnKVxyXG4gICAgbGV0IHBvc3RNZXNzYWdlSWQgPSBlLnRhcmdldC5pZC50cmltKCk7XHJcbiAgICBsZXQgcG9zdFZhbHVlID0ge1xyXG4gICAgICBvd25lcjogdXNlckNyZWRlbnRpYWxzLmVtYWlsLFxyXG4gICAgICBtZXNzYWdlSWQ6IHBvc3RNZXNzYWdlSWRcclxuICAgIH1cclxuICAgIGdldE1lc3NhZ2VzKFwiZmF2RGVsT25lRnJvbUxpc3RcIiwgSlNPTi5zdHJpbmdpZnkocG9zdFZhbHVlKSApLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9KS50aGVuKGRyYXdGYXZvcml0ZXModXNlckNyZWRlbnRpYWxzLmVtYWlsKSk7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJjaGVjay1mYXZvcml0ZXMtYnV0dG9uXCIpKXtcclxuICAgIGxldCBwb3N0TWVzc2FnZUlkID0gZS50YXJnZXQuaWQudHJpbSgpO1xyXG4gICAgbGV0IHBvc3RWYWx1ZSA9IHtcclxuICAgICAgb3duZXI6IHVzZXJDcmVkZW50aWFscy5lbWFpbCxcclxuICAgICAgbWVzc2FnZUlkOiBwb3N0TWVzc2FnZUlkXHJcbiAgICB9XHJcbiAgICBnZXRNZXNzYWdlcyhcImZhdkNoZWNrRG9uZVwiLCBKU09OLnN0cmluZ2lmeShwb3N0VmFsdWUpICkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0pLnRoZW4oZHJhd0Zhdm9yaXRlcyh1c2VyQ3JlZGVudGlhbHMuZW1haWwpKTtcclxuICB9XHJcbn0pXHJcblxyXG5maWx0ZXJzQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICB2YXIgaWQ7XHJcbiAgaWYoZS5zcmNFbGVtZW50ICYmIGUuc3JjRWxlbWVudC5vZmZzZXRQYXJlbnQgJiYgZS5zcmNFbGVtZW50Lm9mZnNldFBhcmVudC5pZCkge1xyXG4gICAgaWQgPSBlLnNyY0VsZW1lbnQub2Zmc2V0UGFyZW50LmlkO1xyXG4gIH1cclxuICBpZihlLnRhcmdldC5pZCkge1xyXG4gICAgaWQgPSBlLnRhcmdldC5pZDtcclxuICB9XHJcbiAgXHJcbiAgaWYoaWQgPT0gXCJsaW5rcy1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICdodHRwJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAnbWVzc2FnZXMgd2l0aCBsaW5rcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcInlvdXR1YmUtZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnd3d3LnlvdXR1YmUnKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICd5b3V0dWJlIHZpZGVvcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcImdpdGh1Yi1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICdnaXRodWInKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICdnaXRodWIgbGlua3MnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJpbWFnZS1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICdpbWcnKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICdpbWFnZXMnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJ0d2l0dGVyLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ3R3aXR0ZXInKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICd0d2l0dGVyIHBvc3RzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwibWVldHVwLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ21lZXR1cCcpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ21lZXR1cHMnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJ5b3V0dWJlLWNoZWNrYm94XCIpIHtcclxuICAgIGFsbG93WW91dHViZVByZXZpZXcgPSBhbGxvd1lvdXR1YmVQcmV2aWV3ID8gZmFsc2UgOiB0cnVlO1xyXG4gIH1cclxuICBpZihpZCA9PSBcInR3aXR0ZXItY2hlY2tib3hcIikge1xyXG4gICAgYWxsb3dUd2l0dGVyUHJldmlldyA9IGFsbG93VHdpdHRlclByZXZpZXcgPyBmYWxzZSA6IHRydWU7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5leHBvcnRzLmRyYXdQaWVDaGFydCA9IGZ1bmN0aW9uKGdyYXBoQXJyKSB7XHJcbiAgZ3JhcGhBcnIgPSBncmFwaEFyci5tYXAob2JqID0+IHtcclxuICAgIHJldHVybiBbb2JqLl9pZC5uYW1lLCBvYmouY291bnRdXHJcbiAgfSlcclxuICBncmFwaEFyci51bnNoaWZ0KFsnVXNlcicsICdDb3VudCBvZiBtZXNzYWdlcyddKVxyXG4gIGdyYXBoQXJyLmxlbmd0aCA9IDIwO1xyXG4gIC8vIGNvbnNvbGUubG9nKGdyYXBoQXJyKVxyXG4gIGdvb2dsZS5jaGFydHMubG9hZChcImN1cnJlbnRcIiwge3BhY2thZ2VzOltcImNvcmVjaGFydFwiXX0pO1xyXG4gICAgICAgIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0NoYXJ0KTtcclxuICAgICAgICBmdW5jdGlvbiBkcmF3Q2hhcnQoKSB7XHJcbiAgICAgICAgICB2YXIgZGF0YSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmFycmF5VG9EYXRhVGFibGUoZ3JhcGhBcnIpO1xyXG5cclxuICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBjaGFydEFyZWE6IHsgbGVmdDogJy01JScsIHRvcDogJzEyJScsIHdpZHRoOiBcIjkwJVwiLCBoZWlnaHQ6IFwiOTAlXCIgfSxcclxuICAgICAgICAgICAgdGl0bGU6ICdNZXNzYWdpbmcgYWN0aXZpdHknLFxyXG4gICAgICAgICAgICBwaWVIb2xlOiAwLjQsXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5QaWVDaGFydChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG9udXRjaGFydCcpKTtcclxuICAgICAgICAgIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbi8vdG90YWxCbG9ja1xyXG5jb25zdCB0b3RhbExpbmtzICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWxpbmtzXCIpLFxyXG4gICAgICB0b3RhbFZpZGVvcyAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLXZpZGVvc1wiKSxcclxuICAgICAgdG90YWxHaXRodWIgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1naXRodWJcIiksXHJcbiAgICAgIHRvdGFsSW1hZ2VzICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtaW1hZ2VzXCIpLFxyXG4gICAgICB0b3RhbG1lbnRpb25zICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLW1lbnRpb25zXCIpLFxyXG4gICAgICB0b3RhbEZpbmlzaGVkVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWZpbmlzaGVkLXRhc2tzXCIpLFxyXG4gICAgICB0b3RhbE1lc3NhZ2VzICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLW1lc3NhZ2VzXCIpLFxyXG4gICAgICB0b3RhbERheXMgICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWRheXNcIik7XHJcblxyXG5cclxuZXhwb3J0cy5yZW5kZXJUb3RhbE1lZGlhU3VtbWFyeUJsb2NrID0gKCkgPT4ge1xyXG4gIGdldE1lc3NhZ2VzKFwiY291bnRcIikudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsTWVzc2FnZXMuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YX08L2I+YDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcImJ5RGF5XCIpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbERheXMuaW5uZXJIVE1MID0gYDxiPiR7TWF0aC5mbG9vcihkYXRhLmxlbmd0aC8zMCl9IG1vbnRocyAmICR7ZGF0YS5sZW5ndGggJSAzMH0gZGF5czwvYj5gO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICdodHRwJykudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsTGlua3MuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiByZWZlcmVuY2VzYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnLnlvdXR1YmUnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxWaWRlb3MuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiB2aWRlb3NgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICcuZ2l0aHViJykudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsR2l0aHViLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gbGlua3MgdG8gZ2l0aHViYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnaHR0cCBpbWcnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxJbWFnZXMuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiBzY3JlZW5zaG90c2A7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJ0AnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxtZW50aW9ucy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IG1lbnRpb25zYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcImZpbmlzaGVkQnlUYXNrc1wiKS50aGVuKChkYXRhLCBodG1sKSA9PiB7XHJcbiAgICB0b3RhbEZpbmlzaGVkVGFza3MuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiByZWFkeSB0YXNrc2A7XHJcbiAgfSk7XHJcbn0iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vX2NvbmZpZ1wiKTtcclxuY29uc3QgdGFibGUgPSByZXF1aXJlKFwiLi4vcGx1Z2lucy9fdGFibGVcIik7XHJcblxyXG5leHBvcnQgY29uc3QgaW5zZXJ0VGFza0xpc3RUb1BhZ2UgPSAoZmluaXNoZWRBcnIpID0+IHtcclxuICB2YXIgaW1hZ2VMb2dvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbG9nbycpO1xyXG4gIGltYWdlTG9nby5zcmMgPSBjb25maWcudmFycy5rb3R0YW5zUm9vbS5hdmF0YXI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215SW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRhYmxlLm15RnVuY3Rpb24pO1xyXG5cclxuICB2YXIgaHRtbCA9ICcnO1xyXG5cclxuICB2YXIgZGl2VGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlUYWJsZScpO1xyXG5cclxuICBodG1sICs9IFxyXG4gICAgYDx0ciBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMSl9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5OYW1lPC90aD5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDIpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+TmljazwvdGg+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgzKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPlB1Ymxpc2hlZDwvdGg+XHJcbiAgICAgICAgPHRoIHN0eWxlPVwid2lkdGg6ODAlO1wiPlRleHQ8L3RoPlxyXG4gICAgPC90cj5gO1xyXG4gICAgICAgIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluaXNoZWRBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgIGh0bWwgKz0gXHJcbiAgICAgICAgYDx0cj5cclxuICAgICAgICAgIDx0ZD48aW1nIHNyYz1cIiR7ZmluaXNoZWRBcnJbaV0uYXZhdGFyVXJsfVwiIGNsYXNzPVwidXNlci1pY29uXCI+JHtmaW5pc2hlZEFycltpXS5kaXNwbGF5TmFtZX08L3RkPlxyXG4gICAgICAgICAgPHRkPig8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tJHtmaW5pc2hlZEFycltpXS51cmx9XCI+JHtmaW5pc2hlZEFycltpXS51c2VybmFtZX08L2E+KTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS5zZW50fTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS50ZXh0fSA8L3RkPlxyXG4gICAgICAgIDwvdHI+YDtcclxuICB9XHJcbmRpdlRhYmxlLmlubmVySFRNTCA9IGh0bWw7XHJcbn0iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vX2NvbmZpZ1wiKTtcclxuY29uc3Qgc2VsID0gcmVxdWlyZSgnLi4vcGx1Z2lucy9fc2VsZWN0b3JzJyk7XHJcbmltcG9ydCB7IHJlcXVlc3QgYXMgZ2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vX3JlcXVlc3QtbmV3XCI7XHJcblxyXG5leHBvcnRzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGZlYXR1cmUgMVxyXG4gIGdldE1lc3NhZ2VzKCdjb3VudCcpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MubWVzc2FnZXNDb3VudC5pbm5lckhUTUwgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDJcclxuICBnZXRNZXNzYWdlcyhcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mva290dGFucy9mcm9udGVuZFwiKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLnN0YXJyZWRSZXBvLmlubmVySFRNTCA9IChkYXRhLnN0YXJnYXplcnNfY291bnQgPT0gdW5kZWZpbmVkKSA/IFwiLi4uXCIgOiBkYXRhLnN0YXJnYXplcnNfY291bnQ7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgM1xyXG4gIGdldE1lc3NhZ2VzKFwiYXV0aG9yc1wiKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLmFjdGl2ZVVzZXJzQ291bnQuaW5uZXJIVE1MID0gZGF0YS5sZW5ndGg7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgNFxyXG4gIGdldE1lc3NhZ2VzKFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9zZWFyY2gvaXNzdWVzP3E9K3R5cGU6cHIrdXNlcjprb3R0YW5zJnNvcnQ9Y3JlYXRlZCYlRTIlODAlOEMlRTIlODAlOEJvcmRlcj1hc2NcIikudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgdmFyIHB1bGxOdW1iZXIgPSBkYXRhLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtyZXR1cm4gaXRlbS5yZXBvc2l0b3J5X3VybCA9PSBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mva290dGFucy9tb2NrLXJlcG9cIjt9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwdWxsLXJlcXVlc3RzXCIpWzBdLmlubmVySFRNTCA9IHB1bGxOdW1iZXIubnVtYmVyO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDVcclxuICBnZXRNZXNzYWdlcyhcImxlYXJuZXJzXCIpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MuYmxvY2tMZWFybmVycy5pbm5lckhUTUwgPSBkYXRhLmxlbmd0aDtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0cy5kcmF3Q291bnRPZlRhc2tzUGVyVXNlcl9WZXJ0aWNhbEJhciA9IGZ1bmN0aW9uKHVzZXJzKSB7XHJcbiAgbGV0IGdyYXBoQXJyID0gdXNlcnMubWFwKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgIHJldHVybiBuZXcgQXJyYXkodXNlci51c2VybmFtZStcIlwiLCB1c2VyLmxlc3NvbnMubGVuZ3RoLCBcImxpZ2h0Ymx1ZVwiKTtcclxuICB9KTtcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoJ2N1cnJlbnQnLCB7cGFja2FnZXM6IFsnY29yZWNoYXJ0JywgJ2JhciddfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3QmFzaWMpO1xyXG4gIGZ1bmN0aW9uIGRyYXdCYXNpYygpIHtcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGljYWxfY2hhcnQnKTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5Db2x1bW5DaGFydChjb250YWluZXIpO1xyXG4gICAgZ3JhcGhBcnIudW5zaGlmdChbJ1VzZXInLCAnVGFza3MnLCB7IHJvbGU6ICdzdHlsZScgfV0pXHJcbiAgICB2YXIgZGF0YSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmFycmF5VG9EYXRhVGFibGUoZ3JhcGhBcnIpO1xyXG4gIHZhciBvcHRpb25zID0ge1xyXG4gICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxyXG4gICAgICBzdGFydHVwOiB0cnVlIC8vVGhpcyBpcyB0aGUgbmV3IG9wdGlvblxyXG4gICAgfSxcclxuICAgIHRpdGxlOiAnU3VtIG9mIGZpbmlzaGVkIHRhc2tzIGJ5IGVhY2ggbGVhcm5lcicsXHJcbiAgICAvLyB3aWR0aDogKCQod2luZG93KS53aWR0aCgpIDwgODAwKSA/ICQod2luZG93KS53aWR0aCgpIDogJCh3aW5kb3cpLndpZHRoKCkqMC41LFxyXG4gICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLFxyXG4gICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkqMC4zLFxyXG4gICAgaEF4aXM6IHtcclxuICAgICAgc2xhbnRlZFRleHQ6dHJ1ZSxcclxuICAgICAgc2xhbnRlZFRleHRBbmdsZTo5MCwgICAgICAgIFxyXG4gICAgfSxcclxuICAgIHZBeGlzOiB7XHJcbiAgICAgIC8vdGl0bGU6ICdTdW0gb2YgZmluaXNoZWQgdGFza3MnXHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uOntcclxuICAgICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICAgIGVhc2luZzogJ291dCdcclxuICAgIH0sXHJcbiAgfTtcclxuICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufSBcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnRzLmRyYXdBY3Rpdml0eV9MaW5lQ2hhcnQgPSBmdW5jdGlvbihhY3Rpdml0eUFycikge1xyXG4gIGFjdGl2aXR5QXJyLm1hcChmdW5jdGlvbihkYXkpIHtcclxuICAgIGRheVswXSA9IG5ldyBEYXRlKGRheVswXSk7XHJcbiAgfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKCdjdXJyZW50Jywge3BhY2thZ2VzOiBbJ2NvcmVjaGFydCcsICdsaW5lJ119KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdCYXNpYyk7XHJcblxyXG4gIGZ1bmN0aW9uIGRyYXdCYXNpYygpIHtcclxuICAgIHZhciBkYXRhID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpO1xyXG4gICAgZGF0YS5hZGRDb2x1bW4oJ2RhdGUnLCAnRGF5cycpO1xyXG4gICAgZGF0YS5hZGRDb2x1bW4oJ251bWJlcicsICdNZXNzYWdlcycpO1xyXG4gICAgZGF0YS5hZGRSb3dzKGFjdGl2aXR5QXJyKTtcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICB0aXRsZTogXCJBY3Rpdml0eSBvZiB1c2VycyBpbiBjaGF0XCIsXHJcbiAgICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxyXG4gICAgICAgIHN0YXJ0dXA6IHRydWUgLy9UaGlzIGlzIHRoZSBuZXcgb3B0aW9uXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vY3VydmVUeXBlOiAnZnVuY3Rpb24nLFxyXG4gICAgICAvLyB3aWR0aDogKCQod2luZG93KS53aWR0aCgpIDwgODAwKSA/ICQod2luZG93KS53aWR0aCgpIDogJCh3aW5kb3cpLndpZHRoKCkqMC41LFxyXG4gICAgICB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIFxyXG4gICAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSowLjMsXHJcbiAgICAgIGhBeGlzOiB7XHJcbiAgICAgICAgc2xhbnRlZFRleHQ6dHJ1ZSxcclxuICAgICAgICBzbGFudGVkVGV4dEFuZ2xlOjQ1LFxyXG4gICAgICB9LFxyXG4gICAgICB2QXhpczoge1xyXG4gICAgICAgIC8vIHRpdGxlOiAnQ291bnQgb2YgbWVzc2EnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uTGluZUNoYXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5lY2hhcnQnKSk7XHJcbiAgICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufSIsImV4cG9ydHMuZHJhd1RpbWVsaW5lQ2hhcnQgPSBmdW5jdGlvbihncmFwaEFycikge1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZChcImN1cnJlbnRcIiwge3BhY2thZ2VzOltcInRpbWVsaW5lXCJdfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3Q2hhcnQpO1xyXG4gIGZ1bmN0aW9uIGRyYXdDaGFydCgpIHtcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZWxpbmUnKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5UaW1lbGluZShjb250YWluZXIpO1xyXG4gICAgdmFyIGRhdGFUYWJsZSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnc3RyaW5nJywgaWQ6ICdSb29tJyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnc3RyaW5nJywgaWQ6ICdOYW1lJyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnZGF0ZScsIGlkOiAnU3RhcnQnIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdkYXRlJywgaWQ6ICdFbmQnIH0pO1xyXG4gICAgXHJcbiAgICBncmFwaEFyci5tYXAoZWxlbWVudCA9PiB7XHJcbiAgICAgIGVsZW1lbnRbMl0gPSBuZXcgRGF0ZShlbGVtZW50WzJdKTtcclxuICAgICAgZWxlbWVudFszXSA9IG5ldyBEYXRlKGVsZW1lbnRbM10pO1xyXG4gICAgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkUm93cyhncmFwaEFycik7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCksXHJcbiAgICAgIHRpbWVsaW5lOiB7IGNvbG9yQnlSb3dMYWJlbDogdHJ1ZSB9LFxyXG4gICAgICBoQXhpczoge1xyXG4gICAgICAgICAgbWluVmFsdWU6IG5ldyBEYXRlKDIwMTcsIDksIDI5KSxcclxuICAgICAgICAgIG1heFZhbHVlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArICgxICogNjAgKiA2MCAqIDEwMDAwMCkpXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjaGFydC5kcmF3KGRhdGFUYWJsZSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59Il19

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.vars = {
  hash: '7e16b5527c77ea58bac36dddda6f5b444f32e81b',
  domain: "https://secret-earth-50936.herokuapp.com/",
  // domain: "http://localhost:3002/",
  kottansRoom: {
    // id : "59b0f29bd73408ce4f74b06f",
    avatar: "https://avatars-02.gitter.im/group/iv/3/57542d27c43b8c601977a0b6"
  }
};

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

  requestObj.timeout = link === "latest" ? 5000 : 60000;
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
var mainMessagesWrapper = document.querySelector(".messages-wrapper");

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
var leftSidebar = document.querySelector(".left-sidebar");
var leftSidebarOpen = document.querySelector(".open");
var leftSidebarClose = document.querySelector(".close");

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

//init emoji formatter
//https://github.com/iamcal/js-emoji
var emoji = null;
var callback = function callback(value) {
  emoji = value;
};
var initEmoji = function initEmoji(callback) {
  var emoji = new EmojiConvertor();
  emoji.include_title = true;
  var path = 'https://raw.githubusercontent.com/iamcal/emoji-data/master/img-apple-64/';

  fetch(path + '1f44d.png') //check if is connection to github online emoji
  .then(function (response) {
    if (response.ok) {
      emoji.img_sets.apple.path = path;
      callback(emoji);
    } else {
      emoji.use_sheet = true;
      emoji.img_sets.apple.sheet = 'libs/js-emoji/sheet_apple_16.png';
      callback(emoji);
    }
  });
};

initEmoji(callback);

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
    html = emoji.replace_colons(html);
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
    if (dayObj._id !== null) {
      var dateString = dayObj._id.split('.').join('-');
      buildedArr.push({
        date: dateString,
        badge: false,
        title: dayObj.count + " messages",
        classname: "day-block-" + (dayObj.count > 100 ? 110 : dayObj.count)
      });
    }
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
      year: 2018,
      month: 2, // Put the number of the month you want to start with
      // today: true,
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

leftSidebarOpen.scrollTop = leftSidebarOpen.scrollHeight;
leftSidebarOpen.addEventListener("click", function () {
  if (leftSidebar.style.marginLeft != "0px") {

    leftSidebar.style.marginLeft = "0px";
    leftSidebarOpen.style.display = "none";
    mainMessagesWrapper.style.display = "none";
    leftSidebarClose.style.display = "block";
  }
});

leftSidebarClose.addEventListener("click", function () {
  if (leftSidebar.style.marginLeft == "0px") {
    leftSidebar.style.marginLeft = "-100%";
    leftSidebarOpen.style.display = "block";
    mainMessagesWrapper.style.display = "block";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvX2NvbmZpZy5qcyIsIkM6L1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9fcmVxdWVzdC1uZXcuanMiLCJDOi9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvYXBwLmpzIiwiQzovUHJvamVjdHMvR2l0aHViL1JlYWwgcHJvamVjdHMva290dGFucy1zdGF0aXN0aWNzL2tvdHRhbnMtc3RhdHMvYXBwL2pzL3BsdWdpbnMvX2NvdW50ZG93bi5qcyIsIkM6L1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9wbHVnaW5zL19zZWxlY3RvcnMuanMiLCJDOi9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcGx1Z2lucy9fdGFibGUuanMiLCJDOi9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLWZpbHRlcnMuanMiLCJDOi9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLXNlYXJjaC5qcyIsIkM6L1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljcy5qcyIsIkM6L1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2UtdGltZWxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sQ0FBQyxJQUFJLEdBQUc7QUFDYixNQUFJLEVBQUUsMENBQTBDO0FBQ2hELFFBQU0sRUFBRSwyQ0FBMkM7O0FBRW5ELGFBQVcsRUFBRTs7QUFFWCxVQUFNLEVBQUcsa0VBQWtFO0dBQzVFO0NBQ0YsQ0FBQzs7Ozs7Ozs7QUNSRixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdCLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLElBQUksRUFBRSxTQUFTLEVBQUs7QUFDMUMsTUFBSSxHQUFHLEdBQUcsQUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDcEYsTUFBSSxPQUFPLEdBQUc7QUFDWixVQUFNLEVBQUUsTUFBTTtBQUNkLFdBQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxtQ0FBbUMsRUFBRTtBQUNoRSxRQUFJLEVBQUUsUUFBUSxHQUFDLFNBQVM7R0FDekIsQ0FBQTs7QUFFRCxNQUFJLFVBQVUsR0FBRyxBQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUU5RSxZQUFVLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxRQUFRLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUN0RCxTQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FDckIsSUFBSSxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ1gsUUFBSSxDQUFD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WUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDMUIsY0FBUSxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRTtBQUNuQyxXQUFLLEVBQUU7QUFDSCxnQkFBUSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQy9CLGdCQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLEFBQUMsQ0FBQztPQUNwRTtLQUNGLENBQUM7QUFDRixTQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNoQztDQUNGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cy52YXJzID0ge1xyXG4gIGhhc2g6ICc3ZTE2YjU1MjdjNzdlYTU4YmFjMzZkZGRkYTZmNWI0NDRmMzJlODFiJyxcclxuICBkb21haW46IFwiaHR0cHM6Ly9zZWNyZXQtZWFydGgtNTA5MzYuaGVyb2t1YXBwLmNvbS9cIixcclxuICAvLyBkb21haW46IFwiaHR0cDovL2xvY2FsaG9zdDozMDAyL1wiLFxyXG4gIGtvdHRhbnNSb29tOiB7XHJcbiAgICAvLyBpZCA6IFwiNTliMGYyOWJkNzM0MDhjZTRmNzRiMDZmXCIsXHJcbiAgICBhdmF0YXIgOiBcImh0dHBzOi8vYXZhdGFycy0wMi5naXR0ZXIuaW0vZ3JvdXAvaXYvMy81NzU0MmQyN2M0M2I4YzYwMTk3N2EwYjZcIlxyXG4gIH1cclxufTsiLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi9fY29uZmlnXCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVlc3QgPSAobGluaywgcG9zdFZhbHVlKSA9PiB7XHJcbiAgdmFyIHVybCA9ICgvaHR0cC8udGVzdChsaW5rKSkgPyBsaW5rIDogY29uZmlnLnZhcnMuZG9tYWluICsgbGluayArIGNvbmZpZy52YXJzLmhhc2g7XHJcbiAgbGV0IG9wdGlvbnMgPSB7IFxyXG4gICAgbWV0aG9kOiBcIlBPU1RcIiwgXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxyXG4gICAgYm9keTogXCJ2YWx1ZT1cIitwb3N0VmFsdWVcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2coISFwb3N0VmFsdWUpXHJcbiAgbGV0IHJlcXVlc3RPYmogPSAoISFwb3N0VmFsdWUpID8gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zKSA6IG5ldyBSZXF1ZXN0KHVybCk7XHJcblxyXG4gIHJlcXVlc3RPYmoudGltZW91dCA9IGxpbmsgPT09IFwibGF0ZXN0XCIgPyA1MDAwIDogNjAwMDA7XHJcbiAgcmV0dXJuIGZldGNoKHJlcXVlc3RPYmopXHJcbiAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICBpZiAoIXJlcy5vaykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXMuc3RhdHVzVGV4dClcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzLmpzb24oKVxyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgIH0pO1xyXG4gIH0gXHJcbiIsImNvbnN0IGNvdW50ZG93biAgICAgID0gcmVxdWlyZShcIi4vcGx1Z2lucy9fY291bnRkb3duXCIpO1xyXG4vLyBjb25zdCByZXF1ZXN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3JlcXVlc3QnKTtcclxuY29uc3QgcGFnZVN0YXRpc3RpY3MgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljc1wiKTtcclxuY29uc3QgcGFnZVRpbWVsaW5lICAgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2UtdGltZWxpbmVcIik7XHJcbmNvbnN0IHBhZ2VTZWFyY2ggICAgID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXNlYXJjaFwiKTtcclxuXHJcbmltcG9ydCAqIGFzIHNlYXJjaFBhZ2UgZnJvbSBcIi4vcmVuZGVyL19wYWdlLXNlYXJjaFwiO1xyXG5pbXBvcnQgKiBhcyBmaWx0ZXJzUGFnZSBmcm9tIFwiLi9yZW5kZXIvX3BhZ2UtZmlsdGVyc1wiO1xyXG5pbXBvcnQgeyByZXF1ZXN0IGFzIGdldE1lc3NhZ2VzICB9IGZyb20gXCIuL19yZXF1ZXN0LW5ld1wiO1xyXG5cclxuXHJcblxyXG5nZXRNZXNzYWdlcyhcImxhdGVzdFwiKS50aGVuKGluaXQpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAvLyBQYWdlIFRpbWVsaW5lXHJcbiAgZ2V0TWVzc2FnZXMoXCJmaW5pc2hlZEJ5VGFza3NcIikudGhlbihwYWdlVGltZWxpbmUuZHJhd1RpbWVsaW5lQ2hhcnQpO1xyXG4gIFxyXG4gIC8vUGFnZSBzZWFyY2ggZmluaXNoZWQgdGFza3NcclxuICBnZXRNZXNzYWdlcyhcImZpbmlzaGVkQnlTdHVkZW50c1wiKS50aGVuKHNlYXJjaFBhZ2UuaW5zZXJ0VGFza0xpc3RUb1BhZ2UpO1xyXG4gIFxyXG4gIC8vUGFnZSBzdGF0aXN0aWNzXHJcbiAgLy8gY291bnRkb3duLmluaXRUaW1lcigpO1xyXG4gIHBhZ2VTdGF0aXN0aWNzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcygpO1xyXG4gIGdldE1lc3NhZ2VzKFwibGVhcm5lcnNcIikudGhlbihwYWdlU3RhdGlzdGljcy5kcmF3Q291bnRPZlRhc2tzUGVyVXNlcl9WZXJ0aWNhbEJhcik7XHJcbiAgZ2V0TWVzc2FnZXMoXCJhY3Rpdml0eVwiKS50aGVuKHBhZ2VTdGF0aXN0aWNzLmRyYXdBY3Rpdml0eV9MaW5lQ2hhcnQpO1xyXG5cclxuICAvL1BhZ2UgZmlsdGVyc1xyXG4gIGxldCBjdXJyZW50RGF0ZSA9IChuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKS5zcGxpdCgnLScpLmpvaW4oJy4nKSk7XHJcbiAgLy8gY29uc29sZS5sb2cobmV3IERhdGUoKSlcclxuICBnZXRNZXNzYWdlcyhcInBlcmRhdGVcIiwgY3VycmVudERhdGUpLnRoZW4oZGF0YSA9PiBmaWx0ZXJzUGFnZS5kcmF3TWVzc2FnZXMoZGF0YSwgY3VycmVudERhdGUpKTtcclxuICBnZXRNZXNzYWdlcyhcImJ5RGF5XCIpLnRoZW4oZmlsdGVyc1BhZ2UuZHJhd0NhbGVuZGFyKTtcclxuXHJcbiAgZmlsdGVyc1BhZ2UucmVuZGVyVG90YWxNZWRpYVN1bW1hcnlCbG9jaygpO1xyXG4gIGdldE1lc3NhZ2VzKFwicGVydXNlclwiKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgZmlsdGVyc1BhZ2UuZHJhd1BpZUNoYXJ0KGRhdGEpOyBcclxuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpXHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbiIsIi8vQ09VTlRET1dOIFRJTUVSXHJcbi8vc2xpY2tjaXRjdWxhciBodHRwczovL3d3dy5qcXVlcnlzY3JpcHQubmV0L2RlbW8vU2xpY2stQ2lyY3VsYXItalF1ZXJ5LUNvdW50ZG93bi1QbHVnaW4tQ2xhc3N5LUNvdW50ZG93bi9cclxuXHJcbmV4cG9ydHMuaW5pdFRpbWVyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHRpbWVFbmQgPSBNYXRoLnJvdW5kKCAobmV3IERhdGUoXCIyMDE4LjAyLjEwXCIpLmdldFRpbWUoKSAtICQubm93KCkpIC8gMTAwMCk7XHJcbiAgICAgIHRpbWVFbmQgPSBNYXRoLmZsb29yKHRpbWVFbmQgLyA4NjQwMCkgKiA4NjQwMDtcclxuXHJcbiAgJCgnI2NvdW50ZG93bi1jb250YWluZXInKS5DbGFzc3lDb3VudGRvd24oe1xyXG4gICAgdGhlbWU6IFwid2hpdGVcIiwgXHJcbiAgICBlbmQ6ICQubm93KCkgKyB0aW1lRW5kLCAvL2VuZDogJC5ub3coKSArIDY0NTYwMCxcclxuICAgIG5vdzogJC5ub3coKSxcclxuICAgIC8vIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgZGF5cy9ob3Vycy9taW51dGVzL3NlY29uZHMgbGFiZWxzLlxyXG4gICAgbGFiZWxzOiB0cnVlLFxyXG4gICAgLy8gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIGRpZmZlcmVudCBsYW5ndWFnZSBwaHJhc2VzIGZvciBzYXlzL2hvdXJzL21pbnV0ZXMvc2Vjb25kcyBhcyB3ZWxsIGFzIHNwZWNpZmljIENTUyBzdHlsZXMuXHJcbiAgICBsYWJlbHNPcHRpb25zOiB7XHJcbiAgICAgIGxhbmc6IHtcclxuICAgICAgICBkYXlzOiAnRGF5cycsXHJcbiAgICAgICAgaG91cnM6ICdIb3VycycsXHJcbiAgICAgICAgbWludXRlczogJ01pbnV0ZXMnLFxyXG4gICAgICAgIHNlY29uZHM6ICdTZWNvbmRzJ1xyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZTogJ2ZvbnQtc2l6ZTogMC41ZW07J1xyXG4gICAgfSxcclxuICAgIC8vIGN1c3RvbSBzdHlsZSBmb3IgdGhlIGNvdW50ZG93blxyXG4gICAgc3R5bGU6IHtcclxuICAgICAgZWxlbWVudDogJycsXHJcbiAgICAgIGxhYmVsczogZmFsc2UsXHJcbiAgICAgIGRheXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyMxQUJDOUMnLC8vJ3JnYmEoMCwgMCwgMCwgMSknLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBob3Vyczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzI5ODBCOScsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIG1pbnV0ZXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyM4RTQ0QUQnLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBzZWNvbmRzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjRjM5QzEyJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsYmFjayB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGNvdW50ZG93biByZWFjaGVzIDAuXHJcbiAgICBvbkVuZENhbGxiYWNrOiBmdW5jdGlvbigpIHt9XHJcbiAgfSk7XHJcbn0iLCJleHBvcnRzLmJsb2NrcyA9IHtcclxuICBtZXNzYWdlc0NvdW50OiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvdW50LW1lc3NhZ2VzXCIpLFxyXG4gIHN0YXJyZWRSZXBvOiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnJlZC1yZXBvXCIpLFxyXG4gIGFjdGl2ZVVzZXJzQ291bnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXVzZXJzXCIpLFxyXG4gIGJsb2NrTGVhcm5lcnM6ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGVhcm5lcnNcIiksXHJcbiAgXHJcbn0gIiwiZXhwb3J0cy5teUZ1bmN0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gRGVjbGFyZSB2YXJpYWJsZXMgXHJcbiAgdmFyIGlucHV0LCBmaWx0ZXIsIHRhYmxlLCB0ciwgdGQsIGk7XHJcbiAgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXRcIik7XHJcbiAgZmlsdGVyID0gaW5wdXQudmFsdWUudG9VcHBlckNhc2UoKTtcclxuICB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTtcclxuICB0ciA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIik7XHJcblxyXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cywgYW5kIGhpZGUgdGhvc2Ugd2hvIGRvbid0IG1hdGNoIHRoZSBzZWFyY2ggcXVlcnlcclxuICBmb3IgKGkgPSAwOyBpIDwgdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIHRkID0gdHJbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZFwiKVswXTtcclxuICAgIGlmICh0ZCkge1xyXG4gICAgICBpZiAodGQuaW5uZXJIVE1MLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIpID4gLTEpIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0cy5zb3J0VGFibGUgPSBmdW5jdGlvbihuKSB7XHJcbiAgdmFyIHRhYmxlLCByb3dzLCBzd2l0Y2hpbmcsIGksIHgsIHksIHNob3VsZFN3aXRjaCwgZGlyLCBzd2l0Y2hjb3VudCA9IDA7XHJcbiAgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VGFibGVcIik7XHJcbiAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAvLyBTZXQgdGhlIHNvcnRpbmcgZGlyZWN0aW9uIHRvIGFzY2VuZGluZzpcclxuICBkaXIgPSBcImFzY1wiOyBcclxuICAvKiBNYWtlIGEgbG9vcCB0aGF0IHdpbGwgY29udGludWUgdW50aWxcclxuICBubyBzd2l0Y2hpbmcgaGFzIGJlZW4gZG9uZTogKi9cclxuICB3aGlsZSAoc3dpdGNoaW5nKSB7XHJcbiAgICAvLyBTdGFydCBieSBzYXlpbmc6IG5vIHN3aXRjaGluZyBpcyBkb25lOlxyXG4gICAgc3dpdGNoaW5nID0gZmFsc2U7XHJcbiAgICByb3dzID0gdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJUUlwiKTtcclxuICAgIC8qIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cyAoZXhjZXB0IHRoZVxyXG4gICAgZmlyc3QsIHdoaWNoIGNvbnRhaW5zIHRhYmxlIGhlYWRlcnMpOiAqL1xyXG4gICAgZm9yIChpID0gMTsgaSA8IChyb3dzLmxlbmd0aCAtIDEpOyBpKyspIHtcclxuICAgICAgLy8gU3RhcnQgYnkgc2F5aW5nIHRoZXJlIHNob3VsZCBiZSBubyBzd2l0Y2hpbmc6XHJcbiAgICAgIHNob3VsZFN3aXRjaCA9IGZhbHNlO1xyXG4gICAgICAvKiBHZXQgdGhlIHR3byBlbGVtZW50cyB5b3Ugd2FudCB0byBjb21wYXJlLFxyXG4gICAgICBvbmUgZnJvbSBjdXJyZW50IHJvdyBhbmQgb25lIGZyb20gdGhlIG5leHQ6ICovXHJcbiAgICAgIHggPSByb3dzW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVERcIilbbl07XHJcbiAgICAgIHkgPSByb3dzW2kgKyAxXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlREXCIpW25dO1xyXG4gICAgICAvKiBDaGVjayBpZiB0aGUgdHdvIHJvd3Mgc2hvdWxkIHN3aXRjaCBwbGFjZSxcclxuICAgICAgYmFzZWQgb24gdGhlIGRpcmVjdGlvbiwgYXNjIG9yIGRlc2M6ICovXHJcbiAgICAgIGlmIChkaXIgPT0gXCJhc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpID4geS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGRpciA9PSBcImRlc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpIDwgeS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoc2hvdWxkU3dpdGNoKSB7XHJcbiAgICAgIC8qIElmIGEgc3dpdGNoIGhhcyBiZWVuIG1hcmtlZCwgbWFrZSB0aGUgc3dpdGNoXHJcbiAgICAgIGFuZCBtYXJrIHRoYXQgYSBzd2l0Y2ggaGFzIGJlZW4gZG9uZTogKi9cclxuICAgICAgcm93c1tpXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyb3dzW2kgKyAxXSwgcm93c1tpXSk7XHJcbiAgICAgIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgICAgIC8vIEVhY2ggdGltZSBhIHN3aXRjaCBpcyBkb25lLCBpbmNyZWFzZSB0aGlzIGNvdW50IGJ5IDE6XHJcbiAgICAgIHN3aXRjaGNvdW50ICsrOyBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8qIElmIG5vIHN3aXRjaGluZyBoYXMgYmVlbiBkb25lIEFORCB0aGUgZGlyZWN0aW9uIGlzIFwiYXNjXCIsXHJcbiAgICAgIHNldCB0aGUgZGlyZWN0aW9uIHRvIFwiZGVzY1wiIGFuZCBydW4gdGhlIHdoaWxlIGxvb3AgYWdhaW4uICovXHJcbiAgICAgIGlmIChzd2l0Y2hjb3VudCA9PSAwICYmIGRpciA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgZGlyID0gXCJkZXNjXCI7XHJcbiAgICAgICAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsImltcG9ydCB7IHJlcXVlc3QgYXMgZ2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vX3JlcXVlc3QtbmV3XCI7XHJcblxyXG5jb25zdCBjYXJvdXNlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYmxvY2stZGF0ZS1zY3JvbGxcIik7XHJcbmNvbnN0IG1haW5NZXNzYWdlc0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2VudGVyLW1lc3NhZ2VzLWNvbnRlbnRcIik7XHJcbmNvbnN0IG1haW5NZXNzYWdlc1dyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1lc3NhZ2VzLXdyYXBwZXJcIik7XHJcblxyXG5jb25zdCBtYWluU2VhcmNoSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNlYXJjaC1ieS13dHdyXCIpO1xyXG5jb25zdCB1c2VybmFtZVNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2gtYnktdXNlcm5hbWVcIik7XHJcbmNvbnN0IHVzZXJuYW1lQXV0b2NvbXBsZXRlQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lYXN5LWF1dG9jb21wbGV0ZS1jb250YWluZXJcIik7XHJcbmNvbnN0IGZpbHRlcnNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJ1dHRvbi1maWx0ZXJzXCIpO1xyXG5jb25zdCBzaWdudXBCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2lnbnVwXCIpO1xyXG5jb25zdCBmYXZvcml0ZXNCbG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZmF2b3JpdGVzLXdyYXBwZXJcIik7XHJcbmNvbnN0IGZhdm9yaXRlc0Jsb2NrVGl0bGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZhdm9yaXRlcy10aXRsZVwiKTtcclxuY29uc3QgZmF2b3JpdGVXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZhdm9yaXRlcy1zZWN0aW9uXCIpO1xyXG5jb25zdCBzYXZlZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2F2ZWQtbWVzc2FnZXMtY29udGFpbmVyXCIpO1xyXG5jb25zdCBkb25lQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kb25lLW1lc3NhZ2VzLWNvbnRhaW5lclwiKTtcclxuY29uc3QgRU5URVIgPSAxMztcclxuY29uc3QgbGVmdFNpZGViYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxlZnQtc2lkZWJhclwiKTtcclxuY29uc3QgbGVmdFNpZGViYXJPcGVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vcGVuXCIpO1xyXG5jb25zdCBsZWZ0U2lkZWJhckNsb3NlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbG9zZVwiKTtcclxuXHJcbmxldCBhbGxvd1R3aXR0ZXJQcmV2aWV3ID0gZmFsc2U7XHJcbmxldCBhbGxvd1lvdXR1YmVQcmV2aWV3ID0gZmFsc2U7XHJcblxyXG5sZXQgdXNlckNyZWRlbnRpYWxzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZmF2b3JpdGVzJykpO1xyXG5pZih1c2VyQ3JlZGVudGlhbHMgJiYgdXNlckNyZWRlbnRpYWxzLmVtYWlsKSB7XHJcbiAgbGV0IHVzZXJuYW1lID0gdXNlckNyZWRlbnRpYWxzLmVtYWlsLnNwbGl0KCdAJylbMF07XHJcbiAgZmF2b3JpdGVzQmxvY2tUaXRsZS5pbm5lckhUTUwgPSBcclxuICAgICAgICBgSGVsbG8gJHt1c2VybmFtZX0hIDxhIGNsYXNzPVwic2lnbm91dC1idXR0b25cIj5TaWduIG91dCE8L2E+YDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGUoc2VudCwgc3BsaXR0ZXIpIHtcclxuICB2YXIgZGF0ZVNlbnRGb3JtYXR0ZWQgPVxyXG4gICAgc2VudC5nZXRGdWxsWWVhcigpICtcclxuICAgIHNwbGl0dGVyICtcclxuICAgIChcIjBcIiArIChzZW50LmdldE1vbnRoKCkgKyAxKSkuc2xpY2UoLTIpICtcclxuICAgIHNwbGl0dGVyICtcclxuICAgIChcIjBcIiArIHNlbnQuZ2V0RGF0ZSgpKS5zbGljZSgtMikgK1xyXG4gICAgXCIgXCIgK1xyXG4gICAgKFwiMFwiICsgc2VudC5nZXRIb3VycygpKS5zbGljZSgtMikgK1xyXG4gICAgXCI6XCIgK1xyXG4gICAgKFwiMFwiICsgc2VudC5nZXRNaW51dGVzKCkpLnNsaWNlKC0yKTtcclxuICByZXR1cm4gZGF0ZVNlbnRGb3JtYXR0ZWQ7XHJcbn1cclxuXHJcbi8vaW5pdCBlbW9qaSBmb3JtYXR0ZXJcclxuLy9odHRwczovL2dpdGh1Yi5jb20vaWFtY2FsL2pzLWVtb2ppXHJcbmxldCBlbW9qaSA9IG51bGw7XHJcbmNvbnN0IGNhbGxiYWNrID0gKHZhbHVlKSA9PiB7IGVtb2ppID0gdmFsdWU7IH07XHJcbmNvbnN0IGluaXRFbW9qaSA9IChjYWxsYmFjaykgPT4ge1xyXG4gIGNvbnN0IGVtb2ppID0gbmV3IEVtb2ppQ29udmVydG9yKCk7XHJcbiAgZW1vamkuaW5jbHVkZV90aXRsZSA9IHRydWU7XHJcbiAgY29uc3QgcGF0aCA9ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vaWFtY2FsL2Vtb2ppLWRhdGEvbWFzdGVyL2ltZy1hcHBsZS02NC8nO1xyXG4gIFxyXG4gIGZldGNoKHBhdGgrJzFmNDRkLnBuZycpIC8vY2hlY2sgaWYgaXMgY29ubmVjdGlvbiB0byBnaXRodWIgb25saW5lIGVtb2ppXHJcbiAgLnRoZW4ocmVzcG9uc2UgPT4gIHtcclxuICAgIGlmKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIGVtb2ppLmltZ19zZXRzLmFwcGxlLnBhdGggPSBwYXRoO1xyXG4gICAgICBjYWxsYmFjayhlbW9qaSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbW9qaS51c2Vfc2hlZXQgPSB0cnVlO1xyXG4gICAgICBlbW9qaS5pbWdfc2V0cy5hcHBsZS5zaGVldCA9ICdsaWJzL2pzLWVtb2ppL3NoZWV0X2FwcGxlXzE2LnBuZyc7XHJcbiAgICAgIGNhbGxiYWNrKGVtb2ppKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuaW5pdEVtb2ppKGNhbGxiYWNrKTtcclxuXHJcblxyXG5jb25zdCB0d2l0dGVyRm9ybWF0dGVyID0gKHVybCkgPT4ge1xyXG4gIGlmKC90d2l0dGVyL2lnLnRlc3QodXJsKSl7XHJcbiAgICAvL2h0dHBzOi8vdHdpdGZyYW1lLmNvbS8jc2l6aW5nXHJcbiAgICByZXR1cm4gYDxpZnJhbWUgYm9yZGVyPTAgZnJhbWVib3JkZXI9MCBoZWlnaHQ9MzAwIHdpZHRoPTU1MCBcclxuICAgICAgc3JjPVwiaHR0cHM6Ly90d2l0ZnJhbWUuY29tL3Nob3c/dXJsPSR7ZW5jb2RlVVJJKHVybC50cmltKCkuc3Vic3RyaW5nKDcsIHVybC5sZW5ndGgpKX1cIj48L2lmcmFtZT5gO1xyXG4gIH0gZWxzZSB7cmV0dXJuICcnO31cclxufVxyXG5cclxuY29uc3QgeW91dHViZUZvcm1hdHRlciA9ICh1cmwpID0+IHtcclxuICBsZXQgeXR1cmwgPSAvKD86aHR0cHM/OlxcL1xcLyk/KD86d3d3XFwuKT8oPzp5b3V0dWJlXFwuY29tfHlvdXR1XFwuYmUpXFwvKD86d2F0Y2hcXD92PSk/KFtcXHdcXC1dezEwLDEyfSkoPzomZmVhdHVyZT1yZWxhdGVkKT8oPzpbXFx3XFwtXXswfSk/L2c7XHJcbiAgbGV0IGlmcmFtZVN0cmluZyA9ICc8aWZyYW1lIHdpZHRoPVwiNDIwXCIgaGVpZ2h0PVwiMzQ1XCIgc3JjPVwiaHR0cDovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8kMVwiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nO1xyXG4gIGlmKHl0dXJsLnRlc3QodXJsKSl7XHJcbiAgICAvL3RyeSB0byBnZW5lcmF0ZSB0aHVtYm5haWxzXHJcbiAgICAvLyByZXR1cm4gYDxicj48aW1nIHNyYz1cIiR7WW91dHViZS50aHVtYih1cmwpfVwiIHRpdGxlPVwieW91dHViZSB0aHVtYm5haWxcIj5gO1xyXG4gICAgbGV0IHl0SWZyYW1lID0gdXJsLnJlcGxhY2UoeXR1cmwsIGlmcmFtZVN0cmluZyk7XHJcbiAgICByZXR1cm4geXRJZnJhbWUuc3Vic3RyaW5nKDYsIHl0SWZyYW1lLmxlbmd0aCk7XHJcbiAgfSBlbHNlIHtyZXR1cm4gJyc7fVxyXG59XHJcblxyXG4vL2h0dHA6Ly9qc2ZpZGRsZS5uZXQvOFRhUzgvNi8gZXh0cmFjdCB0aHVtYm5haWxzIFxyXG52YXIgWW91dHViZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG4gIHZhciB2aWRlbywgcmVzdWx0cztcclxuICB2YXIgZ2V0VGh1bWIgPSBmdW5jdGlvbiAodXJsLCBzaXplKSB7XHJcbiAgICAgIGlmICh1cmwgPT09IG51bGwpIHtcclxuICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgfVxyXG4gICAgICBzaXplID0gKHNpemUgPT09IG51bGwpID8gJ2JpZycgOiBzaXplO1xyXG4gICAgICAvLyBsZXQgeXR1cmwgPSAvKD86aHR0cHM/OlxcL1xcLyk/KD86d3d3XFwuKT8oPzp5b3V0dWJlXFwuY29tfHlvdXR1XFwuYmUpXFwvKD86d2F0Y2hcXD92PSk/KFtcXHdcXC1dezEwLDEyfSkoPzomZmVhdHVyZT1yZWxhdGVkKT8oPzpbXFx3XFwtXXswfSk/L2c7XHJcbiAgICAgIHJlc3VsdHMgPSB1cmwubWF0Y2goJ1tcXFxcPyZddj0oW14mI10qKScpO1xyXG4gICAgICB2aWRlbyA9IChyZXN1bHRzID09PSBudWxsKSA/IHVybCA6IHJlc3VsdHNbMV07XHJcbiAgICAgIGlmIChzaXplID09PSAnc21hbGwnKSB7XHJcbiAgICAgICAgICByZXR1cm4gJ2h0dHA6Ly9pbWcueW91dHViZS5jb20vdmkvJyArIHZpZGVvICsgJy8yLmpwZyc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuICdodHRwOi8vaW1nLnlvdXR1YmUuY29tL3ZpLycgKyB2aWRlbyArICcvMC5qcGcnO1xyXG4gIH07XHJcbiAgcmV0dXJuIHtcclxuICAgICAgdGh1bWI6IGdldFRodW1iXHJcbiAgfTtcclxufSgpKTtcclxuXHJcblxyXG5jb25zdCBtYXJrU2VhcmNoZWRWYWx1ZXNJbkh0bWwgPSAobWVzc2FnZUh0bWwsIHBvc3RWYWx1ZSkgPT4ge1xyXG4gIGxldCB5dElmcmFtZSA9ICcnO1xyXG4gIGxldCB0d2l0dGVySWZyYW1lID0gJyc7XHJcbiAgbGV0IHJlcGxhY2VkVmFsdWUgPSBgPGI+PG1hcms+JHtwb3N0VmFsdWV9PC9tYXJrPjwvYj5gO1xyXG4gIC8vcmVkcmF3IGFsbFxyXG4gIGlmKHBvc3RWYWx1ZSAmJiBwb3N0VmFsdWUgIT0gJ3NyYycpIHtcclxuICAgIGxldCByZWdleHRlbXAgPSBwb3N0VmFsdWUucmVwbGFjZSgvXFwuL2lnLCBcIlxcXFxcXC5cIik7XHJcbiAgICBtZXNzYWdlSHRtbCA9IG1lc3NhZ2VIdG1sLnJlcGxhY2UobmV3IFJlZ0V4cChyZWdleHRlbXAsICdpZycpLCByZXBsYWNlZFZhbHVlKTtcclxuICB9XHJcbiAgLy9zZWFyY2ggZm9yIHdoYXRldmVyIHVybHNcclxuICBsZXQgdXJscyA9IG1lc3NhZ2VIdG1sLm1hdGNoKC9ocmVmPVwiKC4qPylcIi9nKTsgIFxyXG4gIGxldCBjbGVhbmVkSHRtbCA9IG1lc3NhZ2VIdG1sO1xyXG4gIGlmKHVybHMpIHtcclxuICAgIHVybHMuZm9yRWFjaCh1cmwgPT4ge1xyXG4gICAgICBpZihhbGxvd1R3aXR0ZXJQcmV2aWV3KVxyXG4gICAgICAgIHR3aXR0ZXJJZnJhbWUgPSB0d2l0dGVyRm9ybWF0dGVyKHVybCk7XHJcbiAgICAgIGlmKGFsbG93WW91dHViZVByZXZpZXcpXHJcbiAgICAgICAgeXRJZnJhbWUgPSB5b3V0dWJlRm9ybWF0dGVyKHVybCk7XHJcbiAgICAgIGxldCBuZXdVcmwgPSB1cmwuc3BsaXQocmVwbGFjZWRWYWx1ZSkuam9pbihwb3N0VmFsdWUpO1xyXG4gICAgICBjbGVhbmVkSHRtbCA9IGNsZWFuZWRIdG1sLnNwbGl0KHVybCkuam9pbihuZXdVcmwpXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBjbGVhbmVkSHRtbCt5dElmcmFtZSt0d2l0dGVySWZyYW1lO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBtZXNzYWdlSHRtbCt5dElmcmFtZSt0d2l0dGVySWZyYW1lO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRyYXdNZXNzYWdlcyA9IChkYXRhLCBwb3N0VmFsdWUsIGNvbnRhaW5lcikgPT4ge1xyXG4gIGxldCBtZXNzYWdlc0NvbnRhaW5lcjtcclxuICBpZihjb250YWluZXIpIHtcclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gIH1lbHNlIHtcclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyID0gbWFpbk1lc3NhZ2VzQ29udGFpbmVyO1xyXG4gIH1cclxuICBtZXNzYWdlc0NvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMDtcclxuICBsZXQgaHRtbCA9IFwiXCI7XHJcbiAgbGV0IG9wZW4gPSBcIlwiO1xyXG4gIC8vIGNvbnNvbGUubG9nKHBvc3RWYWx1ZSlcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICBpZiAoZGF0YSAmJiBkYXRhWzBdID09IHVuZGVmaW5lZCkge1xyXG4gICAgcG9zdFZhbHVlID0gcG9zdFZhbHVlID8gYHdpdGggd29yZCA8Yj4ke3Bvc3RWYWx1ZX08L2I+YCA6ICcnO1xyXG4gICAgaHRtbCArPSBgPGRpdj48Y2VudGVyPjxoMz5ObyBtZXNzYWdlcyAke3Bvc3RWYWx1ZX08L2gzPjwvY2VudGVyPjwvZGl2PmA7XHJcbiAgICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xyXG4gICAgbWVzc2FnZXNDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIG9wZW4gPSBcIm9wZW5cIjtcclxuICBodG1sICs9IGBcclxuICAgICAgPGRpdiBjbGFzcz1cImRheS10aXRsZVwiPlxyXG4gICAgICAgIEZvdW5kIDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiBtZXNzYWdlcyBmb3IgPGI+JHtwb3N0VmFsdWV9PC9iPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIGA7IFxyXG4gIGRhdGEuZm9yRWFjaChtZXNzYWdlID0+IHtcclxuICAgIGh0bWwgKz0gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2Utd3JhcHBlclwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1lc3NhZ2UtZGF0ZS1zZW50XCI+XHJcbiAgICAgICAgICAgICAgJHtmb3JtYXREYXRlKG5ldyBEYXRlKG1lc3NhZ2Uuc2VudCksIFwiLlwiKX1cclxuICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVzc2FnZS1hdmF0YXIgdG9vbHRpcFwiPlxyXG4gICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwiYXZhdGFyIFwiIHNyYz1cIiR7bWVzc2FnZS5hdmF0YXJVcmx9XCI+XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvb2x0aXB0ZXh0XCI+XHJcbiAgICAgICAgICAgICAgICA8aW1nIGNsYXNzPVwidG9vbHRpcC1hdmF0YXJcIiBzcmM9XCIkeyBtZXNzYWdlLmF2YXRhclVybE1lZGl1bSB9XCI+XHJcbiAgICAgICAgICAgICAgICA8YSB0aXRsZT1cInNlYXJjaCBtZW50aW9ucyBieSAkeyBtZXNzYWdlLnVzZXJuYW1lfVwiIGNsYXNzPVwidGl0bGUgbWVzc2FnZS11c2VybmFtZVwiPiR7IG1lc3NhZ2UudXNlcm5hbWV9PC9hPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJtZGwtYnV0dG9uIG1kbC1qcy1idXR0b24gbWRsLWJ1dHRvbi0tcmFpc2VkIG1kbC1qcy1yaXBwbGUtZWZmZWN0XCIgdGFyZ2V0PVwiX2JsYW5rXCIgdGl0bGU9XCJnbyB0byAke1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZS51c2VybmFtZVxyXG4gICAgICAgICAgICAgIH0gZ2l0aHViIHJlcG9cIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tJHttZXNzYWdlLnVybH1cIj5PcGVuIHByb2ZpbGU8L2E+XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0ZXh0LXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgICA8YSB0aXRsZT1cInNlYXJjaCBtZW50aW9ucyBieSAkeyBtZXNzYWdlLnVzZXJuYW1lfVwiIGNsYXNzPVwibWVzc2FnZS11c2VybmFtZVwiPlxyXG4gICAgICAgICAgICAgICAgJHsgbWVzc2FnZS51c2VybmFtZX1cclxuICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2UtbWFya3VwXCI+XHJcbiAgICAgICAgICAgICAgICAke21hcmtTZWFyY2hlZFZhbHVlc0luSHRtbChtZXNzYWdlLmh0bWwsIHBvc3RWYWx1ZSl9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgY2xhc3M9XCIke2NvbnRhaW5lciA/IFwiZGVsLWZyb20tZmF2b3JpdGVzLWJ1dHRvblwiIDogXCJhZGQtdG8tZmF2b3JpdGVzLWJ1dHRvblwifVwiID5cclxuICAgICAgICAgICAgICAgIDwhLS0gPGkgaWQ9XCIke21lc3NhZ2UubWVzc2FnZUlkfVwiICR7Y29udGFpbmVyID8gYGNsYXNzPVwiZmEgZmEtdHJhc2gtb1wiIHRpdGxlPVwiZGVsZXRlIGZyb20gZmF2b3JpdGVzXCJgIDogYGNsYXNzPVwiZmEgZmEtcGx1c1wiIHRpdGxlPVwiYWRkIHRvIGZhdm9yaXRlc1wiYH0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiAtLT5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiBjbGFzcz1cIiR7Y29udGFpbmVyID8gbWVzc2FnZS5jaGVja2VkID8gXCJkb25lLWZhdm9yaXRlcy1idXR0b25cIiA6IFwiY2hlY2stZmF2b3JpdGVzLWJ1dHRvblwiIDogXCJoaWRlLWJ1dHRvblwifVwiID5cclxuICAgICAgICAgICAgICA8IS0tIDxpIGlkPVwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiBjbGFzcz1cImZhICR7Y29udGFpbmVyID8gbWVzc2FnZS5jaGVja2VkID8gXCJmYS1jaGVjay1zcXVhcmUtb1wiIDogXCJmYS1zcXVhcmUtb1wiIDogIFwiZmEtc3F1YXJlLW9cIn1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IC0tPlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PmA7XHJcbiAgfSk7XHJcbiAgaHRtbCA9IGVtb2ppLnJlcGxhY2VfY29sb25zKGh0bWwpO1xyXG4gIG1lc3NhZ2VzQ29udGFpbmVyLmlubmVySFRNTCA9IGh0bWw7XHJcbiAgXHJcbiAgLy8gSU5JVCBISUdITElHSFQuSlMgRk9SIENPREUgQkxPQ0tTIElOIE1FU1NBR0VTXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwicHJlIGNvZGVcIikuZWFjaChmdW5jdGlvbihpLCBibG9jaykge1xyXG4gICAgICBobGpzLmhpZ2hsaWdodEJsb2NrKGJsb2NrKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBtZXNzYWdlc0NvbnRhaW5lci5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgIH0sIDEwMCk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZHJhd0NhbGVuZGFyID0gYWN0aXZpdHlBcnIgPT4ge1xyXG4gIGxldCBidWlsZGVkQXJyID0gW107XHJcbiAgLy8gY29uc29sZS5sb2coYWN0aXZpdHlBcnJbMF0pXHJcbiAgYWN0aXZpdHlBcnIuZm9yRWFjaChmdW5jdGlvbihkYXlPYmopIHtcclxuICAgIGlmIChkYXlPYmouX2lkICE9PSBudWxsKSB7XHJcbiAgICAgIGxldCBkYXRlU3RyaW5nID0gZGF5T2JqLl9pZC5zcGxpdCgnLicpLmpvaW4oJy0nKTtcclxuICAgICAgYnVpbGRlZEFyci5wdXNoKHtcclxuICAgICAgICBkYXRlOiBkYXRlU3RyaW5nLFxyXG4gICAgICAgIGJhZGdlOiBmYWxzZSxcclxuICAgICAgICB0aXRsZTogYCR7ZGF5T2JqLmNvdW50fSBtZXNzYWdlc2AsXHJcbiAgICAgICAgY2xhc3NuYW1lOiBgZGF5LWJsb2NrLSR7ZGF5T2JqLmNvdW50ID4gMTAwID8gMTEwIDogZGF5T2JqLmNvdW50fWBcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgLy8gY29uc29sZS5sb2coYnVpbGRlZEFycilcclxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQoXCIjbXktY2FsZW5kYXJcIikuemFidXRvX2NhbGVuZGFyKHtcclxuICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gbXlEYXRlRnVuY3Rpb24odGhpcy5pZCwgZmFsc2UpO1xyXG4gICAgICB9LFxyXG4gICAgICBkYXRhOiBidWlsZGVkQXJyLCAvL2V2ZW50RGF0YSxcclxuICAgICAgbW9kYWw6IGZhbHNlLFxyXG4gICAgICBsZWdlbmQ6IFtcclxuICAgICAgICB7IHR5cGU6IFwidGV4dFwiLCBsYWJlbDogXCJsZXNzIDEwXCIgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0eXBlOiBcImxpc3RcIixcclxuICAgICAgICAgIGxpc3Q6IFtcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stMjBcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stMzVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stNDVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stNjVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stNzVcIixcclxuICAgICAgICAgICAgXCJkYXktYmxvY2stOTVcIlxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeyB0eXBlOiBcInRleHRcIiwgbGFiZWw6IFwibW9yZSAxMDBcIiB9XHJcbiAgICAgIF0sXHJcbiAgICAgIGNlbGxfYm9yZGVyOiB0cnVlLFxyXG4gICAgICB5ZWFyOiAyMDE4LFxyXG4gICAgICBtb250aCAgOiAyLCAvLyBQdXQgdGhlIG51bWJlciBvZiB0aGUgbW9udGggeW91IHdhbnQgdG8gc3RhcnQgd2l0aFxyXG4gICAgICAvLyB0b2RheTogdHJ1ZSxcclxuICAgICAgbmF2X2ljb246IHtcclxuICAgICAgICBwcmV2OiAnPGkgY2xhc3M9XCJmYSBmYS1jaGV2cm9uLWNpcmNsZS1sZWZ0XCI+PC9pPicsXHJcbiAgICAgICAgbmV4dDogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1jaXJjbGUtcmlnaHRcIj48L2k+J1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIG15RGF0ZUZ1bmN0aW9uKGlkLCBmcm9tTW9kYWwpIHtcclxuICB2YXIgZGF0ZSA9ICQoXCIjXCIgKyBpZCkuZGF0YShcImRhdGVcIik7XHJcbiAgZGF0ZSA9IGRhdGUuc3BsaXQoJy0nKS5qb2luKCcuJyk7XHJcbiAgdmFyIGhhc0V2ZW50ID0gJChcIiNcIiArIGlkKS5kYXRhKFwiaGFzRXZlbnRcIik7XHJcbiAgLy8gY29uc29sZS5sb2coZGF0ZSlcclxuICBnZXRNZXNzYWdlcyhcInBlcmRhdGVcIiwgZGF0ZSkudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCBkYXRlKSk7XHJcbn1cclxuXHJcblxyXG5sZWZ0U2lkZWJhck9wZW4uc2Nyb2xsVG9wID0gbGVmdFNpZGViYXJPcGVuLnNjcm9sbEhlaWdodDtcclxubGVmdFNpZGViYXJPcGVuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgaWYobGVmdFNpZGViYXIuc3R5bGUubWFyZ2luTGVmdCAhPSBcIjBweFwiKXtcclxuXHJcbiAgICBsZWZ0U2lkZWJhci5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIwcHhcIjtcclxuICAgIGxlZnRTaWRlYmFyT3Blbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBtYWluTWVzc2FnZXNXcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGxlZnRTaWRlYmFyQ2xvc2Uuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB9XHJcbn0pO1xyXG5cclxubGVmdFNpZGViYXJDbG9zZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmKGxlZnRTaWRlYmFyLnN0eWxlLm1hcmdpbkxlZnQgPT0gXCIwcHhcIil7XHJcbiAgICBsZWZ0U2lkZWJhci5zdHlsZS5tYXJnaW5MZWZ0ID0gXCItMTAwJVwiO1xyXG4gICAgbGVmdFNpZGViYXJPcGVuLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBtYWluTWVzc2FnZXNXcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5cclxubWFpblNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xyXG4gIGxldCBwb3N0VmFsdWUgPSBlLnRhcmdldC52YWx1ZS50cmltKCk7XHJcbiAgaWYgKGUua2V5Q29kZSA9PSBFTlRFUikge1xyXG4gICAgKCEhcG9zdFZhbHVlKSAmJiBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCBwb3N0VmFsdWUpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0VmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcclxuXHJcbnVzZXJuYW1lU2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XHJcbiAgbGV0IHBvc3RWYWx1ZSA9IGUudGFyZ2V0LnZhbHVlLnRyaW0oKTtcclxuICBpZiAoZS5rZXlDb2RlID09IEVOVEVSKSB7XHJcbiAgICAoISFwb3N0VmFsdWUpICYmIGdldE1lc3NhZ2VzKFwic2VhcmNoVXNlcm5hbWVcIiwgcG9zdFZhbHVlKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFZhbHVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG4vL2h0dHA6Ly9lYXN5YXV0b2NvbXBsZXRlLmNvbS9ndWlkZSNzZWMtZnVuY3Rpb25zXHJcbmdldE1lc3NhZ2VzKFwiYXV0aG9yc1wiKS50aGVuKGRhdGEgPT4ge1xyXG4gIHZhciBvcHRpb25zID0ge1xyXG4gICAgZGF0YTogZGF0YSxcclxuICAgIGxpc3Q6IHtcclxuICAgICAgbWF0Y2g6IHtcclxuICAgICAgICBlbmFibGVkOiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIG9uQ2xpY2tFdmVudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IHBvc3RWYWx1ZSA9ICQoXCIuc2VhcmNoLWJ5LXVzZXJuYW1lXCIpLmdldFNlbGVjdGVkSXRlbURhdGEoKTtcclxuICAgICAgICBnZXRNZXNzYWdlcyhcInNlYXJjaFVzZXJuYW1lXCIsIHBvc3RWYWx1ZSkudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgIGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0VmFsdWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9LFxyXG5cclxuICAgIH1cclxuICB9O1xyXG4gICQoXCIuc2VhcmNoLWJ5LXVzZXJuYW1lXCIpLmVhc3lBdXRvY29tcGxldGUob3B0aW9ucyk7XHJcbn0pO1xyXG5cclxuXHJcbnNpZ251cEJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGNvbnNvbGUubG9nKGUudGFyZ2V0KVxyXG4gIGxldCBlbWFpbCA9IGUudGFyZ2V0WycwJ10udmFsdWU7XHJcbiAgaWYoZW1haWwgJiYgZW1haWwgIT0gJycpIHtcclxuICAgIHNpZ251cEJsb2NrLmlubmVySFRNTCA9IGA8Y2VudGVyPjxoND5UaGFua3MhPC9oND48L2NlbnRlcj5gO1xyXG4gICAgdXNlckNyZWRlbnRpYWxzID0gIHsgZW1haWw6IGVtYWlsIH07XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmF2b3JpdGVzJywgSlNPTi5zdHJpbmdpZnkodXNlckNyZWRlbnRpYWxzKSk7XHJcbiAgICAvLyB1c2VyQ3JlZGVudGlhbHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZmF2b3JpdGVzJyk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgbGV0IHVzZXJuYW1lID0gZW1haWwuc3BsaXQoJ0AnKVswXTtcclxuICAgICAgZmF2b3JpdGVzQmxvY2tUaXRsZS5pbm5lckhUTUwgPSBcclxuICAgICAgICBgSGVsbG8gJHt1c2VybmFtZX0hIDxhIGNsYXNzPVwic2lnbm91dC1idXR0b25cIj5TaWduIG91dCE8L2E+YDtcclxuXHJcbiAgICAgIFxyXG4gICAgICBzaWdudXBCbG9jay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfSwgMTAwMCk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5tYWluTWVzc2FnZXNDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBjb25zb2xlLmxvZyhlLnRhcmdldClcclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtZXNzYWdlLWRhdGUtc2VudFwiKSl7XHJcbiAgICBsZXQgcG9zdERhdGUgPSBlLnRhcmdldC50ZXh0Q29udGVudC50cmltKCkuc3Vic3RyaW5nKDAsMTApO1xyXG4gICAgZ2V0TWVzc2FnZXMoXCJwZXJkYXRlXCIsIHBvc3REYXRlKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3REYXRlKSk7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJtZXNzYWdlLXVzZXJuYW1lXCIpKXtcclxuICAgIGxldCBwb3N0VXNlcm5hbWUgPSBlLnRhcmdldC50ZXh0Q29udGVudC50cmltKCk7XHJcbiAgICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCBwb3N0VXNlcm5hbWUpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFVzZXJuYW1lKSk7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJhZGQtdG8tZmF2b3JpdGVzLWJ1dHRvblwiKSl7XHJcbiAgICBjaGFuZ2VNZXNzYWdlU3RhdGVUbyhlLCAnc2F2ZVRvRmF2b3JpdGVzJyk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5jb25zdCBjaGFuZ2VNZXNzYWdlU3RhdGVUbyA9IChlLCBzYXZlVG9Db21tYW5kKSA9PiB7XHJcbiAgaWYoIXVzZXJDcmVkZW50aWFscykge1xyXG4gICAgc2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbGV0IHBvc3RNZXNzYWdlSWQgPSBlLnRhcmdldC5pZC50cmltKCk7XHJcbiAgICAvL3dvcmtzXHJcbiAgICBnZXRNZXNzYWdlcyhcImZpbmRieUlkXCIsIHBvc3RNZXNzYWdlSWQpLnRoZW4obWVzc2FnZSA9PiB7XHJcbiAgICAgIGxldCBwb3N0VmFsdWUgPSB7XHJcbiAgICAgICAgb3duZXI6IHVzZXJDcmVkZW50aWFscy5lbWFpbCxcclxuICAgICAgICBtZXNzYWdlSWQ6IG1lc3NhZ2UubWVzc2FnZUlkXHJcbiAgICAgIH1cclxuICAgICAgLy93b3Jrc1xyXG4gICAgICBnZXRNZXNzYWdlcyhzYXZlVG9Db21tYW5kLCBKU09OLnN0cmluZ2lmeShwb3N0VmFsdWUpKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3NhdmV0b2Zhdm9yaXRlcycsIGRhdGEpXHJcbiAgICAgICAgbGV0IGFuc3dlciA9IChkYXRhID09ICdBbHJlYWR5IGV4aXN0JykgPyBkYXRhIDogJ0FkZGVkJztcclxuICAgICAgICBzaWdudXBCbG9jay5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgIHNpZ251cEJsb2NrLmlubmVySFRNTCA9IGA8Y2VudGVyPjxoND4ke2Fuc3dlcn08L2g0PjwvY2VudGVyPmA7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7c2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO30sIDEwMDApO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmZhdm9yaXRlc0Jsb2NrLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2lnbnVwLWJ1dHRvblwiKSl7IFxyXG4gICAgc2lnbnVwQmxvY2suY2xhc3NMaXN0LmFkZCgnZGlzcGxheS1zaWduLWJsb2NrJyk7XHJcbiAgfVxyXG5cclxuICBpZihlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaWdub3V0LWJ1dHRvblwiKSl7IFxyXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2Zhdm9yaXRlcycpO1xyXG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gIH1cclxuICBpZihlLnRhcmdldC5pZCA9PSBcInZpZXctZmF2b3JpdGVzLWJ1dHRvblwiIHx8IGUudGFyZ2V0Lm9mZnNldFBhcmVudC5pZCA9PSBcInZpZXctZmF2b3JpdGVzLWJ1dHRvblwiKXsgXHJcbiAgICBpZighdXNlckNyZWRlbnRpYWxzKXtcclxuICAgICAgc2lnbnVwQmxvY2suY2xhc3NMaXN0LmFkZCgnZGlzcGxheS1zaWduLWJsb2NrJyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgLy93b3Jrc1xyXG4gICAgICBkcmF3RmF2b3JpdGVzKHVzZXJDcmVkZW50aWFscy5lbWFpbCk7XHJcbiAgICAgIGZhdm9yaXRlV2luZG93LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5jb25zdCBkcmF3RmF2b3JpdGVzID0gKGVtYWlsKSA9PiB7XHJcbiAgZ2V0TWVzc2FnZXMoJ2ZhdmdldEJ5Q3JlZCcsIGVtYWlsKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ2RhdGEnLCBkYXRhKVxyXG4gICAgaWYoZGF0YS5sZW5ndGgpIHtcclxuICAgICAgbGV0IGNoZWNrZWQgPSBkYXRhLmZpbHRlcihtID0+IG0uY2hlY2tlZCk7XHJcbiAgICAgIGxldCB1bmNoZWNrZWQgPSBkYXRhLmZpbHRlcihtID0+ICFtLmNoZWNrZWQpO1xyXG4gICAgICBjb25zb2xlLmxvZygnY2hlY2tlZCcsIGNoZWNrZWQpO1xyXG4gICAgICBjb25zb2xlLmxvZygndW5jaGVja2VkJywgdW5jaGVja2VkKTtcclxuICAgICAgY2hlY2tlZC5sZW5ndGggPyBkcmF3TWVzc2FnZXMoY2hlY2tlZCwgZW1haWwsIGRvbmVDb250YWluZXIpIDogIGRvbmVDb250YWluZXIuaW5uZXJIVE1MID0gYDxoND4uLi5lbXB0eSB5ZXQuLi4gPC9oND5gO1xyXG4gICAgICB1bmNoZWNrZWQubGVuZ3RoID8gZHJhd01lc3NhZ2VzKHVuY2hlY2tlZCwgZW1haWwsIHNhdmVkQ29udGFpbmVyKSA6IHNhdmVkQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aDQ+Li4uZW1wdHkgeWV0Li4uIDwvaDQ+YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvbmVDb250YWluZXIuaW5uZXJIVE1MID0gYDxoND4uLi5lbXB0eSB5ZXQuLi4gPC9oND5gO1xyXG4gICAgICBzYXZlZENvbnRhaW5lci5pbm5lckhUTUwgPSBgPGg0Pi4uLmVtcHR5IHlldC4uLiA8L2g0PmA7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmZhdm9yaXRlV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2xvc2UtZmF2b3JpdGVzLXdpbmRvd1wiKSl7IFxyXG4gICAgZmF2b3JpdGVXaW5kb3cuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZGVsLWZyb20tZmF2b3JpdGVzLWJ1dHRvblwiKSl7XHJcbiAgICAvLyBlLnNyY0VsZW1lbnQuYXR0cmlidXRlcy5hZGQoJ2Rpc2FibGVkJylcclxuICAgIGxldCBwb3N0TWVzc2FnZUlkID0gZS50YXJnZXQuaWQudHJpbSgpO1xyXG4gICAgbGV0IHBvc3RWYWx1ZSA9IHtcclxuICAgICAgb3duZXI6IHVzZXJDcmVkZW50aWFscy5lbWFpbCxcclxuICAgICAgbWVzc2FnZUlkOiBwb3N0TWVzc2FnZUlkXHJcbiAgICB9XHJcbiAgICBnZXRNZXNzYWdlcyhcImZhdkRlbE9uZUZyb21MaXN0XCIsIEpTT04uc3RyaW5naWZ5KHBvc3RWYWx1ZSkgKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSkudGhlbihkcmF3RmF2b3JpdGVzKHVzZXJDcmVkZW50aWFscy5lbWFpbCkpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY2hlY2stZmF2b3JpdGVzLWJ1dHRvblwiKSl7XHJcbiAgICBsZXQgcG9zdE1lc3NhZ2VJZCA9IGUudGFyZ2V0LmlkLnRyaW0oKTtcclxuICAgIGxldCBwb3N0VmFsdWUgPSB7XHJcbiAgICAgIG93bmVyOiB1c2VyQ3JlZGVudGlhbHMuZW1haWwsXHJcbiAgICAgIG1lc3NhZ2VJZDogcG9zdE1lc3NhZ2VJZFxyXG4gICAgfVxyXG4gICAgZ2V0TWVzc2FnZXMoXCJmYXZDaGVja0RvbmVcIiwgSlNPTi5zdHJpbmdpZnkocG9zdFZhbHVlKSApLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9KS50aGVuKGRyYXdGYXZvcml0ZXModXNlckNyZWRlbnRpYWxzLmVtYWlsKSk7XHJcbiAgfVxyXG59KVxyXG5cclxuZmlsdGVyc0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgdmFyIGlkO1xyXG4gIGlmKGUuc3JjRWxlbWVudCAmJiBlLnNyY0VsZW1lbnQub2Zmc2V0UGFyZW50ICYmIGUuc3JjRWxlbWVudC5vZmZzZXRQYXJlbnQuaWQpIHtcclxuICAgIGlkID0gZS5zcmNFbGVtZW50Lm9mZnNldFBhcmVudC5pZDtcclxuICB9XHJcbiAgaWYoZS50YXJnZXQuaWQpIHtcclxuICAgIGlkID0gZS50YXJnZXQuaWQ7XHJcbiAgfVxyXG4gIFxyXG4gIGlmKGlkID09IFwibGlua3MtZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnaHR0cCcpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ21lc3NhZ2VzIHdpdGggbGlua3MnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJ5b3V0dWJlLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ3d3dy55b3V0dWJlJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAneW91dHViZSB2aWRlb3MnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJnaXRodWItZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnZ2l0aHViJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAnZ2l0aHViIGxpbmtzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwiaW1hZ2UtZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnaW1nJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAnaW1hZ2VzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwidHdpdHRlci1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICd0d2l0dGVyJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAndHdpdHRlciBwb3N0cycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcIm1lZXR1cC1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICdtZWV0dXAnKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICdtZWV0dXBzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwieW91dHViZS1jaGVja2JveFwiKSB7XHJcbiAgICBhbGxvd1lvdXR1YmVQcmV2aWV3ID0gYWxsb3dZb3V0dWJlUHJldmlldyA/IGZhbHNlIDogdHJ1ZTtcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJ0d2l0dGVyLWNoZWNrYm94XCIpIHtcclxuICAgIGFsbG93VHdpdHRlclByZXZpZXcgPSBhbGxvd1R3aXR0ZXJQcmV2aWV3ID8gZmFsc2UgOiB0cnVlO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuZXhwb3J0cy5kcmF3UGllQ2hhcnQgPSBmdW5jdGlvbihncmFwaEFycikge1xyXG4gIGdyYXBoQXJyID0gZ3JhcGhBcnIubWFwKG9iaiA9PiB7XHJcbiAgICByZXR1cm4gW29iai5faWQubmFtZSwgb2JqLmNvdW50XVxyXG4gIH0pXHJcbiAgZ3JhcGhBcnIudW5zaGlmdChbJ1VzZXInLCAnQ291bnQgb2YgbWVzc2FnZXMnXSlcclxuICBncmFwaEFyci5sZW5ndGggPSAyMDtcclxuICAvLyBjb25zb2xlLmxvZyhncmFwaEFycilcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoXCJjdXJyZW50XCIsIHtwYWNrYWdlczpbXCJjb3JlY2hhcnRcIl19KTtcclxuICAgIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0NoYXJ0KTtcclxuICAgIGZ1bmN0aW9uIGRyYXdDaGFydCgpIHtcclxuICAgICAgdmFyIGRhdGEgPSBnb29nbGUudmlzdWFsaXphdGlvbi5hcnJheVRvRGF0YVRhYmxlKGdyYXBoQXJyKTtcclxuXHJcbiAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIGNoYXJ0QXJlYTogeyBsZWZ0OiAnLTUlJywgdG9wOiAnMTIlJywgd2lkdGg6IFwiOTAlXCIsIGhlaWdodDogXCI5MCVcIiB9LFxyXG4gICAgICAgIHRpdGxlOiAnTWVzc2FnaW5nIGFjdGl2aXR5JyxcclxuICAgICAgICBwaWVIb2xlOiAwLjQsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uUGllQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RvbnV0Y2hhcnQnKSk7XHJcbiAgICAgIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy90b3RhbEJsb2NrXHJcbmNvbnN0IHRvdGFsTGlua3MgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtbGlua3NcIiksXHJcbiAgICAgIHRvdGFsVmlkZW9zICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtdmlkZW9zXCIpLFxyXG4gICAgICB0b3RhbEdpdGh1YiAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWdpdGh1YlwiKSxcclxuICAgICAgdG90YWxJbWFnZXMgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1pbWFnZXNcIiksXHJcbiAgICAgIHRvdGFsbWVudGlvbnMgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtbWVudGlvbnNcIiksXHJcbiAgICAgIHRvdGFsRmluaXNoZWRUYXNrcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtZmluaXNoZWQtdGFza3NcIiksXHJcbiAgICAgIHRvdGFsTWVzc2FnZXMgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtbWVzc2FnZXNcIiksXHJcbiAgICAgIHRvdGFsRGF5cyAgICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtZGF5c1wiKTtcclxuXHJcblxyXG5leHBvcnRzLnJlbmRlclRvdGFsTWVkaWFTdW1tYXJ5QmxvY2sgPSAoKSA9PiB7XHJcbiAgZ2V0TWVzc2FnZXMoXCJjb3VudFwiKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxNZXNzYWdlcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhfTwvYj5gO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwiYnlEYXlcIikudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsRGF5cy5pbm5lckhUTUwgPSBgPGI+JHtNYXRoLmZsb29yKGRhdGEubGVuZ3RoLzMwKX0gbW9udGhzICYgJHtkYXRhLmxlbmd0aCAlIDMwfSBkYXlzPC9iPmA7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJ2h0dHAnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxMaW5rcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHJlZmVyZW5jZXNgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICcueW91dHViZScpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbFZpZGVvcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHZpZGVvc2A7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJy5naXRodWInKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxHaXRodWIuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiBsaW5rcyB0byBnaXRodWJgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICdodHRwIGltZycpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbEltYWdlcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHNjcmVlbnNob3RzYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnQCcpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbG1lbnRpb25zLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gbWVudGlvbnNgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwiZmluaXNoZWRCeVRhc2tzXCIpLnRoZW4oKGRhdGEsIGh0bWwpID0+IHtcclxuICAgIHRvdGFsRmluaXNoZWRUYXNrcy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IHJlYWR5IHRhc2tzYDtcclxuICB9KTtcclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCB0YWJsZSA9IHJlcXVpcmUoXCIuLi9wbHVnaW5zL190YWJsZVwiKTtcclxuXHJcbmV4cG9ydCBjb25zdCBpbnNlcnRUYXNrTGlzdFRvUGFnZSA9IChmaW5pc2hlZEFycikgPT4ge1xyXG4gIHZhciBpbWFnZUxvZ28gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1sb2dvJyk7XHJcbiAgaW1hZ2VMb2dvLnNyYyA9IGNvbmZpZy52YXJzLmtvdHRhbnNSb29tLmF2YXRhcjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbXlJbnB1dCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgdGFibGUubXlGdW5jdGlvbik7XHJcblxyXG4gIHZhciBodG1sID0gJyc7XHJcblxyXG4gIHZhciBkaXZUYWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteVRhYmxlJyk7XHJcblxyXG4gIGh0bWwgKz0gXHJcbiAgICBgPHRyIGNsYXNzPVwiaGVhZGVyXCI+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgxKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPk5hbWU8L3RoPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMil9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5OaWNrPC90aD5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDMpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+UHVibGlzaGVkPC90aD5cclxuICAgICAgICA8dGggc3R5bGU9XCJ3aWR0aDo4MCU7XCI+VGV4dDwvdGg+XHJcbiAgICA8L3RyPmA7XHJcbiAgICAgICAgXHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5pc2hlZEFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgaHRtbCArPSBcclxuICAgICAgICBgPHRyPlxyXG4gICAgICAgICAgPHRkPjxpbWcgc3JjPVwiJHtmaW5pc2hlZEFycltpXS5hdmF0YXJVcmx9XCIgY2xhc3M9XCJ1c2VyLWljb25cIj4ke2ZpbmlzaGVkQXJyW2ldLmRpc3BsYXlOYW1lfTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+KDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20ke2ZpbmlzaGVkQXJyW2ldLnVybH1cIj4ke2ZpbmlzaGVkQXJyW2ldLnVzZXJuYW1lfTwvYT4pPC90ZD5cclxuICAgICAgICAgIDx0ZD4ke2ZpbmlzaGVkQXJyW2ldLnNlbnR9PC90ZD5cclxuICAgICAgICAgIDx0ZD4ke2ZpbmlzaGVkQXJyW2ldLnRleHR9IDwvdGQ+XHJcbiAgICAgICAgPC90cj5gO1xyXG4gIH1cclxuZGl2VGFibGUuaW5uZXJIVE1MID0gaHRtbDtcclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCBzZWwgPSByZXF1aXJlKCcuLi9wbHVnaW5zL19zZWxlY3RvcnMnKTtcclxuaW1wb3J0IHsgcmVxdWVzdCBhcyBnZXRNZXNzYWdlcyB9IGZyb20gXCIuLi9fcmVxdWVzdC1uZXdcIjtcclxuXHJcbmV4cG9ydHMuaW5zZXJ0VmFsdWVzVG9GZWF0dXJlc0NhcmRzID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gZmVhdHVyZSAxXHJcbiAgZ2V0TWVzc2FnZXMoJ2NvdW50JykudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5tZXNzYWdlc0NvdW50LmlubmVySFRNTCA9IGRhdGE7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgMlxyXG4gIGdldE1lc3NhZ2VzKFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9rb3R0YW5zL2Zyb250ZW5kXCIpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3Muc3RhcnJlZFJlcG8uaW5uZXJIVE1MID0gKGRhdGEuc3RhcmdhemVyc19jb3VudCA9PSB1bmRlZmluZWQpID8gXCIuLi5cIiA6IGRhdGEuc3RhcmdhemVyc19jb3VudDtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSAzXHJcbiAgZ2V0TWVzc2FnZXMoXCJhdXRob3JzXCIpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MuYWN0aXZlVXNlcnNDb3VudC5pbm5lckhUTUwgPSBkYXRhLmxlbmd0aDtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSA0XHJcbiAgZ2V0TWVzc2FnZXMoXCJodHRwczovL2FwaS5naXRodWIuY29tL3NlYXJjaC9pc3N1ZXM/cT0rdHlwZTpwcit1c2VyOmtvdHRhbnMmc29ydD1jcmVhdGVkJiVFMiU4MCU4QyVFMiU4MCU4Qm9yZGVyPWFzY1wiKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICB2YXIgcHVsbE51bWJlciA9IGRhdGEuaXRlbXMuZmluZCgoaXRlbSkgPT4ge3JldHVybiBpdGVtLnJlcG9zaXRvcnlfdXJsID09IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9rb3R0YW5zL21vY2stcmVwb1wiO30pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInB1bGwtcmVxdWVzdHNcIilbMF0uaW5uZXJIVE1MID0gcHVsbE51bWJlci5udW1iZXI7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgNVxyXG4gIGdldE1lc3NhZ2VzKFwibGVhcm5lcnNcIikudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5ibG9ja0xlYXJuZXJzLmlubmVySFRNTCA9IGRhdGEubGVuZ3RoO1xyXG4gIH0pO1xyXG59XHJcblxyXG5leHBvcnRzLmRyYXdDb3VudE9mVGFza3NQZXJVc2VyX1ZlcnRpY2FsQmFyID0gZnVuY3Rpb24odXNlcnMpIHtcclxuICBsZXQgZ3JhcGhBcnIgPSB1c2Vycy5tYXAoZnVuY3Rpb24odXNlcikge1xyXG4gICAgcmV0dXJuIG5ldyBBcnJheSh1c2VyLnVzZXJuYW1lK1wiXCIsIHVzZXIubGVzc29ucy5sZW5ndGgsIFwibGlnaHRibHVlXCIpO1xyXG4gIH0pO1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZCgnY3VycmVudCcsIHtwYWNrYWdlczogWydjb3JlY2hhcnQnLCAnYmFyJ119KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdCYXNpYyk7XHJcbiAgZnVuY3Rpb24gZHJhd0Jhc2ljKCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZXJ0aWNhbF9jaGFydCcpO1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNvbHVtbkNoYXJ0KGNvbnRhaW5lcik7XHJcbiAgICBncmFwaEFyci51bnNoaWZ0KFsnVXNlcicsICdUYXNrcycsIHsgcm9sZTogJ3N0eWxlJyB9XSlcclxuICAgIHZhciBkYXRhID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZShncmFwaEFycik7XHJcbiAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICBhbmltYXRpb246IHtcclxuICAgICAgZHVyYXRpb246IDIwMDAsXHJcbiAgICAgIHN0YXJ0dXA6IHRydWUgLy9UaGlzIGlzIHRoZSBuZXcgb3B0aW9uXHJcbiAgICB9LFxyXG4gICAgdGl0bGU6ICdTdW0gb2YgZmluaXNoZWQgdGFza3MgYnkgZWFjaCBsZWFybmVyJyxcclxuICAgIC8vIHdpZHRoOiAoJCh3aW5kb3cpLndpZHRoKCkgPCA4MDApID8gJCh3aW5kb3cpLndpZHRoKCkgOiAkKHdpbmRvdykud2lkdGgoKSowLjUsXHJcbiAgICB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSowLjMsXHJcbiAgICBoQXhpczoge1xyXG4gICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICBzbGFudGVkVGV4dEFuZ2xlOjkwLCAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgdkF4aXM6IHtcclxuICAgICAgLy90aXRsZTogJ1N1bSBvZiBmaW5pc2hlZCB0YXNrcydcclxuICAgIH0sXHJcbiAgICBhbmltYXRpb246e1xyXG4gICAgICBkdXJhdGlvbjogMTAwMCxcclxuICAgICAgZWFzaW5nOiAnb3V0J1xyXG4gICAgfSxcclxuICB9O1xyXG4gIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IFxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbmV4cG9ydHMuZHJhd0FjdGl2aXR5X0xpbmVDaGFydCA9IGZ1bmN0aW9uKGFjdGl2aXR5QXJyKSB7XHJcbiAgYWN0aXZpdHlBcnIubWFwKGZ1bmN0aW9uKGRheSkge1xyXG4gICAgZGF5WzBdID0gbmV3IERhdGUoZGF5WzBdKTtcclxuICB9KTtcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoJ2N1cnJlbnQnLCB7cGFja2FnZXM6IFsnY29yZWNoYXJ0JywgJ2xpbmUnXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0Jhc2ljKTtcclxuXHJcbiAgZnVuY3Rpb24gZHJhd0Jhc2ljKCkge1xyXG4gICAgdmFyIGRhdGEgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKCk7XHJcbiAgICBkYXRhLmFkZENvbHVtbignZGF0ZScsICdEYXlzJyk7XHJcbiAgICBkYXRhLmFkZENvbHVtbignbnVtYmVyJywgJ01lc3NhZ2VzJyk7XHJcbiAgICBkYXRhLmFkZFJvd3MoYWN0aXZpdHlBcnIpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgIHRpdGxlOiBcIkFjdGl2aXR5IG9mIHVzZXJzIGluIGNoYXRcIixcclxuICAgICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXHJcbiAgICAgICAgc3RhcnR1cDogdHJ1ZSAvL1RoaXMgaXMgdGhlIG5ldyBvcHRpb25cclxuICAgICAgfSxcclxuICAgICAgLy9jdXJ2ZVR5cGU6ICdmdW5jdGlvbicsXHJcbiAgICAgIC8vIHdpZHRoOiAoJCh3aW5kb3cpLndpZHRoKCkgPCA4MDApID8gJCh3aW5kb3cpLndpZHRoKCkgOiAkKHdpbmRvdykud2lkdGgoKSowLjUsXHJcbiAgICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgXHJcbiAgICAgIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpKjAuMyxcclxuICAgICAgaEF4aXM6IHtcclxuICAgICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICAgIHNsYW50ZWRUZXh0QW5nbGU6NDUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHZBeGlzOiB7XHJcbiAgICAgICAgLy8gdGl0bGU6ICdDb3VudCBvZiBtZXNzYSdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5MaW5lQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmVjaGFydCcpKTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IiwiZXhwb3J0cy5kcmF3VGltZWxpbmVDaGFydCA9IGZ1bmN0aW9uKGdyYXBoQXJyKSB7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKFwiY3VycmVudFwiLCB7cGFja2FnZXM6W1widGltZWxpbmVcIl19KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdDaGFydCk7XHJcbiAgZnVuY3Rpb24gZHJhd0NoYXJ0KCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lbGluZScpO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLlRpbWVsaW5lKGNvbnRhaW5lcik7XHJcbiAgICB2YXIgZGF0YVRhYmxlID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ1Jvb20nIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ05hbWUnIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdkYXRlJywgaWQ6ICdTdGFydCcgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ2RhdGUnLCBpZDogJ0VuZCcgfSk7XHJcbiAgICBcclxuICAgIGdyYXBoQXJyLm1hcChlbGVtZW50ID0+IHtcclxuICAgICAgZWxlbWVudFsyXSA9IG5ldyBEYXRlKGVsZW1lbnRbMl0pO1xyXG4gICAgICBlbGVtZW50WzNdID0gbmV3IERhdGUoZWxlbWVudFszXSk7XHJcbiAgICB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRSb3dzKGdyYXBoQXJyKTtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLFxyXG4gICAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSxcclxuICAgICAgdGltZWxpbmU6IHsgY29sb3JCeVJvd0xhYmVsOiB0cnVlIH0sXHJcbiAgICAgIGhBeGlzOiB7XHJcbiAgICAgICAgICBtaW5WYWx1ZTogbmV3IERhdGUoMjAxNywgOSwgMjkpLFxyXG4gICAgICAgICAgbWF4VmFsdWU6IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgKDEgKiA2MCAqIDYwICogMTAwMDAwKSlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YVRhYmxlLCBvcHRpb25zKTtcclxuICB9XHJcbn0iXX0=

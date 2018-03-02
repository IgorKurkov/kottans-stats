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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvX2NvbmZpZy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9fcmVxdWVzdC1uZXcuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvYXBwLmpzIiwiRzovRlJPTlRFTkQvUHJvamVjdHMvR2l0aHViL1JlYWwgcHJvamVjdHMva290dGFucy1zdGF0aXN0aWNzL2tvdHRhbnMtc3RhdHMvYXBwL2pzL3BsdWdpbnMvX2NvdW50ZG93bi5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9wbHVnaW5zL19zZWxlY3RvcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcGx1Z2lucy9fdGFibGUuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLWZpbHRlcnMuanMiLCJHOi9GUk9OVEVORC9Qcm9qZWN0cy9HaXRodWIvUmVhbCBwcm9qZWN0cy9rb3R0YW5zLXN0YXRpc3RpY3Mva290dGFucy1zdGF0cy9hcHAvanMvcmVuZGVyL19wYWdlLXNlYXJjaC5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljcy5qcyIsIkc6L0ZST05URU5EL1Byb2plY3RzL0dpdGh1Yi9SZWFsIHByb2plY3RzL2tvdHRhbnMtc3RhdGlzdGljcy9rb3R0YW5zLXN0YXRzL2FwcC9qcy9yZW5kZXIvX3BhZ2UtdGltZWxpbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLE9BQU8sQ0FBQyxJQUFJLEdBQUc7QUFDYixNQUFJLEVBQUUsMENBQTBDO0FBQ2hELFFBQU0sRUFBRSwyQ0FBMkM7O0FBRW5ELGFBQVcsRUFBRTs7QUFFWCxVQUFNLEVBQUcsa0VBQWtFO0dBQzVFO0NBQ0YsQ0FBQzs7Ozs7Ozs7QUNSRixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdCLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLElBQUksRUFBRSxTQUFTLEVBQUs7QUFDMUMsTUFBSSxHQUFHLEdBQUcsQUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFJLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7QUFDcEYsTUFBSSxPQUFPLEdBQUc7QUFDWixVQUFNLEVBQUUsTUFBTTtBQUNkLFdBQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxtQ0FBbUMsRUFBRTtBQUNoRSxRQUFJLEVBQUUsUUFBUSxHQUFDLFNBQVM7R0FDekIsQ0FBQTs7QUFFRCxNQUFJLFVBQVUsR0FBRyxBQUFDLENBQUMsQ0FBQyxTQUFTLEdBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUU5RSxTQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FDckIsSUFBSSxDQUFDLFVBQUEs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QUFDMUIsY0FBUSxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRTtBQUNuQyxXQUFLLEVBQUU7QUFDSCxnQkFBUSxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQy9CLGdCQUFRLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxNQUFNLEFBQUMsQ0FBQztPQUNwRTtLQUNGLENBQUM7QUFDRixTQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNoQztDQUNGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cy52YXJzID0ge1xyXG4gIGhhc2g6ICc3ZTE2YjU1MjdjNzdlYTU4YmFjMzZkZGRkYTZmNWI0NDRmMzJlODFiJyxcclxuICBkb21haW46IFwiaHR0cHM6Ly9zZWNyZXQtZWFydGgtNTA5MzYuaGVyb2t1YXBwLmNvbS9cIixcclxuICAvLyBkb21haW46IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL1wiLFxyXG4gIGtvdHRhbnNSb29tOiB7XHJcbiAgICAvLyBpZCA6IFwiNTliMGYyOWJkNzM0MDhjZTRmNzRiMDZmXCIsXHJcbiAgICBhdmF0YXIgOiBcImh0dHBzOi8vYXZhdGFycy0wMi5naXR0ZXIuaW0vZ3JvdXAvaXYvMy81NzU0MmQyN2M0M2I4YzYwMTk3N2EwYjZcIlxyXG4gIH1cclxufTsiLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi9fY29uZmlnXCIpO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJlcXVlc3QgPSAobGluaywgcG9zdFZhbHVlKSA9PiB7XHJcbiAgdmFyIHVybCA9ICgvaHR0cC8udGVzdChsaW5rKSkgPyBsaW5rIDogY29uZmlnLnZhcnMuZG9tYWluICsgbGluayArIGNvbmZpZy52YXJzLmhhc2g7XHJcbiAgbGV0IG9wdGlvbnMgPSB7IFxyXG4gICAgbWV0aG9kOiBcIlBPU1RcIiwgXHJcbiAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyB9LFxyXG4gICAgYm9keTogXCJ2YWx1ZT1cIitwb3N0VmFsdWVcclxuICB9XHJcbiAgLy8gY29uc29sZS5sb2coISFwb3N0VmFsdWUpXHJcbiAgbGV0IHJlcXVlc3RPYmogPSAoISFwb3N0VmFsdWUpID8gbmV3IFJlcXVlc3QodXJsLCBvcHRpb25zKSA6IG5ldyBSZXF1ZXN0KHVybCk7XHJcblxyXG4gIHJldHVybiBmZXRjaChyZXF1ZXN0T2JqKVxyXG4gICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgaWYgKCFyZXMub2spIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzLnN0YXR1c1RleHQpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcy5qc29uKClcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICB9KTtcclxuICB9IFxyXG4iLCJjb25zdCBjb3VudGRvd24gICAgICA9IHJlcXVpcmUoXCIuL3BsdWdpbnMvX2NvdW50ZG93blwiKTtcclxuLy8gY29uc3QgcmVxdWVzdCAgICAgICAgPSByZXF1aXJlKCcuL19yZXF1ZXN0Jyk7XHJcbmNvbnN0IHBhZ2VTdGF0aXN0aWNzID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXN0YXRpc3RpY3NcIik7XHJcbmNvbnN0IHBhZ2VUaW1lbGluZSAgID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXRpbWVsaW5lXCIpO1xyXG5jb25zdCBwYWdlU2VhcmNoICAgICA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS1zZWFyY2hcIik7XHJcblxyXG5pbXBvcnQgKiBhcyBzZWFyY2hQYWdlIGZyb20gXCIuL3JlbmRlci9fcGFnZS1zZWFyY2hcIjtcclxuaW1wb3J0ICogYXMgZmlsdGVyc1BhZ2UgZnJvbSBcIi4vcmVuZGVyL19wYWdlLWZpbHRlcnNcIjtcclxuaW1wb3J0IHsgcmVxdWVzdCBhcyBnZXRNZXNzYWdlcyAgfSBmcm9tIFwiLi9fcmVxdWVzdC1uZXdcIjtcclxuXHJcblxyXG5cclxuZ2V0TWVzc2FnZXMoXCJsYXRlc3RcIikudGhlbihpbml0KTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgLy8gUGFnZSBUaW1lbGluZVxyXG4gIGdldE1lc3NhZ2VzKFwiZmluaXNoZWRCeVRhc2tzXCIpLnRoZW4ocGFnZVRpbWVsaW5lLmRyYXdUaW1lbGluZUNoYXJ0KTtcclxuICBcclxuICAvL1BhZ2Ugc2VhcmNoIGZpbmlzaGVkIHRhc2tzXHJcbiAgZ2V0TWVzc2FnZXMoXCJmaW5pc2hlZEJ5U3R1ZGVudHNcIikudGhlbihzZWFyY2hQYWdlLmluc2VydFRhc2tMaXN0VG9QYWdlKTtcclxuICBcclxuICAvL1BhZ2Ugc3RhdGlzdGljc1xyXG4gIC8vIGNvdW50ZG93bi5pbml0VGltZXIoKTtcclxuICBwYWdlU3RhdGlzdGljcy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMoKTtcclxuICBnZXRNZXNzYWdlcyhcImxlYXJuZXJzXCIpLnRoZW4ocGFnZVN0YXRpc3RpY3MuZHJhd0NvdW50T2ZUYXNrc1BlclVzZXJfVmVydGljYWxCYXIpO1xyXG4gIGdldE1lc3NhZ2VzKFwiYWN0aXZpdHlcIikudGhlbihwYWdlU3RhdGlzdGljcy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0KTtcclxuXHJcbiAgLy9QYWdlIGZpbHRlcnNcclxuICBsZXQgY3VycmVudERhdGUgPSAobmV3IERhdGUoKS50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCkuc3BsaXQoJy0nKS5qb2luKCcuJykpO1xyXG4gIC8vIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkpXHJcbiAgZ2V0TWVzc2FnZXMoXCJwZXJkYXRlXCIsIGN1cnJlbnREYXRlKS50aGVuKGRhdGEgPT4gZmlsdGVyc1BhZ2UuZHJhd01lc3NhZ2VzKGRhdGEsIGN1cnJlbnREYXRlKSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJieURheVwiKS50aGVuKGZpbHRlcnNQYWdlLmRyYXdDYWxlbmRhcik7XHJcblxyXG4gIGZpbHRlcnNQYWdlLnJlbmRlclRvdGFsTWVkaWFTdW1tYXJ5QmxvY2soKTtcclxuICBnZXRNZXNzYWdlcyhcInBlcnVzZXJcIikudGhlbihkYXRhID0+IHtcclxuICAgIGZpbHRlcnNQYWdlLmRyYXdQaWVDaGFydChkYXRhKTsgXHJcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKVxyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4iLCIvL0NPVU5URE9XTiBUSU1FUlxyXG4vL3NsaWNrY2l0Y3VsYXIgaHR0cHM6Ly93d3cuanF1ZXJ5c2NyaXB0Lm5ldC9kZW1vL1NsaWNrLUNpcmN1bGFyLWpRdWVyeS1Db3VudGRvd24tUGx1Z2luLUNsYXNzeS1Db3VudGRvd24vXHJcblxyXG5leHBvcnRzLmluaXRUaW1lciA9IGZ1bmN0aW9uKCkge1xyXG4gIHZhciB0aW1lRW5kID0gTWF0aC5yb3VuZCggKG5ldyBEYXRlKFwiMjAxOC4wMi4xMFwiKS5nZXRUaW1lKCkgLSAkLm5vdygpKSAvIDEwMDApO1xyXG4gICAgICB0aW1lRW5kID0gTWF0aC5mbG9vcih0aW1lRW5kIC8gODY0MDApICogODY0MDA7XHJcblxyXG4gICQoJyNjb3VudGRvd24tY29udGFpbmVyJykuQ2xhc3N5Q291bnRkb3duKHtcclxuICAgIHRoZW1lOiBcIndoaXRlXCIsIFxyXG4gICAgZW5kOiAkLm5vdygpICsgdGltZUVuZCwgLy9lbmQ6ICQubm93KCkgKyA2NDU2MDAsXHJcbiAgICBub3c6ICQubm93KCksXHJcbiAgICAvLyB3aGV0aGVyIHRvIGRpc3BsYXkgdGhlIGRheXMvaG91cnMvbWludXRlcy9zZWNvbmRzIGxhYmVscy5cclxuICAgIGxhYmVsczogdHJ1ZSxcclxuICAgIC8vIG9iamVjdCB0aGF0IHNwZWNpZmllcyBkaWZmZXJlbnQgbGFuZ3VhZ2UgcGhyYXNlcyBmb3Igc2F5cy9ob3Vycy9taW51dGVzL3NlY29uZHMgYXMgd2VsbCBhcyBzcGVjaWZpYyBDU1Mgc3R5bGVzLlxyXG4gICAgbGFiZWxzT3B0aW9uczoge1xyXG4gICAgICBsYW5nOiB7XHJcbiAgICAgICAgZGF5czogJ0RheXMnLFxyXG4gICAgICAgIGhvdXJzOiAnSG91cnMnLFxyXG4gICAgICAgIG1pbnV0ZXM6ICdNaW51dGVzJyxcclxuICAgICAgICBzZWNvbmRzOiAnU2Vjb25kcydcclxuICAgICAgfSxcclxuICAgICAgc3R5bGU6ICdmb250LXNpemU6IDAuNWVtOydcclxuICAgIH0sXHJcbiAgICAvLyBjdXN0b20gc3R5bGUgZm9yIHRoZSBjb3VudGRvd25cclxuICAgIHN0eWxlOiB7XHJcbiAgICAgIGVsZW1lbnQ6ICcnLFxyXG4gICAgICBsYWJlbHM6IGZhbHNlLFxyXG4gICAgICBkYXlzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjMUFCQzlDJywvLydyZ2JhKDAsIDAsIDAsIDEpJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfSxcclxuICAgICAgaG91cnM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyMyOTgwQjknLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBtaW51dGVzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjOEU0NEFEJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfSxcclxuICAgICAgc2Vjb25kczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnI0YzOUMxMicsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gY2FsbGJhY2sgdGhhdCBpcyBmaXJlZCB3aGVuIHRoZSBjb3VudGRvd24gcmVhY2hlcyAwLlxyXG4gICAgb25FbmRDYWxsYmFjazogZnVuY3Rpb24oKSB7fVxyXG4gIH0pO1xyXG59IiwiZXhwb3J0cy5ibG9ja3MgPSB7XHJcbiAgbWVzc2FnZXNDb3VudDogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb3VudC1tZXNzYWdlc1wiKSxcclxuICBzdGFycmVkUmVwbzogICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJyZWQtcmVwb1wiKSxcclxuICBhY3RpdmVVc2Vyc0NvdW50OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZS11c2Vyc1wiKSxcclxuICBibG9ja0xlYXJuZXJzOiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmxlYXJuZXJzXCIpLFxyXG4gIFxyXG59ICIsImV4cG9ydHMubXlGdW5jdGlvbiA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIERlY2xhcmUgdmFyaWFibGVzIFxyXG4gIHZhciBpbnB1dCwgZmlsdGVyLCB0YWJsZSwgdHIsIHRkLCBpO1xyXG4gIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteUlucHV0XCIpO1xyXG4gIGZpbHRlciA9IGlucHV0LnZhbHVlLnRvVXBwZXJDYXNlKCk7XHJcbiAgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VGFibGVcIik7XHJcbiAgdHIgPSB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyXCIpO1xyXG5cclxuICAvLyBMb29wIHRocm91Z2ggYWxsIHRhYmxlIHJvd3MsIGFuZCBoaWRlIHRob3NlIHdobyBkb24ndCBtYXRjaCB0aGUgc2VhcmNoIHF1ZXJ5XHJcbiAgZm9yIChpID0gMDsgaSA8IHRyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0ZCA9IHRyW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidGRcIilbMF07XHJcbiAgICBpZiAodGQpIHtcclxuICAgICAgaWYgKHRkLmlubmVySFRNTC50b1VwcGVyQ2FzZSgpLmluZGV4T2YoZmlsdGVyKSA+IC0xKSB7XHJcbiAgICAgICAgdHJbaV0uc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdHJbaV0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICB9IFxyXG4gIH1cclxufVxyXG5cclxuXHJcbmV4cG9ydHMuc29ydFRhYmxlID0gZnVuY3Rpb24obikge1xyXG4gIHZhciB0YWJsZSwgcm93cywgc3dpdGNoaW5nLCBpLCB4LCB5LCBzaG91bGRTd2l0Y2gsIGRpciwgc3dpdGNoY291bnQgPSAwO1xyXG4gIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVRhYmxlXCIpO1xyXG4gIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgLy8gU2V0IHRoZSBzb3J0aW5nIGRpcmVjdGlvbiB0byBhc2NlbmRpbmc6XHJcbiAgZGlyID0gXCJhc2NcIjsgXHJcbiAgLyogTWFrZSBhIGxvb3AgdGhhdCB3aWxsIGNvbnRpbnVlIHVudGlsXHJcbiAgbm8gc3dpdGNoaW5nIGhhcyBiZWVuIGRvbmU6ICovXHJcbiAgd2hpbGUgKHN3aXRjaGluZykge1xyXG4gICAgLy8gU3RhcnQgYnkgc2F5aW5nOiBubyBzd2l0Y2hpbmcgaXMgZG9uZTpcclxuICAgIHN3aXRjaGluZyA9IGZhbHNlO1xyXG4gICAgcm93cyA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVFJcIik7XHJcbiAgICAvKiBMb29wIHRocm91Z2ggYWxsIHRhYmxlIHJvd3MgKGV4Y2VwdCB0aGVcclxuICAgIGZpcnN0LCB3aGljaCBjb250YWlucyB0YWJsZSBoZWFkZXJzKTogKi9cclxuICAgIGZvciAoaSA9IDE7IGkgPCAocm93cy5sZW5ndGggLSAxKTsgaSsrKSB7XHJcbiAgICAgIC8vIFN0YXJ0IGJ5IHNheWluZyB0aGVyZSBzaG91bGQgYmUgbm8gc3dpdGNoaW5nOlxyXG4gICAgICBzaG91bGRTd2l0Y2ggPSBmYWxzZTtcclxuICAgICAgLyogR2V0IHRoZSB0d28gZWxlbWVudHMgeW91IHdhbnQgdG8gY29tcGFyZSxcclxuICAgICAgb25lIGZyb20gY3VycmVudCByb3cgYW5kIG9uZSBmcm9tIHRoZSBuZXh0OiAqL1xyXG4gICAgICB4ID0gcm93c1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlREXCIpW25dO1xyXG4gICAgICB5ID0gcm93c1tpICsgMV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJURFwiKVtuXTtcclxuICAgICAgLyogQ2hlY2sgaWYgdGhlIHR3byByb3dzIHNob3VsZCBzd2l0Y2ggcGxhY2UsXHJcbiAgICAgIGJhc2VkIG9uIHRoZSBkaXJlY3Rpb24sIGFzYyBvciBkZXNjOiAqL1xyXG4gICAgICBpZiAoZGlyID09IFwiYXNjXCIpIHtcclxuICAgICAgICBpZiAoeC5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSA+IHkuaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgIC8vIElmIHNvLCBtYXJrIGFzIGEgc3dpdGNoIGFuZCBicmVhayB0aGUgbG9vcDpcclxuICAgICAgICAgIHNob3VsZFN3aXRjaD0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChkaXIgPT0gXCJkZXNjXCIpIHtcclxuICAgICAgICBpZiAoeC5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSA8IHkuaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgIC8vIElmIHNvLCBtYXJrIGFzIGEgc3dpdGNoIGFuZCBicmVhayB0aGUgbG9vcDpcclxuICAgICAgICAgIHNob3VsZFN3aXRjaD0gdHJ1ZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHNob3VsZFN3aXRjaCkge1xyXG4gICAgICAvKiBJZiBhIHN3aXRjaCBoYXMgYmVlbiBtYXJrZWQsIG1ha2UgdGhlIHN3aXRjaFxyXG4gICAgICBhbmQgbWFyayB0aGF0IGEgc3dpdGNoIGhhcyBiZWVuIGRvbmU6ICovXHJcbiAgICAgIHJvd3NbaV0ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocm93c1tpICsgMV0sIHJvd3NbaV0pO1xyXG4gICAgICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gICAgICAvLyBFYWNoIHRpbWUgYSBzd2l0Y2ggaXMgZG9uZSwgaW5jcmVhc2UgdGhpcyBjb3VudCBieSAxOlxyXG4gICAgICBzd2l0Y2hjb3VudCArKzsgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvKiBJZiBubyBzd2l0Y2hpbmcgaGFzIGJlZW4gZG9uZSBBTkQgdGhlIGRpcmVjdGlvbiBpcyBcImFzY1wiLFxyXG4gICAgICBzZXQgdGhlIGRpcmVjdGlvbiB0byBcImRlc2NcIiBhbmQgcnVuIHRoZSB3aGlsZSBsb29wIGFnYWluLiAqL1xyXG4gICAgICBpZiAoc3dpdGNoY291bnQgPT0gMCAmJiBkaXIgPT0gXCJhc2NcIikge1xyXG4gICAgICAgIGRpciA9IFwiZGVzY1wiO1xyXG4gICAgICAgIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0iLCJpbXBvcnQgeyByZXF1ZXN0IGFzIGdldE1lc3NhZ2VzIH0gZnJvbSBcIi4uL19yZXF1ZXN0LW5ld1wiO1xyXG5cclxuY29uc3QgY2Fyb3VzZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmJsb2NrLWRhdGUtc2Nyb2xsXCIpO1xyXG5jb25zdCBtYWluTWVzc2FnZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNlbnRlci1tZXNzYWdlcy1jb250ZW50XCIpO1xyXG5jb25zdCBtYWluTWVzc2FnZXNXcmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tZXNzYWdlcy13cmFwcGVyXCIpO1xyXG5cclxuY29uc3QgbWFpblNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWFyY2gtYnktd3R3clwiKTtcclxuY29uc3QgdXNlcm5hbWVTZWFyY2hJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc2VhcmNoLWJ5LXVzZXJuYW1lXCIpO1xyXG5jb25zdCB1c2VybmFtZUF1dG9jb21wbGV0ZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZWFzeS1hdXRvY29tcGxldGUtY29udGFpbmVyXCIpO1xyXG5jb25zdCBmaWx0ZXJzQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idXR0b24tZmlsdGVyc1wiKTtcclxuY29uc3Qgc2lnbnVwQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNpZ251cFwiKTtcclxuY29uc3QgZmF2b3JpdGVzQmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZhdm9yaXRlcy13cmFwcGVyXCIpO1xyXG5jb25zdCBmYXZvcml0ZXNCbG9ja1RpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXZvcml0ZXMtdGl0bGVcIik7XHJcbmNvbnN0IGZhdm9yaXRlV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mYXZvcml0ZXMtc2VjdGlvblwiKTtcclxuY29uc3Qgc2F2ZWRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNhdmVkLW1lc3NhZ2VzLWNvbnRhaW5lclwiKTtcclxuY29uc3QgZG9uZUNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZG9uZS1tZXNzYWdlcy1jb250YWluZXJcIik7XHJcbmNvbnN0IEVOVEVSID0gMTM7XHJcbmNvbnN0IGxlZnRTaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sZWZ0LXNpZGViYXJcIik7XHJcbmNvbnN0IGxlZnRTaWRlYmFyT3BlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIub3BlblwiKTtcclxuY29uc3QgbGVmdFNpZGViYXJDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xvc2VcIik7XHJcblxyXG5sZXQgYWxsb3dUd2l0dGVyUHJldmlldyA9IGZhbHNlO1xyXG5sZXQgYWxsb3dZb3V0dWJlUHJldmlldyA9IGZhbHNlO1xyXG5cclxubGV0IHVzZXJDcmVkZW50aWFscyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Zhdm9yaXRlcycpKTtcclxuaWYodXNlckNyZWRlbnRpYWxzICYmIHVzZXJDcmVkZW50aWFscy5lbWFpbCkge1xyXG4gIGxldCB1c2VybmFtZSA9IHVzZXJDcmVkZW50aWFscy5lbWFpbC5zcGxpdCgnQCcpWzBdO1xyXG4gIGZhdm9yaXRlc0Jsb2NrVGl0bGUuaW5uZXJIVE1MID0gXHJcbiAgICAgICAgYEhlbGxvICR7dXNlcm5hbWV9ISA8YSBjbGFzcz1cInNpZ25vdXQtYnV0dG9uXCI+U2lnbiBvdXQhPC9hPmA7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlKHNlbnQsIHNwbGl0dGVyKSB7XHJcbiAgdmFyIGRhdGVTZW50Rm9ybWF0dGVkID1cclxuICAgIHNlbnQuZ2V0RnVsbFllYXIoKSArXHJcbiAgICBzcGxpdHRlciArXHJcbiAgICAoXCIwXCIgKyAoc2VudC5nZXRNb250aCgpICsgMSkpLnNsaWNlKC0yKSArXHJcbiAgICBzcGxpdHRlciArXHJcbiAgICAoXCIwXCIgKyBzZW50LmdldERhdGUoKSkuc2xpY2UoLTIpICtcclxuICAgIFwiIFwiICtcclxuICAgIChcIjBcIiArIHNlbnQuZ2V0SG91cnMoKSkuc2xpY2UoLTIpICtcclxuICAgIFwiOlwiICtcclxuICAgIChcIjBcIiArIHNlbnQuZ2V0TWludXRlcygpKS5zbGljZSgtMik7XHJcbiAgcmV0dXJuIGRhdGVTZW50Rm9ybWF0dGVkO1xyXG59XHJcblxyXG4vL2luaXQgZW1vamkgZm9ybWF0dGVyXHJcbi8vaHR0cHM6Ly9naXRodWIuY29tL2lhbWNhbC9qcy1lbW9qaVxyXG5sZXQgZW1vamkgPSBudWxsO1xyXG5jb25zdCBjYWxsYmFjayA9ICh2YWx1ZSkgPT4geyBlbW9qaSA9IHZhbHVlOyB9O1xyXG5jb25zdCBpbml0RW1vamkgPSAoY2FsbGJhY2spID0+IHtcclxuICBjb25zdCBlbW9qaSA9IG5ldyBFbW9qaUNvbnZlcnRvcigpO1xyXG4gIGVtb2ppLmluY2x1ZGVfdGl0bGUgPSB0cnVlO1xyXG4gIGNvbnN0IHBhdGggPSAnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2lhbWNhbC9lbW9qaS1kYXRhL21hc3Rlci9pbWctYXBwbGUtNjQvJztcclxuICBcclxuICBmZXRjaChwYXRoKycxZjQ0ZC5wbmcnKSAvL2NoZWNrIGlmIGlzIGNvbm5lY3Rpb24gdG8gZ2l0aHViIG9ubGluZSBlbW9qaVxyXG4gIC50aGVuKHJlc3BvbnNlID0+ICB7XHJcbiAgICBpZihyZXNwb25zZS5vaykge1xyXG4gICAgICBlbW9qaS5pbWdfc2V0cy5hcHBsZS5wYXRoID0gcGF0aDtcclxuICAgICAgY2FsbGJhY2soZW1vamkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZW1vamkudXNlX3NoZWV0ID0gdHJ1ZTtcclxuICAgICAgZW1vamkuaW1nX3NldHMuYXBwbGUuc2hlZXQgPSAnbGlicy9qcy1lbW9qaS9zaGVldF9hcHBsZV8xNi5wbmcnO1xyXG4gICAgICBjYWxsYmFjayhlbW9qaSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuXHJcbmluaXRFbW9qaShjYWxsYmFjayk7XHJcblxyXG5cclxuY29uc3QgdHdpdHRlckZvcm1hdHRlciA9ICh1cmwpID0+IHtcclxuICBpZigvdHdpdHRlci9pZy50ZXN0KHVybCkpe1xyXG4gICAgLy9odHRwczovL3R3aXRmcmFtZS5jb20vI3NpemluZ1xyXG4gICAgcmV0dXJuIGA8aWZyYW1lIGJvcmRlcj0wIGZyYW1lYm9yZGVyPTAgaGVpZ2h0PTMwMCB3aWR0aD01NTAgXHJcbiAgICAgIHNyYz1cImh0dHBzOi8vdHdpdGZyYW1lLmNvbS9zaG93P3VybD0ke2VuY29kZVVSSSh1cmwudHJpbSgpLnN1YnN0cmluZyg3LCB1cmwubGVuZ3RoKSl9XCI+PC9pZnJhbWU+YDtcclxuICB9IGVsc2Uge3JldHVybiAnJzt9XHJcbn1cclxuXHJcbmNvbnN0IHlvdXR1YmVGb3JtYXR0ZXIgPSAodXJsKSA9PiB7XHJcbiAgbGV0IHl0dXJsID0gLyg/Omh0dHBzPzpcXC9cXC8pPyg/Ond3d1xcLik/KD86eW91dHViZVxcLmNvbXx5b3V0dVxcLmJlKVxcLyg/OndhdGNoXFw/dj0pPyhbXFx3XFwtXXsxMCwxMn0pKD86JmZlYXR1cmU9cmVsYXRlZCk/KD86W1xcd1xcLV17MH0pPy9nO1xyXG4gIGxldCBpZnJhbWVTdHJpbmcgPSAnPGlmcmFtZSB3aWR0aD1cIjQyMFwiIGhlaWdodD1cIjM0NVwiIHNyYz1cImh0dHA6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJDFcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW4+PC9pZnJhbWU+JztcclxuICBpZih5dHVybC50ZXN0KHVybCkpe1xyXG4gICAgLy90cnkgdG8gZ2VuZXJhdGUgdGh1bWJuYWlsc1xyXG4gICAgLy8gcmV0dXJuIGA8YnI+PGltZyBzcmM9XCIke1lvdXR1YmUudGh1bWIodXJsKX1cIiB0aXRsZT1cInlvdXR1YmUgdGh1bWJuYWlsXCI+YDtcclxuICAgIGxldCB5dElmcmFtZSA9IHVybC5yZXBsYWNlKHl0dXJsLCBpZnJhbWVTdHJpbmcpO1xyXG4gICAgcmV0dXJuIHl0SWZyYW1lLnN1YnN0cmluZyg2LCB5dElmcmFtZS5sZW5ndGgpO1xyXG4gIH0gZWxzZSB7cmV0dXJuICcnO31cclxufVxyXG5cclxuLy9odHRwOi8vanNmaWRkbGUubmV0LzhUYVM4LzYvIGV4dHJhY3QgdGh1bWJuYWlscyBcclxudmFyIFlvdXR1YmUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICB2YXIgdmlkZW8sIHJlc3VsdHM7XHJcbiAgdmFyIGdldFRodW1iID0gZnVuY3Rpb24gKHVybCwgc2l6ZSkge1xyXG4gICAgICBpZiAodXJsID09PSBudWxsKSB7XHJcbiAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuICAgICAgc2l6ZSA9IChzaXplID09PSBudWxsKSA/ICdiaWcnIDogc2l6ZTtcclxuICAgICAgLy8gbGV0IHl0dXJsID0gLyg/Omh0dHBzPzpcXC9cXC8pPyg/Ond3d1xcLik/KD86eW91dHViZVxcLmNvbXx5b3V0dVxcLmJlKVxcLyg/OndhdGNoXFw/dj0pPyhbXFx3XFwtXXsxMCwxMn0pKD86JmZlYXR1cmU9cmVsYXRlZCk/KD86W1xcd1xcLV17MH0pPy9nO1xyXG4gICAgICByZXN1bHRzID0gdXJsLm1hdGNoKCdbXFxcXD8mXXY9KFteJiNdKiknKTtcclxuICAgICAgdmlkZW8gPSAocmVzdWx0cyA9PT0gbnVsbCkgPyB1cmwgOiByZXN1bHRzWzFdO1xyXG4gICAgICBpZiAoc2l6ZSA9PT0gJ3NtYWxsJykge1xyXG4gICAgICAgICAgcmV0dXJuICdodHRwOi8vaW1nLnlvdXR1YmUuY29tL3ZpLycgKyB2aWRlbyArICcvMi5qcGcnO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAnaHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS8nICsgdmlkZW8gKyAnLzAuanBnJztcclxuICB9O1xyXG4gIHJldHVybiB7XHJcbiAgICAgIHRodW1iOiBnZXRUaHVtYlxyXG4gIH07XHJcbn0oKSk7XHJcblxyXG5cclxuY29uc3QgbWFya1NlYXJjaGVkVmFsdWVzSW5IdG1sID0gKG1lc3NhZ2VIdG1sLCBwb3N0VmFsdWUpID0+IHtcclxuICBsZXQgeXRJZnJhbWUgPSAnJztcclxuICBsZXQgdHdpdHRlcklmcmFtZSA9ICcnO1xyXG4gIGxldCByZXBsYWNlZFZhbHVlID0gYDxiPjxtYXJrPiR7cG9zdFZhbHVlfTwvbWFyaz48L2I+YDtcclxuICAvL3JlZHJhdyBhbGxcclxuICBpZihwb3N0VmFsdWUgJiYgcG9zdFZhbHVlICE9ICdzcmMnKSB7XHJcbiAgICBsZXQgcmVnZXh0ZW1wID0gcG9zdFZhbHVlLnJlcGxhY2UoL1xcLi9pZywgXCJcXFxcXFwuXCIpO1xyXG4gICAgbWVzc2FnZUh0bWwgPSBtZXNzYWdlSHRtbC5yZXBsYWNlKG5ldyBSZWdFeHAocmVnZXh0ZW1wLCAnaWcnKSwgcmVwbGFjZWRWYWx1ZSk7XHJcbiAgfVxyXG4gIC8vc2VhcmNoIGZvciB3aGF0ZXZlciB1cmxzXHJcbiAgbGV0IHVybHMgPSBtZXNzYWdlSHRtbC5tYXRjaCgvaHJlZj1cIiguKj8pXCIvZyk7ICBcclxuICBsZXQgY2xlYW5lZEh0bWwgPSBtZXNzYWdlSHRtbDtcclxuICBpZih1cmxzKSB7XHJcbiAgICB1cmxzLmZvckVhY2godXJsID0+IHtcclxuICAgICAgaWYoYWxsb3dUd2l0dGVyUHJldmlldylcclxuICAgICAgICB0d2l0dGVySWZyYW1lID0gdHdpdHRlckZvcm1hdHRlcih1cmwpO1xyXG4gICAgICBpZihhbGxvd1lvdXR1YmVQcmV2aWV3KVxyXG4gICAgICAgIHl0SWZyYW1lID0geW91dHViZUZvcm1hdHRlcih1cmwpO1xyXG4gICAgICBsZXQgbmV3VXJsID0gdXJsLnNwbGl0KHJlcGxhY2VkVmFsdWUpLmpvaW4ocG9zdFZhbHVlKTtcclxuICAgICAgY2xlYW5lZEh0bWwgPSBjbGVhbmVkSHRtbC5zcGxpdCh1cmwpLmpvaW4obmV3VXJsKVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gY2xlYW5lZEh0bWwreXRJZnJhbWUrdHdpdHRlcklmcmFtZTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByZXR1cm4gbWVzc2FnZUh0bWwreXRJZnJhbWUrdHdpdHRlcklmcmFtZTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkcmF3TWVzc2FnZXMgPSAoZGF0YSwgcG9zdFZhbHVlLCBjb250YWluZXIpID0+IHtcclxuICBsZXQgbWVzc2FnZXNDb250YWluZXI7XHJcbiAgaWYoY29udGFpbmVyKSB7XHJcbiAgICBtZXNzYWdlc0NvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICB9ZWxzZSB7XHJcbiAgICBtZXNzYWdlc0NvbnRhaW5lciA9IG1haW5NZXNzYWdlc0NvbnRhaW5lcjtcclxuICB9XHJcbiAgbWVzc2FnZXNDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgbGV0IGh0bWwgPSBcIlwiO1xyXG4gIGxldCBvcGVuID0gXCJcIjtcclxuICAvLyBjb25zb2xlLmxvZyhwb3N0VmFsdWUpXHJcbiAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgaWYgKGRhdGEgJiYgZGF0YVswXSA9PSB1bmRlZmluZWQpIHtcclxuICAgIHBvc3RWYWx1ZSA9IHBvc3RWYWx1ZSA/IGB3aXRoIHdvcmQgPGI+JHtwb3N0VmFsdWV9PC9iPmAgOiAnJztcclxuICAgIGh0bWwgKz0gYDxkaXY+PGNlbnRlcj48aDM+Tm8gbWVzc2FnZXMgJHtwb3N0VmFsdWV9PC9oMz48L2NlbnRlcj48L2Rpdj5gO1xyXG4gICAgbWVzc2FnZXNDb250YWluZXIuaW5uZXJIVE1MID0gaHRtbDtcclxuICAgIG1lc3NhZ2VzQ29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBvcGVuID0gXCJvcGVuXCI7XHJcbiAgaHRtbCArPSBgXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJkYXktdGl0bGVcIj5cclxuICAgICAgICBGb3VuZCA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gbWVzc2FnZXMgZm9yIDxiPiR7cG9zdFZhbHVlfTwvYj5cclxuICAgICAgPC9kaXY+XHJcbiAgICBgOyBcclxuICBkYXRhLmZvckVhY2gobWVzc2FnZSA9PiB7XHJcbiAgICBodG1sICs9IGBcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlLXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJtZXNzYWdlLWRhdGUtc2VudFwiPlxyXG4gICAgICAgICAgICAgICR7Zm9ybWF0RGF0ZShuZXcgRGF0ZShtZXNzYWdlLnNlbnQpLCBcIi5cIil9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2UtYXZhdGFyIHRvb2x0aXBcIj5cclxuICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgPGltZyBjbGFzcz1cImF2YXRhciBcIiBzcmM9XCIke21lc3NhZ2UuYXZhdGFyVXJsfVwiPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwdGV4dFwiPlxyXG4gICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cInRvb2x0aXAtYXZhdGFyXCIgc3JjPVwiJHsgbWVzc2FnZS5hdmF0YXJVcmxNZWRpdW0gfVwiPlxyXG4gICAgICAgICAgICAgICAgPGEgdGl0bGU9XCJzZWFyY2ggbWVudGlvbnMgYnkgJHsgbWVzc2FnZS51c2VybmFtZX1cIiBjbGFzcz1cInRpdGxlIG1lc3NhZ2UtdXNlcm5hbWVcIj4keyBtZXNzYWdlLnVzZXJuYW1lfTwvYT5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibWRsLWJ1dHRvbiBtZGwtanMtYnV0dG9uIG1kbC1idXR0b24tLXJhaXNlZCBtZGwtanMtcmlwcGxlLWVmZmVjdFwiIHRhcmdldD1cIl9ibGFua1wiIHRpdGxlPVwiZ28gdG8gJHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UudXNlcm5hbWVcclxuICAgICAgICAgICAgICB9IGdpdGh1YiByZXBvXCIgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbSR7bWVzc2FnZS51cmx9XCI+T3BlbiBwcm9maWxlPC9hPlxyXG5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidGV4dC13cmFwcGVyXCI+XHJcbiAgICAgICAgICAgICAgPGEgdGl0bGU9XCJzZWFyY2ggbWVudGlvbnMgYnkgJHsgbWVzc2FnZS51c2VybmFtZX1cIiBjbGFzcz1cIm1lc3NhZ2UtdXNlcm5hbWVcIj5cclxuICAgICAgICAgICAgICAgICR7IG1lc3NhZ2UudXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgPC9hPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlLW1hcmt1cFwiPlxyXG4gICAgICAgICAgICAgICAgJHttYXJrU2VhcmNoZWRWYWx1ZXNJbkh0bWwobWVzc2FnZS5odG1sLCBwb3N0VmFsdWUpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIDxidXR0b24gaWQ9XCIke21lc3NhZ2UubWVzc2FnZUlkfVwiIGNsYXNzPVwiJHtjb250YWluZXIgPyBcImRlbC1mcm9tLWZhdm9yaXRlcy1idXR0b25cIiA6IFwiYWRkLXRvLWZhdm9yaXRlcy1idXR0b25cIn1cIiA+XHJcbiAgICAgICAgICAgICAgICA8IS0tIDxpIGlkPVwiJHttZXNzYWdlLm1lc3NhZ2VJZH1cIiAke2NvbnRhaW5lciA/IGBjbGFzcz1cImZhIGZhLXRyYXNoLW9cIiB0aXRsZT1cImRlbGV0ZSBmcm9tIGZhdm9yaXRlc1wiYCA6IGBjbGFzcz1cImZhIGZhLXBsdXNcIiB0aXRsZT1cImFkZCB0byBmYXZvcml0ZXNcImB9IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gLS0+XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgY2xhc3M9XCIke2NvbnRhaW5lciA/IG1lc3NhZ2UuY2hlY2tlZCA/IFwiZG9uZS1mYXZvcml0ZXMtYnV0dG9uXCIgOiBcImNoZWNrLWZhdm9yaXRlcy1idXR0b25cIiA6IFwiaGlkZS1idXR0b25cIn1cIiA+XHJcbiAgICAgICAgICAgICAgPCEtLSA8aSBpZD1cIiR7bWVzc2FnZS5tZXNzYWdlSWR9XCIgY2xhc3M9XCJmYSAke2NvbnRhaW5lciA/IG1lc3NhZ2UuY2hlY2tlZCA/IFwiZmEtY2hlY2stc3F1YXJlLW9cIiA6IFwiZmEtc3F1YXJlLW9cIiA6ICBcImZhLXNxdWFyZS1vXCJ9XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiAtLT5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5gO1xyXG4gIH0pO1xyXG4gIGh0bWwgPSBlbW9qaS5yZXBsYWNlX2NvbG9ucyhodG1sKTtcclxuICBtZXNzYWdlc0NvbnRhaW5lci5pbm5lckhUTUwgPSBodG1sO1xyXG4gIFxyXG4gIC8vIElOSVQgSElHSExJR0hULkpTIEZPUiBDT0RFIEJMT0NLUyBJTiBNRVNTQUdFU1xyXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJChcInByZSBjb2RlXCIpLmVhY2goZnVuY3Rpb24oaSwgYmxvY2spIHtcclxuICAgICAgaGxqcy5oaWdobGlnaHRCbG9jayhibG9jayk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgbWVzc2FnZXNDb250YWluZXIuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICB9LCAxMDApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRyYXdDYWxlbmRhciA9IGFjdGl2aXR5QXJyID0+IHtcclxuICBsZXQgYnVpbGRlZEFyciA9IFtdO1xyXG4gIC8vIGNvbnNvbGUubG9nKGFjdGl2aXR5QXJyWzBdKVxyXG4gIGFjdGl2aXR5QXJyLmZvckVhY2goZnVuY3Rpb24oZGF5T2JqKSB7XHJcbiAgICBsZXQgZGF0ZVN0cmluZyA9IGRheU9iai5faWQuc3BsaXQoJy4nKS5qb2luKCctJyk7XHJcbiAgICBidWlsZGVkQXJyLnB1c2goe1xyXG4gICAgICBkYXRlOiBkYXRlU3RyaW5nLFxyXG4gICAgICBiYWRnZTogZmFsc2UsXHJcbiAgICAgIHRpdGxlOiBgJHtkYXlPYmouY291bnR9IG1lc3NhZ2VzYCxcclxuICAgICAgY2xhc3NuYW1lOiBgZGF5LWJsb2NrLSR7ZGF5T2JqLmNvdW50ID4gMTAwID8gMTEwIDogZGF5T2JqLmNvdW50fWBcclxuICAgIH0pO1xyXG4gIH0pO1xyXG4gIC8vIGNvbnNvbGUubG9nKGJ1aWxkZWRBcnIpXHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkKFwiI215LWNhbGVuZGFyXCIpLnphYnV0b19jYWxlbmRhcih7XHJcbiAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIG15RGF0ZUZ1bmN0aW9uKHRoaXMuaWQsIGZhbHNlKTtcclxuICAgICAgfSxcclxuICAgICAgZGF0YTogYnVpbGRlZEFyciwgLy9ldmVudERhdGEsXHJcbiAgICAgIG1vZGFsOiBmYWxzZSxcclxuICAgICAgbGVnZW5kOiBbXHJcbiAgICAgICAgeyB0eXBlOiBcInRleHRcIiwgbGFiZWw6IFwibGVzcyAxMFwiIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdHlwZTogXCJsaXN0XCIsXHJcbiAgICAgICAgICBsaXN0OiBbXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTIwXCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTM1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTQ1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTY1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTc1XCIsXHJcbiAgICAgICAgICAgIFwiZGF5LWJsb2NrLTk1XCJcclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHsgdHlwZTogXCJ0ZXh0XCIsIGxhYmVsOiBcIm1vcmUgMTAwXCIgfVxyXG4gICAgICBdLFxyXG4gICAgICBjZWxsX2JvcmRlcjogdHJ1ZSxcclxuICAgICAgdG9kYXk6IHRydWUsXHJcbiAgICAgIG5hdl9pY29uOiB7XHJcbiAgICAgICAgcHJldjogJzxpIGNsYXNzPVwiZmEgZmEtY2hldnJvbi1jaXJjbGUtbGVmdFwiPjwvaT4nLFxyXG4gICAgICAgIG5leHQ6ICc8aSBjbGFzcz1cImZhIGZhLWNoZXZyb24tY2lyY2xlLXJpZ2h0XCI+PC9pPidcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBteURhdGVGdW5jdGlvbihpZCwgZnJvbU1vZGFsKSB7XHJcbiAgdmFyIGRhdGUgPSAkKFwiI1wiICsgaWQpLmRhdGEoXCJkYXRlXCIpO1xyXG4gIGRhdGUgPSBkYXRlLnNwbGl0KCctJykuam9pbignLicpO1xyXG4gIHZhciBoYXNFdmVudCA9ICQoXCIjXCIgKyBpZCkuZGF0YShcImhhc0V2ZW50XCIpO1xyXG4gIC8vIGNvbnNvbGUubG9nKGRhdGUpXHJcbiAgZ2V0TWVzc2FnZXMoXCJwZXJkYXRlXCIsIGRhdGUpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgZGF0ZSkpO1xyXG59XHJcblxyXG5cclxubGVmdFNpZGViYXJPcGVuLnNjcm9sbFRvcCA9IGxlZnRTaWRlYmFyT3Blbi5zY3JvbGxIZWlnaHQ7XHJcbmxlZnRTaWRlYmFyT3Blbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gIGlmKGxlZnRTaWRlYmFyLnN0eWxlLm1hcmdpbkxlZnQgIT0gXCIwcHhcIil7XHJcblxyXG4gICAgbGVmdFNpZGViYXIuc3R5bGUubWFyZ2luTGVmdCA9IFwiMHB4XCI7XHJcbiAgICBsZWZ0U2lkZWJhck9wZW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgbWFpbk1lc3NhZ2VzV3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBsZWZ0U2lkZWJhckNsb3NlLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgfVxyXG59KTtcclxuXHJcbmxlZnRTaWRlYmFyQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICBpZihsZWZ0U2lkZWJhci5zdHlsZS5tYXJnaW5MZWZ0ID09IFwiMHB4XCIpe1xyXG4gICAgbGVmdFNpZGViYXIuc3R5bGUubWFyZ2luTGVmdCA9IFwiLTEwMCVcIjtcclxuICAgIGxlZnRTaWRlYmFyT3Blbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgbWFpbk1lc3NhZ2VzV3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuXHJcbm1haW5TZWFyY2hJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICBsZXQgcG9zdFZhbHVlID0gZS50YXJnZXQudmFsdWUudHJpbSgpO1xyXG4gIGlmIChlLmtleUNvZGUgPT0gRU5URVIpIHtcclxuICAgICghIXBvc3RWYWx1ZSkgJiYgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgcG9zdFZhbHVlKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFZhbHVlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufSk7XHJcblxyXG51c2VybmFtZVNlYXJjaElucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xyXG4gIGxldCBwb3N0VmFsdWUgPSBlLnRhcmdldC52YWx1ZS50cmltKCk7XHJcbiAgaWYgKGUua2V5Q29kZSA9PSBFTlRFUikge1xyXG4gICAgKCEhcG9zdFZhbHVlKSAmJiBnZXRNZXNzYWdlcyhcInNlYXJjaFVzZXJuYW1lXCIsIHBvc3RWYWx1ZSkudGhlbihkYXRhID0+IHtcclxuICAgICAgZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3RWYWx1ZSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn0pO1xyXG5cclxuLy9odHRwOi8vZWFzeWF1dG9jb21wbGV0ZS5jb20vZ3VpZGUjc2VjLWZ1bmN0aW9uc1xyXG5nZXRNZXNzYWdlcyhcImF1dGhvcnNcIikudGhlbihkYXRhID0+IHtcclxuICB2YXIgb3B0aW9ucyA9IHtcclxuICAgIGRhdGE6IGRhdGEsXHJcbiAgICBsaXN0OiB7XHJcbiAgICAgIG1hdGNoOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxyXG4gICAgICB9LFxyXG4gICAgICBvbkNsaWNrRXZlbnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGxldCBwb3N0VmFsdWUgPSAkKFwiLnNlYXJjaC1ieS11c2VybmFtZVwiKS5nZXRTZWxlY3RlZEl0ZW1EYXRhKCk7XHJcbiAgICAgICAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hVc2VybmFtZVwiLCBwb3N0VmFsdWUpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICBkcmF3TWVzc2FnZXMoZGF0YSwgcG9zdFZhbHVlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSxcclxuXHJcbiAgICB9XHJcbiAgfTtcclxuICAkKFwiLnNlYXJjaC1ieS11c2VybmFtZVwiKS5lYXN5QXV0b2NvbXBsZXRlKG9wdGlvbnMpO1xyXG59KTtcclxuXHJcblxyXG5zaWdudXBCbG9jay5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCAoZSkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBjb25zb2xlLmxvZyhlLnRhcmdldClcclxuICBsZXQgZW1haWwgPSBlLnRhcmdldFsnMCddLnZhbHVlO1xyXG4gIGlmKGVtYWlsICYmIGVtYWlsICE9ICcnKSB7XHJcbiAgICBzaWdudXBCbG9jay5pbm5lckhUTUwgPSBgPGNlbnRlcj48aDQ+VGhhbmtzITwvaDQ+PC9jZW50ZXI+YDtcclxuICAgIHVzZXJDcmVkZW50aWFscyA9ICB7IGVtYWlsOiBlbWFpbCB9O1xyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Zhdm9yaXRlcycsIEpTT04uc3RyaW5naWZ5KHVzZXJDcmVkZW50aWFscykpO1xyXG4gICAgLy8gdXNlckNyZWRlbnRpYWxzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2Zhdm9yaXRlcycpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGxldCB1c2VybmFtZSA9IGVtYWlsLnNwbGl0KCdAJylbMF07XHJcbiAgICAgIGZhdm9yaXRlc0Jsb2NrVGl0bGUuaW5uZXJIVE1MID0gXHJcbiAgICAgICAgYEhlbGxvICR7dXNlcm5hbWV9ISA8YSBjbGFzcz1cInNpZ25vdXQtYnV0dG9uXCI+U2lnbiBvdXQhPC9hPmA7XHJcblxyXG4gICAgICBcclxuICAgICAgc2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH0sIDEwMDApO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxubWFpbk1lc3NhZ2VzQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgY29uc29sZS5sb2coZS50YXJnZXQpXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWVzc2FnZS1kYXRlLXNlbnRcIikpe1xyXG4gICAgbGV0IHBvc3REYXRlID0gZS50YXJnZXQudGV4dENvbnRlbnQudHJpbSgpLnN1YnN0cmluZygwLDEwKTtcclxuICAgIGdldE1lc3NhZ2VzKFwicGVyZGF0ZVwiLCBwb3N0RGF0ZSkudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCBwb3N0RGF0ZSkpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwibWVzc2FnZS11c2VybmFtZVwiKSl7XHJcbiAgICBsZXQgcG9zdFVzZXJuYW1lID0gZS50YXJnZXQudGV4dENvbnRlbnQudHJpbSgpO1xyXG4gICAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgcG9zdFVzZXJuYW1lKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsIHBvc3RVc2VybmFtZSkpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWRkLXRvLWZhdm9yaXRlcy1idXR0b25cIikpe1xyXG4gICAgY2hhbmdlTWVzc2FnZVN0YXRlVG8oZSwgJ3NhdmVUb0Zhdm9yaXRlcycpO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuY29uc3QgY2hhbmdlTWVzc2FnZVN0YXRlVG8gPSAoZSwgc2F2ZVRvQ29tbWFuZCkgPT4ge1xyXG4gIGlmKCF1c2VyQ3JlZGVudGlhbHMpIHtcclxuICAgIHNpZ251cEJsb2NrLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGxldCBwb3N0TWVzc2FnZUlkID0gZS50YXJnZXQuaWQudHJpbSgpO1xyXG4gICAgLy93b3Jrc1xyXG4gICAgZ2V0TWVzc2FnZXMoXCJmaW5kYnlJZFwiLCBwb3N0TWVzc2FnZUlkKS50aGVuKG1lc3NhZ2UgPT4ge1xyXG4gICAgICBsZXQgcG9zdFZhbHVlID0ge1xyXG4gICAgICAgIG93bmVyOiB1c2VyQ3JlZGVudGlhbHMuZW1haWwsXHJcbiAgICAgICAgbWVzc2FnZUlkOiBtZXNzYWdlLm1lc3NhZ2VJZFxyXG4gICAgICB9XHJcbiAgICAgIC8vd29ya3NcclxuICAgICAgZ2V0TWVzc2FnZXMoc2F2ZVRvQ29tbWFuZCwgSlNPTi5zdHJpbmdpZnkocG9zdFZhbHVlKSkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzYXZldG9mYXZvcml0ZXMnLCBkYXRhKVxyXG4gICAgICAgIGxldCBhbnN3ZXIgPSAoZGF0YSA9PSAnQWxyZWFkeSBleGlzdCcpID8gZGF0YSA6ICdBZGRlZCc7XHJcbiAgICAgICAgc2lnbnVwQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICBzaWdudXBCbG9jay5pbm5lckhUTUwgPSBgPGNlbnRlcj48aDQ+JHthbnN3ZXJ9PC9oND48L2NlbnRlcj5gO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge3NpZ251cEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjt9LCAxMDAwKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5mYXZvcml0ZXNCbG9jay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInNpZ251cC1idXR0b25cIikpeyBcclxuICAgIHNpZ251cEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXktc2lnbi1ibG9jaycpO1xyXG4gIH1cclxuXHJcbiAgaWYoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2lnbm91dC1idXR0b25cIikpeyBcclxuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdmYXZvcml0ZXMnKTtcclxuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICB9XHJcbiAgaWYoZS50YXJnZXQuaWQgPT0gXCJ2aWV3LWZhdm9yaXRlcy1idXR0b25cIiB8fCBlLnRhcmdldC5vZmZzZXRQYXJlbnQuaWQgPT0gXCJ2aWV3LWZhdm9yaXRlcy1idXR0b25cIil7IFxyXG4gICAgaWYoIXVzZXJDcmVkZW50aWFscyl7XHJcbiAgICAgIHNpZ251cEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXktc2lnbi1ibG9jaycpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIC8vd29ya3NcclxuICAgICAgZHJhd0Zhdm9yaXRlcyh1c2VyQ3JlZGVudGlhbHMuZW1haWwpO1xyXG4gICAgICBmYXZvcml0ZVdpbmRvdy5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG5cclxuY29uc3QgZHJhd0Zhdm9yaXRlcyA9IChlbWFpbCkgPT4ge1xyXG4gIGdldE1lc3NhZ2VzKCdmYXZnZXRCeUNyZWQnLCBlbWFpbCkudGhlbihkYXRhID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdkYXRhJywgZGF0YSlcclxuICAgIGlmKGRhdGEubGVuZ3RoKSB7XHJcbiAgICAgIGxldCBjaGVja2VkID0gZGF0YS5maWx0ZXIobSA9PiBtLmNoZWNrZWQpO1xyXG4gICAgICBsZXQgdW5jaGVja2VkID0gZGF0YS5maWx0ZXIobSA9PiAhbS5jaGVja2VkKTtcclxuICAgICAgY29uc29sZS5sb2coJ2NoZWNrZWQnLCBjaGVja2VkKTtcclxuICAgICAgY29uc29sZS5sb2coJ3VuY2hlY2tlZCcsIHVuY2hlY2tlZCk7XHJcbiAgICAgIGNoZWNrZWQubGVuZ3RoID8gZHJhd01lc3NhZ2VzKGNoZWNrZWQsIGVtYWlsLCBkb25lQ29udGFpbmVyKSA6ICBkb25lQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aDQ+Li4uZW1wdHkgeWV0Li4uIDwvaDQ+YDtcclxuICAgICAgdW5jaGVja2VkLmxlbmd0aCA/IGRyYXdNZXNzYWdlcyh1bmNoZWNrZWQsIGVtYWlsLCBzYXZlZENvbnRhaW5lcikgOiBzYXZlZENvbnRhaW5lci5pbm5lckhUTUwgPSBgPGg0Pi4uLmVtcHR5IHlldC4uLiA8L2g0PmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb25lQ29udGFpbmVyLmlubmVySFRNTCA9IGA8aDQ+Li4uZW1wdHkgeWV0Li4uIDwvaDQ+YDtcclxuICAgICAgc2F2ZWRDb250YWluZXIuaW5uZXJIVE1MID0gYDxoND4uLi5lbXB0eSB5ZXQuLi4gPC9oND5gO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcblxyXG5mYXZvcml0ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNsb3NlLWZhdm9yaXRlcy13aW5kb3dcIikpeyBcclxuICAgIGZhdm9yaXRlV2luZG93LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB9XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRlbC1mcm9tLWZhdm9yaXRlcy1idXR0b25cIikpe1xyXG4gICAgLy8gZS5zcmNFbGVtZW50LmF0dHJpYnV0ZXMuYWRkKCdkaXNhYmxlZCcpXHJcbiAgICBsZXQgcG9zdE1lc3NhZ2VJZCA9IGUudGFyZ2V0LmlkLnRyaW0oKTtcclxuICAgIGxldCBwb3N0VmFsdWUgPSB7XHJcbiAgICAgIG93bmVyOiB1c2VyQ3JlZGVudGlhbHMuZW1haWwsXHJcbiAgICAgIG1lc3NhZ2VJZDogcG9zdE1lc3NhZ2VJZFxyXG4gICAgfVxyXG4gICAgZ2V0TWVzc2FnZXMoXCJmYXZEZWxPbmVGcm9tTGlzdFwiLCBKU09OLnN0cmluZ2lmeShwb3N0VmFsdWUpICkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICByZXR1cm4gZGF0YTtcclxuICAgIH0pLnRoZW4oZHJhd0Zhdm9yaXRlcyh1c2VyQ3JlZGVudGlhbHMuZW1haWwpKTtcclxuICB9XHJcblxyXG4gIGlmKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImNoZWNrLWZhdm9yaXRlcy1idXR0b25cIikpe1xyXG4gICAgbGV0IHBvc3RNZXNzYWdlSWQgPSBlLnRhcmdldC5pZC50cmltKCk7XHJcbiAgICBsZXQgcG9zdFZhbHVlID0ge1xyXG4gICAgICBvd25lcjogdXNlckNyZWRlbnRpYWxzLmVtYWlsLFxyXG4gICAgICBtZXNzYWdlSWQ6IHBvc3RNZXNzYWdlSWRcclxuICAgIH1cclxuICAgIGdldE1lc3NhZ2VzKFwiZmF2Q2hlY2tEb25lXCIsIEpTT04uc3RyaW5naWZ5KHBvc3RWYWx1ZSkgKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSkudGhlbihkcmF3RmF2b3JpdGVzKHVzZXJDcmVkZW50aWFscy5lbWFpbCkpO1xyXG4gIH1cclxufSlcclxuXHJcbmZpbHRlcnNDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gIHZhciBpZDtcclxuICBpZihlLnNyY0VsZW1lbnQgJiYgZS5zcmNFbGVtZW50Lm9mZnNldFBhcmVudCAmJiBlLnNyY0VsZW1lbnQub2Zmc2V0UGFyZW50LmlkKSB7XHJcbiAgICBpZCA9IGUuc3JjRWxlbWVudC5vZmZzZXRQYXJlbnQuaWQ7XHJcbiAgfVxyXG4gIGlmKGUudGFyZ2V0LmlkKSB7XHJcbiAgICBpZCA9IGUudGFyZ2V0LmlkO1xyXG4gIH1cclxuICBcclxuICBpZihpZCA9PSBcImxpbmtzLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ2h0dHAnKS50aGVuKGRhdGEgPT4gZHJhd01lc3NhZ2VzKGRhdGEsICdtZXNzYWdlcyB3aXRoIGxpbmtzJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwieW91dHViZS1maWx0ZXJcIikge1xyXG4gICAgZ2V0TWVzc2FnZXMoJ3NlYXJjaCcsICd3d3cueW91dHViZScpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ3lvdXR1YmUgdmlkZW9zJykpXHJcbiAgfVxyXG4gIGlmKGlkID09IFwiZ2l0aHViLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ2dpdGh1YicpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ2dpdGh1YiBsaW5rcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcImltYWdlLWZpbHRlclwiKSB7XHJcbiAgICBnZXRNZXNzYWdlcygnc2VhcmNoJywgJ2ltZycpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ2ltYWdlcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcInR3aXR0ZXItZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAndHdpdHRlcicpLnRoZW4oZGF0YSA9PiBkcmF3TWVzc2FnZXMoZGF0YSwgJ3R3aXR0ZXIgcG9zdHMnKSlcclxuICB9XHJcbiAgaWYoaWQgPT0gXCJtZWV0dXAtZmlsdGVyXCIpIHtcclxuICAgIGdldE1lc3NhZ2VzKCdzZWFyY2gnLCAnbWVldHVwJykudGhlbihkYXRhID0+IGRyYXdNZXNzYWdlcyhkYXRhLCAnbWVldHVwcycpKVxyXG4gIH1cclxuICBpZihpZCA9PSBcInlvdXR1YmUtY2hlY2tib3hcIikge1xyXG4gICAgYWxsb3dZb3V0dWJlUHJldmlldyA9IGFsbG93WW91dHViZVByZXZpZXcgPyBmYWxzZSA6IHRydWU7XHJcbiAgfVxyXG4gIGlmKGlkID09IFwidHdpdHRlci1jaGVja2JveFwiKSB7XHJcbiAgICBhbGxvd1R3aXR0ZXJQcmV2aWV3ID0gYWxsb3dUd2l0dGVyUHJldmlldyA/IGZhbHNlIDogdHJ1ZTtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcbmV4cG9ydHMuZHJhd1BpZUNoYXJ0ID0gZnVuY3Rpb24oZ3JhcGhBcnIpIHtcclxuICBncmFwaEFyciA9IGdyYXBoQXJyLm1hcChvYmogPT4ge1xyXG4gICAgcmV0dXJuIFtvYmouX2lkLm5hbWUsIG9iai5jb3VudF1cclxuICB9KVxyXG4gIGdyYXBoQXJyLnVuc2hpZnQoWydVc2VyJywgJ0NvdW50IG9mIG1lc3NhZ2VzJ10pXHJcbiAgZ3JhcGhBcnIubGVuZ3RoID0gMjA7XHJcbiAgLy8gY29uc29sZS5sb2coZ3JhcGhBcnIpXHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKFwiY3VycmVudFwiLCB7cGFja2FnZXM6W1wiY29yZWNoYXJ0XCJdfSk7XHJcbiAgICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdDaGFydCk7XHJcbiAgICBmdW5jdGlvbiBkcmF3Q2hhcnQoKSB7XHJcbiAgICAgIHZhciBkYXRhID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZShncmFwaEFycik7XHJcblxyXG4gICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICBjaGFydEFyZWE6IHsgbGVmdDogJy01JScsIHRvcDogJzEyJScsIHdpZHRoOiBcIjkwJVwiLCBoZWlnaHQ6IFwiOTAlXCIgfSxcclxuICAgICAgICB0aXRsZTogJ01lc3NhZ2luZyBhY3Rpdml0eScsXHJcbiAgICAgICAgcGllSG9sZTogMC40LFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLlBpZUNoYXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkb251dGNoYXJ0JykpO1xyXG4gICAgICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vdG90YWxCbG9ja1xyXG5jb25zdCB0b3RhbExpbmtzICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWxpbmtzXCIpLFxyXG4gICAgICB0b3RhbFZpZGVvcyAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLXZpZGVvc1wiKSxcclxuICAgICAgdG90YWxHaXRodWIgICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b3RhbC1naXRodWJcIiksXHJcbiAgICAgIHRvdGFsSW1hZ2VzICAgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudG90YWwtaW1hZ2VzXCIpLFxyXG4gICAgICB0b3RhbG1lbnRpb25zICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLW1lbnRpb25zXCIpLFxyXG4gICAgICB0b3RhbEZpbmlzaGVkVGFza3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWZpbmlzaGVkLXRhc2tzXCIpLFxyXG4gICAgICB0b3RhbE1lc3NhZ2VzICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLW1lc3NhZ2VzXCIpLFxyXG4gICAgICB0b3RhbERheXMgICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvdGFsLWRheXNcIik7XHJcblxyXG5cclxuZXhwb3J0cy5yZW5kZXJUb3RhbE1lZGlhU3VtbWFyeUJsb2NrID0gKCkgPT4ge1xyXG4gIGdldE1lc3NhZ2VzKFwiY291bnRcIikudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsTWVzc2FnZXMuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YX08L2I+YDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcImJ5RGF5XCIpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICB0b3RhbERheXMuaW5uZXJIVE1MID0gYDxiPiR7TWF0aC5mbG9vcihkYXRhLmxlbmd0aC8zMCl9IG1vbnRocyAmICR7ZGF0YS5sZW5ndGggJSAzMH0gZGF5czwvYj5gO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICdodHRwJykudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsTGlua3MuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiByZWZlcmVuY2VzYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnLnlvdXR1YmUnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxWaWRlb3MuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiB2aWRlb3NgO1xyXG4gIH0pO1xyXG4gIGdldE1lc3NhZ2VzKFwic2VhcmNoXCIsICcuZ2l0aHViJykudGhlbihkYXRhID0+IHtcclxuICAgIHRvdGFsR2l0aHViLmlubmVySFRNTCA9IGA8Yj4ke2RhdGEubGVuZ3RofTwvYj4gbGlua3MgdG8gZ2l0aHViYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcInNlYXJjaFwiLCAnaHR0cCBpbWcnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxJbWFnZXMuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiBzY3JlZW5zaG90c2A7XHJcbiAgfSk7XHJcbiAgZ2V0TWVzc2FnZXMoXCJzZWFyY2hcIiwgJ0AnKS50aGVuKGRhdGEgPT4ge1xyXG4gICAgdG90YWxtZW50aW9ucy5pbm5lckhUTUwgPSBgPGI+JHtkYXRhLmxlbmd0aH08L2I+IG1lbnRpb25zYDtcclxuICB9KTtcclxuICBnZXRNZXNzYWdlcyhcImZpbmlzaGVkQnlUYXNrc1wiKS50aGVuKChkYXRhLCBodG1sKSA9PiB7XHJcbiAgICB0b3RhbEZpbmlzaGVkVGFza3MuaW5uZXJIVE1MID0gYDxiPiR7ZGF0YS5sZW5ndGh9PC9iPiByZWFkeSB0YXNrc2A7XHJcbiAgfSk7XHJcbn0iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vX2NvbmZpZ1wiKTtcclxuY29uc3QgdGFibGUgPSByZXF1aXJlKFwiLi4vcGx1Z2lucy9fdGFibGVcIik7XHJcblxyXG5leHBvcnQgY29uc3QgaW5zZXJ0VGFza0xpc3RUb1BhZ2UgPSAoZmluaXNoZWRBcnIpID0+IHtcclxuICB2YXIgaW1hZ2VMb2dvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbG9nbycpO1xyXG4gIGltYWdlTG9nby5zcmMgPSBjb25maWcudmFycy5rb3R0YW5zUm9vbS5hdmF0YXI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215SW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRhYmxlLm15RnVuY3Rpb24pO1xyXG5cclxuICB2YXIgaHRtbCA9ICcnO1xyXG5cclxuICB2YXIgZGl2VGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlUYWJsZScpO1xyXG5cclxuICBodG1sICs9IFxyXG4gICAgYDx0ciBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMSl9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5OYW1lPC90aD5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDIpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+TmljazwvdGg+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgzKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPlB1Ymxpc2hlZDwvdGg+XHJcbiAgICAgICAgPHRoIHN0eWxlPVwid2lkdGg6ODAlO1wiPlRleHQ8L3RoPlxyXG4gICAgPC90cj5gO1xyXG4gICAgICAgIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluaXNoZWRBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgIGh0bWwgKz0gXHJcbiAgICAgICAgYDx0cj5cclxuICAgICAgICAgIDx0ZD48aW1nIHNyYz1cIiR7ZmluaXNoZWRBcnJbaV0uYXZhdGFyVXJsfVwiIGNsYXNzPVwidXNlci1pY29uXCI+JHtmaW5pc2hlZEFycltpXS5kaXNwbGF5TmFtZX08L3RkPlxyXG4gICAgICAgICAgPHRkPig8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tJHtmaW5pc2hlZEFycltpXS51cmx9XCI+JHtmaW5pc2hlZEFycltpXS51c2VybmFtZX08L2E+KTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS5zZW50fTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS50ZXh0fSA8L3RkPlxyXG4gICAgICAgIDwvdHI+YDtcclxuICB9XHJcbmRpdlRhYmxlLmlubmVySFRNTCA9IGh0bWw7XHJcbn0iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vX2NvbmZpZ1wiKTtcclxuY29uc3Qgc2VsID0gcmVxdWlyZSgnLi4vcGx1Z2lucy9fc2VsZWN0b3JzJyk7XHJcbmltcG9ydCB7IHJlcXVlc3QgYXMgZ2V0TWVzc2FnZXMgfSBmcm9tIFwiLi4vX3JlcXVlc3QtbmV3XCI7XHJcblxyXG5leHBvcnRzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGZlYXR1cmUgMVxyXG4gIGdldE1lc3NhZ2VzKCdjb3VudCcpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MubWVzc2FnZXNDb3VudC5pbm5lckhUTUwgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDJcclxuICBnZXRNZXNzYWdlcyhcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mva290dGFucy9mcm9udGVuZFwiKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLnN0YXJyZWRSZXBvLmlubmVySFRNTCA9IChkYXRhLnN0YXJnYXplcnNfY291bnQgPT0gdW5kZWZpbmVkKSA/IFwiLi4uXCIgOiBkYXRhLnN0YXJnYXplcnNfY291bnQ7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgM1xyXG4gIGdldE1lc3NhZ2VzKFwiYXV0aG9yc1wiKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLmFjdGl2ZVVzZXJzQ291bnQuaW5uZXJIVE1MID0gZGF0YS5sZW5ndGg7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgNFxyXG4gIGdldE1lc3NhZ2VzKFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9zZWFyY2gvaXNzdWVzP3E9K3R5cGU6cHIrdXNlcjprb3R0YW5zJnNvcnQ9Y3JlYXRlZCYlRTIlODAlOEMlRTIlODAlOEJvcmRlcj1hc2NcIikudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgdmFyIHB1bGxOdW1iZXIgPSBkYXRhLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtyZXR1cm4gaXRlbS5yZXBvc2l0b3J5X3VybCA9PSBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mva290dGFucy9tb2NrLXJlcG9cIjt9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwdWxsLXJlcXVlc3RzXCIpWzBdLmlubmVySFRNTCA9IHB1bGxOdW1iZXIubnVtYmVyO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDVcclxuICBnZXRNZXNzYWdlcyhcImxlYXJuZXJzXCIpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MuYmxvY2tMZWFybmVycy5pbm5lckhUTUwgPSBkYXRhLmxlbmd0aDtcclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0cy5kcmF3Q291bnRPZlRhc2tzUGVyVXNlcl9WZXJ0aWNhbEJhciA9IGZ1bmN0aW9uKHVzZXJzKSB7XHJcbiAgbGV0IGdyYXBoQXJyID0gdXNlcnMubWFwKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgIHJldHVybiBuZXcgQXJyYXkodXNlci51c2VybmFtZStcIlwiLCB1c2VyLmxlc3NvbnMubGVuZ3RoLCBcImxpZ2h0Ymx1ZVwiKTtcclxuICB9KTtcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoJ2N1cnJlbnQnLCB7cGFja2FnZXM6IFsnY29yZWNoYXJ0JywgJ2JhciddfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3QmFzaWMpO1xyXG4gIGZ1bmN0aW9uIGRyYXdCYXNpYygpIHtcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGljYWxfY2hhcnQnKTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5Db2x1bW5DaGFydChjb250YWluZXIpO1xyXG4gICAgZ3JhcGhBcnIudW5zaGlmdChbJ1VzZXInLCAnVGFza3MnLCB7IHJvbGU6ICdzdHlsZScgfV0pXHJcbiAgICB2YXIgZGF0YSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmFycmF5VG9EYXRhVGFibGUoZ3JhcGhBcnIpO1xyXG4gIHZhciBvcHRpb25zID0ge1xyXG4gICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxyXG4gICAgICBzdGFydHVwOiB0cnVlIC8vVGhpcyBpcyB0aGUgbmV3IG9wdGlvblxyXG4gICAgfSxcclxuICAgIHRpdGxlOiAnU3VtIG9mIGZpbmlzaGVkIHRhc2tzIGJ5IGVhY2ggbGVhcm5lcicsXHJcbiAgICAvLyB3aWR0aDogKCQod2luZG93KS53aWR0aCgpIDwgODAwKSA/ICQod2luZG93KS53aWR0aCgpIDogJCh3aW5kb3cpLndpZHRoKCkqMC41LFxyXG4gICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLFxyXG4gICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkqMC4zLFxyXG4gICAgaEF4aXM6IHtcclxuICAgICAgc2xhbnRlZFRleHQ6dHJ1ZSxcclxuICAgICAgc2xhbnRlZFRleHRBbmdsZTo5MCwgICAgICAgIFxyXG4gICAgfSxcclxuICAgIHZBeGlzOiB7XHJcbiAgICAgIC8vdGl0bGU6ICdTdW0gb2YgZmluaXNoZWQgdGFza3MnXHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uOntcclxuICAgICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICAgIGVhc2luZzogJ291dCdcclxuICAgIH0sXHJcbiAgfTtcclxuICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufSBcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5leHBvcnRzLmRyYXdBY3Rpdml0eV9MaW5lQ2hhcnQgPSBmdW5jdGlvbihhY3Rpdml0eUFycikge1xyXG4gIGFjdGl2aXR5QXJyLm1hcChmdW5jdGlvbihkYXkpIHtcclxuICAgIGRheVswXSA9IG5ldyBEYXRlKGRheVswXSk7XHJcbiAgfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKCdjdXJyZW50Jywge3BhY2thZ2VzOiBbJ2NvcmVjaGFydCcsICdsaW5lJ119KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdCYXNpYyk7XHJcblxyXG4gIGZ1bmN0aW9uIGRyYXdCYXNpYygpIHtcclxuICAgIHZhciBkYXRhID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpO1xyXG4gICAgZGF0YS5hZGRDb2x1bW4oJ2RhdGUnLCAnRGF5cycpO1xyXG4gICAgZGF0YS5hZGRDb2x1bW4oJ251bWJlcicsICdNZXNzYWdlcycpO1xyXG4gICAgZGF0YS5hZGRSb3dzKGFjdGl2aXR5QXJyKTtcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICB0aXRsZTogXCJBY3Rpdml0eSBvZiB1c2VycyBpbiBjaGF0XCIsXHJcbiAgICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxyXG4gICAgICAgIHN0YXJ0dXA6IHRydWUgLy9UaGlzIGlzIHRoZSBuZXcgb3B0aW9uXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vY3VydmVUeXBlOiAnZnVuY3Rpb24nLFxyXG4gICAgICAvLyB3aWR0aDogKCQod2luZG93KS53aWR0aCgpIDwgODAwKSA/ICQod2luZG93KS53aWR0aCgpIDogJCh3aW5kb3cpLndpZHRoKCkqMC41LFxyXG4gICAgICB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIFxyXG4gICAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSowLjMsXHJcbiAgICAgIGhBeGlzOiB7XHJcbiAgICAgICAgc2xhbnRlZFRleHQ6dHJ1ZSxcclxuICAgICAgICBzbGFudGVkVGV4dEFuZ2xlOjQ1LFxyXG4gICAgICB9LFxyXG4gICAgICB2QXhpczoge1xyXG4gICAgICAgIC8vIHRpdGxlOiAnQ291bnQgb2YgbWVzc2EnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uTGluZUNoYXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5lY2hhcnQnKSk7XHJcbiAgICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufSIsImV4cG9ydHMuZHJhd1RpbWVsaW5lQ2hhcnQgPSBmdW5jdGlvbihncmFwaEFycikge1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZChcImN1cnJlbnRcIiwge3BhY2thZ2VzOltcInRpbWVsaW5lXCJdfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3Q2hhcnQpO1xyXG4gIGZ1bmN0aW9uIGRyYXdDaGFydCgpIHtcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZWxpbmUnKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5UaW1lbGluZShjb250YWluZXIpO1xyXG4gICAgdmFyIGRhdGFUYWJsZSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnc3RyaW5nJywgaWQ6ICdSb29tJyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnc3RyaW5nJywgaWQ6ICdOYW1lJyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnZGF0ZScsIGlkOiAnU3RhcnQnIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdkYXRlJywgaWQ6ICdFbmQnIH0pO1xyXG4gICAgXHJcbiAgICBncmFwaEFyci5tYXAoZWxlbWVudCA9PiB7XHJcbiAgICAgIGVsZW1lbnRbMl0gPSBuZXcgRGF0ZShlbGVtZW50WzJdKTtcclxuICAgICAgZWxlbWVudFszXSA9IG5ldyBEYXRlKGVsZW1lbnRbM10pO1xyXG4gICAgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkUm93cyhncmFwaEFycik7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCksXHJcbiAgICAgIHRpbWVsaW5lOiB7IGNvbG9yQnlSb3dMYWJlbDogdHJ1ZSB9LFxyXG4gICAgICBoQXhpczoge1xyXG4gICAgICAgICAgbWluVmFsdWU6IG5ldyBEYXRlKDIwMTcsIDksIDI5KSxcclxuICAgICAgICAgIG1heFZhbHVlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArICgxICogNjAgKiA2MCAqIDEwMDAwMCkpXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjaGFydC5kcmF3KGRhdGFUYWJsZSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59Il19

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
const config = require("./_config");

exports.request = function (link, renderCallback, fetchOptions) {
  var url = '';
  if (/http/.test(link)) {
    url = link;
  } else {
    url = config.vars.domain + link + config.vars.hash;
  }

  let requestObj = fetchOptions ? new Request(url, fetchOptions) : new Request(url);
  fetch(requestObj).then(res => {
    res.json().then(response => {
      // console.log(response)
      if (renderCallback) {
        renderCallback(response);
      }
    });
  }).catch(error => {
    console.log(error);
  });
};

function getSingleRequest(url, renderCallback) {
  fetch(url).then(function (response) {
    return response.json();
  }).then(renderCallback()).catch(alert);
}

},{"./_config":1}],3:[function(require,module,exports){
const countdown = require("./plugins/_countdown");
const request = require('./_request');
const pageStatistics = require("./render/_page-statistics");
const pageTimeline = require("./render/_page-timeline");
const pageSearch = require("./render/_page-search");

request.request("latest");
request.request("latest", init);

function init() {
  //timeline
  // window.onload = function () {
  request.request("finishedT", pageTimeline.drawTimelineChart);
  request.request("finishedA", pageSearch.insertTaskListToPage);
  // }

  //page statistics
  // countdown.initTimer();
  pageStatistics.insertValuesToFeaturesCards();
  request.request("learners", pageStatistics.drawCountOfTasksPerUser_VerticalBar);
  request.request("activity", pageStatistics.drawActivity_LineChart);
}

},{"./_request":2,"./plugins/_countdown":4,"./render/_page-search":7,"./render/_page-statistics":8,"./render/_page-timeline":9}],4:[function(require,module,exports){
//COUNTDOWN TIMER
//slickcitcular https://www.jqueryscript.net/demo/Slick-Circular-jQuery-Countdown-Plugin-Classy-Countdown/

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
    onEndCallback: function () {}
  });
};

},{}],5:[function(require,module,exports){
exports.blocks = {
  messagesCount: document.querySelector(".count-messages"),
  starredRepo: document.querySelector(".starred-repo"),
  activeUsersCount: document.querySelector(".active-users"),
  blockLearners: document.querySelector(".learners")

};

},{}],6:[function(require,module,exports){
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
const config = require("../_config");
const table = require("../plugins/_table");

exports.insertTaskListToPage = function (finishedArr) {
  var imageLogo = document.getElementById('main-logo');
  imageLogo.src = config.vars.kottansRoom.avatar;
  document.querySelector('#myInput').addEventListener('input', table.myFunction);

  var html = '';

  var divTable = document.getElementById('myTable');

  html += `<tr class="header">
        <th onclick="${table.sortTable(1)}" style="width:5%;">Name</th>
        <th onclick="${table.sortTable(2)}" style="width:5%;">Nick</th>
        <th onclick="${table.sortTable(3)}" style="width:5%;">Published</th>
        <th style="width:80%;">Text</th>
    </tr>`;

  for (var i = 0; i < finishedArr.length; i++) {
    html += `<tr>
          <td><img src="${finishedArr[i].avatarUrl}" class="user-icon">${finishedArr[i].displayName}</td>
          <td>(<a target="_blank" href="https://github.com${finishedArr[i].url}">${finishedArr[i].username}</a>)</td>
          <td>${finishedArr[i].sent}</td>
          <td>${finishedArr[i].text} </td>
        </tr>`;
  }
  divTable.innerHTML = html;
};

},{"../_config":1,"../plugins/_table":6}],8:[function(require,module,exports){
const config = require("../_config");
const request = require('../_request');
const sel = require('../plugins/_selectors');

exports.insertValuesToFeaturesCards = function () {
  // feature 1
  request.request('count', data => {
    sel.blocks.messagesCount.innerHTML = data;
  });

  // feature 2
  request.request("https://api.github.com/repos/kottans/frontend", data => {
    sel.blocks.starredRepo.innerHTML = data.stargazers_count == undefined ? "..." : data.stargazers_count;
  });

  // feature 3
  request.request("authors", data => {
    sel.blocks.activeUsersCount.innerHTML = data;
  });

  // feature 4
  request.request("https://api.github.com/search/issues?q=+type:pr+user:kottans&sort=created&%E2%80%8C%E2%80%8Border=asc", data => {
    var pullNumber = data.items.find(item => {
      return item.repository_url == "https://api.github.com/repos/kottans/mock-repo";
    });
    document.getElementsByClassName("pull-requests")[0].innerHTML = pullNumber.number;
  });

  // feature 5
  request.request("learners", data => {
    sel.blocks.blockLearners.innerHTML = data.length;
  });
};

exports.drawCountOfTasksPerUser_VerticalBar = function (users) {
  let graphArr = users.map(function (user) {
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
      height: $(window).height() * 0.45,
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
      height: $(window).height() * 0.45,
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

},{"../_config":1,"../_request":2,"../plugins/_selectors":5}],9:[function(require,module,exports){
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

    graphArr.map(element => {
      element[2] = new Date(element[2]);
      element[3] = new Date(element[3]);
    });
    dataTable.addRows(graphArr);

    var options = {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvX2NvbmZpZy5qcyIsImFwcC9qcy9fcmVxdWVzdC5qcyIsImFwcC9qcy9hcHAuanMiLCJhcHAvanMvcGx1Z2lucy9fY291bnRkb3duLmpzIiwiYXBwL2pzL3BsdWdpbnMvX3NlbGVjdG9ycy5qcyIsImFwcC9qcy9wbHVnaW5zL190YWJsZS5qcyIsImFwcC9qcy9yZW5kZXIvX3BhZ2Utc2VhcmNoLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS1zdGF0aXN0aWNzLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS10aW1lbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFFBQVEsSUFBUixHQUFlO0FBQ2IsUUFBTSwwQ0FETztBQUViLFVBQVEsMkNBRks7QUFHYjtBQUNBLGVBQWE7QUFDWDtBQUNBLFlBQVM7QUFGRTtBQUpBLENBQWY7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RCQSxNQUFNLFNBQVMsUUFBUSxXQUFSLENBQWY7O0FBRUEsUUFBUSxPQUFSLEdBQWtCLFVBQVMsSUFBVCxFQUFlLGNBQWYsRUFBK0IsWUFBL0IsRUFBNkM7QUFDN0QsTUFBSSxNQUFNLEVBQVY7QUFDQSxNQUFHLE9BQU8sSUFBUCxDQUFZLElBQVosQ0FBSCxFQUFzQjtBQUNwQixVQUFNLElBQU47QUFDRCxHQUZELE1BR0s7QUFDSCxVQUFNLE9BQU8sSUFBUCxDQUFZLE1BQVosR0FBcUIsSUFBckIsR0FBNEIsT0FBTyxJQUFQLENBQVksSUFBOUM7QUFDRDs7QUFFRCxNQUFJLGFBQWMsWUFBRCxHQUFpQixJQUFJLE9BQUosQ0FBWSxHQUFaLEVBQWlCLFlBQWpCLENBQWpCLEdBQWtELElBQUksT0FBSixDQUFZLEdBQVosQ0FBbkU7QUFDQSxRQUFNLFVBQU4sRUFDRyxJQURILENBQ1EsT0FBTztBQUNYLFFBQUksSUFBSixHQUFXLElB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QXRCO0FBQ0Q7QUFDRixDQTVCRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLnZhcnMgPSB7XHJcbiAgaGFzaDogJzdlMTZiNTUyN2M3N2VhNThiYWMzNmRkZGRhNmY1YjQ0NGYzMmU4MWInLFxyXG4gIGRvbWFpbjogXCJodHRwczovL3NlY3JldC1lYXJ0aC01MDkzNi5oZXJva3VhcHAuY29tL1wiLFxyXG4gIC8vIGRvbWFpbjogXCJodHRwOi8vbG9jYWxob3N0OjMwMDAvXCIsXHJcbiAga290dGFuc1Jvb206IHtcclxuICAgIC8vIGlkIDogXCI1OWIwZjI5YmQ3MzQwOGNlNGY3NGIwNmZcIixcclxuICAgIGF2YXRhciA6IFwiaHR0cHM6Ly9hdmF0YXJzLTAyLmdpdHRlci5pbS9ncm91cC9pdi8zLzU3NTQyZDI3YzQzYjhjNjAxOTc3YTBiNlwiXHJcbiAgfVxyXG59O1xyXG4gXHJcblxyXG4vLyB2YXIgZ2xvYmFsID0ge1xyXG4vLyAgIHRva2VuU3RyaW5nIDogXCJhY2Nlc3NfdG9rZW49XCIgKyBcIjllMTMxOTBhNmY3MGUyOGI2ZTI2MzAxMWU2M2Q0YjM0ZDI2YmQ2OTdcIixcclxuLy8gICByb29tVXJsUHJlZml4IDogXCJodHRwczovL2FwaS5naXR0ZXIuaW0vdjEvcm9vbXMvXCJcclxuLy8gfTtcclxuXHJcblxyXG5cclxuLy8gZnVuY3Rpb24gZ2V0QWxsUm9vbU1lc3NhZ2VzKGNvdW50LCBvbGRlc3RJZCkge1xyXG4vLyAgIGlmKG9sZGVzdElkKXtvbGRlc3RJZCA9IFwiJmJlZm9yZUlkPVwiK29sZGVzdElkO30gXHJcbi8vICAgcmV0dXJuIGdsb2JhbC5yb29tVXJsUHJlZml4ICsga290dGFuc1Jvb20uaWQgK1xyXG4vLyAgICAgICAgICAgXCIvY2hhdE1lc3NhZ2VzP2xpbWl0PVwiKyBjb3VudCArIG9sZGVzdElkICtcIiZcIiArIGdsb2JhbC50b2tlblN0cmluZztcclxuLy8gICB9OyBcclxuIiwiY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4vX2NvbmZpZ1wiKTtcclxuXHJcbmV4cG9ydHMucmVxdWVzdCA9IGZ1bmN0aW9uKGxpbmssIHJlbmRlckNhbGxiYWNrLCBmZXRjaE9wdGlvbnMpIHtcclxuICB2YXIgdXJsID0gJydcclxuICBpZigvaHR0cC8udGVzdChsaW5rKSkge1xyXG4gICAgdXJsID0gbGluaztcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB1cmwgPSBjb25maWcudmFycy5kb21haW4gKyBsaW5rICsgY29uZmlnLnZhcnMuaGFzaDtcclxuICB9XHJcblxyXG4gIGxldCByZXF1ZXN0T2JqID0gKGZldGNoT3B0aW9ucykgPyBuZXcgUmVxdWVzdCh1cmwsIGZldGNoT3B0aW9ucykgOiBuZXcgUmVxdWVzdCh1cmwpO1xyXG4gIGZldGNoKHJlcXVlc3RPYmopXHJcbiAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICByZXMuanNvbigpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxyXG4gICAgICAgIGlmKHJlbmRlckNhbGxiYWNrKSB7XHJcbiAgICAgICAgICByZW5kZXJDYWxsYmFjayhyZXNwb25zZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9KTtcclxuICB9IFxyXG5cclxuICBmdW5jdGlvbiBnZXRTaW5nbGVSZXF1ZXN0KHVybCwgcmVuZGVyQ2FsbGJhY2spIHtcclxuICAgIGZldGNoKHVybClcclxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oIHJlbmRlckNhbGxiYWNrKCkgKVxyXG4gICAgLmNhdGNoKGFsZXJ0KTtcclxuICB9IiwiY29uc3QgY291bnRkb3duICAgICAgPSByZXF1aXJlKFwiLi9wbHVnaW5zL19jb3VudGRvd25cIik7XHJcbmNvbnN0IHJlcXVlc3QgICAgICAgID0gcmVxdWlyZSgnLi9fcmVxdWVzdCcpO1xyXG5jb25zdCBwYWdlU3RhdGlzdGljcyA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS1zdGF0aXN0aWNzXCIpO1xyXG5jb25zdCBwYWdlVGltZWxpbmUgICA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS10aW1lbGluZVwiKTtcclxuY29uc3QgcGFnZVNlYXJjaCAgICAgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2Utc2VhcmNoXCIpO1xyXG5cclxucmVxdWVzdC5yZXF1ZXN0KFwibGF0ZXN0XCIpO1xyXG5yZXF1ZXN0LnJlcXVlc3QoXCJsYXRlc3RcIiwgaW5pdCk7XHJcblxyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gIC8vdGltZWxpbmVcclxuICAvLyB3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmVxdWVzdC5yZXF1ZXN0KFwiZmluaXNoZWRUXCIsIHBhZ2VUaW1lbGluZS5kcmF3VGltZWxpbmVDaGFydCk7XHJcbiAgICByZXF1ZXN0LnJlcXVlc3QoXCJmaW5pc2hlZEFcIiwgcGFnZVNlYXJjaC5pbnNlcnRUYXNrTGlzdFRvUGFnZSk7XHJcbiAgLy8gfVxyXG5cclxuICAvL3BhZ2Ugc3RhdGlzdGljc1xyXG4gIC8vIGNvdW50ZG93bi5pbml0VGltZXIoKTtcclxuICBwYWdlU3RhdGlzdGljcy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMoKTtcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJsZWFybmVyc1wiLCBwYWdlU3RhdGlzdGljcy5kcmF3Q291bnRPZlRhc2tzUGVyVXNlcl9WZXJ0aWNhbEJhcik7XHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwiYWN0aXZpdHlcIiwgcGFnZVN0YXRpc3RpY3MuZHJhd0FjdGl2aXR5X0xpbmVDaGFydCk7XHJcblxyXG59XHJcblxyXG5cclxuICIsIi8vQ09VTlRET1dOIFRJTUVSXHJcbi8vc2xpY2tjaXRjdWxhciBodHRwczovL3d3dy5qcXVlcnlzY3JpcHQubmV0L2RlbW8vU2xpY2stQ2lyY3VsYXItalF1ZXJ5LUNvdW50ZG93bi1QbHVnaW4tQ2xhc3N5LUNvdW50ZG93bi9cclxuXHJcbmV4cG9ydHMuaW5pdFRpbWVyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHRpbWVFbmQgPSBNYXRoLnJvdW5kKCAobmV3IERhdGUoXCIyMDE4LjAyLjEwXCIpLmdldFRpbWUoKSAtICQubm93KCkpIC8gMTAwMCk7XHJcbiAgICAgIHRpbWVFbmQgPSBNYXRoLmZsb29yKHRpbWVFbmQgLyA4NjQwMCkgKiA4NjQwMDtcclxuXHJcbiAgJCgnI2NvdW50ZG93bi1jb250YWluZXInKS5DbGFzc3lDb3VudGRvd24oe1xyXG4gICAgdGhlbWU6IFwid2hpdGVcIiwgXHJcbiAgICBlbmQ6ICQubm93KCkgKyB0aW1lRW5kLCAvL2VuZDogJC5ub3coKSArIDY0NTYwMCxcclxuICAgIG5vdzogJC5ub3coKSxcclxuICAgIC8vIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgZGF5cy9ob3Vycy9taW51dGVzL3NlY29uZHMgbGFiZWxzLlxyXG4gICAgbGFiZWxzOiB0cnVlLFxyXG4gICAgLy8gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIGRpZmZlcmVudCBsYW5ndWFnZSBwaHJhc2VzIGZvciBzYXlzL2hvdXJzL21pbnV0ZXMvc2Vjb25kcyBhcyB3ZWxsIGFzIHNwZWNpZmljIENTUyBzdHlsZXMuXHJcbiAgICBsYWJlbHNPcHRpb25zOiB7XHJcbiAgICAgIGxhbmc6IHtcclxuICAgICAgICBkYXlzOiAnRGF5cycsXHJcbiAgICAgICAgaG91cnM6ICdIb3VycycsXHJcbiAgICAgICAgbWludXRlczogJ01pbnV0ZXMnLFxyXG4gICAgICAgIHNlY29uZHM6ICdTZWNvbmRzJ1xyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZTogJ2ZvbnQtc2l6ZTogMC41ZW07J1xyXG4gICAgfSxcclxuICAgIC8vIGN1c3RvbSBzdHlsZSBmb3IgdGhlIGNvdW50ZG93blxyXG4gICAgc3R5bGU6IHtcclxuICAgICAgZWxlbWVudDogJycsXHJcbiAgICAgIGxhYmVsczogZmFsc2UsXHJcbiAgICAgIGRheXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyMxQUJDOUMnLC8vJ3JnYmEoMCwgMCwgMCwgMSknLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBob3Vyczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzI5ODBCOScsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIG1pbnV0ZXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyM4RTQ0QUQnLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBzZWNvbmRzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjRjM5QzEyJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsYmFjayB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGNvdW50ZG93biByZWFjaGVzIDAuXHJcbiAgICBvbkVuZENhbGxiYWNrOiBmdW5jdGlvbigpIHt9XHJcbiAgfSk7XHJcbn0iLCJleHBvcnRzLmJsb2NrcyA9IHtcclxuICBtZXNzYWdlc0NvdW50OiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvdW50LW1lc3NhZ2VzXCIpLFxyXG4gIHN0YXJyZWRSZXBvOiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnJlZC1yZXBvXCIpLFxyXG4gIGFjdGl2ZVVzZXJzQ291bnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXVzZXJzXCIpLFxyXG4gIGJsb2NrTGVhcm5lcnM6ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGVhcm5lcnNcIiksXHJcbiAgXHJcbn0gIiwiZXhwb3J0cy5teUZ1bmN0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gRGVjbGFyZSB2YXJpYWJsZXMgXHJcbiAgdmFyIGlucHV0LCBmaWx0ZXIsIHRhYmxlLCB0ciwgdGQsIGk7XHJcbiAgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXRcIik7XHJcbiAgZmlsdGVyID0gaW5wdXQudmFsdWUudG9VcHBlckNhc2UoKTtcclxuICB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTtcclxuICB0ciA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIik7XHJcblxyXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cywgYW5kIGhpZGUgdGhvc2Ugd2hvIGRvbid0IG1hdGNoIHRoZSBzZWFyY2ggcXVlcnlcclxuICBmb3IgKGkgPSAwOyBpIDwgdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIHRkID0gdHJbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZFwiKVswXTtcclxuICAgIGlmICh0ZCkge1xyXG4gICAgICBpZiAodGQuaW5uZXJIVE1MLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIpID4gLTEpIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0cy5zb3J0VGFibGUgPSBmdW5jdGlvbihuKSB7XHJcbiAgdmFyIHRhYmxlLCByb3dzLCBzd2l0Y2hpbmcsIGksIHgsIHksIHNob3VsZFN3aXRjaCwgZGlyLCBzd2l0Y2hjb3VudCA9IDA7XHJcbiAgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VGFibGVcIik7XHJcbiAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAvLyBTZXQgdGhlIHNvcnRpbmcgZGlyZWN0aW9uIHRvIGFzY2VuZGluZzpcclxuICBkaXIgPSBcImFzY1wiOyBcclxuICAvKiBNYWtlIGEgbG9vcCB0aGF0IHdpbGwgY29udGludWUgdW50aWxcclxuICBubyBzd2l0Y2hpbmcgaGFzIGJlZW4gZG9uZTogKi9cclxuICB3aGlsZSAoc3dpdGNoaW5nKSB7XHJcbiAgICAvLyBTdGFydCBieSBzYXlpbmc6IG5vIHN3aXRjaGluZyBpcyBkb25lOlxyXG4gICAgc3dpdGNoaW5nID0gZmFsc2U7XHJcbiAgICByb3dzID0gdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJUUlwiKTtcclxuICAgIC8qIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cyAoZXhjZXB0IHRoZVxyXG4gICAgZmlyc3QsIHdoaWNoIGNvbnRhaW5zIHRhYmxlIGhlYWRlcnMpOiAqL1xyXG4gICAgZm9yIChpID0gMTsgaSA8IChyb3dzLmxlbmd0aCAtIDEpOyBpKyspIHtcclxuICAgICAgLy8gU3RhcnQgYnkgc2F5aW5nIHRoZXJlIHNob3VsZCBiZSBubyBzd2l0Y2hpbmc6XHJcbiAgICAgIHNob3VsZFN3aXRjaCA9IGZhbHNlO1xyXG4gICAgICAvKiBHZXQgdGhlIHR3byBlbGVtZW50cyB5b3Ugd2FudCB0byBjb21wYXJlLFxyXG4gICAgICBvbmUgZnJvbSBjdXJyZW50IHJvdyBhbmQgb25lIGZyb20gdGhlIG5leHQ6ICovXHJcbiAgICAgIHggPSByb3dzW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVERcIilbbl07XHJcbiAgICAgIHkgPSByb3dzW2kgKyAxXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlREXCIpW25dO1xyXG4gICAgICAvKiBDaGVjayBpZiB0aGUgdHdvIHJvd3Mgc2hvdWxkIHN3aXRjaCBwbGFjZSxcclxuICAgICAgYmFzZWQgb24gdGhlIGRpcmVjdGlvbiwgYXNjIG9yIGRlc2M6ICovXHJcbiAgICAgIGlmIChkaXIgPT0gXCJhc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpID4geS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGRpciA9PSBcImRlc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpIDwgeS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoc2hvdWxkU3dpdGNoKSB7XHJcbiAgICAgIC8qIElmIGEgc3dpdGNoIGhhcyBiZWVuIG1hcmtlZCwgbWFrZSB0aGUgc3dpdGNoXHJcbiAgICAgIGFuZCBtYXJrIHRoYXQgYSBzd2l0Y2ggaGFzIGJlZW4gZG9uZTogKi9cclxuICAgICAgcm93c1tpXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyb3dzW2kgKyAxXSwgcm93c1tpXSk7XHJcbiAgICAgIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgICAgIC8vIEVhY2ggdGltZSBhIHN3aXRjaCBpcyBkb25lLCBpbmNyZWFzZSB0aGlzIGNvdW50IGJ5IDE6XHJcbiAgICAgIHN3aXRjaGNvdW50ICsrOyBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8qIElmIG5vIHN3aXRjaGluZyBoYXMgYmVlbiBkb25lIEFORCB0aGUgZGlyZWN0aW9uIGlzIFwiYXNjXCIsXHJcbiAgICAgIHNldCB0aGUgZGlyZWN0aW9uIHRvIFwiZGVzY1wiIGFuZCBydW4gdGhlIHdoaWxlIGxvb3AgYWdhaW4uICovXHJcbiAgICAgIGlmIChzd2l0Y2hjb3VudCA9PSAwICYmIGRpciA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgZGlyID0gXCJkZXNjXCI7XHJcbiAgICAgICAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCB0YWJsZSA9IHJlcXVpcmUoXCIuLi9wbHVnaW5zL190YWJsZVwiKTtcclxuXHJcblxyXG5cclxuZXhwb3J0cy5pbnNlcnRUYXNrTGlzdFRvUGFnZSA9IGZ1bmN0aW9uKGZpbmlzaGVkQXJyKSB7XHJcbiAgdmFyIGltYWdlTG9nbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWxvZ28nKTtcclxuICBpbWFnZUxvZ28uc3JjID0gY29uZmlnLnZhcnMua290dGFuc1Jvb20uYXZhdGFyO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteUlucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0YWJsZS5teUZ1bmN0aW9uKTtcclxuXHJcbiAgdmFyIGh0bWwgPSAnJztcclxuXHJcbiAgdmFyIGRpdlRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215VGFibGUnKTtcclxuXHJcbiAgaHRtbCArPSBcclxuICAgIGA8dHIgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDEpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+TmFtZTwvdGg+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgyKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPk5pY2s8L3RoPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMyl9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5QdWJsaXNoZWQ8L3RoPlxyXG4gICAgICAgIDx0aCBzdHlsZT1cIndpZHRoOjgwJTtcIj5UZXh0PC90aD5cclxuICAgIDwvdHI+YDtcclxuICAgICAgICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmlzaGVkQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBodG1sICs9IFxyXG4gICAgICAgIGA8dHI+XHJcbiAgICAgICAgICA8dGQ+PGltZyBzcmM9XCIke2ZpbmlzaGVkQXJyW2ldLmF2YXRhclVybH1cIiBjbGFzcz1cInVzZXItaWNvblwiPiR7ZmluaXNoZWRBcnJbaV0uZGlzcGxheU5hbWV9PC90ZD5cclxuICAgICAgICAgIDx0ZD4oPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbSR7ZmluaXNoZWRBcnJbaV0udXJsfVwiPiR7ZmluaXNoZWRBcnJbaV0udXNlcm5hbWV9PC9hPik8L3RkPlxyXG4gICAgICAgICAgPHRkPiR7ZmluaXNoZWRBcnJbaV0uc2VudH08L3RkPlxyXG4gICAgICAgICAgPHRkPiR7ZmluaXNoZWRBcnJbaV0udGV4dH0gPC90ZD5cclxuICAgICAgICA8L3RyPmA7XHJcbiAgfVxyXG4gIGRpdlRhYmxlLmlubmVySFRNTCA9IGh0bWw7XHJcbn0iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vX2NvbmZpZ1wiKTtcclxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4uL19yZXF1ZXN0Jyk7XHJcbmNvbnN0IHNlbCA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvX3NlbGVjdG9ycycpO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0cy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMgPSBmdW5jdGlvbigpIHtcclxuICAvLyBmZWF0dXJlIDFcclxuICByZXF1ZXN0LnJlcXVlc3QoJ2NvdW50JywgKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MubWVzc2FnZXNDb3VudC5pbm5lckhUTUwgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDJcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2tvdHRhbnMvZnJvbnRlbmRcIiwgKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3Muc3RhcnJlZFJlcG8uaW5uZXJIVE1MID0gKGRhdGEuc3RhcmdhemVyc19jb3VudCA9PSB1bmRlZmluZWQpID8gXCIuLi5cIiA6IGRhdGEuc3RhcmdhemVyc19jb3VudDtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSAzXHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwiYXV0aG9yc1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5hY3RpdmVVc2Vyc0NvdW50LmlubmVySFRNTCA9IGRhdGE7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgNFxyXG4gIHJlcXVlc3QucmVxdWVzdChcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vc2VhcmNoL2lzc3Vlcz9xPSt0eXBlOnByK3VzZXI6a290dGFucyZzb3J0PWNyZWF0ZWQmJUUyJTgwJThDJUUyJTgwJThCb3JkZXI9YXNjXCIsIChkYXRhKSA9PiB7XHJcbiAgICB2YXIgcHVsbE51bWJlciA9IGRhdGEuaXRlbXMuZmluZCgoaXRlbSkgPT4ge3JldHVybiBpdGVtLnJlcG9zaXRvcnlfdXJsID09IFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9rb3R0YW5zL21vY2stcmVwb1wiO30pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInB1bGwtcmVxdWVzdHNcIilbMF0uaW5uZXJIVE1MID0gcHVsbE51bWJlci5udW1iZXI7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgNVxyXG4gIHJlcXVlc3QucmVxdWVzdChcImxlYXJuZXJzXCIsIChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLmJsb2NrTGVhcm5lcnMuaW5uZXJIVE1MID0gZGF0YS5sZW5ndGg7XHJcbiAgfSk7XHJcbn1cclxuXHJcblxyXG5leHBvcnRzLmRyYXdDb3VudE9mVGFza3NQZXJVc2VyX1ZlcnRpY2FsQmFyID0gZnVuY3Rpb24odXNlcnMpIHtcclxuICBsZXQgZ3JhcGhBcnIgPSB1c2Vycy5tYXAoZnVuY3Rpb24odXNlcikge1xyXG4gICAgcmV0dXJuIG5ldyBBcnJheSh1c2VyLnVzZXJuYW1lK1wiXCIsIHVzZXIubGVzc29ucy5sZW5ndGgsIFwibGlnaHRibHVlXCIpO1xyXG4gIH0pO1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZCgnY3VycmVudCcsIHtwYWNrYWdlczogWydjb3JlY2hhcnQnLCAnYmFyJ119KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdCYXNpYyk7XHJcbiAgZnVuY3Rpb24gZHJhd0Jhc2ljKCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZXJ0aWNhbF9jaGFydCcpO1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNvbHVtbkNoYXJ0KGNvbnRhaW5lcik7XHJcbiAgICBncmFwaEFyci51bnNoaWZ0KFsnVXNlcicsICdUYXNrcycsIHsgcm9sZTogJ3N0eWxlJyB9XSlcclxuICAgIHZhciBkYXRhID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZShncmFwaEFycik7XHJcbiAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICBhbmltYXRpb246IHtcclxuICAgICAgZHVyYXRpb246IDIwMDAsXHJcbiAgICAgIHN0YXJ0dXA6IHRydWUgLy9UaGlzIGlzIHRoZSBuZXcgb3B0aW9uXHJcbiAgICB9LFxyXG4gICAgdGl0bGU6ICdTdW0gb2YgZmluaXNoZWQgdGFza3MgYnkgZWFjaCBsZWFybmVyJyxcclxuICAgIC8vIHdpZHRoOiAoJCh3aW5kb3cpLndpZHRoKCkgPCA4MDApID8gJCh3aW5kb3cpLndpZHRoKCkgOiAkKHdpbmRvdykud2lkdGgoKSowLjUsXHJcbiAgICB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksXHJcbiAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSowLjQ1LFxyXG4gICAgaEF4aXM6IHtcclxuICAgICAgc2xhbnRlZFRleHQ6dHJ1ZSxcclxuICAgICAgc2xhbnRlZFRleHRBbmdsZTo5MCwgICAgICAgIFxyXG4gICAgfSxcclxuICAgIHZBeGlzOiB7XHJcbiAgICAgIC8vdGl0bGU6ICdTdW0gb2YgZmluaXNoZWQgdGFza3MnXHJcbiAgICB9LFxyXG4gICAgYW5pbWF0aW9uOntcclxuICAgICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICAgIGVhc2luZzogJ291dCdcclxuICAgIH0sXHJcbiAgfTtcclxuICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufSBcclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcbmV4cG9ydHMuZHJhd0FjdGl2aXR5X0xpbmVDaGFydCA9IGZ1bmN0aW9uKGFjdGl2aXR5QXJyKSB7XHJcbiAgYWN0aXZpdHlBcnIubWFwKGZ1bmN0aW9uKGRheSkge1xyXG4gICAgZGF5WzBdID0gbmV3IERhdGUoZGF5WzBdKTtcclxuICB9KTtcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoJ2N1cnJlbnQnLCB7cGFja2FnZXM6IFsnY29yZWNoYXJ0JywgJ2xpbmUnXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0Jhc2ljKTtcclxuXHJcbiAgZnVuY3Rpb24gZHJhd0Jhc2ljKCkge1xyXG4gICAgdmFyIGRhdGEgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKCk7XHJcbiAgICBkYXRhLmFkZENvbHVtbignZGF0ZScsICdEYXlzJyk7XHJcbiAgICBkYXRhLmFkZENvbHVtbignbnVtYmVyJywgJ01lc3NhZ2VzJyk7XHJcbiAgICBkYXRhLmFkZFJvd3MoYWN0aXZpdHlBcnIpO1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgIHRpdGxlOiBcIkFjdGl2aXR5IG9mIHVzZXJzIGluIGNoYXRcIixcclxuICAgICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgICAgZHVyYXRpb246IDIwMDAsXHJcbiAgICAgICAgc3RhcnR1cDogdHJ1ZSAvL1RoaXMgaXMgdGhlIG5ldyBvcHRpb25cclxuICAgICAgfSxcclxuICAgICAgLy9jdXJ2ZVR5cGU6ICdmdW5jdGlvbicsXHJcbiAgICAgIC8vIHdpZHRoOiAoJCh3aW5kb3cpLndpZHRoKCkgPCA4MDApID8gJCh3aW5kb3cpLndpZHRoKCkgOiAkKHdpbmRvdykud2lkdGgoKSowLjUsXHJcbiAgICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSwgXHJcbiAgICAgIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpKjAuNDUsXHJcbiAgICAgIGhBeGlzOiB7XHJcbiAgICAgICAgc2xhbnRlZFRleHQ6dHJ1ZSxcclxuICAgICAgICBzbGFudGVkVGV4dEFuZ2xlOjQ1LFxyXG4gICAgICB9LFxyXG4gICAgICB2QXhpczoge1xyXG4gICAgICAgIC8vIHRpdGxlOiAnQ291bnQgb2YgbWVzc2EnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uTGluZUNoYXJ0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsaW5lY2hhcnQnKSk7XHJcbiAgICBjaGFydC5kcmF3KGRhdGEsIG9wdGlvbnMpO1xyXG4gIH1cclxufSIsImV4cG9ydHMuZHJhd1RpbWVsaW5lQ2hhcnQgPSBmdW5jdGlvbihncmFwaEFycikge1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZChcImN1cnJlbnRcIiwge3BhY2thZ2VzOltcInRpbWVsaW5lXCJdfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3Q2hhcnQpO1xyXG4gIGZ1bmN0aW9uIGRyYXdDaGFydCgpIHtcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGltZWxpbmUnKTtcclxuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5UaW1lbGluZShjb250YWluZXIpO1xyXG4gICAgdmFyIGRhdGFUYWJsZSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnc3RyaW5nJywgaWQ6ICdSb29tJyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnc3RyaW5nJywgaWQ6ICdOYW1lJyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnZGF0ZScsIGlkOiAnU3RhcnQnIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdkYXRlJywgaWQ6ICdFbmQnIH0pO1xyXG4gICAgXHJcbiAgICBncmFwaEFyci5tYXAoZWxlbWVudCA9PiB7XHJcbiAgICAgIGVsZW1lbnRbMl0gPSBuZXcgRGF0ZShlbGVtZW50WzJdKTtcclxuICAgICAgZWxlbWVudFszXSA9IG5ldyBEYXRlKGVsZW1lbnRbM10pO1xyXG4gICAgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkUm93cyhncmFwaEFycik7XHJcblxyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgIHRpbWVsaW5lOiB7IGNvbG9yQnlSb3dMYWJlbDogdHJ1ZSB9LFxyXG4gICAgICBoQXhpczoge1xyXG4gICAgICAgICAgbWluVmFsdWU6IG5ldyBEYXRlKDIwMTcsIDksIDI5KSxcclxuICAgICAgICAgIG1heFZhbHVlOiBuZXcgRGF0ZShuZXcgRGF0ZSgpLmdldFRpbWUoKSArICgxICogNjAgKiA2MCAqIDEwMDAwMCkpXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBjaGFydC5kcmF3KGRhdGFUYWJsZSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59Il19

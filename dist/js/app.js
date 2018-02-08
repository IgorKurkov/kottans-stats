(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.vars = {
  hash: '7e16b5527c77ea58bac36dddda6f5b444f32e81b',
  domain: "https://secret-earth-50936.herokuapp.com/",
  // domain: "http://localhost:3000/",
  kottansRoom: {
    id: "59b0f29bd73408ce4f74b06f",
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
    console.log(url);
  }

  let requestObj = fetchOptions ? new Request(url, fetchOptions) : new Request(url);
  fetch(requestObj).then(res => {
    res.json().then(response => {
      console.log(response);
      renderCallback(response);
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

//timeline
window.onload = function () {
  request.request("finishedT", pageTimeline.drawTimelineChart);
  request.request("finishedA", pageSearch.insertTaskListToPage);
};

//page statistics
// countdown.initTimer();
pageStatistics.insertValuesToFeaturesCards();
request.request("learners", pageStatistics.drawCountOfTasksPerUser_VerticalBar);
request.request("activity", pageStatistics.drawActivity_LineChart);

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

  console.log(finishedArr);
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
  request.request("http://api.github.com/repos/kottans/frontend", data => {
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
  console.log(graphArr);
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
  console.log(activityArr);
  activityArr.map(function (day) {
    day[0] = new Date(day[0]);
  });
  console.log(activityArr);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvX2NvbmZpZy5qcyIsImFwcC9qcy9fcmVxdWVzdC5qcyIsImFwcC9qcy9hcHAuanMiLCJhcHAvanMvcGx1Z2lucy9fY291bnRkb3duLmpzIiwiYXBwL2pzL3BsdWdpbnMvX3NlbGVjdG9ycy5qcyIsImFwcC9qcy9wbHVnaW5zL190YWJsZS5qcyIsImFwcC9qcy9yZW5kZXIvX3BhZ2Utc2VhcmNoLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS1zdGF0aXN0aWNzLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS10aW1lbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFFBQVEsSUFBUixHQUFlO0FBQ2IsUUFBTSwwQ0FETztBQUViLFVBQVEsMkNBRks7QUFHYjtBQUNBLGVBQWE7QUFDWCxRQUFLLDBCQURNO0FBRVgsWUFBUztBQUZFO0FBSkEsQ0FBZjs7QUFXQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEJBLE1BQU0sU0FBUyxRQUFRLFdBQVIsQ0FBZjs7QUFFQSxRQUFRLE9BQVIsR0FBa0IsVUFBUyxJQUFULEVBQWUsY0FBZixFQUErQixZQUEvQixFQUE2QztBQUM3RCxNQUFJLE1BQU0sRUFBVjtBQUNBLE1BQUcsT0FBTyxJQUFQLENBQVksSUFBWixDQUFILEVBQXNCO0FBQ3BCLFVBQU0sSUFBTjtBQUNELEdBRkQsTUFHSztBQUNILFVBQU0sT0FBTyxJQUFQLENBQVksTUFBWixHQUFxQixJQUFyQixHQUE0QixPQUFPLElBQVAsQ0FBWSxJQUE5QztBQUNBLFlBQVEsR0FBUixDQUFZLEdBQVo7QUFDRDs7QUFFRCxNQUFJLGFBQWMsWUFBRCxHQUFpQixJQUFJLE9BQUosQ0FBWSxHQUFaLEVBQWlCLFlBQWpCLENBQWpCLEdBQWtELElBQUksT0FBSixDQUFZLEdBQVosQ0FBbkU7QUFDQSxRQUFNLFVBQU4sRUFDRyxJ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QVQsR0FBYyxNQUEvQztBQUZQO0FBRkssS0FBZDtBQU9BLFVBQU0sSUFBTixDQUFXLFNBQVgsRUFBc0IsT0FBdEI7QUFDRDtBQUNGLENBNUJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMudmFycyA9IHtcclxuICBoYXNoOiAnN2UxNmI1NTI3Yzc3ZWE1OGJhYzM2ZGRkZGE2ZjViNDQ0ZjMyZTgxYicsXHJcbiAgZG9tYWluOiBcImh0dHBzOi8vc2VjcmV0LWVhcnRoLTUwOTM2Lmhlcm9rdWFwcC5jb20vXCIsXHJcbiAgLy8gZG9tYWluOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9cIixcclxuICBrb3R0YW5zUm9vbToge1xyXG4gICAgaWQgOiBcIjU5YjBmMjliZDczNDA4Y2U0Zjc0YjA2ZlwiLFxyXG4gICAgYXZhdGFyIDogXCJodHRwczovL2F2YXRhcnMtMDIuZ2l0dGVyLmltL2dyb3VwL2l2LzMvNTc1NDJkMjdjNDNiOGM2MDE5NzdhMGI2XCJcclxuICB9XHJcbn07XHJcbiBcclxuXHJcbi8vIHZhciBnbG9iYWwgPSB7XHJcbi8vICAgdG9rZW5TdHJpbmcgOiBcImFjY2Vzc190b2tlbj1cIiArIFwiOWUxMzE5MGE2ZjcwZTI4YjZlMjYzMDExZTYzZDRiMzRkMjZiZDY5N1wiLFxyXG4vLyAgIHJvb21VcmxQcmVmaXggOiBcImh0dHBzOi8vYXBpLmdpdHRlci5pbS92MS9yb29tcy9cIlxyXG4vLyB9O1xyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBnZXRBbGxSb29tTWVzc2FnZXMoY291bnQsIG9sZGVzdElkKSB7XHJcbi8vICAgaWYob2xkZXN0SWQpe29sZGVzdElkID0gXCImYmVmb3JlSWQ9XCIrb2xkZXN0SWQ7fSBcclxuLy8gICByZXR1cm4gZ2xvYmFsLnJvb21VcmxQcmVmaXggKyBrb3R0YW5zUm9vbS5pZCArXHJcbi8vICAgICAgICAgICBcIi9jaGF0TWVzc2FnZXM/bGltaXQ9XCIrIGNvdW50ICsgb2xkZXN0SWQgK1wiJlwiICsgZ2xvYmFsLnRva2VuU3RyaW5nO1xyXG4vLyAgIH07IFxyXG4iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi9fY29uZmlnXCIpO1xyXG5cclxuZXhwb3J0cy5yZXF1ZXN0ID0gZnVuY3Rpb24obGluaywgcmVuZGVyQ2FsbGJhY2ssIGZldGNoT3B0aW9ucykge1xyXG4gIHZhciB1cmwgPSAnJ1xyXG4gIGlmKC9odHRwLy50ZXN0KGxpbmspKSB7XHJcbiAgICB1cmwgPSBsaW5rO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHVybCA9IGNvbmZpZy52YXJzLmRvbWFpbiArIGxpbmsgKyBjb25maWcudmFycy5oYXNoO1xyXG4gICAgY29uc29sZS5sb2codXJsKVxyXG4gIH1cclxuXHJcbiAgbGV0IHJlcXVlc3RPYmogPSAoZmV0Y2hPcHRpb25zKSA/IG5ldyBSZXF1ZXN0KHVybCwgZmV0Y2hPcHRpb25zKSA6IG5ldyBSZXF1ZXN0KHVybCk7XHJcbiAgZmV0Y2gocmVxdWVzdE9iailcclxuICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgIHJlcy5qc29uKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgcmVuZGVyQ2FsbGJhY2socmVzcG9uc2UpXHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICB9KTtcclxuICB9IFxyXG5cclxuICBmdW5jdGlvbiBnZXRTaW5nbGVSZXF1ZXN0KHVybCwgcmVuZGVyQ2FsbGJhY2spIHtcclxuICAgIGZldGNoKHVybClcclxuICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oIHJlbmRlckNhbGxiYWNrKCkgKVxyXG4gICAgLmNhdGNoKGFsZXJ0KTtcclxuICB9IiwiY29uc3QgY291bnRkb3duICAgICAgPSByZXF1aXJlKFwiLi9wbHVnaW5zL19jb3VudGRvd25cIik7XHJcbmNvbnN0IHJlcXVlc3QgICAgICAgID0gcmVxdWlyZSgnLi9fcmVxdWVzdCcpO1xyXG5jb25zdCBwYWdlU3RhdGlzdGljcyA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS1zdGF0aXN0aWNzXCIpO1xyXG5jb25zdCBwYWdlVGltZWxpbmUgICA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS10aW1lbGluZVwiKTtcclxuY29uc3QgcGFnZVNlYXJjaCAgICAgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2Utc2VhcmNoXCIpO1xyXG5cclxuXHJcbi8vdGltZWxpbmVcclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJmaW5pc2hlZFRcIiwgcGFnZVRpbWVsaW5lLmRyYXdUaW1lbGluZUNoYXJ0KTtcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJmaW5pc2hlZEFcIiwgcGFnZVNlYXJjaC5pbnNlcnRUYXNrTGlzdFRvUGFnZSk7XHJcbn1cclxuIFxyXG4vL3BhZ2Ugc3RhdGlzdGljc1xyXG4vLyBjb3VudGRvd24uaW5pdFRpbWVyKCk7XHJcbnBhZ2VTdGF0aXN0aWNzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcygpO1xyXG5yZXF1ZXN0LnJlcXVlc3QoXCJsZWFybmVyc1wiLCBwYWdlU3RhdGlzdGljcy5kcmF3Q291bnRPZlRhc2tzUGVyVXNlcl9WZXJ0aWNhbEJhcik7XHJcbnJlcXVlc3QucmVxdWVzdChcImFjdGl2aXR5XCIsIHBhZ2VTdGF0aXN0aWNzLmRyYXdBY3Rpdml0eV9MaW5lQ2hhcnQpO1xyXG5cclxuXHJcblxyXG4gIiwiLy9DT1VOVERPV04gVElNRVJcclxuLy9zbGlja2NpdGN1bGFyIGh0dHBzOi8vd3d3LmpxdWVyeXNjcmlwdC5uZXQvZGVtby9TbGljay1DaXJjdWxhci1qUXVlcnktQ291bnRkb3duLVBsdWdpbi1DbGFzc3ktQ291bnRkb3duL1xyXG5cclxuZXhwb3J0cy5pbml0VGltZXIgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgdGltZUVuZCA9IE1hdGgucm91bmQoIChuZXcgRGF0ZShcIjIwMTguMDIuMTBcIikuZ2V0VGltZSgpIC0gJC5ub3coKSkgLyAxMDAwKTtcclxuICAgICAgdGltZUVuZCA9IE1hdGguZmxvb3IodGltZUVuZCAvIDg2NDAwKSAqIDg2NDAwO1xyXG5cclxuICAkKCcjY291bnRkb3duLWNvbnRhaW5lcicpLkNsYXNzeUNvdW50ZG93bih7XHJcbiAgICB0aGVtZTogXCJ3aGl0ZVwiLCBcclxuICAgIGVuZDogJC5ub3coKSArIHRpbWVFbmQsIC8vZW5kOiAkLm5vdygpICsgNjQ1NjAwLFxyXG4gICAgbm93OiAkLm5vdygpLFxyXG4gICAgLy8gd2hldGhlciB0byBkaXNwbGF5IHRoZSBkYXlzL2hvdXJzL21pbnV0ZXMvc2Vjb25kcyBsYWJlbHMuXHJcbiAgICBsYWJlbHM6IHRydWUsXHJcbiAgICAvLyBvYmplY3QgdGhhdCBzcGVjaWZpZXMgZGlmZmVyZW50IGxhbmd1YWdlIHBocmFzZXMgZm9yIHNheXMvaG91cnMvbWludXRlcy9zZWNvbmRzIGFzIHdlbGwgYXMgc3BlY2lmaWMgQ1NTIHN0eWxlcy5cclxuICAgIGxhYmVsc09wdGlvbnM6IHtcclxuICAgICAgbGFuZzoge1xyXG4gICAgICAgIGRheXM6ICdEYXlzJyxcclxuICAgICAgICBob3VyczogJ0hvdXJzJyxcclxuICAgICAgICBtaW51dGVzOiAnTWludXRlcycsXHJcbiAgICAgICAgc2Vjb25kczogJ1NlY29uZHMnXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiAnZm9udC1zaXplOiAwLjVlbTsnXHJcbiAgICB9LFxyXG4gICAgLy8gY3VzdG9tIHN0eWxlIGZvciB0aGUgY291bnRkb3duXHJcbiAgICBzdHlsZToge1xyXG4gICAgICBlbGVtZW50OiAnJyxcclxuICAgICAgbGFiZWxzOiBmYWxzZSxcclxuICAgICAgZGF5czoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzFBQkM5QycsLy8ncmdiYSgwLCAwLCAwLCAxKScsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIGhvdXJzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjMjk4MEI5JyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfSxcclxuICAgICAgbWludXRlczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzhFNDRBRCcsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHNlY29uZHM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyNGMzlDMTInLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxiYWNrIHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgY291bnRkb3duIHJlYWNoZXMgMC5cclxuICAgIG9uRW5kQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge31cclxuICB9KTtcclxufSIsImV4cG9ydHMuYmxvY2tzID0ge1xyXG4gIG1lc3NhZ2VzQ291bnQ6ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY291bnQtbWVzc2FnZXNcIiksXHJcbiAgc3RhcnJlZFJlcG86ICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFycmVkLXJlcG9cIiksXHJcbiAgYWN0aXZlVXNlcnNDb3VudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdXNlcnNcIiksXHJcbiAgYmxvY2tMZWFybmVyczogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sZWFybmVyc1wiKSxcclxuICBcclxufSAiLCJleHBvcnRzLm15RnVuY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuICAvLyBEZWNsYXJlIHZhcmlhYmxlcyBcclxuICB2YXIgaW5wdXQsIGZpbHRlciwgdGFibGUsIHRyLCB0ZCwgaTtcclxuICBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dFwiKTtcclxuICBmaWx0ZXIgPSBpbnB1dC52YWx1ZS50b1VwcGVyQ2FzZSgpO1xyXG4gIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVRhYmxlXCIpO1xyXG4gIHRyID0gdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKTtcclxuXHJcbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0YWJsZSByb3dzLCBhbmQgaGlkZSB0aG9zZSB3aG8gZG9uJ3QgbWF0Y2ggdGhlIHNlYXJjaCBxdWVyeVxyXG4gIGZvciAoaSA9IDA7IGkgPCB0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgdGQgPSB0cltpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRkXCIpWzBdO1xyXG4gICAgaWYgKHRkKSB7XHJcbiAgICAgIGlmICh0ZC5pbm5lckhUTUwudG9VcHBlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSkge1xyXG4gICAgICAgIHRyW2ldLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRyW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgfSBcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnRzLnNvcnRUYWJsZSA9IGZ1bmN0aW9uKG4pIHtcclxuICB2YXIgdGFibGUsIHJvd3MsIHN3aXRjaGluZywgaSwgeCwgeSwgc2hvdWxkU3dpdGNoLCBkaXIsIHN3aXRjaGNvdW50ID0gMDtcclxuICB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTtcclxuICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gIC8vIFNldCB0aGUgc29ydGluZyBkaXJlY3Rpb24gdG8gYXNjZW5kaW5nOlxyXG4gIGRpciA9IFwiYXNjXCI7IFxyXG4gIC8qIE1ha2UgYSBsb29wIHRoYXQgd2lsbCBjb250aW51ZSB1bnRpbFxyXG4gIG5vIHN3aXRjaGluZyBoYXMgYmVlbiBkb25lOiAqL1xyXG4gIHdoaWxlIChzd2l0Y2hpbmcpIHtcclxuICAgIC8vIFN0YXJ0IGJ5IHNheWluZzogbm8gc3dpdGNoaW5nIGlzIGRvbmU6XHJcbiAgICBzd2l0Y2hpbmcgPSBmYWxzZTtcclxuICAgIHJvd3MgPSB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlRSXCIpO1xyXG4gICAgLyogTG9vcCB0aHJvdWdoIGFsbCB0YWJsZSByb3dzIChleGNlcHQgdGhlXHJcbiAgICBmaXJzdCwgd2hpY2ggY29udGFpbnMgdGFibGUgaGVhZGVycyk6ICovXHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgKHJvd3MubGVuZ3RoIC0gMSk7IGkrKykge1xyXG4gICAgICAvLyBTdGFydCBieSBzYXlpbmcgdGhlcmUgc2hvdWxkIGJlIG5vIHN3aXRjaGluZzpcclxuICAgICAgc2hvdWxkU3dpdGNoID0gZmFsc2U7XHJcbiAgICAgIC8qIEdldCB0aGUgdHdvIGVsZW1lbnRzIHlvdSB3YW50IHRvIGNvbXBhcmUsXHJcbiAgICAgIG9uZSBmcm9tIGN1cnJlbnQgcm93IGFuZCBvbmUgZnJvbSB0aGUgbmV4dDogKi9cclxuICAgICAgeCA9IHJvd3NbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJURFwiKVtuXTtcclxuICAgICAgeSA9IHJvd3NbaSArIDFdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVERcIilbbl07XHJcbiAgICAgIC8qIENoZWNrIGlmIHRoZSB0d28gcm93cyBzaG91bGQgc3dpdGNoIHBsYWNlLFxyXG4gICAgICBiYXNlZCBvbiB0aGUgZGlyZWN0aW9uLCBhc2Mgb3IgZGVzYzogKi9cclxuICAgICAgaWYgKGRpciA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgaWYgKHguaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkgPiB5LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAvLyBJZiBzbywgbWFyayBhcyBhIHN3aXRjaCBhbmQgYnJlYWsgdGhlIGxvb3A6XHJcbiAgICAgICAgICBzaG91bGRTd2l0Y2g9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoZGlyID09IFwiZGVzY1wiKSB7XHJcbiAgICAgICAgaWYgKHguaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkgPCB5LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAvLyBJZiBzbywgbWFyayBhcyBhIHN3aXRjaCBhbmQgYnJlYWsgdGhlIGxvb3A6XHJcbiAgICAgICAgICBzaG91bGRTd2l0Y2g9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChzaG91bGRTd2l0Y2gpIHtcclxuICAgICAgLyogSWYgYSBzd2l0Y2ggaGFzIGJlZW4gbWFya2VkLCBtYWtlIHRoZSBzd2l0Y2hcclxuICAgICAgYW5kIG1hcmsgdGhhdCBhIHN3aXRjaCBoYXMgYmVlbiBkb25lOiAqL1xyXG4gICAgICByb3dzW2ldLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHJvd3NbaSArIDFdLCByb3dzW2ldKTtcclxuICAgICAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAgICAgLy8gRWFjaCB0aW1lIGEgc3dpdGNoIGlzIGRvbmUsIGluY3JlYXNlIHRoaXMgY291bnQgYnkgMTpcclxuICAgICAgc3dpdGNoY291bnQgKys7IFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyogSWYgbm8gc3dpdGNoaW5nIGhhcyBiZWVuIGRvbmUgQU5EIHRoZSBkaXJlY3Rpb24gaXMgXCJhc2NcIixcclxuICAgICAgc2V0IHRoZSBkaXJlY3Rpb24gdG8gXCJkZXNjXCIgYW5kIHJ1biB0aGUgd2hpbGUgbG9vcCBhZ2Fpbi4gKi9cclxuICAgICAgaWYgKHN3aXRjaGNvdW50ID09IDAgJiYgZGlyID09IFwiYXNjXCIpIHtcclxuICAgICAgICBkaXIgPSBcImRlc2NcIjtcclxuICAgICAgICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL19jb25maWdcIik7XHJcbmNvbnN0IHRhYmxlID0gcmVxdWlyZShcIi4uL3BsdWdpbnMvX3RhYmxlXCIpO1xyXG5cclxuXHJcblxyXG5leHBvcnRzLmluc2VydFRhc2tMaXN0VG9QYWdlID0gZnVuY3Rpb24oZmluaXNoZWRBcnIpIHtcclxuICB2YXIgaW1hZ2VMb2dvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbG9nbycpO1xyXG4gIGltYWdlTG9nby5zcmMgPSBjb25maWcudmFycy5rb3R0YW5zUm9vbS5hdmF0YXI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215SW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRhYmxlLm15RnVuY3Rpb24pO1xyXG5cclxuICBjb25zb2xlLmxvZyhmaW5pc2hlZEFycilcclxuICB2YXIgaHRtbCA9ICcnO1xyXG5cclxuICB2YXIgZGl2VGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlUYWJsZScpO1xyXG5cclxuICBodG1sICs9IFxyXG4gICAgYDx0ciBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMSl9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5OYW1lPC90aD5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDIpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+TmljazwvdGg+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgzKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPlB1Ymxpc2hlZDwvdGg+XHJcbiAgICAgICAgPHRoIHN0eWxlPVwid2lkdGg6ODAlO1wiPlRleHQ8L3RoPlxyXG4gICAgPC90cj5gO1xyXG4gICAgICAgIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluaXNoZWRBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgIGh0bWwgKz0gXHJcbiAgICAgICAgYDx0cj5cclxuICAgICAgICAgIDx0ZD48aW1nIHNyYz1cIiR7ZmluaXNoZWRBcnJbaV0uYXZhdGFyVXJsfVwiIGNsYXNzPVwidXNlci1pY29uXCI+JHtmaW5pc2hlZEFycltpXS5kaXNwbGF5TmFtZX08L3RkPlxyXG4gICAgICAgICAgPHRkPig8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tJHtmaW5pc2hlZEFycltpXS51cmx9XCI+JHtmaW5pc2hlZEFycltpXS51c2VybmFtZX08L2E+KTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS5zZW50fTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS50ZXh0fSA8L3RkPlxyXG4gICAgICAgIDwvdHI+YDtcclxuICB9XHJcbiAgZGl2VGFibGUuaW5uZXJIVE1MID0gaHRtbDtcclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi4vX3JlcXVlc3QnKTtcclxuY29uc3Qgc2VsID0gcmVxdWlyZSgnLi4vcGx1Z2lucy9fc2VsZWN0b3JzJyk7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnRzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGZlYXR1cmUgMVxyXG4gIHJlcXVlc3QucmVxdWVzdCgnY291bnQnLCAoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5tZXNzYWdlc0NvdW50LmlubmVySFRNTCA9IGRhdGE7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgMlxyXG4gIHJlcXVlc3QucmVxdWVzdChcImh0dHA6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9rb3R0YW5zL2Zyb250ZW5kXCIsIChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLnN0YXJyZWRSZXBvLmlubmVySFRNTCA9IChkYXRhLnN0YXJnYXplcnNfY291bnQgPT0gdW5kZWZpbmVkKSA/IFwiLi4uXCIgOiBkYXRhLnN0YXJnYXplcnNfY291bnQ7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgM1xyXG4gIHJlcXVlc3QucmVxdWVzdChcImF1dGhvcnNcIiwgKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MuYWN0aXZlVXNlcnNDb3VudC5pbm5lckhUTUwgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDRcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJodHRwczovL2FwaS5naXRodWIuY29tL3NlYXJjaC9pc3N1ZXM/cT0rdHlwZTpwcit1c2VyOmtvdHRhbnMmc29ydD1jcmVhdGVkJiVFMiU4MCU4QyVFMiU4MCU4Qm9yZGVyPWFzY1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgdmFyIHB1bGxOdW1iZXIgPSBkYXRhLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHtyZXR1cm4gaXRlbS5yZXBvc2l0b3J5X3VybCA9PSBcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mva290dGFucy9tb2NrLXJlcG9cIjt9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwdWxsLXJlcXVlc3RzXCIpWzBdLmlubmVySFRNTCA9IHB1bGxOdW1iZXIubnVtYmVyO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDVcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJsZWFybmVyc1wiLCAoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5ibG9ja0xlYXJuZXJzLmlubmVySFRNTCA9IGRhdGEubGVuZ3RoO1xyXG4gIH0pO1xyXG59XHJcblxyXG5cclxuZXhwb3J0cy5kcmF3Q291bnRPZlRhc2tzUGVyVXNlcl9WZXJ0aWNhbEJhciA9IGZ1bmN0aW9uKHVzZXJzKSB7XHJcbiAgbGV0IGdyYXBoQXJyID0gdXNlcnMubWFwKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgIHJldHVybiBuZXcgQXJyYXkodXNlci51c2VybmFtZStcIlwiLCB1c2VyLmxlc3NvbnMubGVuZ3RoLCBcImxpZ2h0Ymx1ZVwiKTtcclxuICB9KTtcclxuICBjb25zb2xlLmxvZyhncmFwaEFycilcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoJ2N1cnJlbnQnLCB7cGFja2FnZXM6IFsnY29yZWNoYXJ0JywgJ2JhciddfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3QmFzaWMpO1xyXG4gIGZ1bmN0aW9uIGRyYXdCYXNpYygpIHtcclxuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGljYWxfY2hhcnQnKTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5Db2x1bW5DaGFydChjb250YWluZXIpO1xyXG4gICAgZ3JhcGhBcnIudW5zaGlmdChbJ1VzZXInLCAnVGFza3MnLCB7IHJvbGU6ICdzdHlsZScgfV0pXHJcbiAgICB2YXIgZGF0YSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmFycmF5VG9EYXRhVGFibGUoZ3JhcGhBcnIpO1xyXG4gIHZhciBvcHRpb25zID0ge1xyXG4gICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgIGR1cmF0aW9uOiAyMDAwLFxyXG4gICAgICBzdGFydHVwOiB0cnVlIC8vVGhpcyBpcyB0aGUgbmV3IG9wdGlvblxyXG4gICAgfSxcclxuICAgIHRpdGxlOiAnU3VtIG9mIGZpbmlzaGVkIHRhc2tzIGJ5IGVhY2ggbGVhcm5lcicsXHJcbiAgICAvLyB3aWR0aDogKCQod2luZG93KS53aWR0aCgpIDwgODAwKSA/ICQod2luZG93KS53aWR0aCgpIDogJCh3aW5kb3cpLndpZHRoKCkqMC41LFxyXG4gICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLFxyXG4gICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkqMC40NSxcclxuICAgIGhBeGlzOiB7XHJcbiAgICAgIHNsYW50ZWRUZXh0OnRydWUsXHJcbiAgICAgIHNsYW50ZWRUZXh0QW5nbGU6OTAsICAgICAgICBcclxuICAgIH0sXHJcbiAgICB2QXhpczoge1xyXG4gICAgICAvL3RpdGxlOiAnU3VtIG9mIGZpbmlzaGVkIHRhc2tzJ1xyXG4gICAgfSxcclxuICAgIGFuaW1hdGlvbjp7XHJcbiAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG4gICAgICBlYXNpbmc6ICdvdXQnXHJcbiAgICB9LFxyXG4gIH07XHJcbiAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcclxuICB9XHJcbn0gXHJcblxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5leHBvcnRzLmRyYXdBY3Rpdml0eV9MaW5lQ2hhcnQgPSBmdW5jdGlvbihhY3Rpdml0eUFycikge1xyXG4gIGNvbnNvbGUubG9nKGFjdGl2aXR5QXJyKVxyXG4gIGFjdGl2aXR5QXJyLm1hcChmdW5jdGlvbihkYXkpIHtcclxuICAgIGRheVswXSA9IG5ldyBEYXRlKGRheVswXSk7XHJcbiAgfSk7XHJcbiAgY29uc29sZS5sb2coYWN0aXZpdHlBcnIpXHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKCdjdXJyZW50Jywge3BhY2thZ2VzOiBbJ2NvcmVjaGFydCcsICdsaW5lJ119KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdCYXNpYyk7XHJcblxyXG4gIGZ1bmN0aW9uIGRyYXdCYXNpYygpIHtcclxuICAgIHZhciBkYXRhID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpO1xyXG4gICAgZGF0YS5hZGRDb2x1bW4oJ2RhdGUnLCAnRGF5cycpO1xyXG4gICAgZGF0YS5hZGRDb2x1bW4oJ251bWJlcicsICdNZXNzYWdlcycpO1xyXG4gICAgZGF0YS5hZGRSb3dzKGFjdGl2aXR5QXJyKTtcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICB0aXRsZTogXCJBY3Rpdml0eSBvZiB1c2VycyBpbiBjaGF0XCIsXHJcbiAgICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICAgIGR1cmF0aW9uOiAyMDAwLFxyXG4gICAgICAgIHN0YXJ0dXA6IHRydWUgLy9UaGlzIGlzIHRoZSBuZXcgb3B0aW9uXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vY3VydmVUeXBlOiAnZnVuY3Rpb24nLFxyXG4gICAgICAvLyB3aWR0aDogKCQod2luZG93KS53aWR0aCgpIDwgODAwKSA/ICQod2luZG93KS53aWR0aCgpIDogJCh3aW5kb3cpLndpZHRoKCkqMC41LFxyXG4gICAgICB3aWR0aDogJCh3aW5kb3cpLndpZHRoKCksIFxyXG4gICAgICBoZWlnaHQ6ICQod2luZG93KS5oZWlnaHQoKSowLjQ1LFxyXG4gICAgICBoQXhpczoge1xyXG4gICAgICAgIHNsYW50ZWRUZXh0OnRydWUsXHJcbiAgICAgICAgc2xhbnRlZFRleHRBbmdsZTo0NSxcclxuICAgICAgfSxcclxuICAgICAgdkF4aXM6IHtcclxuICAgICAgICAvLyB0aXRsZTogJ0NvdW50IG9mIG1lc3NhJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkxpbmVDaGFydChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGluZWNoYXJ0JykpO1xyXG4gICAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcclxuICB9XHJcbn0iLCJleHBvcnRzLmRyYXdUaW1lbGluZUNoYXJ0ID0gZnVuY3Rpb24oZ3JhcGhBcnIpIHtcclxuICBnb29nbGUuY2hhcnRzLmxvYWQoXCJjdXJyZW50XCIsIHtwYWNrYWdlczpbXCJ0aW1lbGluZVwiXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0NoYXJ0KTtcclxuICBmdW5jdGlvbiBkcmF3Q2hhcnQoKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RpbWVsaW5lJyk7XHJcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gJyc7XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uVGltZWxpbmUoY29udGFpbmVyKTtcclxuICAgIHZhciBkYXRhVGFibGUgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGF0YVRhYmxlKCk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ3N0cmluZycsIGlkOiAnUm9vbScgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ3N0cmluZycsIGlkOiAnTmFtZScgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ2RhdGUnLCBpZDogJ1N0YXJ0JyB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRDb2x1bW4oeyB0eXBlOiAnZGF0ZScsIGlkOiAnRW5kJyB9KTtcclxuICAgIFxyXG4gICAgZ3JhcGhBcnIubWFwKGVsZW1lbnQgPT4ge1xyXG4gICAgICBlbGVtZW50WzJdID0gbmV3IERhdGUoZWxlbWVudFsyXSk7XHJcbiAgICAgIGVsZW1lbnRbM10gPSBuZXcgRGF0ZShlbGVtZW50WzNdKTtcclxuICAgIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZFJvd3MoZ3JhcGhBcnIpO1xyXG5cclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICB0aW1lbGluZTogeyBjb2xvckJ5Um93TGFiZWw6IHRydWUgfSxcclxuICAgICAgaEF4aXM6IHtcclxuICAgICAgICAgIG1pblZhbHVlOiBuZXcgRGF0ZSgyMDE3LCA5LCAyOSksXHJcbiAgICAgICAgICBtYXhWYWx1ZTogbmV3IERhdGUobmV3IERhdGUoKS5nZXRUaW1lKCkgKyAoMSAqIDYwICogNjAgKiAxMDAwMDApKVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gICAgY2hhcnQuZHJhdyhkYXRhVGFibGUsIG9wdGlvbnMpO1xyXG4gIH1cclxufSJdfQ==

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvX2NvbmZpZy5qcyIsImFwcC9qcy9fcmVxdWVzdC5qcyIsImFwcC9qcy9hcHAuanMiLCJhcHAvanMvcGx1Z2lucy9fY291bnRkb3duLmpzIiwiYXBwL2pzL3BsdWdpbnMvX3NlbGVjdG9ycy5qcyIsImFwcC9qcy9wbHVnaW5zL190YWJsZS5qcyIsImFwcC9qcy9yZW5kZXIvX3BhZ2Utc2VhcmNoLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS1zdGF0aXN0aWNzLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS10aW1lbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFFBQVEsSUFBUixHQUFlO0FBQ2IsUUFBTSwwQ0FETztBQUViLFVBQVEsMkNBRks7QUFHYjtBQUNBLGVBQWE7QUFDWCxRQUFLLDBCQURNO0FBRVgsWUFBUztBQUZFO0FBSkEsQ0FBZjs7QUFXQTtBQUNBO0FBQ0E7QUFDQTs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEJBLE1BQU0sU0FBUyxRQUFRLFdBQVIsQ0FBZjs7QUFFQSxRQUFRLE9BQVIsR0FBa0IsVUFBUyxJQUFULEVBQWUsY0FBZixFQUErQixZQUEvQixFQUE2QztBQUM3RCxNQUFJLE1BQU0sRUFBVjtBQUNBLE1BQUcsT0FBTyxJQUFQLENBQVksSUFBWixDQUFILEVBQXNCO0FBQ3BCLFVBQU0sSUFBTjtBQUNELEdBRkQsTUFHSztBQUNILFVBQU0sT0FBTyxJQUFQLENBQVksTUFBWixHQUFxQixJQUFyQixHQUE0QixPQUFPLElBQVAsQ0FBWSxJQUE5QztBQUNEOztBQUVELE1BQUksYUFBYyxZQUFELEdBQWlCLElBQUksT0FBSixDQUFZLEdBQVosRUFBaUIsWUFBakIsQ0FBakIsR0FBa0QsSUFBSSxPQUFKLENBQVksR0FBWixDQUFuRTtBQUNBLFFBQU0sVUFBTixFQUNHLElBREgsQ0FDUSxPQUFPO0FBQ1gsUUFBSSxJ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ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMudmFycyA9IHtcclxuICBoYXNoOiAnN2UxNmI1NTI3Yzc3ZWE1OGJhYzM2ZGRkZGE2ZjViNDQ0ZjMyZTgxYicsXHJcbiAgZG9tYWluOiBcImh0dHBzOi8vc2VjcmV0LWVhcnRoLTUwOTM2Lmhlcm9rdWFwcC5jb20vXCIsXHJcbiAgLy8gZG9tYWluOiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9cIixcclxuICBrb3R0YW5zUm9vbToge1xyXG4gICAgaWQgOiBcIjU5YjBmMjliZDczNDA4Y2U0Zjc0YjA2ZlwiLFxyXG4gICAgYXZhdGFyIDogXCJodHRwczovL2F2YXRhcnMtMDIuZ2l0dGVyLmltL2dyb3VwL2l2LzMvNTc1NDJkMjdjNDNiOGM2MDE5NzdhMGI2XCJcclxuICB9XHJcbn07XHJcbiBcclxuXHJcbi8vIHZhciBnbG9iYWwgPSB7XHJcbi8vICAgdG9rZW5TdHJpbmcgOiBcImFjY2Vzc190b2tlbj1cIiArIFwiOWUxMzE5MGE2ZjcwZTI4YjZlMjYzMDExZTYzZDRiMzRkMjZiZDY5N1wiLFxyXG4vLyAgIHJvb21VcmxQcmVmaXggOiBcImh0dHBzOi8vYXBpLmdpdHRlci5pbS92MS9yb29tcy9cIlxyXG4vLyB9O1xyXG5cclxuXHJcblxyXG4vLyBmdW5jdGlvbiBnZXRBbGxSb29tTWVzc2FnZXMoY291bnQsIG9sZGVzdElkKSB7XHJcbi8vICAgaWYob2xkZXN0SWQpe29sZGVzdElkID0gXCImYmVmb3JlSWQ9XCIrb2xkZXN0SWQ7fSBcclxuLy8gICByZXR1cm4gZ2xvYmFsLnJvb21VcmxQcmVmaXggKyBrb3R0YW5zUm9vbS5pZCArXHJcbi8vICAgICAgICAgICBcIi9jaGF0TWVzc2FnZXM/bGltaXQ9XCIrIGNvdW50ICsgb2xkZXN0SWQgK1wiJlwiICsgZ2xvYmFsLnRva2VuU3RyaW5nO1xyXG4vLyAgIH07IFxyXG4iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi9fY29uZmlnXCIpO1xyXG5cclxuZXhwb3J0cy5yZXF1ZXN0ID0gZnVuY3Rpb24obGluaywgcmVuZGVyQ2FsbGJhY2ssIGZldGNoT3B0aW9ucykge1xyXG4gIHZhciB1cmwgPSAnJ1xyXG4gIGlmKC9odHRwLy50ZXN0KGxpbmspKSB7XHJcbiAgICB1cmwgPSBsaW5rO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHVybCA9IGNvbmZpZy52YXJzLmRvbWFpbiArIGxpbmsgKyBjb25maWcudmFycy5oYXNoO1xyXG4gIH1cclxuXHJcbiAgbGV0IHJlcXVlc3RPYmogPSAoZmV0Y2hPcHRpb25zKSA/IG5ldyBSZXF1ZXN0KHVybCwgZmV0Y2hPcHRpb25zKSA6IG5ldyBSZXF1ZXN0KHVybCk7XHJcbiAgZmV0Y2gocmVxdWVzdE9iailcclxuICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgIHJlcy5qc29uKCkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cocmVzcG9uc2UpXHJcbiAgICAgICAgaWYocmVuZGVyQ2FsbGJhY2spIHtcclxuICAgICAgICAgIHJlbmRlckNhbGxiYWNrKHJlc3BvbnNlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gIH0pO1xyXG4gIH0gXHJcblxyXG4gIGZ1bmN0aW9uIGdldFNpbmdsZVJlcXVlc3QodXJsLCByZW5kZXJDYWxsYmFjaykge1xyXG4gICAgZmV0Y2godXJsKVxyXG4gICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxuICAgIH0pXHJcbiAgICAudGhlbiggcmVuZGVyQ2FsbGJhY2soKSApXHJcbiAgICAuY2F0Y2goYWxlcnQpO1xyXG4gIH0iLCJjb25zdCBjb3VudGRvd24gICAgICA9IHJlcXVpcmUoXCIuL3BsdWdpbnMvX2NvdW50ZG93blwiKTtcclxuY29uc3QgcmVxdWVzdCAgICAgICAgPSByZXF1aXJlKCcuL19yZXF1ZXN0Jyk7XHJcbmNvbnN0IHBhZ2VTdGF0aXN0aWNzID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXN0YXRpc3RpY3NcIik7XHJcbmNvbnN0IHBhZ2VUaW1lbGluZSAgID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXRpbWVsaW5lXCIpO1xyXG5jb25zdCBwYWdlU2VhcmNoICAgICA9IHJlcXVpcmUoXCIuL3JlbmRlci9fcGFnZS1zZWFyY2hcIik7XHJcblxyXG5yZXF1ZXN0LnJlcXVlc3QoXCJsYXRlc3RcIik7XHJcblxyXG4vL3RpbWVsaW5lXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwiZmluaXNoZWRUXCIsIHBhZ2VUaW1lbGluZS5kcmF3VGltZWxpbmVDaGFydCk7XHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwiZmluaXNoZWRBXCIsIHBhZ2VTZWFyY2guaW5zZXJ0VGFza0xpc3RUb1BhZ2UpO1xyXG59XHJcbiBcclxuLy9wYWdlIHN0YXRpc3RpY3NcclxuLy8gY291bnRkb3duLmluaXRUaW1lcigpO1xyXG5wYWdlU3RhdGlzdGljcy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMoKTtcclxucmVxdWVzdC5yZXF1ZXN0KFwibGVhcm5lcnNcIiwgcGFnZVN0YXRpc3RpY3MuZHJhd0NvdW50T2ZUYXNrc1BlclVzZXJfVmVydGljYWxCYXIpO1xyXG5yZXF1ZXN0LnJlcXVlc3QoXCJhY3Rpdml0eVwiLCBwYWdlU3RhdGlzdGljcy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0KTtcclxuXHJcblxyXG5cclxuICIsIi8vQ09VTlRET1dOIFRJTUVSXHJcbi8vc2xpY2tjaXRjdWxhciBodHRwczovL3d3dy5qcXVlcnlzY3JpcHQubmV0L2RlbW8vU2xpY2stQ2lyY3VsYXItalF1ZXJ5LUNvdW50ZG93bi1QbHVnaW4tQ2xhc3N5LUNvdW50ZG93bi9cclxuXHJcbmV4cG9ydHMuaW5pdFRpbWVyID0gZnVuY3Rpb24oKSB7XHJcbiAgdmFyIHRpbWVFbmQgPSBNYXRoLnJvdW5kKCAobmV3IERhdGUoXCIyMDE4LjAyLjEwXCIpLmdldFRpbWUoKSAtICQubm93KCkpIC8gMTAwMCk7XHJcbiAgICAgIHRpbWVFbmQgPSBNYXRoLmZsb29yKHRpbWVFbmQgLyA4NjQwMCkgKiA4NjQwMDtcclxuXHJcbiAgJCgnI2NvdW50ZG93bi1jb250YWluZXInKS5DbGFzc3lDb3VudGRvd24oe1xyXG4gICAgdGhlbWU6IFwid2hpdGVcIiwgXHJcbiAgICBlbmQ6ICQubm93KCkgKyB0aW1lRW5kLCAvL2VuZDogJC5ub3coKSArIDY0NTYwMCxcclxuICAgIG5vdzogJC5ub3coKSxcclxuICAgIC8vIHdoZXRoZXIgdG8gZGlzcGxheSB0aGUgZGF5cy9ob3Vycy9taW51dGVzL3NlY29uZHMgbGFiZWxzLlxyXG4gICAgbGFiZWxzOiB0cnVlLFxyXG4gICAgLy8gb2JqZWN0IHRoYXQgc3BlY2lmaWVzIGRpZmZlcmVudCBsYW5ndWFnZSBwaHJhc2VzIGZvciBzYXlzL2hvdXJzL21pbnV0ZXMvc2Vjb25kcyBhcyB3ZWxsIGFzIHNwZWNpZmljIENTUyBzdHlsZXMuXHJcbiAgICBsYWJlbHNPcHRpb25zOiB7XHJcbiAgICAgIGxhbmc6IHtcclxuICAgICAgICBkYXlzOiAnRGF5cycsXHJcbiAgICAgICAgaG91cnM6ICdIb3VycycsXHJcbiAgICAgICAgbWludXRlczogJ01pbnV0ZXMnLFxyXG4gICAgICAgIHNlY29uZHM6ICdTZWNvbmRzJ1xyXG4gICAgICB9LFxyXG4gICAgICBzdHlsZTogJ2ZvbnQtc2l6ZTogMC41ZW07J1xyXG4gICAgfSxcclxuICAgIC8vIGN1c3RvbSBzdHlsZSBmb3IgdGhlIGNvdW50ZG93blxyXG4gICAgc3R5bGU6IHtcclxuICAgICAgZWxlbWVudDogJycsXHJcbiAgICAgIGxhYmVsczogZmFsc2UsXHJcbiAgICAgIGRheXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyMxQUJDOUMnLC8vJ3JnYmEoMCwgMCwgMCwgMSknLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBob3Vyczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzI5ODBCOScsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIG1pbnV0ZXM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyM4RTQ0QUQnLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9LFxyXG4gICAgICBzZWNvbmRzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjRjM5QzEyJyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBjYWxsYmFjayB0aGF0IGlzIGZpcmVkIHdoZW4gdGhlIGNvdW50ZG93biByZWFjaGVzIDAuXHJcbiAgICBvbkVuZENhbGxiYWNrOiBmdW5jdGlvbigpIHt9XHJcbiAgfSk7XHJcbn0iLCJleHBvcnRzLmJsb2NrcyA9IHtcclxuICBtZXNzYWdlc0NvdW50OiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvdW50LW1lc3NhZ2VzXCIpLFxyXG4gIHN0YXJyZWRSZXBvOiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnJlZC1yZXBvXCIpLFxyXG4gIGFjdGl2ZVVzZXJzQ291bnQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlLXVzZXJzXCIpLFxyXG4gIGJsb2NrTGVhcm5lcnM6ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubGVhcm5lcnNcIiksXHJcbiAgXHJcbn0gIiwiZXhwb3J0cy5teUZ1bmN0aW9uID0gZnVuY3Rpb24oKSB7XHJcbiAgLy8gRGVjbGFyZSB2YXJpYWJsZXMgXHJcbiAgdmFyIGlucHV0LCBmaWx0ZXIsIHRhYmxlLCB0ciwgdGQsIGk7XHJcbiAgaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15SW5wdXRcIik7XHJcbiAgZmlsdGVyID0gaW5wdXQudmFsdWUudG9VcHBlckNhc2UoKTtcclxuICB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTtcclxuICB0ciA9IHRhYmxlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJcIik7XHJcblxyXG4gIC8vIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cywgYW5kIGhpZGUgdGhvc2Ugd2hvIGRvbid0IG1hdGNoIHRoZSBzZWFyY2ggcXVlcnlcclxuICBmb3IgKGkgPSAwOyBpIDwgdHIubGVuZ3RoOyBpKyspIHtcclxuICAgIHRkID0gdHJbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0ZFwiKVswXTtcclxuICAgIGlmICh0ZCkge1xyXG4gICAgICBpZiAodGQuaW5uZXJIVE1MLnRvVXBwZXJDYXNlKCkuaW5kZXhPZihmaWx0ZXIpID4gLTEpIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0cltpXS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0cy5zb3J0VGFibGUgPSBmdW5jdGlvbihuKSB7XHJcbiAgdmFyIHRhYmxlLCByb3dzLCBzd2l0Y2hpbmcsIGksIHgsIHksIHNob3VsZFN3aXRjaCwgZGlyLCBzd2l0Y2hjb3VudCA9IDA7XHJcbiAgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15VGFibGVcIik7XHJcbiAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAvLyBTZXQgdGhlIHNvcnRpbmcgZGlyZWN0aW9uIHRvIGFzY2VuZGluZzpcclxuICBkaXIgPSBcImFzY1wiOyBcclxuICAvKiBNYWtlIGEgbG9vcCB0aGF0IHdpbGwgY29udGludWUgdW50aWxcclxuICBubyBzd2l0Y2hpbmcgaGFzIGJlZW4gZG9uZTogKi9cclxuICB3aGlsZSAoc3dpdGNoaW5nKSB7XHJcbiAgICAvLyBTdGFydCBieSBzYXlpbmc6IG5vIHN3aXRjaGluZyBpcyBkb25lOlxyXG4gICAgc3dpdGNoaW5nID0gZmFsc2U7XHJcbiAgICByb3dzID0gdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJUUlwiKTtcclxuICAgIC8qIExvb3AgdGhyb3VnaCBhbGwgdGFibGUgcm93cyAoZXhjZXB0IHRoZVxyXG4gICAgZmlyc3QsIHdoaWNoIGNvbnRhaW5zIHRhYmxlIGhlYWRlcnMpOiAqL1xyXG4gICAgZm9yIChpID0gMTsgaSA8IChyb3dzLmxlbmd0aCAtIDEpOyBpKyspIHtcclxuICAgICAgLy8gU3RhcnQgYnkgc2F5aW5nIHRoZXJlIHNob3VsZCBiZSBubyBzd2l0Y2hpbmc6XHJcbiAgICAgIHNob3VsZFN3aXRjaCA9IGZhbHNlO1xyXG4gICAgICAvKiBHZXQgdGhlIHR3byBlbGVtZW50cyB5b3Ugd2FudCB0byBjb21wYXJlLFxyXG4gICAgICBvbmUgZnJvbSBjdXJyZW50IHJvdyBhbmQgb25lIGZyb20gdGhlIG5leHQ6ICovXHJcbiAgICAgIHggPSByb3dzW2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVERcIilbbl07XHJcbiAgICAgIHkgPSByb3dzW2kgKyAxXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlREXCIpW25dO1xyXG4gICAgICAvKiBDaGVjayBpZiB0aGUgdHdvIHJvd3Mgc2hvdWxkIHN3aXRjaCBwbGFjZSxcclxuICAgICAgYmFzZWQgb24gdGhlIGRpcmVjdGlvbiwgYXNjIG9yIGRlc2M6ICovXHJcbiAgICAgIGlmIChkaXIgPT0gXCJhc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpID4geS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGRpciA9PSBcImRlc2NcIikge1xyXG4gICAgICAgIGlmICh4LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpIDwgeS5pbm5lckhUTUwudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgLy8gSWYgc28sIG1hcmsgYXMgYSBzd2l0Y2ggYW5kIGJyZWFrIHRoZSBsb29wOlxyXG4gICAgICAgICAgc2hvdWxkU3dpdGNoPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoc2hvdWxkU3dpdGNoKSB7XHJcbiAgICAgIC8qIElmIGEgc3dpdGNoIGhhcyBiZWVuIG1hcmtlZCwgbWFrZSB0aGUgc3dpdGNoXHJcbiAgICAgIGFuZCBtYXJrIHRoYXQgYSBzd2l0Y2ggaGFzIGJlZW4gZG9uZTogKi9cclxuICAgICAgcm93c1tpXS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyb3dzW2kgKyAxXSwgcm93c1tpXSk7XHJcbiAgICAgIHN3aXRjaGluZyA9IHRydWU7XHJcbiAgICAgIC8vIEVhY2ggdGltZSBhIHN3aXRjaCBpcyBkb25lLCBpbmNyZWFzZSB0aGlzIGNvdW50IGJ5IDE6XHJcbiAgICAgIHN3aXRjaGNvdW50ICsrOyBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8qIElmIG5vIHN3aXRjaGluZyBoYXMgYmVlbiBkb25lIEFORCB0aGUgZGlyZWN0aW9uIGlzIFwiYXNjXCIsXHJcbiAgICAgIHNldCB0aGUgZGlyZWN0aW9uIHRvIFwiZGVzY1wiIGFuZCBydW4gdGhlIHdoaWxlIGxvb3AgYWdhaW4uICovXHJcbiAgICAgIGlmIChzd2l0Y2hjb3VudCA9PSAwICYmIGRpciA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgZGlyID0gXCJkZXNjXCI7XHJcbiAgICAgICAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCB0YWJsZSA9IHJlcXVpcmUoXCIuLi9wbHVnaW5zL190YWJsZVwiKTtcclxuXHJcblxyXG5cclxuZXhwb3J0cy5pbnNlcnRUYXNrTGlzdFRvUGFnZSA9IGZ1bmN0aW9uKGZpbmlzaGVkQXJyKSB7XHJcbiAgdmFyIGltYWdlTG9nbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWxvZ28nKTtcclxuICBpbWFnZUxvZ28uc3JjID0gY29uZmlnLnZhcnMua290dGFuc1Jvb20uYXZhdGFyO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNteUlucHV0JykuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCB0YWJsZS5teUZ1bmN0aW9uKTtcclxuXHJcbiAgdmFyIGh0bWwgPSAnJztcclxuXHJcbiAgdmFyIGRpdlRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215VGFibGUnKTtcclxuXHJcbiAgaHRtbCArPSBcclxuICAgIGA8dHIgY2xhc3M9XCJoZWFkZXJcIj5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDEpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+TmFtZTwvdGg+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgyKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPk5pY2s8L3RoPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMyl9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5QdWJsaXNoZWQ8L3RoPlxyXG4gICAgICAgIDx0aCBzdHlsZT1cIndpZHRoOjgwJTtcIj5UZXh0PC90aD5cclxuICAgIDwvdHI+YDtcclxuICAgICAgICBcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmlzaGVkQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBodG1sICs9IFxyXG4gICAgICAgIGA8dHI+XHJcbiAgICAgICAgICA8dGQ+PGltZyBzcmM9XCIke2ZpbmlzaGVkQXJyW2ldLmF2YXRhclVybH1cIiBjbGFzcz1cInVzZXItaWNvblwiPiR7ZmluaXNoZWRBcnJbaV0uZGlzcGxheU5hbWV9PC90ZD5cclxuICAgICAgICAgIDx0ZD4oPGEgdGFyZ2V0PVwiX2JsYW5rXCIgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbSR7ZmluaXNoZWRBcnJbaV0udXJsfVwiPiR7ZmluaXNoZWRBcnJbaV0udXNlcm5hbWV9PC9hPik8L3RkPlxyXG4gICAgICAgICAgPHRkPiR7ZmluaXNoZWRBcnJbaV0uc2VudH08L3RkPlxyXG4gICAgICAgICAgPHRkPiR7ZmluaXNoZWRBcnJbaV0udGV4dH0gPC90ZD5cclxuICAgICAgICA8L3RyPmA7XHJcbiAgfVxyXG4gIGRpdlRhYmxlLmlubmVySFRNTCA9IGh0bWw7XHJcbn0iLCJjb25zdCBjb25maWcgPSByZXF1aXJlKFwiLi4vX2NvbmZpZ1wiKTtcclxuY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJy4uL19yZXF1ZXN0Jyk7XHJcbmNvbnN0IHNlbCA9IHJlcXVpcmUoJy4uL3BsdWdpbnMvX3NlbGVjdG9ycycpO1xyXG5cclxuXHJcblxyXG5cclxuZXhwb3J0cy5pbnNlcnRWYWx1ZXNUb0ZlYXR1cmVzQ2FyZHMgPSBmdW5jdGlvbigpIHtcclxuICAvLyBmZWF0dXJlIDFcclxuICByZXF1ZXN0LnJlcXVlc3QoJ2NvdW50JywgKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MubWVzc2FnZXNDb3VudC5pbm5lckhUTUwgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDJcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJodHRwOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mva290dGFucy9mcm9udGVuZFwiLCAoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5zdGFycmVkUmVwby5pbm5lckhUTUwgPSAoZGF0YS5zdGFyZ2F6ZXJzX2NvdW50ID09IHVuZGVmaW5lZCkgPyBcIi4uLlwiIDogZGF0YS5zdGFyZ2F6ZXJzX2NvdW50O1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDNcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJhdXRob3JzXCIsIChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLmFjdGl2ZVVzZXJzQ291bnQuaW5uZXJIVE1MID0gZGF0YTtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSA0XHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9zZWFyY2gvaXNzdWVzP3E9K3R5cGU6cHIrdXNlcjprb3R0YW5zJnNvcnQ9Y3JlYXRlZCYlRTIlODAlOEMlRTIlODAlOEJvcmRlcj1hc2NcIiwgKGRhdGEpID0+IHtcclxuICAgIHZhciBwdWxsTnVtYmVyID0gZGF0YS5pdGVtcy5maW5kKChpdGVtKSA9PiB7cmV0dXJuIGl0ZW0ucmVwb3NpdG9yeV91cmwgPT0gXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2tvdHRhbnMvbW9jay1yZXBvXCI7fSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHVsbC1yZXF1ZXN0c1wiKVswXS5pbm5lckhUTUwgPSBwdWxsTnVtYmVyLm51bWJlcjtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSA1XHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwibGVhcm5lcnNcIiwgKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MuYmxvY2tMZWFybmVycy5pbm5lckhUTUwgPSBkYXRhLmxlbmd0aDtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydHMuZHJhd0NvdW50T2ZUYXNrc1BlclVzZXJfVmVydGljYWxCYXIgPSBmdW5jdGlvbih1c2Vycykge1xyXG4gIGxldCBncmFwaEFyciA9IHVzZXJzLm1hcChmdW5jdGlvbih1c2VyKSB7XHJcbiAgICByZXR1cm4gbmV3IEFycmF5KHVzZXIudXNlcm5hbWUrXCJcIiwgdXNlci5sZXNzb25zLmxlbmd0aCwgXCJsaWdodGJsdWVcIik7XHJcbiAgfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKCdjdXJyZW50Jywge3BhY2thZ2VzOiBbJ2NvcmVjaGFydCcsICdiYXInXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0Jhc2ljKTtcclxuICBmdW5jdGlvbiBkcmF3QmFzaWMoKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRpY2FsX2NoYXJ0Jyk7XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ29sdW1uQ2hhcnQoY29udGFpbmVyKTtcclxuICAgIGdyYXBoQXJyLnVuc2hpZnQoWydVc2VyJywgJ1Rhc2tzJywgeyByb2xlOiAnc3R5bGUnIH1dKVxyXG4gICAgdmFyIGRhdGEgPSBnb29nbGUudmlzdWFsaXphdGlvbi5hcnJheVRvRGF0YVRhYmxlKGdyYXBoQXJyKTtcclxuICB2YXIgb3B0aW9ucyA9IHtcclxuICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICBkdXJhdGlvbjogMjAwMCxcclxuICAgICAgc3RhcnR1cDogdHJ1ZSAvL1RoaXMgaXMgdGhlIG5ldyBvcHRpb25cclxuICAgIH0sXHJcbiAgICB0aXRsZTogJ1N1bSBvZiBmaW5pc2hlZCB0YXNrcyBieSBlYWNoIGxlYXJuZXInLFxyXG4gICAgLy8gd2lkdGg6ICgkKHdpbmRvdykud2lkdGgoKSA8IDgwMCkgPyAkKHdpbmRvdykud2lkdGgoKSA6ICQod2luZG93KS53aWR0aCgpKjAuNSxcclxuICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpKjAuNDUsXHJcbiAgICBoQXhpczoge1xyXG4gICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICBzbGFudGVkVGV4dEFuZ2xlOjkwLCAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgdkF4aXM6IHtcclxuICAgICAgLy90aXRsZTogJ1N1bSBvZiBmaW5pc2hlZCB0YXNrcydcclxuICAgIH0sXHJcbiAgICBhbmltYXRpb246e1xyXG4gICAgICBkdXJhdGlvbjogMTAwMCxcclxuICAgICAgZWFzaW5nOiAnb3V0J1xyXG4gICAgfSxcclxuICB9O1xyXG4gIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IFxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuZXhwb3J0cy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0ID0gZnVuY3Rpb24oYWN0aXZpdHlBcnIpIHtcclxuICBhY3Rpdml0eUFyci5tYXAoZnVuY3Rpb24oZGF5KSB7XHJcbiAgICBkYXlbMF0gPSBuZXcgRGF0ZShkYXlbMF0pO1xyXG4gIH0pO1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZCgnY3VycmVudCcsIHtwYWNrYWdlczogWydjb3JlY2hhcnQnLCAnbGluZSddfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3QmFzaWMpO1xyXG5cclxuICBmdW5jdGlvbiBkcmF3QmFzaWMoKSB7XHJcbiAgICB2YXIgZGF0YSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIGRhdGEuYWRkQ29sdW1uKCdkYXRlJywgJ0RheXMnKTtcclxuICAgIGRhdGEuYWRkQ29sdW1uKCdudW1iZXInLCAnTWVzc2FnZXMnKTtcclxuICAgIGRhdGEuYWRkUm93cyhhY3Rpdml0eUFycik7XHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgdGl0bGU6IFwiQWN0aXZpdHkgb2YgdXNlcnMgaW4gY2hhdFwiLFxyXG4gICAgICBhbmltYXRpb246IHtcclxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcclxuICAgICAgICBzdGFydHVwOiB0cnVlIC8vVGhpcyBpcyB0aGUgbmV3IG9wdGlvblxyXG4gICAgICB9LFxyXG4gICAgICAvL2N1cnZlVHlwZTogJ2Z1bmN0aW9uJyxcclxuICAgICAgLy8gd2lkdGg6ICgkKHdpbmRvdykud2lkdGgoKSA8IDgwMCkgPyAkKHdpbmRvdykud2lkdGgoKSA6ICQod2luZG93KS53aWR0aCgpKjAuNSxcclxuICAgICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBcclxuICAgICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkqMC40NSxcclxuICAgICAgaEF4aXM6IHtcclxuICAgICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICAgIHNsYW50ZWRUZXh0QW5nbGU6NDUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHZBeGlzOiB7XHJcbiAgICAgICAgLy8gdGl0bGU6ICdDb3VudCBvZiBtZXNzYSdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5MaW5lQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmVjaGFydCcpKTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IiwiZXhwb3J0cy5kcmF3VGltZWxpbmVDaGFydCA9IGZ1bmN0aW9uKGdyYXBoQXJyKSB7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKFwiY3VycmVudFwiLCB7cGFja2FnZXM6W1widGltZWxpbmVcIl19KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdDaGFydCk7XHJcbiAgZnVuY3Rpb24gZHJhd0NoYXJ0KCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lbGluZScpO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLlRpbWVsaW5lKGNvbnRhaW5lcik7XHJcbiAgICB2YXIgZGF0YVRhYmxlID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ1Jvb20nIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ05hbWUnIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdkYXRlJywgaWQ6ICdTdGFydCcgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ2RhdGUnLCBpZDogJ0VuZCcgfSk7XHJcbiAgICBcclxuICAgIGdyYXBoQXJyLm1hcChlbGVtZW50ID0+IHtcclxuICAgICAgZWxlbWVudFsyXSA9IG5ldyBEYXRlKGVsZW1lbnRbMl0pO1xyXG4gICAgICBlbGVtZW50WzNdID0gbmV3IERhdGUoZWxlbWVudFszXSk7XHJcbiAgICB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRSb3dzKGdyYXBoQXJyKTtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgdGltZWxpbmU6IHsgY29sb3JCeVJvd0xhYmVsOiB0cnVlIH0sXHJcbiAgICAgIGhBeGlzOiB7XHJcbiAgICAgICAgICBtaW5WYWx1ZTogbmV3IERhdGUoMjAxNywgOSwgMjkpLFxyXG4gICAgICAgICAgbWF4VmFsdWU6IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgKDEgKiA2MCAqIDYwICogMTAwMDAwKSlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YVRhYmxlLCBvcHRpb25zKTtcclxuICB9XHJcbn0iXX0=

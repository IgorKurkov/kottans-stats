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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvanMvX2NvbmZpZy5qcyIsImFwcC9qcy9fcmVxdWVzdC5qcyIsImFwcC9qcy9hcHAuanMiLCJhcHAvanMvcGx1Z2lucy9fY291bnRkb3duLmpzIiwiYXBwL2pzL3BsdWdpbnMvX3NlbGVjdG9ycy5qcyIsImFwcC9qcy9wbHVnaW5zL190YWJsZS5qcyIsImFwcC9qcy9yZW5kZXIvX3BhZ2Utc2VhcmNoLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS1zdGF0aXN0aWNzLmpzIiwiYXBwL2pzL3JlbmRlci9fcGFnZS10aW1lbGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLFFBQUEsQUFBUTtRQUFPLEFBQ1AsQUFDTjtVQUZhLEFBRUwsQUFDUixBQUNBOzs7UUFBYSxBQUNOLEFBQ0w7WUFOSixBQUFlLEFBQ2IsQUFHYSxBQUNYLEFBQ1M7Ozs7QUFLYjtBQUNBO0FBQ0E7QUFDQTs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdEJBLE1BQU0sU0FBUyxRQUFRLFdBQVIsQ0FBZjs7QUFFQSxRQUFRLE9BQVIsR0FBa0IsVUFBUyxJQUFULEVBQWUsY0FBZixFQUErQixZQUEvQixFQUE2QztBQUM3RCxNQUFJLE1BQU0sRUFBVjtBQUNBLE1BQUcsT0FBTyxJQUFQLENBQVksSUFBWixDQUFILEVBQXNCO0FBQ3BCLFVBQU0sSUFBTjtBQUNELEdBRkQsTUFHSztBQUNILFVBQU0sT0FBTyxJQUFQLENBQVksTUFBWixHQUFxQixJQUFyQixHQUE0QixPQUFPLElBQVAsQ0FBWSxJQUE5QztBQUNEOztBQUVELE1BQUksYUFBYyxZQUFELEdBQWlCLElBQUksT0FBSixDQUFZLEdBQVosRUFBaUIsWUFBakIsQ0FBakIsR0FBa0QsSUFBSSxPQUFKLENBQVksR0FBWixDQUFuRTtBQUNBLFFBQU0sVUFBTixFQUNHLElBREgsQ0FDUSxPQUFPO0FBQ1gsUUFBSSxJQUFKLEdBQVcs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biBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0cy52YXJzID0ge1xyXG4gIGhhc2g6ICc3ZTE2YjU1MjdjNzdlYTU4YmFjMzZkZGRkYTZmNWI0NDRmMzJlODFiJyxcclxuICBkb21haW46IFwiaHR0cHM6Ly9zZWNyZXQtZWFydGgtNTA5MzYuaGVyb2t1YXBwLmNvbS9cIixcclxuICAvLyBkb21haW46IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwL1wiLFxyXG4gIGtvdHRhbnNSb29tOiB7XHJcbiAgICBpZCA6IFwiNTliMGYyOWJkNzM0MDhjZTRmNzRiMDZmXCIsXHJcbiAgICBhdmF0YXIgOiBcImh0dHBzOi8vYXZhdGFycy0wMi5naXR0ZXIuaW0vZ3JvdXAvaXYvMy81NzU0MmQyN2M0M2I4YzYwMTk3N2EwYjZcIlxyXG4gIH1cclxufTtcclxuIFxyXG5cclxuLy8gdmFyIGdsb2JhbCA9IHtcclxuLy8gICB0b2tlblN0cmluZyA6IFwiYWNjZXNzX3Rva2VuPVwiICsgXCI5ZTEzMTkwYTZmNzBlMjhiNmUyNjMwMTFlNjNkNGIzNGQyNmJkNjk3XCIsXHJcbi8vICAgcm9vbVVybFByZWZpeCA6IFwiaHR0cHM6Ly9hcGkuZ2l0dGVyLmltL3YxL3Jvb21zL1wiXHJcbi8vIH07XHJcblxyXG5cclxuXHJcbi8vIGZ1bmN0aW9uIGdldEFsbFJvb21NZXNzYWdlcyhjb3VudCwgb2xkZXN0SWQpIHtcclxuLy8gICBpZihvbGRlc3RJZCl7b2xkZXN0SWQgPSBcIiZiZWZvcmVJZD1cIitvbGRlc3RJZDt9IFxyXG4vLyAgIHJldHVybiBnbG9iYWwucm9vbVVybFByZWZpeCArIGtvdHRhbnNSb29tLmlkICtcclxuLy8gICAgICAgICAgIFwiL2NoYXRNZXNzYWdlcz9saW1pdD1cIisgY291bnQgKyBvbGRlc3RJZCArXCImXCIgKyBnbG9iYWwudG9rZW5TdHJpbmc7XHJcbi8vICAgfTsgXHJcbiIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuL19jb25maWdcIik7XHJcblxyXG5leHBvcnRzLnJlcXVlc3QgPSBmdW5jdGlvbihsaW5rLCByZW5kZXJDYWxsYmFjaywgZmV0Y2hPcHRpb25zKSB7XHJcbiAgdmFyIHVybCA9ICcnXHJcbiAgaWYoL2h0dHAvLnRlc3QobGluaykpIHtcclxuICAgIHVybCA9IGxpbms7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdXJsID0gY29uZmlnLnZhcnMuZG9tYWluICsgbGluayArIGNvbmZpZy52YXJzLmhhc2g7XHJcbiAgfVxyXG5cclxuICBsZXQgcmVxdWVzdE9iaiA9IChmZXRjaE9wdGlvbnMpID8gbmV3IFJlcXVlc3QodXJsLCBmZXRjaE9wdGlvbnMpIDogbmV3IFJlcXVlc3QodXJsKTtcclxuICBmZXRjaChyZXF1ZXN0T2JqKVxyXG4gICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgcmVzLmpzb24oKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXNwb25zZSlcclxuICAgICAgICBpZihyZW5kZXJDYWxsYmFjaykge1xyXG4gICAgICAgICAgcmVuZGVyQ2FsbGJhY2socmVzcG9uc2UpXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgfSk7XHJcbiAgfSBcclxuXHJcbiAgZnVuY3Rpb24gZ2V0U2luZ2xlUmVxdWVzdCh1cmwsIHJlbmRlckNhbGxiYWNrKSB7XHJcbiAgICBmZXRjaCh1cmwpXHJcbiAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgfSlcclxuICAgIC50aGVuKCByZW5kZXJDYWxsYmFjaygpIClcclxuICAgIC5jYXRjaChhbGVydCk7XHJcbiAgfSIsImNvbnN0IGNvdW50ZG93biAgICAgID0gcmVxdWlyZShcIi4vcGx1Z2lucy9fY291bnRkb3duXCIpO1xyXG5jb25zdCByZXF1ZXN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3JlcXVlc3QnKTtcclxuY29uc3QgcGFnZVN0YXRpc3RpY3MgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2Utc3RhdGlzdGljc1wiKTtcclxuY29uc3QgcGFnZVRpbWVsaW5lICAgPSByZXF1aXJlKFwiLi9yZW5kZXIvX3BhZ2UtdGltZWxpbmVcIik7XHJcbmNvbnN0IHBhZ2VTZWFyY2ggICAgID0gcmVxdWlyZShcIi4vcmVuZGVyL19wYWdlLXNlYXJjaFwiKTtcclxuXHJcbnJlcXVlc3QucmVxdWVzdChcImxhdGVzdFwiLCBpbml0KTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgLy90aW1lbGluZVxyXG4gIC8vIHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXF1ZXN0LnJlcXVlc3QoXCJmaW5pc2hlZFRcIiwgcGFnZVRpbWVsaW5lLmRyYXdUaW1lbGluZUNoYXJ0KTtcclxuICAgIHJlcXVlc3QucmVxdWVzdChcImZpbmlzaGVkQVwiLCBwYWdlU2VhcmNoLmluc2VydFRhc2tMaXN0VG9QYWdlKTtcclxuICAvLyB9XHJcblxyXG4gIC8vcGFnZSBzdGF0aXN0aWNzXHJcbiAgLy8gY291bnRkb3duLmluaXRUaW1lcigpO1xyXG4gIHBhZ2VTdGF0aXN0aWNzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcygpO1xyXG4gIHJlcXVlc3QucmVxdWVzdChcImxlYXJuZXJzXCIsIHBhZ2VTdGF0aXN0aWNzLmRyYXdDb3VudE9mVGFza3NQZXJVc2VyX1ZlcnRpY2FsQmFyKTtcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJhY3Rpdml0eVwiLCBwYWdlU3RhdGlzdGljcy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0KTtcclxuXHJcbn1cclxuXHJcblxyXG4gIiwiLy9DT1VOVERPV04gVElNRVJcclxuLy9zbGlja2NpdGN1bGFyIGh0dHBzOi8vd3d3LmpxdWVyeXNjcmlwdC5uZXQvZGVtby9TbGljay1DaXJjdWxhci1qUXVlcnktQ291bnRkb3duLVBsdWdpbi1DbGFzc3ktQ291bnRkb3duL1xyXG5cclxuZXhwb3J0cy5pbml0VGltZXIgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgdGltZUVuZCA9IE1hdGgucm91bmQoIChuZXcgRGF0ZShcIjIwMTguMDIuMTBcIikuZ2V0VGltZSgpIC0gJC5ub3coKSkgLyAxMDAwKTtcclxuICAgICAgdGltZUVuZCA9IE1hdGguZmxvb3IodGltZUVuZCAvIDg2NDAwKSAqIDg2NDAwO1xyXG5cclxuICAkKCcjY291bnRkb3duLWNvbnRhaW5lcicpLkNsYXNzeUNvdW50ZG93bih7XHJcbiAgICB0aGVtZTogXCJ3aGl0ZVwiLCBcclxuICAgIGVuZDogJC5ub3coKSArIHRpbWVFbmQsIC8vZW5kOiAkLm5vdygpICsgNjQ1NjAwLFxyXG4gICAgbm93OiAkLm5vdygpLFxyXG4gICAgLy8gd2hldGhlciB0byBkaXNwbGF5IHRoZSBkYXlzL2hvdXJzL21pbnV0ZXMvc2Vjb25kcyBsYWJlbHMuXHJcbiAgICBsYWJlbHM6IHRydWUsXHJcbiAgICAvLyBvYmplY3QgdGhhdCBzcGVjaWZpZXMgZGlmZmVyZW50IGxhbmd1YWdlIHBocmFzZXMgZm9yIHNheXMvaG91cnMvbWludXRlcy9zZWNvbmRzIGFzIHdlbGwgYXMgc3BlY2lmaWMgQ1NTIHN0eWxlcy5cclxuICAgIGxhYmVsc09wdGlvbnM6IHtcclxuICAgICAgbGFuZzoge1xyXG4gICAgICAgIGRheXM6ICdEYXlzJyxcclxuICAgICAgICBob3VyczogJ0hvdXJzJyxcclxuICAgICAgICBtaW51dGVzOiAnTWludXRlcycsXHJcbiAgICAgICAgc2Vjb25kczogJ1NlY29uZHMnXHJcbiAgICAgIH0sXHJcbiAgICAgIHN0eWxlOiAnZm9udC1zaXplOiAwLjVlbTsnXHJcbiAgICB9LFxyXG4gICAgLy8gY3VzdG9tIHN0eWxlIGZvciB0aGUgY291bnRkb3duXHJcbiAgICBzdHlsZToge1xyXG4gICAgICBlbGVtZW50OiAnJyxcclxuICAgICAgbGFiZWxzOiBmYWxzZSxcclxuICAgICAgZGF5czoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzFBQkM5QycsLy8ncmdiYSgwLCAwLCAwLCAxKScsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIGhvdXJzOiB7XHJcbiAgICAgICAgZ2F1Z2U6IHtcclxuICAgICAgICAgIHRoaWNrbmVzczogMC4wMixcclxuICAgICAgICAgIGJnQ29sb3I6ICdyZ2JhKDAsIDAsIDAsIDApJyxcclxuICAgICAgICAgIGZnQ29sb3I6ICcjMjk4MEI5JyxcclxuICAgICAgICAgIGxpbmVDYXA6ICdidXR0J1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dENTUzogJydcclxuICAgICAgfSxcclxuICAgICAgbWludXRlczoge1xyXG4gICAgICAgIGdhdWdlOiB7XHJcbiAgICAgICAgICB0aGlja25lc3M6IDAuMDIsXHJcbiAgICAgICAgICBiZ0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwKScsXHJcbiAgICAgICAgICBmZ0NvbG9yOiAnIzhFNDRBRCcsXHJcbiAgICAgICAgICBsaW5lQ2FwOiAnYnV0dCdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHRleHRDU1M6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHNlY29uZHM6IHtcclxuICAgICAgICBnYXVnZToge1xyXG4gICAgICAgICAgdGhpY2tuZXNzOiAwLjAyLFxyXG4gICAgICAgICAgYmdDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMCknLFxyXG4gICAgICAgICAgZmdDb2xvcjogJyNGMzlDMTInLFxyXG4gICAgICAgICAgbGluZUNhcDogJ2J1dHQnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0ZXh0Q1NTOiAnJ1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIGNhbGxiYWNrIHRoYXQgaXMgZmlyZWQgd2hlbiB0aGUgY291bnRkb3duIHJlYWNoZXMgMC5cclxuICAgIG9uRW5kQ2FsbGJhY2s6IGZ1bmN0aW9uKCkge31cclxuICB9KTtcclxufSIsImV4cG9ydHMuYmxvY2tzID0ge1xyXG4gIG1lc3NhZ2VzQ291bnQ6ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY291bnQtbWVzc2FnZXNcIiksXHJcbiAgc3RhcnJlZFJlcG86ICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zdGFycmVkLXJlcG9cIiksXHJcbiAgYWN0aXZlVXNlcnNDb3VudDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hY3RpdmUtdXNlcnNcIiksXHJcbiAgYmxvY2tMZWFybmVyczogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5sZWFybmVyc1wiKSxcclxuICBcclxufSAiLCJleHBvcnRzLm15RnVuY3Rpb24gPSBmdW5jdGlvbigpIHtcclxuICAvLyBEZWNsYXJlIHZhcmlhYmxlcyBcclxuICB2YXIgaW5wdXQsIGZpbHRlciwgdGFibGUsIHRyLCB0ZCwgaTtcclxuICBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlJbnB1dFwiKTtcclxuICBmaWx0ZXIgPSBpbnB1dC52YWx1ZS50b1VwcGVyQ2FzZSgpO1xyXG4gIHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteVRhYmxlXCIpO1xyXG4gIHRyID0gdGFibGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0clwiKTtcclxuXHJcbiAgLy8gTG9vcCB0aHJvdWdoIGFsbCB0YWJsZSByb3dzLCBhbmQgaGlkZSB0aG9zZSB3aG8gZG9uJ3QgbWF0Y2ggdGhlIHNlYXJjaCBxdWVyeVxyXG4gIGZvciAoaSA9IDA7IGkgPCB0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgdGQgPSB0cltpXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRkXCIpWzBdO1xyXG4gICAgaWYgKHRkKSB7XHJcbiAgICAgIGlmICh0ZC5pbm5lckhUTUwudG9VcHBlckNhc2UoKS5pbmRleE9mKGZpbHRlcikgPiAtMSkge1xyXG4gICAgICAgIHRyW2ldLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRyW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgfSBcclxuICB9XHJcbn1cclxuXHJcblxyXG5leHBvcnRzLnNvcnRUYWJsZSA9IGZ1bmN0aW9uKG4pIHtcclxuICB2YXIgdGFibGUsIHJvd3MsIHN3aXRjaGluZywgaSwgeCwgeSwgc2hvdWxkU3dpdGNoLCBkaXIsIHN3aXRjaGNvdW50ID0gMDtcclxuICB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlUYWJsZVwiKTtcclxuICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gIC8vIFNldCB0aGUgc29ydGluZyBkaXJlY3Rpb24gdG8gYXNjZW5kaW5nOlxyXG4gIGRpciA9IFwiYXNjXCI7IFxyXG4gIC8qIE1ha2UgYSBsb29wIHRoYXQgd2lsbCBjb250aW51ZSB1bnRpbFxyXG4gIG5vIHN3aXRjaGluZyBoYXMgYmVlbiBkb25lOiAqL1xyXG4gIHdoaWxlIChzd2l0Y2hpbmcpIHtcclxuICAgIC8vIFN0YXJ0IGJ5IHNheWluZzogbm8gc3dpdGNoaW5nIGlzIGRvbmU6XHJcbiAgICBzd2l0Y2hpbmcgPSBmYWxzZTtcclxuICAgIHJvd3MgPSB0YWJsZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIlRSXCIpO1xyXG4gICAgLyogTG9vcCB0aHJvdWdoIGFsbCB0YWJsZSByb3dzIChleGNlcHQgdGhlXHJcbiAgICBmaXJzdCwgd2hpY2ggY29udGFpbnMgdGFibGUgaGVhZGVycyk6ICovXHJcbiAgICBmb3IgKGkgPSAxOyBpIDwgKHJvd3MubGVuZ3RoIC0gMSk7IGkrKykge1xyXG4gICAgICAvLyBTdGFydCBieSBzYXlpbmcgdGhlcmUgc2hvdWxkIGJlIG5vIHN3aXRjaGluZzpcclxuICAgICAgc2hvdWxkU3dpdGNoID0gZmFsc2U7XHJcbiAgICAgIC8qIEdldCB0aGUgdHdvIGVsZW1lbnRzIHlvdSB3YW50IHRvIGNvbXBhcmUsXHJcbiAgICAgIG9uZSBmcm9tIGN1cnJlbnQgcm93IGFuZCBvbmUgZnJvbSB0aGUgbmV4dDogKi9cclxuICAgICAgeCA9IHJvd3NbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJURFwiKVtuXTtcclxuICAgICAgeSA9IHJvd3NbaSArIDFdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiVERcIilbbl07XHJcbiAgICAgIC8qIENoZWNrIGlmIHRoZSB0d28gcm93cyBzaG91bGQgc3dpdGNoIHBsYWNlLFxyXG4gICAgICBiYXNlZCBvbiB0aGUgZGlyZWN0aW9uLCBhc2Mgb3IgZGVzYzogKi9cclxuICAgICAgaWYgKGRpciA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgaWYgKHguaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkgPiB5LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAvLyBJZiBzbywgbWFyayBhcyBhIHN3aXRjaCBhbmQgYnJlYWsgdGhlIGxvb3A6XHJcbiAgICAgICAgICBzaG91bGRTd2l0Y2g9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoZGlyID09IFwiZGVzY1wiKSB7XHJcbiAgICAgICAgaWYgKHguaW5uZXJIVE1MLnRvTG93ZXJDYXNlKCkgPCB5LmlubmVySFRNTC50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICAvLyBJZiBzbywgbWFyayBhcyBhIHN3aXRjaCBhbmQgYnJlYWsgdGhlIGxvb3A6XHJcbiAgICAgICAgICBzaG91bGRTd2l0Y2g9IHRydWU7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChzaG91bGRTd2l0Y2gpIHtcclxuICAgICAgLyogSWYgYSBzd2l0Y2ggaGFzIGJlZW4gbWFya2VkLCBtYWtlIHRoZSBzd2l0Y2hcclxuICAgICAgYW5kIG1hcmsgdGhhdCBhIHN3aXRjaCBoYXMgYmVlbiBkb25lOiAqL1xyXG4gICAgICByb3dzW2ldLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHJvd3NbaSArIDFdLCByb3dzW2ldKTtcclxuICAgICAgc3dpdGNoaW5nID0gdHJ1ZTtcclxuICAgICAgLy8gRWFjaCB0aW1lIGEgc3dpdGNoIGlzIGRvbmUsIGluY3JlYXNlIHRoaXMgY291bnQgYnkgMTpcclxuICAgICAgc3dpdGNoY291bnQgKys7IFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLyogSWYgbm8gc3dpdGNoaW5nIGhhcyBiZWVuIGRvbmUgQU5EIHRoZSBkaXJlY3Rpb24gaXMgXCJhc2NcIixcclxuICAgICAgc2V0IHRoZSBkaXJlY3Rpb24gdG8gXCJkZXNjXCIgYW5kIHJ1biB0aGUgd2hpbGUgbG9vcCBhZ2Fpbi4gKi9cclxuICAgICAgaWYgKHN3aXRjaGNvdW50ID09IDAgJiYgZGlyID09IFwiYXNjXCIpIHtcclxuICAgICAgICBkaXIgPSBcImRlc2NcIjtcclxuICAgICAgICBzd2l0Y2hpbmcgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59IiwiY29uc3QgY29uZmlnID0gcmVxdWlyZShcIi4uL19jb25maWdcIik7XHJcbmNvbnN0IHRhYmxlID0gcmVxdWlyZShcIi4uL3BsdWdpbnMvX3RhYmxlXCIpO1xyXG5cclxuXHJcblxyXG5leHBvcnRzLmluc2VydFRhc2tMaXN0VG9QYWdlID0gZnVuY3Rpb24oZmluaXNoZWRBcnIpIHtcclxuICB2YXIgaW1hZ2VMb2dvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tbG9nbycpO1xyXG4gIGltYWdlTG9nby5zcmMgPSBjb25maWcudmFycy5rb3R0YW5zUm9vbS5hdmF0YXI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI215SW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIHRhYmxlLm15RnVuY3Rpb24pO1xyXG5cclxuICB2YXIgaHRtbCA9ICcnO1xyXG5cclxuICB2YXIgZGl2VGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlUYWJsZScpO1xyXG5cclxuICBodG1sICs9IFxyXG4gICAgYDx0ciBjbGFzcz1cImhlYWRlclwiPlxyXG4gICAgICAgIDx0aCBvbmNsaWNrPVwiJHt0YWJsZS5zb3J0VGFibGUoMSl9XCIgc3R5bGU9XCJ3aWR0aDo1JTtcIj5OYW1lPC90aD5cclxuICAgICAgICA8dGggb25jbGljaz1cIiR7dGFibGUuc29ydFRhYmxlKDIpfVwiIHN0eWxlPVwid2lkdGg6NSU7XCI+TmljazwvdGg+XHJcbiAgICAgICAgPHRoIG9uY2xpY2s9XCIke3RhYmxlLnNvcnRUYWJsZSgzKX1cIiBzdHlsZT1cIndpZHRoOjUlO1wiPlB1Ymxpc2hlZDwvdGg+XHJcbiAgICAgICAgPHRoIHN0eWxlPVwid2lkdGg6ODAlO1wiPlRleHQ8L3RoPlxyXG4gICAgPC90cj5gO1xyXG4gICAgICAgIFxyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluaXNoZWRBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgIGh0bWwgKz0gXHJcbiAgICAgICAgYDx0cj5cclxuICAgICAgICAgIDx0ZD48aW1nIHNyYz1cIiR7ZmluaXNoZWRBcnJbaV0uYXZhdGFyVXJsfVwiIGNsYXNzPVwidXNlci1pY29uXCI+JHtmaW5pc2hlZEFycltpXS5kaXNwbGF5TmFtZX08L3RkPlxyXG4gICAgICAgICAgPHRkPig8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tJHtmaW5pc2hlZEFycltpXS51cmx9XCI+JHtmaW5pc2hlZEFycltpXS51c2VybmFtZX08L2E+KTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS5zZW50fTwvdGQ+XHJcbiAgICAgICAgICA8dGQ+JHtmaW5pc2hlZEFycltpXS50ZXh0fSA8L3RkPlxyXG4gICAgICAgIDwvdHI+YDtcclxuICB9XHJcbiAgZGl2VGFibGUuaW5uZXJIVE1MID0gaHRtbDtcclxufSIsImNvbnN0IGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9fY29uZmlnXCIpO1xyXG5jb25zdCByZXF1ZXN0ID0gcmVxdWlyZSgnLi4vX3JlcXVlc3QnKTtcclxuY29uc3Qgc2VsID0gcmVxdWlyZSgnLi4vcGx1Z2lucy9fc2VsZWN0b3JzJyk7XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnRzLmluc2VydFZhbHVlc1RvRmVhdHVyZXNDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG4gIC8vIGZlYXR1cmUgMVxyXG4gIHJlcXVlc3QucmVxdWVzdCgnY291bnQnLCAoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5tZXNzYWdlc0NvdW50LmlubmVySFRNTCA9IGRhdGE7XHJcbiAgfSk7XHJcblxyXG4gIC8vIGZlYXR1cmUgMlxyXG4gIHJlcXVlc3QucmVxdWVzdChcImh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3Mva290dGFucy9mcm9udGVuZFwiLCAoZGF0YSkgPT4ge1xyXG4gICAgc2VsLmJsb2Nrcy5zdGFycmVkUmVwby5pbm5lckhUTUwgPSAoZGF0YS5zdGFyZ2F6ZXJzX2NvdW50ID09IHVuZGVmaW5lZCkgPyBcIi4uLlwiIDogZGF0YS5zdGFyZ2F6ZXJzX2NvdW50O1xyXG4gIH0pO1xyXG5cclxuICAvLyBmZWF0dXJlIDNcclxuICByZXF1ZXN0LnJlcXVlc3QoXCJhdXRob3JzXCIsIChkYXRhKSA9PiB7XHJcbiAgICBzZWwuYmxvY2tzLmFjdGl2ZVVzZXJzQ291bnQuaW5uZXJIVE1MID0gZGF0YTtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSA0XHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9zZWFyY2gvaXNzdWVzP3E9K3R5cGU6cHIrdXNlcjprb3R0YW5zJnNvcnQ9Y3JlYXRlZCYlRTIlODAlOEMlRTIlODAlOEJvcmRlcj1hc2NcIiwgKGRhdGEpID0+IHtcclxuICAgIHZhciBwdWxsTnVtYmVyID0gZGF0YS5pdGVtcy5maW5kKChpdGVtKSA9PiB7cmV0dXJuIGl0ZW0ucmVwb3NpdG9yeV91cmwgPT0gXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL2tvdHRhbnMvbW9jay1yZXBvXCI7fSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicHVsbC1yZXF1ZXN0c1wiKVswXS5pbm5lckhUTUwgPSBwdWxsTnVtYmVyLm51bWJlcjtcclxuICB9KTtcclxuXHJcbiAgLy8gZmVhdHVyZSA1XHJcbiAgcmVxdWVzdC5yZXF1ZXN0KFwibGVhcm5lcnNcIiwgKGRhdGEpID0+IHtcclxuICAgIHNlbC5ibG9ja3MuYmxvY2tMZWFybmVycy5pbm5lckhUTUwgPSBkYXRhLmxlbmd0aDtcclxuICB9KTtcclxufVxyXG5cclxuXHJcbmV4cG9ydHMuZHJhd0NvdW50T2ZUYXNrc1BlclVzZXJfVmVydGljYWxCYXIgPSBmdW5jdGlvbih1c2Vycykge1xyXG4gIGxldCBncmFwaEFyciA9IHVzZXJzLm1hcChmdW5jdGlvbih1c2VyKSB7XHJcbiAgICByZXR1cm4gbmV3IEFycmF5KHVzZXIudXNlcm5hbWUrXCJcIiwgdXNlci5sZXNzb25zLmxlbmd0aCwgXCJsaWdodGJsdWVcIik7XHJcbiAgfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKCdjdXJyZW50Jywge3BhY2thZ2VzOiBbJ2NvcmVjaGFydCcsICdiYXInXX0pO1xyXG4gIGdvb2dsZS5jaGFydHMuc2V0T25Mb2FkQ2FsbGJhY2soZHJhd0Jhc2ljKTtcclxuICBmdW5jdGlvbiBkcmF3QmFzaWMoKSB7XHJcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRpY2FsX2NoYXJ0Jyk7XHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ29sdW1uQ2hhcnQoY29udGFpbmVyKTtcclxuICAgIGdyYXBoQXJyLnVuc2hpZnQoWydVc2VyJywgJ1Rhc2tzJywgeyByb2xlOiAnc3R5bGUnIH1dKVxyXG4gICAgdmFyIGRhdGEgPSBnb29nbGUudmlzdWFsaXphdGlvbi5hcnJheVRvRGF0YVRhYmxlKGdyYXBoQXJyKTtcclxuICB2YXIgb3B0aW9ucyA9IHtcclxuICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICBkdXJhdGlvbjogMjAwMCxcclxuICAgICAgc3RhcnR1cDogdHJ1ZSAvL1RoaXMgaXMgdGhlIG5ldyBvcHRpb25cclxuICAgIH0sXHJcbiAgICB0aXRsZTogJ1N1bSBvZiBmaW5pc2hlZCB0YXNrcyBieSBlYWNoIGxlYXJuZXInLFxyXG4gICAgLy8gd2lkdGg6ICgkKHdpbmRvdykud2lkdGgoKSA8IDgwMCkgPyAkKHdpbmRvdykud2lkdGgoKSA6ICQod2luZG93KS53aWR0aCgpKjAuNSxcclxuICAgIHdpZHRoOiAkKHdpbmRvdykud2lkdGgoKSxcclxuICAgIGhlaWdodDogJCh3aW5kb3cpLmhlaWdodCgpKjAuNDUsXHJcbiAgICBoQXhpczoge1xyXG4gICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICBzbGFudGVkVGV4dEFuZ2xlOjkwLCAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgdkF4aXM6IHtcclxuICAgICAgLy90aXRsZTogJ1N1bSBvZiBmaW5pc2hlZCB0YXNrcydcclxuICAgIH0sXHJcbiAgICBhbmltYXRpb246e1xyXG4gICAgICBkdXJhdGlvbjogMTAwMCxcclxuICAgICAgZWFzaW5nOiAnb3V0J1xyXG4gICAgfSxcclxuICB9O1xyXG4gIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IFxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5cclxuZXhwb3J0cy5kcmF3QWN0aXZpdHlfTGluZUNoYXJ0ID0gZnVuY3Rpb24oYWN0aXZpdHlBcnIpIHtcclxuICBhY3Rpdml0eUFyci5tYXAoZnVuY3Rpb24oZGF5KSB7XHJcbiAgICBkYXlbMF0gPSBuZXcgRGF0ZShkYXlbMF0pO1xyXG4gIH0pO1xyXG4gIGdvb2dsZS5jaGFydHMubG9hZCgnY3VycmVudCcsIHtwYWNrYWdlczogWydjb3JlY2hhcnQnLCAnbGluZSddfSk7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjayhkcmF3QmFzaWMpO1xyXG5cclxuICBmdW5jdGlvbiBkcmF3QmFzaWMoKSB7XHJcbiAgICB2YXIgZGF0YSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIGRhdGEuYWRkQ29sdW1uKCdkYXRlJywgJ0RheXMnKTtcclxuICAgIGRhdGEuYWRkQ29sdW1uKCdudW1iZXInLCAnTWVzc2FnZXMnKTtcclxuICAgIGRhdGEuYWRkUm93cyhhY3Rpdml0eUFycik7XHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgdGl0bGU6IFwiQWN0aXZpdHkgb2YgdXNlcnMgaW4gY2hhdFwiLFxyXG4gICAgICBhbmltYXRpb246IHtcclxuICAgICAgICBkdXJhdGlvbjogMjAwMCxcclxuICAgICAgICBzdGFydHVwOiB0cnVlIC8vVGhpcyBpcyB0aGUgbmV3IG9wdGlvblxyXG4gICAgICB9LFxyXG4gICAgICAvL2N1cnZlVHlwZTogJ2Z1bmN0aW9uJyxcclxuICAgICAgLy8gd2lkdGg6ICgkKHdpbmRvdykud2lkdGgoKSA8IDgwMCkgPyAkKHdpbmRvdykud2lkdGgoKSA6ICQod2luZG93KS53aWR0aCgpKjAuNSxcclxuICAgICAgd2lkdGg6ICQod2luZG93KS53aWR0aCgpLCBcclxuICAgICAgaGVpZ2h0OiAkKHdpbmRvdykuaGVpZ2h0KCkqMC40NSxcclxuICAgICAgaEF4aXM6IHtcclxuICAgICAgICBzbGFudGVkVGV4dDp0cnVlLFxyXG4gICAgICAgIHNsYW50ZWRUZXh0QW5nbGU6NDUsXHJcbiAgICAgIH0sXHJcbiAgICAgIHZBeGlzOiB7XHJcbiAgICAgICAgLy8gdGl0bGU6ICdDb3VudCBvZiBtZXNzYSdcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBjaGFydCA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5MaW5lQ2hhcnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xpbmVjaGFydCcpKTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YSwgb3B0aW9ucyk7XHJcbiAgfVxyXG59IiwiZXhwb3J0cy5kcmF3VGltZWxpbmVDaGFydCA9IGZ1bmN0aW9uKGdyYXBoQXJyKSB7XHJcbiAgZ29vZ2xlLmNoYXJ0cy5sb2FkKFwiY3VycmVudFwiLCB7cGFja2FnZXM6W1widGltZWxpbmVcIl19KTtcclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdDaGFydCk7XHJcbiAgZnVuY3Rpb24gZHJhd0NoYXJ0KCkge1xyXG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0aW1lbGluZScpO1xyXG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xyXG4gICAgdmFyIGNoYXJ0ID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLlRpbWVsaW5lKGNvbnRhaW5lcik7XHJcbiAgICB2YXIgZGF0YVRhYmxlID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSgpO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ1Jvb20nIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdzdHJpbmcnLCBpZDogJ05hbWUnIH0pO1xyXG4gICAgZGF0YVRhYmxlLmFkZENvbHVtbih7IHR5cGU6ICdkYXRlJywgaWQ6ICdTdGFydCcgfSk7XHJcbiAgICBkYXRhVGFibGUuYWRkQ29sdW1uKHsgdHlwZTogJ2RhdGUnLCBpZDogJ0VuZCcgfSk7XHJcbiAgICBcclxuICAgIGdyYXBoQXJyLm1hcChlbGVtZW50ID0+IHtcclxuICAgICAgZWxlbWVudFsyXSA9IG5ldyBEYXRlKGVsZW1lbnRbMl0pO1xyXG4gICAgICBlbGVtZW50WzNdID0gbmV3IERhdGUoZWxlbWVudFszXSk7XHJcbiAgICB9KTtcclxuICAgIGRhdGFUYWJsZS5hZGRSb3dzKGdyYXBoQXJyKTtcclxuXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgdGltZWxpbmU6IHsgY29sb3JCeVJvd0xhYmVsOiB0cnVlIH0sXHJcbiAgICAgIGhBeGlzOiB7XHJcbiAgICAgICAgICBtaW5WYWx1ZTogbmV3IERhdGUoMjAxNywgOSwgMjkpLFxyXG4gICAgICAgICAgbWF4VmFsdWU6IG5ldyBEYXRlKG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgKDEgKiA2MCAqIDYwICogMTAwMDAwKSlcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNoYXJ0LmRyYXcoZGF0YVRhYmxlLCBvcHRpb25zKTtcclxuICB9XHJcbn0iXX0=

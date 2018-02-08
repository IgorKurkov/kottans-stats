const config = require("../_config");
const request = require('../_request');
const sel = require('../plugins/_selectors');




exports.insertValuesToFeaturesCards = function() {
  // feature 1
  request.request('count', (data) => {
    sel.blocks.messagesCount.innerHTML = data;
  });

  // feature 2
  request.request("https://api.github.com/repos/kottans/frontend", (data) => {
    sel.blocks.starredRepo.innerHTML = (data.stargazers_count == undefined) ? "..." : data.stargazers_count;
  });

  // feature 3
  request.request("authors", (data) => {
    sel.blocks.activeUsersCount.innerHTML = data;
  });

  // feature 4
  request.request("https://api.github.com/search/issues?q=+type:pr+user:kottans&sort=created&%E2%80%8C%E2%80%8Border=asc", (data) => {
    var pullNumber = data.items.find((item) => {return item.repository_url == "https://api.github.com/repos/kottans/mock-repo";});
    document.getElementsByClassName("pull-requests")[0].innerHTML = pullNumber.number;
  });

  // feature 5
  request.request("learners", (data) => {
    sel.blocks.blockLearners.innerHTML = data.length;
  });
}


exports.drawCountOfTasksPerUser_VerticalBar = function(users) {
  let graphArr = users.map(function(user) {
    return new Array(user.username+"", user.lessons.length, "lightblue");
  });
  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(drawBasic);
  function drawBasic() {
    var container = document.getElementById('vertical_chart');
    var chart = new google.visualization.ColumnChart(container);
    graphArr.unshift(['User', 'Tasks', { role: 'style' }])
    var data = google.visualization.arrayToDataTable(graphArr);
  var options = {
    animation: {
      duration: 2000,
      startup: true //This is the new option
    },
    title: 'Sum of finished tasks by each learner',
    // width: ($(window).width() < 800) ? $(window).width() : $(window).width()*0.5,
    width: $(window).width(),
    height: $(window).height()*0.45,
    hAxis: {
      slantedText:true,
      slantedTextAngle:90,        
    },
    vAxis: {
      //title: 'Sum of finished tasks'
    },
    animation:{
      duration: 1000,
      easing: 'out'
    },
  };
  chart.draw(data, options);
  }
} 


////////////////////


exports.drawActivity_LineChart = function(activityArr) {
  activityArr.map(function(day) {
    day[0] = new Date(day[0]);
  });
  google.charts.load('current', {packages: ['corechart', 'line']});
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
      height: $(window).height()*0.45,
      hAxis: {
        slantedText:true,
        slantedTextAngle:45,
      },
      vAxis: {
        // title: 'Count of messa'
      }
    };
    var chart = new google.visualization.LineChart(document.getElementById('linechart'));
    chart.draw(data, options);
  }
}
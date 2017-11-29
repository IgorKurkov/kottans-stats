var global = {
  token : "826700829f73a8dd6ec83770aae456bb3bc6b6df",
  tokenString : "access_token=" + "826700829f73a8dd6ec83770aae456bb3bc6b6df",
  roomUrlPrefix : "https://api.gitter.im/v1/rooms/"
};

var kottansRoom = {
  id : "59b0f29bd73408ce4f74b06f",
  avatar : "https://avatars-02.gitter.im/group/iv/3/57542d27c43b8c601977a0b6"
};

var preloader = document.getElementById("timeline");
preloader.innerHTML = `<div class="kitty-wiggle-full"></div><center><h3>Loading ...</h3></center>`;

function getAllRoomMessages(count, oldestId) {
  if(oldestId){oldestId = "&beforeId="+oldestId;} 
  return global.roomUrlPrefix + kottansRoom.id +
          "/chatMessages?limit="+ count + oldestId +"&" + global.tokenString;
  };  

var data = [];

var oldestMessageId = null;

function fetchAllMessages(oldestMessageId) {
  fetch(getAllRoomMessages(100, oldestMessageId))
  .then(function(response) {
    return response.json();
  })
  .then( function(response) {
    Array.prototype.push.apply(data, response);
    var oldestMessageId = response[0].id; //console.log(oldestMessageId)  
    if(response.length == 100) {
      fetchAllMessages(oldestMessageId); // fetch again
    } 
    else {
      var messagesArr =  buildMessagesArr (data);
      var finishedArr = filterFinishedMessages (messagesArr);
      var activityArr = buildActivityArrOfChattingByDay (messagesArr);
      
      var users = extractActiveUsersFromFinishedArr (finishedArr);
      insertTaskListToPage (finishedArr); //void
      insertValuesToFeaturesCards (messagesArr); //void
      
      drawTimelineChart (buildTimelineGraphArr (finishedArr, users));
      drawVerticalBarChart (buildSumOfTasksByUserGraphArr (users));
      drawActivityLineChart (activityArr);
    }
  })
  .catch(alert);
}
fetchAllMessages(oldestMessageId); 



function buildMessagesArr(data) {
  var messagesArr = [];
  console.log(data)
  for (var i = 0; i < data.length; i++) {
    var croppedData = data[i];
    var regexFinished = /finished/;
    var regexlessonsName = /Website Performance|server and http tools|CSS Basics|HTML5 and CSS|Object Oriented JS|Intro to JS|Offline Web|Pair Game|Intro to HTML & CSS|task 2|Task 1|Web Design/ig;
    var sent = new Date(croppedData["sent"]); // 2017-11-17T14:01:46.906Z
    var dateSentFormatted = sent.getFullYear() +"."+ 
      ("0"+ (sent.getMonth() + 1)).slice(-2) +"."+ 
      ("0"+ sent.getDate()).slice(-2) +" "+ 
      ("0"+ sent.getHours()).slice(-2) +":"+ 
      ("0"+ sent.getMinutes()).slice(-2);

    var matches = croppedData["text"].match(regexlessonsName);
    messagesArr[i] = {
        lesson : (matches == null) ? "Unrecognised task" : matches,
        finished : regexFinished.test(croppedData["text"]),
        avatarUrl : croppedData.fromUser["avatarUrl"],
        displayName : croppedData.fromUser["displayName"],
        username : croppedData.fromUser["username"], 
        gv : croppedData.fromUser["gv"],
        v : croppedData.fromUser["v"],
        text : croppedData["text"],
        sent : dateSentFormatted 
    };
  }
  console.log(messagesArr)
  return messagesArr;
}

function getSingleRequest(url, callback) {
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then( callback )
  .catch(alert);
}

function insertValuesToFeaturesCards (messagesArr) {
  // feature 1
  document.getElementsByClassName("count-messages")[0].innerHTML = messagesArr.length;
  // feature 2
  getSingleRequest("http://api.github.com/repos/kottans/frontend", (data) => {
    document.getElementsByClassName("starred-repo")[0].innerHTML = data.stargazers_count;
  });
  // feature 3
  document.getElementsByClassName("active-users")[0].innerHTML = getAllUsersOfChat(messagesArr).length;
  // feature 4
  getSingleRequest("https://api.github.com/search/issues?q=+type:pr+user:kottans&sort=created&%E2%80%8C%E2%80%8Border=asc", (data) => {
    var pullNumber = data.items.find((item) => {return item.repository_url == "https://api.github.com/repos/kottans/mock-repo";});
    document.getElementsByClassName("pull-requests")[0].innerHTML = pullNumber.number;
  });
  // feature 5
  var learners = extractActiveUsersFromFinishedArr (finishedArr).length;
  document.getElementsByClassName("learners")[0].innerHTML = learners;
}

function filterFinishedMessages(messagesArr) {
  return finishedArr = messagesArr.filter((obj) => { 
    return obj.finished == true && obj.displayName != "zonzujiro"; 
  });
};


function User(displayName, username, avatarUrl, lessons) {
  this.displayName = displayName;
  this.username = username;
  this.avatarUrl = avatarUrl;
  this.lessons = lessons || [];
};

function getAllUsersOfChat (messagesArr) {
  var allUsersArr = [];
  for (var i = 0; i < messagesArr.length; i++) {
      var existUser = allUsersArr.find((user) => user.username === messagesArr[i].username);

      if(existUser != undefined) { 
        existUser.lessons = existUser.lessons.concat(messagesArr[i].lesson);
      } else {
        allUsersArr.push(new User(
          messagesArr[i].displayName, 
          messagesArr[i].username,
          messagesArr[i].avatarUrl,
          messagesArr[i].lesson
      ));
    }
  } 
  return allUsersArr;
}

function extractActiveUsersFromFinishedArr (finishedArr) {
  var usersArr = [];
  for (var i = 0; i < finishedArr.length; i++) {
      var existUser = usersArr.find((user) => user.displayName === finishedArr[i].displayName);

      if(existUser != undefined) { 
        existUser.lessons = existUser.lessons.concat(finishedArr[i].lesson);
      } else {
        usersArr.push(new User(
          finishedArr[i].displayName, 
          finishedArr[i].username,
          finishedArr[i].avatarUrl,
          finishedArr[i].lesson
      ));
    }
  } 
  return usersArr;
}

function buildActivityArrOfChattingByDay (messagesArr) {
  messagesArr.sort((a, b)=> { 
    a = new Date(a.sent).getTime();
    b = new Date(b.sent).getTime();
    return a > b ? 1 : a < b ? -1 : 0;
  }).reverse();
  var activityArr = [];
  for (var i = 0; i < messagesArr.length; i++) {
    var sent = new Date(messagesArr[i].sent);
    var existDay = activityArr.find((day) => day[0].getDate() == sent.getDate() && day[0].getMonth() == sent.getMonth());
    (existDay != undefined) ? existDay[1]++ : activityArr.push( [sent, 1] );
  } 
  
  return activityArr.filter((day) => { return day[0].getMonth() != 8 }); //cut two first messages from september
}

function insertTaskListToPage(finishedArr) {
  var imageLogo = document.getElementById('main-logo');
  imageLogo.src = kottansRoom.avatar;

  finishedArr.sort((a, b)=> { 
    a = new Date(a.sent).getTime();
    b = new Date(b.sent).getTime();
    return a > b ? 1 : a < b ? -1 : 0;
  }).reverse();

  var divTable = document.getElementById('myTable');
      divTable.innerHTML += 
      `<tr class="header">
         <th>№</th>
         <th onclick="sortTable(1)" style="width:10%;">Name</th>
         <td onclick="sortTable(2)" >Username</td>
         <th onclick="sortTable(3)" style="width:10%;">Published</th>
         <th style="width:90%;">Text</th>
      </tr>`;
        
  for (var i = 0; i < finishedArr.length; i++) {
    // var sent = new Date(finishedArr[i].sent);
    // var dateSentFormatted = 
    //   sent.getFullYear() +"."+ ("0"+ (sent.getMonth() + 1)).slice(-2) +"."+ 
    //   ("0"+ sent.getDate()).slice(-2) +" "+ sent.getHours() +":"+ sent.getMinutes();
    divTable.innerHTML += 
        `<tr>
          <td>${i+1}</td>
          <td>${finishedArr[i].displayName}</td>
          <td>(${finishedArr[i].username})</td>
          <td>${finishedArr[i].sent}</td>
          <td>${finishedArr[i].text} </td>
        </tr>`;
  }
}


function buildTimelineGraphArr(finishedArr, users) {
  var graphArr = [];
  for (var i = 0; i < finishedArr.length; i++) {
    var obj = finishedArr[i];
      var startTime = new Date(obj.sent);   
      var endTime = new Date(new Date(obj.sent).getTime() + (1 * 60 * 60 * 20000));
      var user = users.find((user) => { return user.displayName == obj.displayName });

      graphArr[i] = [`${obj.displayName} (${user.lessons.length})`, obj.lesson+"", startTime, endTime];    
  }
  return graphArr;
}

function buildSumOfTasksByUserGraphArr(users) {
  var graphArr = [];
  for (var i = 0; i < users.length; i++) {
      graphArr[i] = new Array(users[i].username+"", users[i].lessons.length, "lightblue");    
  }
  return graphArr;
}



function drawTimelineChart (graphArr) {
  google.charts.load("current", {packages:["timeline"]});
  google.charts.setOnLoadCallback(drawChart);
  function drawChart() {
    var container = document.getElementById('timeline');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Room' });
    dataTable.addColumn({ type: 'string', id: 'Name' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    dataTable.addRows(graphArr);
    var options = {
      //width: $(window).width(),
      //height: $(window).height(),
      timeline: { colorByRowLabel: true },
      hAxis: {
          minValue: new Date(2017, 9, 29),
          maxValue: new Date(new Date().getTime() + (1 * 60 * 60 * 100000))
      }
    };
    chart.draw(dataTable, options);
  }
}

function drawVerticalBarChart (graphArr) {
  google.charts.load('current', {packages: ['corechart', 'bar']});
  google.charts.setOnLoadCallback(drawBasic);
  function drawBasic() {
    var container = document.getElementById('vertical_chart');
    var chart = new google.visualization.ColumnChart(container);
    graphArr.unshift(['User', 'Lessons', { role: 'style' }])
    //document.getElementById('debug').innerHTML = JSON.stringify(graphArr);
    var data = google.visualization.arrayToDataTable(graphArr);
  var options = {
    animation: {
      duration: 2000,
      startup: true //This is the new option
    },
    title: 'Bar of finished tasks by each user',
    width: $(window).width()*0.49,
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

function drawActivityLineChart (activityArr) {
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
      width: $(window).width()*0.49,
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




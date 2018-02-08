const config = require("./_config");
const request = require('./_request');
const sel = require('./plugins/_selectors');
// console.log(sel.blocks.messagesCount)

exports.renderTimelinesdfsdfsdv = function(data) {

  //var usersUrls = getUrlsOfUsersInChat (messagesArr, getAllUsersOfChat);
  //console.log(usersUrls)
  //getLocationsFromUserUrls (usersUrls, buildLocationsGraphArray); //void


}



// function getUrlsOfUsersInChat (messagesArr, getAllUsersOfChat) {
//   var usersUrls = [];
//   var allUsersInChat = getAllUsersOfChat (messagesArr);
//   for (var i = 0; i < allUsersInChat.length; i++) {
//     usersUrls[i] = "https://api.github.com/users"+ allUsersInChat[i].url;
//   }
//   return usersUrls;
// }

// function getLocationsFromUserUrls (usersUrls, buildLocationsGraphArray) {
//   Promise.all(usersUrls.map(url =>
//     fetch(url).then(resp => resp.text())
//   )).then(parsedUsersObjs => {
//     //console.log(parsedUsersObjs)
//     var locationsGraphArr = buildLocationsGraphArray (parsedUsersObjs);
//     console.log(locationsGraphArr)
//     //then build pie chart
//     //then build geo chart
//   });
// }

// function buildLocationsGraphArray (parsedUsersObjs) {
//   //console.log(parsedUsersObjs)
//   var locationNamesArr = [];
//   for (var i = 0; i < parsedUsersObjs.length; i++) {
//     console.log("parsedUsersObjs[i]")
//     console.log(parsedUsersObjs[i])
//     locationNamesArr[i] = parsedUsersObjs[i]["location"];
//     console.log("locationNamesArr[i]")
//     console.log(locationNamesArr[i])
//   }
//   console.log("locationNamesArr")
//   console.log(locationNamesArr)
//   //var items = [4,5,4,6,3,4,5,2,23,1,4,4,4];
//   var locationsCountObj = locationNamesArr.reduce(function(prev, cur) {
//     prev[cur] = (prev[cur] || 0) + 1;
//     return prev;
//     }, {});

//   var locationsGraphArr = [];
//   for (var i in locationsCountObj) { // i is the property name
//     locationsGraphArr.push([ i, locationsCountObj[i] ]);
//   }
//   console.log("locationsGraphArr")
//   console.log(locationsGraphArr)

//   return locationsGraphArr;
// }

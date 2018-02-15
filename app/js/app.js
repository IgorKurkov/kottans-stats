const countdown      = require("./plugins/_countdown");
const request        = require('./_request');
const pageStatistics = require("./render/_page-statistics");
const pageTimeline   = require("./render/_page-timeline");
const pageSearch     = require("./render/_page-search");
const pageFilters     = require("./render/_page-filters");

// request.request("latest");
// request.request("latest", init);
pageFilters.printDayBlocks();
pageFilters.printMessages();

var divv = document.querySelector(".open");
divv.scrollTop = divv.scrollHeight;

document.querySelector(".open").addEventListener('click', () => {
  document.querySelector(".left-sidebar").style.marginLeft = "0px";
  // document.querySelector("body").style.marginLeft = "250px";
  // document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
});


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


 
const countdown      = require("./plugins/_countdown");
const request        = require('./_request');
const pageStatistics = require("./render/_page-statistics");
const pageTimeline   = require("./render/_page-timeline");
const pageSearch     = require("./render/_page-search");

request.request("latest");

//timeline
window.onload = function () {
  request.request("finishedT", pageTimeline.drawTimelineChart);
  request.request("finishedA", pageSearch.insertTaskListToPage);
}
 
//page statistics
// countdown.initTimer();
pageStatistics.insertValuesToFeaturesCards();
request.request("learners", pageStatistics.drawCountOfTasksPerUser_VerticalBar);
request.request("activity", pageStatistics.drawActivity_LineChart);



 
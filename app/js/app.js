const countdown      = require("./plugins/_countdown");
// const request        = require('./_request');
const pageStatistics = require("./render/_page-statistics");
const pageTimeline   = require("./render/_page-timeline");
const pageSearch     = require("./render/_page-search");

import * as searchPage from "./render/_page-search";
import * as filtersPage from "./render/_page-filters";
import { request as getMessages  } from "./_request-new";



getMessages("latest").then(init);

function init() {
  // Page Timeline
  getMessages("finishedByTasks").then(pageTimeline.drawTimelineChart);
  
  //Page search finished tasks
  getMessages("finishedByStudents").then(searchPage.insertTaskListToPage);
  
  //Page statistics
  // countdown.initTimer();
  pageStatistics.insertValuesToFeaturesCards();
  getMessages("learners").then(pageStatistics.drawCountOfTasksPerUser_VerticalBar);
  getMessages("activity").then(pageStatistics.drawActivity_LineChart);

  //Page filters
  let currentDate = (new Date().toISOString().substring(0, 10).split('-').join('.'));
  // console.log(new Date())
  getMessages("perdate", currentDate).then(data => filtersPage.drawMessages(data, currentDate));
  getMessages("byDay").then(filtersPage.drawCalendar);

  filtersPage.renderTotalMediaSummaryBlock();
  getMessages("peruser").then(data => {
    filtersPage.drawPieChart(data); 
    // console.log(data)
  });
}





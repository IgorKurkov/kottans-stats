

// function highchartsLineChart (activityArr) {
// var seriesOptions = [],
// seriesCounter = 0,
// names = ['Chat'];
// /**
// * Create the chart when all data is loaded
// */
// function createChart() {
// Highcharts.stockChart('container', {
//     rangeSelector: {
//         selected: 4
//     },
//     plotOptions: {
//         series: {
//             showInNavigator: true
//         }
//     },
//     tooltip: {
//         pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} messages</b><br/>',
//         valueDecimals: 0
//     },
//     series: seriesOptions
// });
// }

// $.each(names, function (i, name) {
//     seriesOptions[i] = {
//         name: name,
//         data: activityArr //data
//     };
//     seriesCounter += 1;

//     if (seriesCounter === names.length) {
//         createChart();
//     }
// });
// }








// function drawDoubleChart (pieArr, barArr) {
//   // Load Charts and the corechart and barchart packages.
//   google.charts.load('current', {'packages':['corechart']});
//   // Draw the pie chart and bar chart when Charts is loaded.
//   google.charts.setOnLoadCallback(drawChart);
//   function drawChart() {
//     var data = new google.visualization.DataTable();
//     data.addColumn('string', 'Topping');
//     data.addColumn('number', 'Slices');
//     data.addRows([
//       ['Mushrooms', 3],
//       ['Onions', 1],
//       ['Olives', 1],
//       ['Zucchini', 1],
//       ['Pepperoni', 2]
//     ]);

//     var piechart_options = {title:'Pie Chart: How Much Pizza I Ate Last Night',
//                     width:400,
//                     height:300};
//     var piechart = new google.visualization.PieChart(document.getElementById('piechart_div'));
//     piechart.draw(data, piechart_options);

//     var barchart_options = {title:'Barchart: How Much Pizza I Ate Last Night',
//                     width:400,
//                     height:300,
//                     legend: 'none'};
//     var barchart = new google.visualization.BarChart(document.getElementById('barchart_div'));
//     barchart.draw(data, barchart_options);
//   }
// }




// function drawHorisontalBarChart(graphArr){
//   google.charts.load('current', {packages: ['corechart', 'bar']});
//   google.charts.setOnLoadCallback(drawMultSeries);

//   function drawMultSeries() {
//   var data = google.visualization.arrayToDataTable([
//     ['Element', 'Density', { role: 'style' }, { role: 'annotation' } ],
//     ['Copper', 8.94, '#b87333', 'Cu' ],
//     ['Silver', 10.49, 'silver', 'Ag' ],
//     ['Gold', 19.30, 'gold', 'Au' ],
//     ['Platinum', 21.45, 'color: #e5e4e2', 'Pt' ]
//   ]);

//   var options = {
//     title: 'Population of Largest U.S. Cities',
//     width: $(window).width()*0.75,
//     height: $(window).height()*0.75,
//     chartArea: {width: '50%'},
//     hAxis: {
//       title: 'Total Population',
//       minValue: 0
//     },
//     vAxis: {
//       title: 'City'
//     }
//   };

//   var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
//   chart.draw(data, options);
//   }
// }




// function drawPieChart(graphArr){
//   google.charts.load("current", {packages:["corechart"]});
//   google.charts.setOnLoadCallback(drawChart);
//   function drawChart() {
//     var data = google.visualization.arrayToDataTable([
//       ['Language', 'Speakers (in millions)'],
//       ['Assamese', 13], ['Bengali', 83], ['Bodo', 1.4],
//       ['Dogri', 2.3], ['Gujarati', 46], ['Hindi', 300],
//       ['Kannada', 38], ['Kashmiri', 5.5], ['Konkani', 5],
//       ['Maithili', 20], ['Malayalam', 33], ['Manipuri', 1.5],
//       ['Marathi', 72], ['Nepali', 2.9], ['Oriya', 33],
//       ['Punjabi', 29], ['Sanskrit', 0.01], ['Santhali', 6.5],
//       ['Sindhi', 2.5], ['Tamil', 61], ['Telugu', 74], ['Urdu', 52]
//     ]);

//     var options = {
//       title: 'Indian Language Use',
//       legend: 'none',
//       pieSliceText: 'label',
//       slices: {  4: {offset: 0.2},
//                 12: {offset: 0.3},
//                 14: {offset: 0.4},
//                 15: {offset: 0.5},
//       },
//     };

//     var chart = new google.visualization.PieChart(document.getElementById('piechart'));
//     chart.draw(data, options);
//   }
// }

//get urls of users with lessons - api .github get location
//draw pie
/*count all values - 
all messages in chat, 
github repo stars, 
users in chat, 
active users was once writing in chat,
finished users, 
done all tasks

*/
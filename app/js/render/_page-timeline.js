exports.drawTimelineChart = function(graphArr) {
  google.charts.load("current", {packages:["timeline"]});
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
          maxValue: new Date(new Date().getTime() + (1 * 60 * 60 * 100000))
      }
    };
    chart.draw(dataTable, options);
  }
}
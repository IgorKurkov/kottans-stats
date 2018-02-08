//COUNTDOWN TIMER
//slickcitcular https://www.jqueryscript.net/demo/Slick-Circular-jQuery-Countdown-Plugin-Classy-Countdown/

exports.initTimer = function() {
  var timeEnd = Math.round( (new Date("2018.02.10").getTime() - $.now()) / 1000);
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
          fgColor: '#1ABC9C',//'rgba(0, 0, 0, 1)',
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
    onEndCallback: function() {}
  });
}
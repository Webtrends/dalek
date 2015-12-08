
var keg_size = 19500;  //milliters in a sixth barrel keg

var options = {
  width: "400", height: "50%",
  redFrom: 0, redTo: keg_size/1000 * 0.10,
  yellowFrom: keg_size/1000 * 0.10, yellowTo: keg_size/1000 * 0.30,
  minorTicks: 5,
  max: keg_size/1000
};

function normalize(val){
  return parseInt(val)/1000;
}

function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

google.load("visualization", "1", {packages:["gauge"]});
var source = new EventSource('/stream');
source.addEventListener('message', function(e) {
  
  var data = JSON.parse(e.data);
  console.log(data);

  options.width = $("#c1").width().toString();
  var title1 = $.urlParam("orange") ? urldecode($.urlParam("orange")) : data[0].color;
  var d1 = google.visualization.arrayToDataTable([
     ['Keg', 'Mills'],
     [title1,  normalize(keg_size - data[0].millis)]
  ]);
  var chart1 = new google.visualization.Gauge(document.getElementById('orange_div'));
  chart1.draw(d1, options);

  var title2 = $.urlParam("green") ? urldecode($.urlParam("green")) : data[1].color;
  var d2 = google.visualization.arrayToDataTable([
     ['Keg', 'Mills'],
     [title2,  normalize(keg_size - data[1].millis)]
  ]);
  var chart2 = new google.visualization.Gauge(document.getElementById('green_div'));
  chart2.draw(d2, options);

  var title3 = $.urlParam("yellow") ? urldecode($.urlParam("yellow")) : data[2].color;
  var d3 = google.visualization.arrayToDataTable([
     ['Keg', 'Mills'],
     [title3,  normalize(keg_size - data[2].millis)]
  ]);
  var chart3 = new google.visualization.Gauge(document.getElementById('yellow_div'));
  chart3.draw(d3, options);

 }, false);


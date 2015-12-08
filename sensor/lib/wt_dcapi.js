var rest = require('restler'),
    defaults = require('./defaults'),
       _ = require('lodash');

var dcsid = process.env.DCSID;  //webtrends.com
var idUrl = 'http://dc.webtrends.com/v1/'+dcsid+'/ids.svc'
var eventUrl = 'http://dc.webtrends.com/v1/'+dcsid+'/events.svc';
var scsUrl = 'http://scs.webtrends.com/'+dcsid+'/dcs.gif?';

var headers = {
  'connection': 'close',
  'user-agent': 'dalek-state',
  'Content-Type': 'application/x-www-form-urlencoded',
  'accept-encoding': 'identity'
};

function pack(payload){
  var data = _.extend(defaults.payload,payload);
  return scsUrl+Object.keys(data).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
  }).join('&');
}

function sendToSCS(payload, callback){

    rest.get(pack(payload), {
      headers: headers
    }).on('complete', function(data, response) {
      if( response && response.statusCode && response.rawEncoded ){
        callback({
          code: response.statusCode,
          raw: response.rawEncoded
        });
      } else {
        callback({
          code: "-1",
          raw: "ERR_INTERNET_DISCONNECTED"
        });
      }
    });    

}

// function sendToCDAPI(payload, callback){

//   rest.post(idUrl, {
//     headers: headers
//   }).on('complete', function(data, response) {
//     var jsonData = {
//       dcssip: "localhost",
//       dcsuri: "/dalek/state",
//       "WT.ti": "Dalek State Information",
//       "WT.co_f": response.rawEncoded
//     };
    
//     rest.post(eventUrl, {
//       data: _.extend(jsonData,payload),
//       headers: headers
//     }).on('complete', function(data, response) {
//       callback({
//         code: response.statusCode,
//         raw: response.rawEncoded
//       });
//     });

//   });
// }

module.exports = {
  send: function (payload, callback) {
    sendToSCS(payload, callback);
  }
};


var wt_auth = require('./wt_auth');
var WebSocket = require('ws');

var dalek_query = "WHERE data.cs-uri-stem='/dalek/state'";
var cache;
var stream;
var stream_timeout =  1800000;  //30 mins milliseconds

function init(){
    var ws;
    wt_auth.token(process.env.ACCOUNT_ID, function(token){
        var request = {
            "access_token":token,
            "command":"stream",
            "api_version":"2.0",
            "schema_version":"2.0",
            "stream_type":"session_all",
            "query":dalek_query
        };
        ws = new WebSocket('ws://sapi.webtrends.com/streaming');
        ws.on('open', function() {
            console.log('sapi connection opened');
            ws.send(JSON.stringify(request));
        });

        ws.on('message', onMessage);
        ws.on('close', function(){
            console.log('sapi connection closed');
        })
    });

    setTimeout(function(){
        ws.close();
        init();
    }, stream_timeout);

}

function onMessage(message){
    try {
       var events = JSON.parse(message).event;
        if( events !== undefined ){
            events.forEach( function(event){
                if( event.data["payload"] ) {
                    var data = JSON.parse(event.data["payload"]);
                    console.log(JSON.stringify(data,null,'  '));
                    cache.update(data, function(data){
                        stream.trigger(data);
                    });
                }
            });
        }
    } catch (e){
        console.log(e);
    }
}

function setStream(s){
    stream = s;
}

module.exports.init = init;
module.exports.setStream = setStream;
module.exports.use = function(c){
    cache = c;
}

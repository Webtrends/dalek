var dcapi = require('../lib/wt_dcapi'),
    _ = require('lodash'),
    defaults = require('./defaults');


var run_timeout = 5000,
    local_only = true,
	cache = {},
	stream = {},
	data = {},
    flow = {};

function collect(data){
    dcapi.send({payload: JSON.stringify(data)}, function(resp){
        console.log(resp.code + " : "+resp.raw.toString('base64'));
    });
}

function run_fake() {
    
	data = defaults.states;
    cache_get(function(dd){

        if(!_.isEmpty(dd)){
            data = dd;
        } 

        cache.update(data, function(d){
            console.log(JSON.stringify(d,null,'  '));
            stream.trigger(d);
        });

        setTimeout(run_fake_iteration, run_timeout);

    }); 

}

var ctr = 0;
function run_fake_iteration() {

    function randomIntInc (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    }
    cache_get(function(dd){

        if(!_.isEmpty(dd)){
            data = dd;
        } 

        data[0].pouring = data[1].pouring = data[2].pouring = false;
        var keg = randomIntInc(0,2);
    	data[keg].millis += 470;  //millis in a pint'ish
        data[keg].pouring = true;

        if( !local_only )
            collect(data);

        cache.update(data, function(d){
            console.log(JSON.stringify(d,null,'  '));
            stream.trigger(d);
        });

        setTimeout(run_fake_iteration, run_timeout);
    })
}

function run() {
    flow = require('./flow_sensor');
    cache_get(function(dd){
        flow.init(dd)
        run_iteration(dd);
    });
}

function cache_get(callback){
  cache.store.get( "dalekState", function( err, s ){
    if( !err ){
      if( s === undefined ){
        callback(data);
      } else {
        callback(s);
      }
    }
  });
}

function run_iteration(dd) {
      flow.check(dd, function(data){

        if( !local_only )
            collect(data);

        cache.update(data, function(d){
            console.log(JSON.stringify(d,null,'  '));
            stream.trigger(d);
        });
      });
      setTimeout(run_iteration, run_timeout);        
}

function setStream(s,l){
    stream = s;
    local_only = l;
}

module.exports = {
	setCache: function(c){
		cache = c;
	},
	setStream: setStream,
	run: function() {
		if( process.env.LIVE )
			run() ;
		else
			run_fake();
	}
};
var express = require('express'),
    router = express.Router();

var cache;

router.get('/', function(req, res) {

  cache.store.get( "dalekState", function( err, value ){
    if( !err ){
      res.json(value);
    } else {
      res.send(err);
    }
  });
});

router.get('/reset', function(req, res) {
  cache.reset();
  if( process.env.LIVE ) {
    cache.store.get( "dalekState", function( err, s ){
      if( !err ){
        if( s !== undefined ){
          var flow = require('../lib/flow_sensor');
          flow.init(s)
        }
      }
    });
  }
  res.json({reset: "complete"})
});

router.setCache = function(c){
  cache = c;
}

module.exports = router;

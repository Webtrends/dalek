var NodeCache = require( "node-cache" ),
    jsonfile = require('jsonfile'),
    defaults = require('./defaults'),
    path = require('path');


var store = new NodeCache();

try {
  store.set("dalekState",jsonfile.readFileSync(path.resolve(__dirname,"dalekState.json"), {encoding: "utf8"}));
} catch ( e ) {
  store.set("dalekState",{});
}


function update(data, callback){

  jsonfile.writeFileSync(path.resolve(__dirname,"dalekState.json"), data);
  store.set( "dalekState", data, function( err, success ){
    callback(data);
  });

}

function reset(){
    update(defaults.states, function(f){});
}

module.exports = {
  update: update,
  store: store,
  reset: reset
}

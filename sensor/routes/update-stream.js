var cache,
    out = [],
    ctr=0;

function stream(req, res) {

  // req.socket.setTimeout(Infinity);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');
  out.push(res);

  req.on("close", function() {
    out.forEach( function(o,i){
      if(o == out){
        delete out[i];
      }
    });
  });
}

function trigger(data){
  if( out.length ) {
    ctr++;
    out.forEach( function(o){
      o.write("id: "+ctr+"\n\n");
      o.write("data: "+JSON.stringify(data)+"\n\n");       
    });
  }
}

function setCache(c){
  cache = c;
}

 module.exports = {
  stream: stream,
  setCache: setCache,
  trigger: trigger
 }
var http = require("https");

exports.handler = (event, context, callback) => {
    let evt = JSON.parse(event.Records[0].Sns.Message);
    console.log(evt);
    if (evt.EventType !== 'PourEnd' && evt.EventType !== 'PourStart') {
        return callback();
    }
    
    let isPourEnd = evt.EventType === 'PourEnd';
    
    let route = isPourEnd ? 'completepour' : 'beginpour';
    
    let options = {
      "method": "POST",
      "hostname": "kask.kabbage.com",
      "port": null,
      "path": "/api/admin/" + route + "/" + evt.Tap,
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "cookie": "$AUTH_COOKIE"
      }
    };
    
    let req = http.request(options, (res) => {
        let chunks = [];
        
        res.on("data", (chunk) => {
            chunks.push(chunk);
        });
        
        res.on("end", () => {
            let body = Buffer.concat(chunks);
            return callback(null, body.toString());
        });
    });
        
    let body = {Timestamp: evt.Timestamp};
    if (isPourEnd) {
        body.Volume = evt.Milliliters;
    }
        
    req.write(JSON.stringify(body));
    
    req.end();
}

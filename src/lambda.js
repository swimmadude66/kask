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
        "cookie": "ot_auth=s%3Ad1bd8fea-7ae7-45b6-81b0-a73453642f50.UVRKNaz%2FhB%2FseTzvFQdAr933OY11APQtmV2rPdOVALY"
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

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

module.exports = function(commitlog, db) {
  var config = '_local/config';
  // need to consume commit log and notify services
  db.get(config).then(function(doc) {
    return doc.seq;
  }, function(err) {
    db.put({ _id: config, seq: 'now' })
    return 'now';
  })
  .then(function(seq) {
    console.log(seq);
    commitlog.changes({
      since: seq,
      live: true,
      include_docs: true
    }).on('change', function(change) { 
      var doc = change.doc;
      if (doc.model && doc.verb) {
        var topic = [change.doc.model, change.doc.verb].join('-');
        ee.emit(topic, change.doc);      
      }
      db.get(config).then(function(d) {
        d.seq = change.seq;
        db.put(d);
      });
    });
  })
  .catch(function(err) {
    console.log(err);
  });
  
  // listen for responses and post to commit log
  ee.on('post', function(event) {
    var topic = [event.model, event.verb].join('-');
    topic = [topic, (new Date()).toISOString()].join('\x00');  
    commitlog.put(event, topic)
  });

  return ee;
}; 


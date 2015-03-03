var pouchdb = require('pouchdb');
var uri = process.env.COUCH_URL || 'http://localhost:5984';

var commitlog = pouchdb([uri, 'commit-log'].join('/'));
var db = pouchdb([uri, 'test'].join('/'))

var ee = require('../')(commitlog, db);

ee.on('ndc-rxcui-query-success', function(event) {
  console.log(event);
});

ee.emit('post', {
  verb:'query',
  model: 'ndc-rxcui',
  object: {
    criteria: '0005442972'
  }
});

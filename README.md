# cha-cha-changes

Is a simple couchdb commit log module that uses a local config document to manage the commit seq id.  It can be used to insert into service application containers of the palmetto concept, if you are using a couchdb or pouchdb as your commit-log implementation.

## Usage

``` js
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
```


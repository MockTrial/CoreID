var PouchDB = require('pouchdb');
window.PouchDB = PouchDB;
var localDB = new PouchDB('locallyHosted');
var externalDB = new PouchDB('dci-node-1.media.mit.edu:5984');

var dbHelpers = {
  localDB: localDB,
  externalDB: externalDB,
  getSiteData: function () {
    localDB.sync(externalDB, {retry: true, live: true}).on('complete', function (e) {
      console.log('sync success', e)
    }).on('error', function (err) {
      console.log('Failed to sync', err);
    });

    return this.getSiteDocs();
  },

  getSiteDocs: function () {
    return localDB.allDocs({include_docs: true})
      .then(function(response){
        return response.rows;
      })
      .then(function(rows) {
        return rows.filter(function(row) {
          return (row.doc['@type'] == 'node');
        })
      })
      .then(function(nodes) {
        return nodes.filter(function(node) {
          return (node.doc.en.type[0]['target_id'] == 'panel');
        })
      })
      .catch(function (err) {
        console.warn('Failed to getSiteDocs', err)
      });
  },

  getPanelData: function (panelID) {
    localDB.sync(externalDB).on('complete', function () {
      console.log('sync success')
    }).on('error', function (err) {
      console.log('Failed to sync', err);
    });

    return localDB.get(panelID)
      .then(function (doc) {
        return doc;
      })
      .catch(function (err) {
        console.warn('Failed to getPanelData', err)
      });
  },

  updatePanelStatus: function (panelID) {
    localDB.get(panelID)
      .then(function(panelOld){
        var operatingStatus = (panelOld.en.field_operating_status[0].value == '0') ? '1' : '0';
        panelOld.en.field_operating_status[0].value = operatingStatus;
        return localDB.put(panelOld);
      })
      .then(function(putResponse) {
        return localDB.sync(externalDB).on('complete', function (e) {
          console.log(e);
          console.log('sync success')
          return true;
        }).on('error', function (err) {
          return false;
        });
      })
      .catch(function(err) {
        console.warn('Failed to updatePanelStatus', err);
      })
  },

  docToJSON: function (doc) {
    return {
      id: doc._id,
      title: doc.en.title[0].value,
      updated: new Date(doc.en.revision_timestamp[0].value*1000),
      lat: doc.en.field_location[0].lat,
      lon: doc.en.field_location[0].lon,
      status: (doc.en.field_operating_status[0].value == 1)
    }
  }

};

module.exports = dbHelpers;

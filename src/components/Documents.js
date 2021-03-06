import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import bitcoin from 'bitcoin'
import crypto from 'crypto'
import keyto from "@trust/keyto"
import fs from 'fs'
import jsonfile from 'jsonfile'


import claims from '../../data/claims.json';

import documents from '../../data/documents.json';
import payloads from '../../data/payload.json';

import './Documents.css';


export default class Documents extends Component {

  render(){
    let payload = documents.payload;
    console.log(payload);

    payload.map((document, i) => console.log(document))
    payload.map((claim, i) => console.log(claim))
    this.renderDocuments();

        return (
            <div className="container-fluid container-fullw bg-white ng-scope">
                <div className="row">
                    <div className="col-md-12">
                        <h5 className="over-title margin-bottom-15">
                            <span className="text-bold">Documents</span>
                            <a href="#" className="ti-plus icon-yes"/>
                        </h5>
                        <p>
                            Find all documents for transactions below.
                        </p>
                        <table className="table table-hover" id="sample-table-1">
                            <thead>
                                <tr>
                                    <th className="sortable">File Name</th>
                                    <th className="hidden-xs">Date Added</th>
                                    <th className="hidden-xs">Date Signed</th>
                                    <th className="hidden-xs">Signed By</th>
                                    <th className="hidden-xs">Status</th>
                                    <th className="hidden-xs">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
  {
    payload.map((document, i) => (
        <tr key={i}>
                                    <td>
                                        <Link to={`/document/${i}`} rel="nofollow noopener noreferrer">
        {document.title}
                                        </Link>
                                    </td>
        <td className="hidden-xs">{document.dateAdded}</td>
                                    <td>{document.signedDate}</td>
                                    <td>{document.signedBy}</td>
                                    <td>N/A</td>
                                    <td className="center">
                                        <div className="visible-md visible-lg hidden-sm hidden-xs">
                                            <a href="#" className="btn btn-transparent btn-xs tooltips" tooltip-placement="top" tooltip="Info">
                                                <i className="ti-info-alt" title={document.content}></i>
                                            </a>
                                            <a href="#" className="btn btn-transparent btn-xs tooltips" tooltip-placement="top" tooltip="Share"><i className="ti-control-forward"></i></a>
                                            <a href="#" className="btn btn-transparent btn-xs tooltips" tooltip-placement="top" tooltip="Remove"><i className="ti-close"></i></a>
                                        </div>
                                    </td>
                                </tr>

        ))
      }

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        );
    }

    signDocument(document){
      // console.log(consolelog.sayHelloinEnglish())
      // console.log(consolelog.sign(document))
      var s = fs.ReadStream(payloads)
      console.log(document)
      console.log(JSON.stringify(document))
      var client = new bitcoin.Client({
        host: 'localhost',
        port: '8080/bitcoind',
        user: 'fred',
        pass: 'fred'
      })
      var address = "mjH9KTBnNyzdLifkr6xch5FkXnGdbf27mq"
      var message = JSON.stringify(document.payload)
      console.log(message)
      var signaturePayload = {}

      console.log(message)
      client.signMessage(address, message,function(err,signature){
        if(err){
          return console.error(err);
        }
        signaturePayload["address"] = address
        signaturePayload["signature"] = signature
        console.log(signature)
        console.log(address)
      })


    }

    renderDocument (document) {

        return (
            <h3> <button type="submit" className="btn btn-wide btn-o btn-primary" onClick={this.signDocument.bind(this,document)}>Sign</button> <a href={document.title}>{JSON.stringify(document)} </a></h3>

        )
    }

    renderDocuments () {
        return (
            <div className='documents-container'>
                        <h5 className="over-title margin-bottom-15">
                            <span className="text-bold">Signing Validation</span>
                            <a href="#" className="ti-plus icon-yes"/>
                        </h5>
                { payloads.entries.map((document) => this.renderDocument(document)) }
            </div>
        )
    }

}

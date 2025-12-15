var express = require('express');
var appServer = express();
const consign = require('consign');
const bodyparser = require('body-parser')
const cors = require('cors');

appServer.use(express.static('./app/public'))
appServer.use(bodyparser.urlencoded({extended:true}))
appServer.use(cors())

consign().include('app/routes')
    .then('./database/dbconnection.js')
    .then('app/models')
    .then('app/controllers')
    .into(appServer);

module.exports = appServer;
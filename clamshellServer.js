/*
== BSD2 LICENSE ==
Copyright (c) 2014, Tidepool Project

This program is free software; you can redistribute it and/or modify it under
the terms of the associated License, which is identical to the BSD 2-Clause
License as published by the Open Source Initiative at opensource.org.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the License for more details.

You should have received a copy of the License along with this program; if
not, you can obtain one from Tidepool Project at tidepool.org.
== BSD2 LICENSE ==
*/
'use strict';

var express = require('express');
var path = require('path');
var app = express();

var envConfig = require('./src/env');

var servicePort;

if (envConfig.httpPort != null) {
  servicePort = envConfig.httpPort;
} else if (envConfig.httpsPort != null) {
  servicePort = envConfig.httpsPort;
}else{
  servicePort = 3000;
}

app.use('/app_build', express.static('app_build'));
app.use('/thirdparty', express.static('thirdparty'));

app.get('/', function(req,res) {
  res.sendfile('index.html');
});

app.listen(servicePort, function() {
  console.log('clamshell server started on port', servicePort);
});
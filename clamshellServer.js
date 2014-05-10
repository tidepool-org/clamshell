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
var app = express();

var envConfig = require('./envConfig');
var log = require('./log.js')('clamshellServer.js');

var hakkenClient;
var servicePort;
var serviceDescriptor;

function setupDiscovery(){
  log.info('setting up service discovery');
  hakkenClient = require('hakken')(envConfig.discovery).client();
  hakkenClient.start();

  serviceDescriptor = { service: envConfig.serviceName };
  servicePort;

  if (envConfig.httpsPort != null) {
    servicePort = envConfig.httpPort;
    serviceDescriptor.host = envConfig.publishHost + ':' + envConfig.httpsPort;
    serviceDescriptor.protocol = 'https';
  }
  else if (envConfig.httpPort != null) {
    servicePort = envConfig.httpPort;
    serviceDescriptor.host = envConfig.publishHost + ':' + envConfig.httpPort;
    serviceDescriptor.protocol = 'http';
  }
}

function publishService(){
  log.info('Publishing service[%j]', serviceDescriptor);
  hakkenClient.publish(serviceDescriptor);
}

function setupLocal(){
  log.info('setting up local service with no service discovery');
  servicePort;
  if (envConfig.httpsPort != null) {
    servicePort = envConfig.httpPort;
  }
  else if (envConfig.httpPort != null) {
    servicePort = envConfig.httpPort;
  }
}

if(envConfig.discovery){
  setupDiscovery();
}else{
  setupLocal();
}

app.use(express.static('app_build'));

app.listen(servicePort, function() {
  log.info('clamshell server started on port', servicePort);
  if(envConfig.discovery){
    publishService();
  }
});

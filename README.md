# Clamshell

[Blip](https://github.com/tidepool-org/blip)'s companion mobile web app, used for messaging.

## Install

Requirements:

- [Node.js](http://nodejs.org/)
- [Reactjs](http://facebook.github.io/react/)

Clone this repo then install dependencies:

```bash
$ npm install
```

## Quick start

Start the development server (in "mock mode") with:

```bash
$ source config/mock.sh
$ npm start
```

Open your web browser and navigate to `http://localhost:3001/`.


## Build and deployment

The app is built as a static site in the `dist/` directory.

We use [Shio](https://github.com/tidepool-org/shio) to deploy, so we separate the build in two.

Shio's `build.sh` script will take care of building the app itself with:

```bash
$ npm run build-app
```

Shio's `start.sh` script then builds the config from environment variables as a separate file with:

```bash
$ source config/env.sh
$ npm run build-config
```

After that, the app is ready to be served using the static web included in this repo:

```bash
$ npm run server
```

You can also build everything at once locally by simply running:

```bash
$ source config/mock.sh
$ npm run build
$ npm run server
```

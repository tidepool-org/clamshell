# ClamShell

todo: add details

Tech stack:

- [React](http://facebook.github.io/react)
- [Bootstrap](http://getbootstrap.com/)

Table of contents:

- [Install](#install)
- [Quick start](#quick-start)
- [Development](#development)
    - [Code organization](#code-organization)
    - [React components](#react-components)
    - [Vendor packages](#vendor-packages)
- [Testing](#testing)

## Install

Requirements:

- [Node.js](http://nodejs.org/)

Clone this repo then install dependencies:

```bash
$ npm install .
```

## Quick start

Once you have completed the install then build the app 

```bash
$ npm start
```

Open the index.html in your web browser and start using ClamShell


## Development

The following snippets of documentation should help you find your way around and contribute to the app's code.

### Code organization

- **App** (`src/app.js`): Expose a global `app` object where everything else is attached; create the main React component `app.component`
- **App** (`src/main.js`): Starts the app and used for the webpack build to pull in the various components.
- **Components** (`src/components`): Reusable React components, the building-blocks of the application.
- **Layout** (`src/layout`): React container that holds the components that make up the different parts of the screen.
- **Core** (`app/core/`): Core data and service opjects 

### React components

When writing [React](http://facebook.github.io/react) components, try to follow the following guidelines:

- Keep components small. If a component gets too big, it might be worth splitting it out into smaller pieces.
- Keep state to a minimum. A component without anything in `state` and only `props` would be best. When state is needed, make sure nothing is reduntant and can be derived from other state values. Move state upstream (to parent components) as much as it makes sense.
- Use the `propTypes` attribute to document what props the component expects

See ["Writing good React components"](http://blog.whn.se/post/69621609605/writing-good-react-components).

### Vendor packages

Third-party dependencies are managed npm and are installed when you do the install.

## Testing

Requirements:

- [Mocha](http://visionmedia.github.io/mocha/) 
- [Chai](http://chaijs.com/)
- [Browserify](http://browserify.org/)
- [Testem](https://github.com/airportyh/testem) as the test runner.

### Setup

To run the tests, first install Testem:

```bash
$ npm install -g testem
```

### Running

Then run:

```
$ grunt test
```

This will open and run the tests in Chrome by default. You can also open other browsers and point them to the specified URL.
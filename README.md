# Clamshell

[Blip](https://github.com/tidepool-org/blip)'s companion mobile web app, used for messaging.

Tech stack:

- [React](http://facebook.github.io/react)

Table of contents:

- [Install](#install)
- [Quick start](#quick-start)
- [Development](#development)
    - [Code organization](#code-organization)
    - [React components](#react-components)
    - [Styling](#styling)
    - [Vendor packages](#vendor-packages)
    - [JSHint](#jshint)
- [Testing](#testing)
- [Build and deployment](#build-and-deployment)

## Install

Requirements:

- [Node.js](http://nodejs.org/)

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

## Development

The following snippets of documentation should help you find your way around and contribute to the app's code.

### Code organization

- **App** (`src/app.js`): Expose a global `app` object where everything else is attached; create the main React component `app.component`
- **App** (`src/main.js`): Starts the app and used for the webpack build to pull in the various components.
- **Components** (`src/components/`): Reusable React components, the building-blocks of the application.
- **Layout** (`src/layout/`): React container that holds the components that make up the different parts of the screen.
- **Core** (`app/core/`): Core data and service opjects

### React components

When writing [React](http://facebook.github.io/react) components, try to follow the following guidelines:

- Keep components small. If a component gets too big, it might be worth splitting it out into smaller pieces.
- Keep state to a minimum. A component without anything in `state` and only `props` would be best. When state is needed, make sure nothing is reduntant and can be derived from other state values. Move state upstream (to parent components) as much as it makes sense.
- Use the `propTypes` attribute to document what props the component expects

See ["Writing good React components"](http://blog.whn.se/post/69621609605/writing-good-react-components).

### Styling

We use [Less](http://lesscss.org/) as the CSS pre-processor.

Prefix all CSS classes with the component name. For example, if I'm working on the `NoteThread` component, I'll prefix CSS classes with `notethread-`.

Keep styles in the same folder as the component, and import them in the component's `.js` file with `require('./NoteThread.less')` (the `webpack` builder will take care of processing them).

Styles shared throughout the app can be found in `src/core/less/`, and should be used by extending a component's CSS class with them. For example:

```less
.login-form-button {
  &:extend(.btn all);
  &:extend(.btn-primary all);
  // Custom `login-form-button` styles here...
}
```

### Vendor packages

Third-party dependencies are managed via `npm`.

## JSHint

In a separate terminal, you can lint JS files with:

```bash
$ npm run jshint
```

You can also watch files and re-run JSHint on changes with:

```bash
$ npm run jshint-watch
```

## Testing

We use the following testing tools:

- [Mocha](http://visionmedia.github.io/mocha/)
- [Chai](http://chaijs.com/)
- [Sinon](http://sinonjs.org/)

To run the unit tests, use:

```bash
$ npm test
```

Then open `http://localhost:8080/webpack-dev-server/test` in your browser.

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

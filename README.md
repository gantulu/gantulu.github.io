# gantulu.github.io

A static website built with React and Babel Standalone. Files are served directly by GitHub Pages; there is no build step.

## Architecture

- `index.html` — static HTML entry point and CDN dependencies
- `App.jsx` — single React application and hash-based page selection
- `components/` — shared UI components
- `pages/` — page-level components
- `styles/` — global and application CSS
- `assets/` — static images and icons

## Runtime

React and ReactDOM are loaded from UNPKG. Babel Standalone compiles JSX in the browser. JSX scripts are loaded in dependency order and expose components through the `window` namespace.

Navigation uses hash routes (`#/` and `#/about`) so navigation works on static hosting without server-side rewrite rules.

## Preview

Serve this directory with any static HTTP server. Some browsers restrict external scripts from a local `file://` URL, so an HTTP server is recommended.

## Constraints

- No Node.js, npm, Vite, Webpack, or build pipeline
- CDN availability is required for React, ReactDOM, and Babel
- JSX compilation happens in the browser; this is intended for a small static site
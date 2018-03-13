# Contributing

### Code of conduct

Be nice.

### Running in development

```sh
bin/bundle-analyzer.js ../some-project/dist-dir
```

### Project structure

This project uses [yarn](https://yarnpkg.com/en/) for lock file enforcement.

The `analyzer` interface can be found in `server.js`. This file sets up the express server and routes and exports the programmatic interface for this package. The express server pushes size data via server-side events upon client connection or if `update` is called on the server.

The code to calculate sizes from source maps is in `sizes.js`. The `getSizesByFile` function asynchronously returns a map of form `{'some/path': size}`. The `groupByHierarchy` function converts that map to a tree of form `{some: {path: size}}`. The `normalize` function converts that tree into a normalized tree of form `{name, children, size}`. The exported function asynchronously returns an array of normalized trees.

The CLI code can be found in `bin/bundle-analyzer.js`. If you run into permission issues, run `chmod +x bin/bundle-analyzer`. The CLI watches the filesystem via `fs.watch`.

The client-side code is in `client.html`. It sets up an server-side-event listener, code to handle URL state via `history.pushState`, a D3 zoomable sunburst visualization, and some DOM glue code.

### Credits

The code to calculate sizes is adapted from [https://github.com/danvk/source-map-explorer](https://github.com/danvk/source-map-explorer)

The code for the zoomable sunburst is adapted from [https://bl.ocks.org/vasturiano/12da9071095fbd4df434e60d52d2d58d](https://bl.ocks.org/vasturiano/12da9071095fbd4df434e60d52d2d58d)

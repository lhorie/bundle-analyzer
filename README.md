# Bundle analyzer

Displays a visualization of code sizes by file based on source map information.

![Bundle analyzer in action](https://raw.githubusercontent.com/wiki/lhorie/bundle-analyzer/images/bundle-analyzer.gif)

File sizes displayed by this tool reflect size of transpiled minified bundled code, as calculated from source maps. Note that this tool does not take compression (i.e. gzip/brotli) into account. Compression profiles vary depending on the compression algorithm and aggressiveness setting, thus cannot be easily calculated with accuracy. For the purposes of optimization work, making an assumption that compression is applied evenly across the bundle is usually good enough.

---

### Installation

```sh
# NPM
npm install bundle-analyzer -g

# Yarn
yarn add bundle-analyzer --global
```

---

### Usage

#### CLI

```sh
bundle-analyzer dist-directory
```

* `dist-directory` - Required. A directory path that contains minified Javascript files and their source maps. It's expected that source map files have the same name as their respective js files, plus a `.map` extension.

---

### API

```js
import analyzer from 'bundle-analyzer';
```

#### analyzer.start

* `const server = analyzer.start({dir: string, port: number})`

  * `dir: string` - Required. A directory path that contains minified Javascript files and their source maps. It's expected that source map files have the same name as their respective js files, plus a `.map` extension.
  * `port: number` - Optional. Defaults to `9000`. The port at which the analyzer server runs
  * returns `server: {update : () => void, close: () => void}`
    * `server.update()` - Hot-reloads the visualization
    * `server.close()` - Shuts down the analyzer server

#### analyzer.getSizes

* `const sizes = await analyzer.getSizes(dir)`

  * `dir: string` - Required. A directory path that contains minified Javascript files and their source maps. It's expected that source map files have the same name as their respective js files, plus a `.map` extension.
  * returns `sizes: Node {name: string, children: ?[Node], size: ?number}`
    * `name: string` - a directory or file name
    * `children: [Node]` - a list of subdirectories or files
    * `size: number` - a size calculation based on source maps. It represents the sum of sizes of all the code originating from a single file, after transpilation, minification and bundling.

---

### Ways to decrease file size

#### Bundle splitting

Typically, the simplest way to reduce the amount of code being downloaded on page load is to [employ code splitting](https://webpack.js.org/guides/code-splitting/)

#### Reduce dependencies

For example, prefer native Array methods over utility libraries such as Lodash and Ramda, and prefer tree-shaking friendly libraries over monolythic ones (e.g. date-fns vs moment.js)

#### Alias libraries

For example, React can often be replaced by similar libraries such as Nerv.js or Preact.

#### Remove polyfills

Ensure you're not [polyfilling/mocking node globals](https://webpack.js.org/configuration/node/)

---

### Differences from webpack-bundle-analyzer

Bundle analyzer CLI hot-reloads, and its programmatic API is designed to integrate with server push events.

Bundle analyzer uses a D3-based zoomable sunburst visualization, which provides a more accurate visual representation of size breakdowns. In addition, bundle analyzer aggregates the analysis of all bundles into a single interface, and it hot-reloads them when it detects changes in disk.

Bundle analyzer looks at source maps rather than webpack's `stats.json` file, so it should work with other non-Webpack tools such as Rollup or Parcel.

Bundle analyzer does not report compression estimates, since different compression algorithms and different settings give different results and the results of gzipping each section individually doesn't provide an accurate number anyways.

### Differences from source-map-explorer

Both bundle analyzer and source map explorer display roughly the same information, but slightly differently. Bundle analyzer uses a D3-based zoomable sunburst visualization, which provides a more accurate visual representation of size breakdowns. In addition, bundle analyzer aggregates the analysis of all bundles into a single interface, and it hot-reloads them when it detects changes in disk.

---

License: MIT

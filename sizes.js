const util = require('util');
const fs = require('fs');
const path = require('path');
const {SourceMapConsumer} = require('source-map');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

module.exports = async function(dir) {
  const paths = await readDir(dir).catch(() => []);
  return (await Promise.all([
    ...paths.map(async p => {
      if (p.match(/\.js$/)) {
        return {
          name: p,
          children: normalize(
            groupByHierarchy(await getSizesByFile(dir, p).catch(() => []))
          ),
        };
      }
    }),
  ])).filter(Boolean);
};

async function getSizesByFile(dir, p) {
  const js = path.resolve(dir, p);
  const map = path.resolve(dir, p + '.map');
  const jsData = await readFile(js, 'utf-8');
  const sourceMapData = await readFile(map, 'utf-8');
  mapConsumer = await new SourceMapConsumer(sourceMapData);

  const lines = jsData.split('\n');
  const sourceExtrema = {};
  let numChars = 0;
  let lastSource = null;
  for (let line = 1; line <= lines.length; line++) {
    const lineText = lines[line - 1];
    const numCols = lineText.length;
    for (let column = 0; column < numCols; column++, numChars++) {
      const pos = mapConsumer.originalPositionFor({
        line: line,
        column: column,
      });
      const source = pos.source;
      if (source == null) {
        continue;
      }

      if (source != lastSource) {
        if (!(source in sourceExtrema)) {
          sourceExtrema[source] = {min: numChars};
          lastSource = source;
        }
      } else {
        sourceExtrema[source].max = numChars;
      }
    }
  }
  return Object.keys(sourceExtrema).reduce((memo, key) => {
    const v = sourceExtrema[key];
    memo[key] = v.max - v.min + 1;
    return memo;
  }, {});
}
function groupByHierarchy(map) {
  let groups = {};
  for (key in map) {
    const levels = key.split('/').slice(1);
    let level = groups;
    levels.forEach((l, i) => {
      if (!level[l]) level[l] = {};
      if (i === levels.length - 1) level[l] = map[key];
      level = level[l];
    });
  }
  while (true) {
    const keys = Object.keys(groups);
    if (keys.length === 1 && typeof groups[keys[0]] !== 'number') {
      groups = groups[keys[0]];
    } else break;
  }
  return groups;
}
function normalize(object) {
  const list = [];
  for (const key in object) {
    if (typeof object[key] === 'number') {
      list.push({name: key, size: object[key]});
    } else {
      list.push({name: key, children: normalize(object[key])});
    }
  }
  return list;
}

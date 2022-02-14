/*jshint esversion: 6 */
const convert = require("xml-js");
const _ = require("lodash");
/**
 * @author AKASH J P ,Gokulnath
 * @param {String} xml (Mandatory)
 * @param {JSON} options (Optional)
 * @param options.crossReference {Regex} example x_(.*)
 */
const xmlPathResolver = (xml, { crossRefKey = "id" , ...rest } = {}) => {
  try {
    if (!xml) {
      throw new Error("First argument should have xml");
    }
    let jsonFormOfXml = convert.xml2json(xml, { compact: true, spaces: 4 });
    let refpaths = extractArrayPaths(JSON.parse(jsonFormOfXml)).arrayPaths;
    let modifiedJson = resolveCrossRefs(jsonFormOfXml, { crossRefKey, ...rest }, refpaths);
    return modifiedJson;
  } catch (Err) {
    console.log(`error in xmlpathresolver`, Err);
    throw Err;
  }
};
function extractArrayPaths(obj, prefix, current, arrayPaths) {
  try {
    prefix = prefix || [];
    current = current || {};
    arrayPaths = arrayPaths || {};

    if (typeof (obj) === 'object' && obj !== null && !_.isArray(obj)) {
      Object.keys(obj).forEach(key => {
        extractArrayPaths(obj[key], prefix.concat(key), current, arrayPaths);
      });
    }
    else if (_.isArray(obj)) {
      let lastPrefix = prefix[prefix.length - 1];
      if (arrayPaths[lastPrefix] && _.isArray(arrayPaths[lastPrefix])) {
        arrayPaths[lastPrefix] = [...arrayPaths[lastPrefix], ...obj];
      } else {
        arrayPaths[lastPrefix] = obj;
      }
    }
    else {
      current[prefix.join('.')] = obj;
    }
    if (_.isObject(obj) && !_.isArray(obj)) {
      let lastPrefix = prefix[prefix.length - 1];
      if (arrayPaths[lastPrefix]) {
        arrayPaths[lastPrefix].push(obj);
      }
      else {
        arrayPaths[lastPrefix] = [obj];
      }
    }

    return { current, arrayPaths };
  } catch (err) {
    throw err;
  }
}

function resolveCrossRefs(jsonFormOfXml, options, refpaths, level = 0) {
  try {
    return JSON.parse(jsonFormOfXml, (key, value) => {
      if (options.crossReference && options.crossReference instanceof RegExp) {
        if (options.crossReference.test(key)) {
          let matches = options.crossReference.exec(key);
          if (_.isArray(matches) && matches.length >= 1) {
            let path = matches[1];
            try {
              if (refpaths[path]) {
                let extractedRefsValue = refpaths[path].filter((path) => {
                  return path._attributes[options.crossRefKey] === value;
                });
                extractedRefsValue = _.get(extractedRefsValue, "0", value);
                if (level > 150) {
                  throw new Error("Nesting level threshold reached");
                }
                let resolvedRefs = resolveCrossRefs(JSON.stringify(extractedRefsValue), options, refpaths, level + 1);
                return resolvedRefs;
              }
            } catch (err) {
              throw err;
            }
          }
          return value;
        }
        return value;
      }
      return value;
    });
  } catch (err) {
    throw err;
  }
}
module.exports = xmlPathResolver;

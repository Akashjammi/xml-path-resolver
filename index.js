const convert = require("xml-js");
const _ = require("lodash");
/**
 *
 * @param {String} xml
 * @param {JSON} options
 * @param options.crossReference {Regex} example x_(.*)
 */
const xmlPathResolver = (xml, options = {}) => {
  try {
    let jsonFormOfXml = convert.xml2json(xml, { compact: true, spaces: 4 });
    let refpaths = extractArrayPaths(JSON.parse(jsonFormOfXml)).arrayPaths;
    console.log(`refpaths`, refpaths);
    let modifiedJson = resolveCrossRefs(jsonFormOfXml, options, refpaths);
    console.log(JSON.stringify(modifiedJson));
    return modifiedJson;
  } catch (Err) {
    console.log(`error in xmlpathresolver`, Err);
    return Err;
  }
};
function extractArrayPaths(obj, prefix, current, arrayPaths) {
  prefix = prefix || []
  current = current || {}
  arrayPaths = arrayPaths || {}

  if (typeof (obj) === 'object' && obj !== null && !_.isArray(obj)) {
    Object.keys(obj).forEach(key => {
      extractArrayPaths(obj[key], prefix.concat(key), current, arrayPaths).current
    })
  }
  else if (_.isArray(obj)) {
    let lastPrefix = prefix[prefix.length-1];
    if (arrayPaths[lastPrefix] && _.isArray(arrayPaths[lastPrefix])) {
      arrayPaths[lastPrefix] = [...arrayPaths[lastPrefix], ...obj];
    } else {
      arrayPaths[lastPrefix] = obj;
    }
  }
  else {
    current[prefix.join('.')] = obj
  }
  if(_.isObject(obj) && !_.isArray(obj)){
    let lastPrefix = prefix[prefix.length-1];
    if (arrayPaths[lastPrefix]) {
      arrayPaths[lastPrefix].push(obj); 
    } 
    else {
      arrayPaths[lastPrefix] = [obj];
    }
  }

  return { current, arrayPaths }
}

function resolveCrossRefs(jsonFormOfXml, options, refpaths) {
  return JSON.parse(jsonFormOfXml, (key, value) => {
    if (options.crossReference && options.crossReference instanceof RegExp) {
      if (options.crossReference.test(key)) {
        let matches = options.crossReference.exec(key);
        if (_.isArray(matches) && matches.length >= 1) {
          let path = matches[1];
          try {
            if (refpaths[path]) {
              let extractedRefsValue = refpaths[path].filter((path) => {
                return path._attributes.id === value
              })[0];
              console.log(`extractedRefsValue`, extractedRefsValue);
              let resolvedRefs = resolveCrossRefs(JSON.stringify(extractedRefsValue), options, refpaths);
              return resolvedRefs;
            };
          } catch (err) {
            return value;
          }
        }
        return value;
      }
      return value;
    }
    return value;
  });
}

let xml =  `<?xml version="1.0" encoding="utf-8"?>  
<note id="1212"  importance="high" logged="true" x_note="23">
    <title>Happy</title>
     <todo>Work</todo>
     <todo>Play</todo>
</note>
<note id="23" importance="high" logged="true">
</note>
<note importance="high" logged="true">
</note>
<person x_note="1212">
</person> `;
xmlPathResolver(xml ,{crossReference : /x_(.*)/} )
module.exports = xmlPathResolver;

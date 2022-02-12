# xml-path-resolver
This npm module is used to convert xml to json after resolving the cross reference.

The cross reference keys in xml can be identified by the regex .

### USAGE
```
npm i xml-path-resolver
```
### CODE USAGE
```
const xmlPathResolver = require("xml-path-resolver");
const xmlString = `
<?xml version="1.0" encoding="utf-8"?>  
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
</person>
`;
const resolvedJSON = xmlPathResolver(xmlString,{ crossReference: /x_(.*)/ });

```

Example :
```
<?xml version="1.0" encoding="utf-8"?>  
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
</person>
```

The above xml has cross reference paths, The resolved JSON output is 
```
{
  "_declaration": {
    "_attributes": {
      "version": "1.0",
      "encoding": "utf-8"
    }
  },
  "note": [
    {
      "_attributes": {
        "id": "1212",
        "importance": "high",
        "logged": "true",
        "x_note": {
          "_attributes": {
            "id": "23",
            "importance": "high",
            "logged": "true"
          }
        }
      },
      "title": {
        "_text": "Happy"
      },
      "todo": [
        {
          "_text": "Work"
        },
        {
          "_text": "Play"
        }
      ]
    },
    {
      "_attributes": {
        "id": "23",
        "importance": "high",
        "logged": "true"
      }
    },
    {
      "_attributes": {
        "importance": "high",
        "logged": "true"
      }
    }
  ],
  "person": {
    "_attributes": {
      "x_note": {
        "_attributes": {
          "id": "1212",
          "importance": "high",
          "logged": "true",
          "x_note": {
            "_attributes": {
              "id": "23",
              "importance": "high",
              "logged": "true"
            }
          }
        },
        "title": {
          "_text": "Happy"
        },
        "todo": [
          {
            "_text": "Work"
          },
          {
            "_text": "Play"
          }
        ]
      }
    }
  }
}
```

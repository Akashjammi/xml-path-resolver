/*jshint esversion: 6 */
const xmlPathResolver = require('./index');

test('convert xml with nested cross reference', () => {
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
        </person>`;
    const resolvedJSON = xmlPathResolver(xmlString, { crossReference: /x_(.*)/ });
    let expectedResponse = {
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
    expect(resolvedJSON).toMatchObject(expectedResponse);
});

test('convert xml with single cross reference', () => {
    const xmlString = `
        <?xml version="1.0" encoding="utf-8"?>  
        <note id="1212"  importance="high" logged="true">
        <title>Happy</title>
         <todo>Work</todo>
         <todo>Play</todo>
        </note>
        <note id="23" importance="high" logged="true">
        </note>
        <note importance="high" logged="true">
        </note>
        <person x_note="1212">
        </person>`;
    const resolvedJSON = xmlPathResolver(xmlString, { crossReference: /x_(.*)/ });
    let expectedResponse = {
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
                    "logged": "true"
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
                        "logged": "true"
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
    expect(resolvedJSON).toMatchObject(expectedResponse);
});

test('convert xml without cross reference but with crossRefenece option', () => {
    const xmlString = `
        <?xml version="1.0" encoding="utf-8"?>  
        <note id="1212"  importance="high" logged="true">
        <title>Happy</title>
         <todo>Work</todo>
         <todo>Play</todo>
        </note>
        <note id="23" importance="high" logged="true">
        </note>
        <note importance="high" logged="true">
        </note>
        <person id="1">
        </person>`;
    const resolvedJSON = xmlPathResolver(xmlString, { crossReference: /x_(.*)/ });
    let expectedResponse = {
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
            }
        }
    }
    expect(resolvedJSON).toMatchObject(expectedResponse);
});

test('convert xml without cross reference but without crossRefenece option', () => {
    const xmlString = `
        <?xml version="1.0" encoding="utf-8"?>  
        <note id="1212"  importance="high" logged="true">
        <title>Happy</title>
         <todo>Work</todo>
         <todo>Play</todo>
        </note>
        <note id="23" importance="high" logged="true">
        </note>
        <note importance="high" logged="true">
        </note>
        <person id="1">
        </person>`;
    const resolvedJSON = xmlPathResolver(xmlString);
    let expectedResponse = {
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
            }
        }
    }
    expect(resolvedJSON).toMatchObject(expectedResponse);
});

test('Throw error for invalid xml', () => {
    const xmlString = `
        xml version="1.0" encoding="utf-8"?>  
        <note id="1212"  importance="high" logged="true">
        <title>Happy</title>
         <todo>Work</todo>
         <todo>Play</todo>
        </note>
        <note id="23" importance="high" logged="true">
        </note>
        <note importance="high" logged="true">
        </note>
        <person id="1">
        </person>
        
        `;

    expect(() => xmlPathResolver(xmlString, { crossReference: /x_(.*)/ })).toThrow();
});

test('Throw error for no xml', () => {
    expect(() => xmlPathResolver()).toThrow();
});


test('Throw error for infinite reference ', () => {
    const xmlString = `
        <?xml version="1.0" encoding="utf-8"?>  
        <note id="1212"  importance="high" logged="true" x_note="23">
        <title>Happy</title>
         <todo>Work</todo>
         <todo>Play</todo>
        </note>
        <note id="23" importance="high" logged="true" x_note="1212">
        </note>
        <note importance="high" logged="true">
        </note>`
        ;
    expect(() => {
        try {
            let json = xmlPathResolver(xmlString, { crossReference: /x_(.*)/ });
        } catch (err) {
            throw err;
        }
    }).toThrow();
});

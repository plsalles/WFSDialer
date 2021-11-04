const EWS = require('node-ews');

class EWSController {
 
    findItem = async (agent, startDate, endDate) => {
        
    
        console.log("findItem ------------->",agent);

        // exchange server connection info
        const ewsConfig = {
            //When communicating directly with outlook O365
            //username: agent.serviceAccountEmailAddress,
            //password: agent.serviceAccountPassword,
            // username: 'local\paulo.salles1',
            // password: 'Asd123!.',
            username: "paulo.salles@t3nsd.onmicrosoft.com",
            password: 'Polycom123',
            host: `https://outlook.office365.com`,
            auth: 'basic',
            temp: '/mnt/d/Repo/WFSDialer'
        };
        
        // define custom soap header
        let ewsSoapHeader = {
            't:RequestServerVersion': {
                'attributes': {
                'Version': "Exchange2007_SP1"
                }
            },
          };
        
        
        // initialize node-ews
        const ews = new EWS(ewsConfig);
        
        // define ews api function
        const ewsFunction = 'FindItem';
        
        // define ews api function args
        const ewsArgs = {
            'attributes': {
                'Traversal': 'Shallow'
            },
            'tns:ItemShape': {
                't:BaseShape': 'AllProperties',
                't:AditionalProperties': {
                    't:FieldURI': {
                        'attributes': {
                            'FieldURI' : 'item:Subject'
                        }   
                    },
                    't:ExtendedFieldURI': {
                        'attributes': {
                            'PropertyType': 'Binary',
                            'PropertyId': '3',
                            'DistinguishedPropertySetId': 'Meeting'
                        }
                    },
                    't:ExtendedFieldURI': {
                        'attributes': {
                            'PropertyType': 'String',
                            'PropertyName': 'OnlineMeetingExternalLink',
                            'DistinguishedPropertySetId': 'PublicStrings'
                            }
                    },
                    't:ExtendedFieldURI': {
                        'attributes': {
                            'PropertyType': 'String',
                            'PropertyName': 'OnlineMeetingConfLink',
                            'DistinguishedPropertySetId': 'PublicStrings'
                            }
                    },
                    't:ExtendedFieldURI': {
                        'attributes': {
                            'PropertyType': 'String',
                            'PropertyName': 'UCMeetingSettings',
                            'DistinguishedPropertySetId': 'PublicStrings'
                            }
                    },
                    't:FieldURI': {
                        'attributes': {
                            'FieldURI' : 'calendar:Start'
                        }   
                    },
                    't:FieldURI': {
                        'attributes': {
                            'FieldURI' : 'item:Body'
                        }   
                    },
                    't:FieldURI': {
                        'attributes': {
                            'FieldURI' : 'calendar:CalendarItemType'
                        }   
                    },
                    't:FieldURI': {
                        'attributes': {
                            'FieldURI' : 'calendar:RecurrenceId'
                        }   
                    },
                }
            },
            'tns:CalendarView': {
                'attributes': {
                    'StartDate': startDate,
                    'EndDate': endDate,
                    'MaxEntriesReturned': '1024'
                }
            },
            'tns:ParentFolderIds' : {
                't:DistinguishedFolderId': {
                    'attributes': {
                        'Id': 'calendar',          
                    },
                    't:Mailbox': {
                        'EmailAddress': agent.roomEmailAddress,
                    }
                }
            }
        };
     
   
        ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
                .then(result => {
                
                //console.log(result)
                
                //console.log(JSON.stringify(result));
                agent.calendarItems = result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.CalendarItem;
                //console.log(JSON.stringify(result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.CalendarItem));

                //res.status(200).json(result);
                return result;
                })
                .catch(err => {
                console.log(err.statusCode);
                console.log(err);
                //res.status(500).json("The request failed");
                });
        };
}

module.exports = new EWSController();
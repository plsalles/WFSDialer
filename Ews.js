const EWS = require('node-ews');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class EWSController {
 
    findItem = async (agent, startDate, endDate) => {
        console.log("FindItem Start Date:",startDate)
        console.log("FindItem End Date:",endDate)
        // exchange server connection info
        const ewsConfig = {
            //When communicating with WFS
            username: `${agent.roomDomain}\\${agent.roomUser}`,
            password: agent.roomPassword,
            // username: 'local\room201',
            // password: 'Asd123!.',
            host: `https://10.10.30.71`,
            
            //Talking directly to O365 - Necessary to change the FQDN in the services.wsdl file
            // username: "paulo.salles@t3nsd.onmicrosoft.com",
            // password: 'Polycom123',
            // host: `https://outlook.office365.com`,
            //auth: 'basic',
            temp: '/mnt/d/Repo/WFSDialer'
        };

        const options = {
            rejectUnauthorized: false,
            strictSSL: false
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
        const ews = new EWS(ewsConfig, options);
        
        // define ews api function
        const ewsFunction = 'FindItem';
        
        // define ews api function args
        const ewsArgs = {
            'attributes': {
                'Traversal': 'Shallow'
            },
            'm:ItemShape': {
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
            'm:CalendarView': {
                'attributes': {
                    'StartDate': startDate,
                    'EndDate': endDate,
                    'MaxEntriesReturned': '1024'
                }
            },
            'm:ParentFolderIds' : {
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
     
   
        await ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
                .then(result => {
                
                let calendarItems = result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.CalendarItem;
                console.log("CalendarItem Length ----->",calendarItems.length)
                
                if(!calendarItems.length){
                    agent.calendarItems.push(calendarItems);
                } else {
                    result.ResponseMessages.FindItemResponseMessage.RootFolder.Items.CalendarItem.forEach( calendarItem => {
                        agent.calendarItems.push(calendarItem);
                    })
                }

                return result;

                })
                .catch(err => {
                console.log(err)
                if (err.statusCode){
                    console.log(err.statusCode);
                    console.log(err);
                
                }    

                });
        };

        getItem = async (agent,calendarItem) => {
    
            console.log(calendarItem.ItemId.attributes.Id)
            // exchange server connection info
            const ewsConfig = {
             //When communicating directly with outlook O365
             username: `${agent.roomDomain}\\${agent.roomUser}`,
             password: agent.roomPassword,
            //  username: "paulo.salles@t3nsd.onmicrosoft.com",
            //  password: 'Polycom123',
             host: `https://10.10.30.71`,
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
            const ewsFunction = 'GetItem';
             
            // define ews api function args
            const ewsArgs = {
                'attributes': {
                    'Traversal': 'Shallow'
                },
                'm:ItemShape': {
                    't:BaseShape': 'AllProperties',
                    't:BodyType': 'Text',
                    't:AditionalProperties': {
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
                    }
                },
                'm:ItemIds': {
                    't:ItemId': {
                        'attributes': {
                            'Id': calendarItem.ItemId.attributes.Id,
                        }
                    }
                },
            };
            
            await ews.run(ewsFunction, ewsArgs, ewsSoapHeader)
                    .then(result => {
                    console.log(JSON.stringify(result));
                    agent.detailedItems.push(result.ResponseMessages)
                    return result;
                    })
                    .catch(err => {
                        console.log(err.status)     
                        console.log(err);
                    
                    });
        };
}

module.exports = new EWSController();
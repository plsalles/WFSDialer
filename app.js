'use strict'

const { promises: { readFile } } = require("fs");
const Agent = require('./Agent');
const convertToObj = require('./utils/convertToObj');
const ews = require('./Ews');

const pollingInterval = 300;
const pollingCycles = 288; //24 hours
let startDate = "2020-01-25T00:00:00Z";
let endDate = "2020-11-26T23:59:00Z";



readFile("/mnt/d/Repo/WFSDialer/AgentList.csv").then(fileBuffer => {
    console.log("Reading CSV file")


    let input = convertToObj(fileBuffer.toString().split('\r\n'));
    let agents = [];

    input.forEach(e => {
        agents.push(new Agent(e.agentName, e.agentType, e.roomEmailAddress, e.roomDomain, e.roomUser, e.roomPassword, e.serviceAccount));    
    });
    

    //let currentPollCycle = 0;


    
    ews.findItem(agents[0],startDate,endDate).then(res => {
        
    })

    setTimeout( () => {
        console.log(agents[0].calendarItems)
        console.log(agents[0].calendarItems.length)
    },10000)


 

    


})


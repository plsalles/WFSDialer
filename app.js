'use strict'

const { promises: { readFile } } = require("fs");
const Agent = require('./Agent');
const convertToObj = require('./utils/convertToObj');
const dateQueryFormat = require('./utils/dateQueryFormat');
const ews = require('./Ews');

const pollingInterval = 300;
const pollingCycles = 288; //24 hours
// let startDate = "2021-11-08T12:00:00Z";
// let endDate = "2021-11-10T23:59:00Z";

let dateNow = new Date();
let startDate = dateQueryFormat(dateNow).dayPoll.startDate;
let endDateTwoDaysLater = dateQueryFormat(dateNow).dayPoll.endDate;
let endDateWeekLater = dateQueryFormat(dateNow).weekPoll.endDate;

console.log(startDate)
console.log(endDateTwoDaysLater)
console.log(endDateWeekLater)

readFile("/mnt/d/Repo/WFSDialer/AgentList.csv").then(fileBuffer => {
    console.log("Reading CSV file")

    let input = convertToObj(fileBuffer.toString().split('\r\n'));
    let agents = [];

    input.forEach(e => {
        agents.push(new Agent(e.agentName, e.agentType, e.roomEmailAddress, e.roomDomain, e.roomUser, e.roomPassword, e.serviceAccount));    
    });

    //let currentPollCycle = 0;
    console.log(`${new Date()} - Starting new Polling Event`)    
    console.log(agents)
    agents.forEach( async (agent,index) =>{
       getCalendarItems(agent,startDate,endDateTwoDaysLater).then(() =>{
            console.log(`${new Date()} - First Polling for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress} has finished`)
            agent.calendarItems = [];
            agent.detailedItems = [];
            getCalendarItems(agent,startDate,endDateWeekLater).then(() => {
                console.log(`${new Date()} - Second Polling for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress} has finished`)
                agent.calendarItems = [];
                agent.detailedItems = [];
            })
       })
       
    })

    setInterval(() => {
        console.log(`${new Date()} - Starting new Polling Event`)
        agents.forEach((agent,index) =>{
             getCalendarItems(agent,startDate,endDateTwoDaysLater).then(() => {
                console.log(`${new Date()} - First Polling for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress} has finished`)
                agent.calendarItems = [];
                agent.detailedItems = [];
                getCalendarItems(agent,startDate,endDateWeekLater).then(() => {
                    console.log(`${new Date()} - Second Polling for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress} has finished`)
                    agent.calendarItems = [];
                    agent.detailedItems = [];
                })
            })
        })
    },60000)
})

async function getCalendarItems(agent,startDate,endDate) {
    console.log(`${new Date()} - Polling for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress}`)
    await ews.findItem(agent,startDate,endDate)
    console.log(`${new Date()} - Find Item for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress} - Room Challengue user/passw ${agent.roomDomain}\\${agent.roomUser} returned ${agent.calendarItems.length} calendar items`)
    
    if(agent.calendarItems.length > 0){
        await agent.calendarItems.forEach(async (calendarItem, index) => {
            await ews.getItem(agent,calendarItem)
            //console.log(`${new Date()} - getItem for iten number ${index + 1} for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress} has finished`)
              })
    }
   
    console.log(`${new Date()} - Polling for agent ${agent.agentName} - Room Mailbox ${agent.roomEmailAddress} has finished`)
}

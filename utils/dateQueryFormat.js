function dateQueryFormat(dateNow){



//let date2 = new Date(Date.parse('4/28/2021 23:59 GMT-0000'))
let date = dateNow;
let day = date.getDate()
let year = date.getFullYear();
let hours = date.getHours();
let minutes = date.getMinutes();
let timeZone = date.getTimezoneOffset()/60;
let month = date.getMonth() + 1

let nextDay;
let nextDayWeekAfter;
let lastMonthDay; 
let endDayPollMonth;
let endWeekPollMonth;


let dateObject = {
    dayPoll: { 
        startDate: "",
        endDate: ""
    },
    weekPoll: {
        startDate: "",
        endDate: ""
    }
}


if (timeZone < 10){
    timeZone = `0${date.getTimezoneOffset()/60}`;
} else {
    timeZone = timeZone.toString()
}

dateObject.dayPoll.startDate = `${month}-${day}-${year} ${hours}:${minutes}:00 GMT-${timeZone}:00`;
dateObject.weekPoll.startDate = `${month}-${day}-${year} ${hours}:${minutes}:00 GMT-${timeZone}:00`;

switch(date.getMonth() + 1){
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        lastMonthDay = 31;
        break;
    case 2:
    case 4:
    case 6:
    case 9:
    case 11:
        lastMonthDay = 30;
        break;
}

if( day + 2 > lastMonthDay){
    nextDay = day + 2 - lastMonthDay;
    endDayPollMonth = month + 1; 
} else {
    nextDay = day + 2;
    endDayPollMonth = month;
}

if( day + 7 > lastMonthDay){
    nextDayWeekAfter = day + 7 - lastMonthDay;
    endWeekPollMonth = month + 1; 
} else {
    nextDayWeekAfter = day + 7;
    endWeekPollMonth = month;
}

dateObject.dayPoll.endDate = `${endDayPollMonth}-${nextDay}-${year} 23:59:00 GMT-${timeZone}:00`;
dateObject.weekPoll.endDate = `${endWeekPollMonth}-${nextDayWeekAfter}-${year} 23:59:00 GMT-${timeZone}:00`;

// // console.log(date)
// // console.log(date2)

// // console.log("Date now", new Date(date))
// // console.log("Date2", new Date(date2))
// // console.log("Get Date", date.getDate())
// // console.log("Get Month", date.getMonth() + 1)


// console.log(day2)
// console.log(nextDay)
// console.log(month2)
// console.log(lastMonthDay)
// console.log(month2 + 1)
// console.log(date2.getTimezoneOffset()/60)
// console.log("Day Poll ",dateObject.dayPoll)
// console.log("Week Poll ",dateObject.weekPoll)
// console.log("Date Object",dateObject)

return dateObject;

}

module.exports = dateQueryFormat;
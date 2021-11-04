process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

class Agent {
    constructor(agentName, agentType, roomEmailAddress, roomDomain, roomUser, roomPassword, serviceAccount) {
        this.agentName = agentName;
        this.agentType = agentType; //Poly or Cisco
        this.roomEmailAddress = roomEmailAddress;
        this.roomDomain = roomDomain;
        this.roomUser = roomUser;
        this.roomPassword = roomPassword;
        this.serviceAccount = serviceAccount;
        this.calendarItems = [];
        // this.serviceUser = serviceUser;
        // this.servicePassword = servicePassword;
    }
}

module.exports = Agent;
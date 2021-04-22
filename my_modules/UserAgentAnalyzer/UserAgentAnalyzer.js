let robots = require('./robots.json');

class UserAgentAnalyzer {

    constructor() {
        this.robots = robots.robots;
    }

    isContainString(str, searchWord) {
        return str.indexOf(searchWord.toLowerCase()) > -1;
    }

    isRobotUserAgent(str) {
        str = str.toLowerCase();
        for (let i = 0; i < this.robots.length; i++) {
            if (this.isContainString(str, this.robots[i])){
                return true;
            }
        }
        return false;
    }

}

module.exports.UserAgentAnalyzer = UserAgentAnalyzer;

class Source {
    constructor(info) {
        this.lat = info.coordinates[0];
        this.lng = info.coordinates[1];
        let type = "Threat";
        if (info.networkAns == 1) {
            type = "";
        }
        this.icon = {
            iconUrl: 'img/empty.png',
            iconAnchor: [12, 15],
            popupAnchor: [0, 0],
            shadowSize: [0, 0],
            shadowAnchor: [0, 0],
            className: 'source' + type
        };
        this.fullCountryName = this.getCountryName(info.country);
        this.ip = info.ip;
        this.status = info.status;
        this.network = info.networkAns;
        this.blacklist = info.blackListAns;
        this.message = "IP:" + this.ip + "<br>" + "country:" + this.fullCountryName +
            "<p>Network: " + this.sourceType(this.network) + "</p>" +
            "<p>Official: " + this.sourceType(this.blacklist) + "</p>";
    }

    sourceType(ans) {
        if (ans == 1) {
            return "<span style='color: greenyellow'>Not Threat</span>";
        } else {
            return "<span style='color: red'>Threat</span>";
        }
    }

    getCountryName(name) {
        var res = '';
        if (countries) {
            for (var i = 0; i < countries.length; i++)
                if (name == countries[i]['alpha-2'])
                    res = countries[i].name;
        }
        return res;
    }
}
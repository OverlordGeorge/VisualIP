class Botnet {
    constructor(info) {
        this.lat = info.geometry.coordinates[0];
        this.lng = info.geometry.coordinates[1];
        this.icon = {
            iconUrl: 'img/empty.png',
            iconAnchor: [12, 15],
            popupAnchor: [0, 0],
            shadowSize: [0, 0],
            shadowAnchor: [0, 0],
            className: 'botnetMember'
        };
        this.fullCountryName = info.properties.country;
        this.ip = info.properties.ip;
        this.from = "";
        this.message = "IP:" + this.ip + "<br>" + "country:" + this.fullCountryName + "<br>" + "Mail:" + this.from;
    }
}


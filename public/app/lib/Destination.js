class Destination {
    constructor(info) {
        this.lat = info.ll[0];
        this.lng = info.ll[1];
        this.icon = {
            iconUrl: 'img/empty.png',
            iconAnchor: [12, 15],
            popupAnchor: [0, 0],
            shadowSize: [0, 0],
            shadowAnchor: [0, 0],
            className: 'destination'
        };
        this.country = info.country;
        this.city = info.city;
        this.ip = info.ip;
        this.message = "<p>Server:" + this.ip + " </p><p>Country: " + this.country + "</p><p>City: " + this.city + "</p>";
    }
}
class Ip {
    constructor(info) {
        this.setCoordinates(info);
        this.setMessage(info);
        this.icon = {
            iconUrl: 'img/empty.png',
            iconAnchor: [12, 15],
            popupAnchor: [0, 0],
            shadowSize: [0, 0],
            shadowAnchor: [0, 0],
            className: 'destination'
        };
    }

    setCoordinates(info){
        if (info.geoInfo && info.geoInfo.ll && info.geoInfo.ll[0]){
            this.lat = info.geoInfo.ll[0];
            this.lng = info.geoInfo.ll[1];
        } else if (info.dbAns && info.dbAns.coordinates && info.dbAns.coordinates[0]){
            this.lat = info.dbAns.coordinates[0];
            this.lng = info.dbAns.coordinates[1];
        }
    }

    setMessageField(object, name, field){
        this.message += "<p><b>"+name+":</b> "+object[field]+"</p>";
    }

    setWhoisInfo(whois){
        if (whois.address){
            this.setMessageField(whois, "address by whois", "address");
        } else if (whois.Address){
            this.setMessageField(whois, "address by whois", "Address");
        }
    }

    setGeoInfo(geoInfo){
        if (geoInfo.country){
            this.setMessageField(geoInfo, "country", "country");
        }
        if (geoInfo.city){
            this.setMessageField(geoInfo, "city", "city");
        }
    }

    setDbInfo(dbInfo){
        if (dbInfo.body_bytes_sent){
            this.setMessageField(dbInfo, "average body size", "body_bytes_sent");
        }
        if (dbInfo.networkAns){
            this.setMessageField(dbInfo, "network opinion", "networkAns");
        }
        if (dbInfo.blackListAns){
            this.setMessageField(dbInfo, "blacklist info", "blackListAns");
        }
    }

    setMessage(info){
        this.message = "";
        if (info.dbAns){
            this.setDbInfo(info.dbAns)
        }
        if (info.geoInfo){
            this.setGeoInfo(info.geoInfo)
        }
        if (info.whois){
            this.setWhoisInfo(info.whois)
        }
    }
}
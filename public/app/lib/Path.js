class Path {
    constructor(source, destination, currentStep = 0, allSteps = 0) {
        this.color= '#58801e';
        this.weight= 3;
        this.latlngs= this.calculateFinishPoint(source, destination, currentStep , allSteps);
        this.dashArray= '20, 8';
        this.dashOffset= '10';
    }

    calculateFinishPoint(source, destination, currentStep, allSteps){
        if (currentStep === 0){
            return [
                {
                    lat: source.coordinates[0], lng: source.coordinates[1]
                },
                {
                    lat: destination.ll[0], lng: destination.ll[1]
                }
            ];
        } else{
            let diffX = destination.ll[0]-source.coordinates[0];
            let diffY = destination.ll[1]-source.coordinates[1];
            if (currentStep > allSteps/2){
                let multiplier = ((currentStep - allSteps/2)*2)/allSteps;
                return [
                    {
                        lat: source.coordinates[0] + diffX*multiplier, lng: source.coordinates[1] + diffY*multiplier
                    },
                    {
                        lat: destination.ll[0], lng: destination.ll[1]
                    }
                ];
            } else{
                let multiplier = (currentStep*2)/allSteps;
                let start = {
                    lat: source.coordinates[0], lng: source.coordinates[1]
                };
                let finish = {
                    lat: source.coordinates[0]+ diffX*multiplier, lng:source.coordinates[1]+ diffY*multiplier
                };
                return [start, finish];
            }
        }
    }

}
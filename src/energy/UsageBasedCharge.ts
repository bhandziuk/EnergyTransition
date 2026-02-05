export interface UsageBasedCharge {
    usage: number;
    usageUom: string;
    source: string
    cost: () => number;
}

export class GasFurnace implements UsageBasedCharge {

    constructor(private cop: number, public usage: number, private gasRatePerThem: number) {

    }
    public source = "Gas Furnace";

    public usageUom: string = 'therm';

    public cost() {
        return this.usage * this.cop * this.gasRatePerThem;
    }
}
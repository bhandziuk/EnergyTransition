import { NumberFormats } from "../helpers/NumbersFormats";

const commaFormat = NumberFormats.numberCommasFormat().format;

export interface UsageBasedCharge {
    usage: number;
    usageFormatted: () => string;
    source: string
    cost: () => number;
}

export class ElectricalHeatPump implements UsageBasedCharge {
    constructor(private year: number, private cop: number, public usage: number, private effectiveRatePerKwh: number) {

    }
    private usageUom = 'kWh';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
    public source = 'Space heating';
    public cost() {
        return this.usage * this.effectiveRatePerKwh
    }
}


export class GeorgiaPowerEnvironmentalFee implements UsageBasedCharge {
    constructor(private year: number, public usage: number) {

    }
    public usageUom = 'kWh';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
    public source = 'Environmental Compliance Cost ';
    public cost() {
        return 12 * 10.61;   // seems to be proportional to usage
    }
}

export class GeorgiaPowerFranchiseFee implements UsageBasedCharge {
    constructor(private year: number, public usage: number) {

    }
    private usageUom = 'kWh';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
    public source = 'Municipal Franchise Fee';
    public cost() {
        return 12 * 3.91;// seems to be proportional to usage
    }
}

// export class ElectricalSalesTax

export class GasFurnace implements UsageBasedCharge {

    constructor(private cop: number, public usage: number, private gasRatePerThem: number) {

    }
    public source = "Space heating";

    private usageUom = 'therm';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
    public cost() {
        return this.usage * this.gasRatePerThem;
    }
}

export class GasWaterHeater implements UsageBasedCharge {

    constructor(private cop: number, public usage: number, private gasRatePerThem: number) {

    }
    public source = "Water heating";

    private usageUom = 'therm';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;

    public cost() {
        return this.usage * this.gasRatePerThem;
    }
}


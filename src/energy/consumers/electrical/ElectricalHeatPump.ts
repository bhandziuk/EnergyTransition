import { NumberFormats } from "../../../helpers";
import { DirectUsageBasedCharge } from "../../usageBasedCharges/UsageBasedCharge";

const commaFormat = NumberFormats.numberCommasFormat().format;

export class ElectricalHeatPump implements DirectUsageBasedCharge {
    constructor(private year: number, private cop: number, public usage: number) {

    }
    private usageUom = 'kWh';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
    public source = 'Space heating';
}
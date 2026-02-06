import { NumberFormats } from "../../../helpers";
import { DirectUsageBasedCharge } from "../../usageBasedCharges/UsageBasedCharge";

const commaFormat = NumberFormats.numberCommasFormat().format;

export class GasFurnace implements DirectUsageBasedCharge {

    constructor(private cop: number, public usage: number) {

    }
    public source = "Space heating";

    private usageUom = 'therm';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
}
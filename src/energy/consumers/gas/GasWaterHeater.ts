import { NumberFormats } from "../../../helpers";
import { DirectUsageBasedCharge } from "../../usageBasedCharges/UsageBasedCharge";

const commaFormat = NumberFormats.numberCommasFormat().format;

export class GasWaterHeater implements DirectUsageBasedCharge {

    constructor(private cop: number, public usage: number) {

    }
    public source = "Water heating";

    private usageUom = 'therm';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
}

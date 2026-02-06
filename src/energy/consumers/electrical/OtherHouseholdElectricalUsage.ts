import { NumberFormats } from "../../../helpers";
import { DirectUsageBasedCharge } from "../../usageBasedCharges/UsageBasedCharge";

const commaFormat = NumberFormats.numberCommasFormat().format;

export class OtherHouseholdElectricalUsage implements DirectUsageBasedCharge {
    constructor(public usage: number) {

    }
    private usageUom = 'kWh';
    public usageFormatted = () => `${commaFormat(this.usage)} ${this.usageUom}`;
    public source = 'Other household electrical uses';
}
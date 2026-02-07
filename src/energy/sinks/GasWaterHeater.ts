import { Sinks } from ".";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose } from "../usageBasedCharges/UsageBasedCharge";

export class GasWaterHeater implements IDirectUsageBasedCharge {

    constructor(private cop: number, private gasUsage: MeasuredValue) {
        this.usage = [this.gasUsage];
    }
    usage: MeasuredValue[];
    id: string = Sinks.gasWaterHeater;
    public static displayName: string = 'Gas water heater';
    purpose: Purpose = 'Water heating';
    displayName: string = GasWaterHeater.displayName;
    public usageFormatted = () => this.gasUsage.formatted();
}

import { Sinks } from ".";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose } from "../usageBasedCharges/UsageBasedCharge";

export class GasFurnace implements IDirectUsageBasedCharge {

    constructor(private cop: number, private gasUsage: MeasuredValue) {
        this.usage = [this.gasUsage];
    }
    public usage: MeasuredValue[];
    id: string = Sinks.gasFurnace;
    displayName: string = 'Gas furnace';
    purpose: Purpose = 'Space heating';

    public usageFormatted = () => this.gasUsage.formatted();
}
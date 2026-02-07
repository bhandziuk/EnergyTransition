import { Sinks } from ".";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose } from "../usageBasedCharges";

export class ElectricalHeatPump implements IDirectUsageBasedCharge {
    constructor(private year: number, private cop: number, private electricalUsage: MeasuredValue) {
        this.usage = [this.electricalUsage];
    }

    public usage: MeasuredValue[];
    public usageFormatted = () => this.electricalUsage.formatted();
    public displayName: string = 'Electrical heat pump';
    public id: string = Sinks.electricalHeatPump;
    public purpose: Purpose = 'Space heating';
}




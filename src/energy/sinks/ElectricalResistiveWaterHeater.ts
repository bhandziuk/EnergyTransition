import { Sinks } from ".";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose } from "../usageBasedCharges";

export class ElectricalResistiveWaterHeater implements IDirectUsageBasedCharge {
    constructor(private year: number, private cop: number, private electricalUsage: MeasuredValue) {
        this.usage = [this.electricalUsage];
    }
    public static displayName = 'Electric resistive water heater';
    public usage: Array<MeasuredValue>;
    public usageFormatted = () => this.electricalUsage.formatted();
    public displayName = ElectricalResistiveWaterHeater.displayName;
    public id = Sinks.electricalResistiveWaterHeater;
    public purpose: Purpose = 'Space heating';
}
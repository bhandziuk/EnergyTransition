import { Sinks } from ".";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose, UnitOfMeasure } from "../usageBasedCharges";

export class DualFuelHeatPump implements IDirectUsageBasedCharge {

    constructor(private year: number, private cop: number, public usage: Array<MeasuredValue>) {

    }
    usageFormatted = (uom?: UnitOfMeasure) => this.usage.filter(o => uom ? uom == o.uom : true).map(o => o.formatted()).join(', ');

    id = Sinks.dualFuelHeatPump;
    displayName = 'Dual fuel heat pump (primary electrical, supplementary gas)';
    purpose: Purpose = 'Space heating';

}
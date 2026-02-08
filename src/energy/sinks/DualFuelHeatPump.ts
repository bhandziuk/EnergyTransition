import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose, UnitOfMeasure } from "../usageBasedCharges";

export class DualFuelHeatPump implements IDirectUsageBasedCharge {

    constructor(private year: number, private cop: number, private summaryUsage: UserUsageSummary) {

    }
    usage: Array<IMonthUsage> = [];
    usageFormatted: (uom?: UnitOfMeasure) => string = () => '';
    // usageFormatted = (uom?: UnitOfMeasure) => this.usage.filter(o => uom ? uom == o.uom : true).map(o => o.formatted()).join(', ');

    id = Sinks.dualFuelHeatPump;
    public static displayName = 'Dual fuel heat pump (primary electrical, supplementary gas)';
    purpose: Purpose = 'Space heating';
    displayName = DualFuelHeatPump.displayName;
}
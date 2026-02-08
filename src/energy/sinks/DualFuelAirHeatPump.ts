import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose, UnitOfMeasure } from "../usageBasedCharges";

export class DualFuelAirHeatPump implements IDirectUsageBasedCharge {

    constructor(private year: number, private inputUsage: UserUsageSummary | Array<IMonthUsage>) {

    }

    public static copElectrical: number = 3;
    public static copGas: number = 0.9;
    usage: Array<IMonthUsage> = [];
    usageFormatted: (uom?: UnitOfMeasure) => string = () => '';
    // usageFormatted = (uom?: UnitOfMeasure) => this.usage.filter(o => uom ? uom == o.uom : true).map(o => o.formatted()).join(', ');

    id = Sinks.dualFuelAirHeatPump;
    public static displayName = 'Dual fuel heat pump (primary electrical, supplementary gas)';
    purpose: Purpose = 'Space heating';
    displayName = DualFuelAirHeatPump.displayName;
}
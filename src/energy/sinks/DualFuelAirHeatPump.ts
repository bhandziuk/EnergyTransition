import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { groupBy } from "../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../MeasuredValue";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../usageBasedCharges";

export class DualFuelAirHeatPump implements IDirectUsageBasedCharge {

    constructor(private year: number, private inputUsage: UserUsageSummary | Array<IMonthUsage>) {
        if (inputUsage instanceof Array) {
            this.usage = inputUsage;
        } else {
            // const thisYearCdd = cdd.filter(o => o.year == year).toSorted((a, b) => b.cdd - a.cdd);
            // const highestCdd = thisYearCdd[0];
            // const lowestCdd = thisYearCdd[thisYearCdd.length - 1];
            // const highestUsedKwh = inputUsage.highestElectrical;
            // const lowestUsedKwh = inputUsage.lowestElectrical;

            // const coolingOnly = Math.max(0, (highestUsedKwh?.value ?? 0) - (lowestUsedKwh?.value ?? 0));

            // this.usage = thisYearCdd.map(o => <IMonthUsage>{ month: o.month, usage: new MeasuredValue(coolingOnly * 1.1 * o.cdd / highestCdd.cdd, 'kWh') });
        }
    }

    public static copElectrical: number = 3;
    public static copGas: number = 0.9;
    usage: Array<IMonthUsage> = [];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');
    id = Sinks.dualFuelAirHeatPump;
    public static displayName = 'Dual fuel heat pump (supplementary heat source: gas)';
    purpose: Purpose = 'Space heating';
    displayName = DualFuelAirHeatPump.displayName;
}
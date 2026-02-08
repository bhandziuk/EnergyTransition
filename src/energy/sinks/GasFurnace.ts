import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import hdd from '../../data/heatingDegreeDays.dunwoody.json';
import { groupBy } from "../../helpers";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose, UnitOfMeasure } from "../usageBasedCharges/UsageBasedCharge";


export class GasFurnace implements IDirectUsageBasedCharge {

    constructor(year: number, cop: number, summaryUsage: UserUsageSummary) {
        const thisYearHdd = hdd.filter(o => o.year == year).toSorted((a, b) => b.hdd - a.hdd);
        const highestHdd = thisYearHdd[0];
        const lowestHdd = thisYearHdd[thisYearHdd.length - 1];

        const highestUsedTherms = summaryUsage.highestGas.toTherms(highestHdd.year, highestHdd.month);
        const lowestUsedTherms = summaryUsage.lowestGas.toTherms(lowestHdd.year, lowestHdd.month);

        const heatingOnly = (highestUsedTherms?.value ?? 0) - (lowestUsedTherms?.value ?? 0);

        this.usage = thisYearHdd.map(o => <IMonthUsage>{ month: o.month, usage: new MeasuredValue(heatingOnly * o.hdd / highestHdd.hdd, 'therm') });
    }

    usage: IMonthUsage[];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');

    id: string = Sinks.gasFurnace;
    public static displayName: string = 'Gas furnace';
    purpose: Purpose = 'Space heating';
    displayName = GasFurnace.displayName;
}
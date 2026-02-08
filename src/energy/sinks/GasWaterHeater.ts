import { possibleGasAppliancesInUseInLowestMonth, Sinks } from ".";
import { UserUsageSummary } from "../../components";
import hdd from '../../data/heatingDegreeDays.dunwoody.json';
import { groupBy } from "../../helpers";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose, UnitOfMeasure } from "../usageBasedCharges/UsageBasedCharge";


export class GasWaterHeater implements IDirectUsageBasedCharge {

    constructor(year: number, summaryUsage: UserUsageSummary, appliancesInUse: Array<string>) {
        const thisYearHdd = hdd.filter(o => o.year == year).toSorted((a, b) => a.hdd - b.hdd);

        const lowestHdd = thisYearHdd[thisYearHdd.length - 1];

        const gasAppliancesInUseInLowestMonth = possibleGasAppliancesInUseInLowestMonth.filter(o => appliancesInUse.includes(o.sink));
        const fractionForThisUse = (possibleGasAppliancesInUseInLowestMonth.find(o => o.sink == Sinks.gasWaterHeater)?.weight ?? 0) / gasAppliancesInUseInLowestMonth.reduce((acc, val) => acc + val.weight, 0);

        const gasWaterHeaterUsageOnly = (summaryUsage.lowestGas.toTherms(lowestHdd.year, lowestHdd.month)?.value ?? 0) * fractionForThisUse;
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        // Assumes constant gas use for heating water all year long
        this.usage = months.map(month => <IMonthUsage>{ month: month, usage: new MeasuredValue(gasWaterHeaterUsageOnly, 'therm') });
    }

    usage: IMonthUsage[];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');

    id: string = Sinks.gasWaterHeater;
    public static displayName: string = 'Gas water heater';
    purpose: Purpose = 'Water heating';
    displayName: string = GasWaterHeater.displayName;
}

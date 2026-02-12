
import { UserUsageSummary } from '../components';
import hdd from '../data/heatingDegreeDays.dunwoody.json';
import { IMonthUsage, MeasuredValue, possibleGasAppliancesInUseInLowestMonth } from '../energy';


/** Assumes constant gas use for heating water all year long */
export function proportionDistributeGas(summaryUsage: UserUsageSummary, forSink: string, degreeDays: Array<typeof hdd[number]>, appliancesInUse: Array<string>) {
    const lowestHdd = degreeDays[degreeDays.length - 1];
    const gasAppliancesInUseInLowestMonth = possibleGasAppliancesInUseInLowestMonth.filter(o => appliancesInUse.includes(o.sink));
    const fractionForThisUse = (possibleGasAppliancesInUseInLowestMonth.find(o => o.sink == forSink)?.weight ?? 0) / gasAppliancesInUseInLowestMonth.reduce((acc, val) => acc + val.weight, 0);

    const gasWaterHeaterUsageOnly = (summaryUsage.lowestGas.toTherms(lowestHdd.year, lowestHdd.month)?.value ?? 0) * fractionForThisUse;
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    // Assumes constant gas use for heating water all year long
    return months.map(month => <IMonthUsage>{ month: month, usage: new MeasuredValue(gasWaterHeaterUsageOnly, 'therm') });
}
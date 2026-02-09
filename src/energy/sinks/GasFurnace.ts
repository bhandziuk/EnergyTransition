import { DualFuelAirHeatPump, Sinks } from ".";
import { UserUsageSummary } from "../../components";
import hdd from '../../data/heatingDegreeDays.dunwoody.json';
import { groupBy } from "../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../MeasuredValue";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../usageBasedCharges/UsageBasedCharge";
import { IProportionUse } from "./IProportionUse";


export class GasFurnace implements IDirectUsageBasedCharge, IProportionUse {

    constructor(private year: number, summaryUsage: UserUsageSummary) {
        const thisYearHdd = hdd.filter(o => o.year == year).toSorted((a, b) => b.hdd - a.hdd);
        const highestHdd = thisYearHdd[0];
        const lowestHdd = thisYearHdd[thisYearHdd.length - 1];

        const highestUsedTherms = summaryUsage.highestGas.toTherms(highestHdd.year, highestHdd.month);
        const lowestUsedTherms = summaryUsage.lowestGas.toTherms(lowestHdd.year, lowestHdd.month);

        const heatingOnly = Math.max(0, (highestUsedTherms?.value ?? 0) - (lowestUsedTherms?.value ?? 0));

        this.usage = thisYearHdd.map(o => <IMonthUsage>{ month: o.month, usage: new MeasuredValue(heatingOnly * o.hdd / highestHdd.hdd, 'therm') });
    }
    canConvertTo: string[] = [Sinks.dualFuelAirHeatPump, Sinks.electricalAirHeatPump, Sinks.hybridAirHeatPump];
    convert: (toSink: string, relatedUsage: Array<IMonthUsage>) => IDirectUsageBasedCharge = (toSink, relatedUsage) => {
        if (toSink == Sinks.dualFuelAirHeatPump) {

            // break down gas usage into 
            // 75% of heating is electric. Remainder remains gas.   
            const newUsage = this.usage
                .map(o => [
                    <IMonthUsage>{ month: o.month, usage: new MeasuredValue((o.usage.toTherms(this.year, o.month)?.value ?? 0) * 0.75, 'therm') },
                    <IMonthUsage>{ month: o.month, usage: new MeasuredValue((o.usage.toKwh(this.year, o.month)?.value ?? 0) * 0.25 / DualFuelAirHeatPump.copElectrical, 'therm') }
                ])
                .flatMap(o => o);
            return new DualFuelAirHeatPump(this.year, newUsage);
        }
        else {
            throw new Error("Cannot convert this to that.");
        }
    };

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
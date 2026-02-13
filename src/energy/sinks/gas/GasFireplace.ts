import { Sinks } from "..";
import { UserUsageSummary } from "../../../components";
import hdd from '../../../data/heatingDegreeDays.dunwoody.json';
import { groupBy, proportionDistributeGas } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges/UsageBasedCharge";
import { IProportionUse } from "../IProportionUse";
import { WoodFireplace } from "../other/WoodFireplace";

export class GasFireplace implements IDirectUsageBasedCharge, IProportionUse {

    constructor(private year: number, summaryUsage: UserUsageSummary, appliancesInUse: Array<string>) {
        const thisYearHdd = hdd.filter(o => o.year == year).toSorted((a, b) => a.hdd - b.hdd);

        this.usage = proportionDistributeGas(summaryUsage, this.id, thisYearHdd, appliancesInUse);
    }

    canConvertTo: string[] = [Sinks.other.woodFireplace, Sinks.gas.gasFireplace];
    convert: (toSink: string) => IDirectUsageBasedCharge = (toSink) => {
        if (toSink == this.id) {
            return this;
        }
        else {
            return new WoodFireplace();
        }
    };

    usage: IMonthUsage[];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');

    id: string = Sinks.gas.gasFireplace;
    public static displayName: string = 'Gas fireplace';
    public static purpose: Purpose = 'Other';
    purpose: Purpose = GasFireplace.purpose;
    displayName: string = GasFireplace.displayName;
}

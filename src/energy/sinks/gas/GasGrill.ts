import { Sinks } from "..";
import { UserUsageSummary } from "../../../components";
import hdd from '../../../data/heatingDegreeDays.dunwoody.json';
import { groupBy, proportionDistributeGas } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges/UsageBasedCharge";
import { IProportionUse } from "../IProportionUse";
import { NothingSink } from "../other/NothingSink";


export class GasGrill implements IDirectUsageBasedCharge, IProportionUse {

    constructor(private year: number, summaryUsage: UserUsageSummary, appliancesInUse: Array<string>) {
        const thisYearHdd = hdd.filter(o => o.year == year).toSorted((a, b) => a.hdd - b.hdd);

        this.usage = proportionDistributeGas(summaryUsage, this.id, thisYearHdd, appliancesInUse);
    }

    canConvertTo: string[] = [Sinks.other.nothing, Sinks.gas.gasGrill];
    convert: (toSink: string) => IDirectUsageBasedCharge = (toSink) => {
        if (toSink == this.id) {
            return this;
        }
        else {
            return new NothingSink();
        }
    };

    usage: IMonthUsage[];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');

    id: string = Sinks.gas.gasGrill;
    public static displayName: string = 'Gas grill';
    public static purpose: Purpose = 'Other';
    purpose: Purpose = GasGrill.purpose;
    displayName: string = GasGrill.displayName;
}

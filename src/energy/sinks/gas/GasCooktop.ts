import { Sinks } from "..";
import { UserUsageSummary } from "../../../components";
import hdd from '../../../data/heatingDegreeDays.dunwoody.json';
import { groupBy, proportionDistributeGas } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges/UsageBasedCharge";
import { ElectricCooktop } from "../electric/ElectricCooktop";
import { IProportionUse } from "../IProportionUse";


export class GasCooktop implements IDirectUsageBasedCharge, IProportionUse {

    constructor(private year: number, summaryUsage: UserUsageSummary, appliancesInUse: Array<string>) {
        const thisYearHdd = hdd.filter(o => o.year == year).toSorted((a, b) => a.hdd - b.hdd);

        this.usage = proportionDistributeGas(summaryUsage, this.id, thisYearHdd, appliancesInUse);
    }

    canConvertTo: string[] = [Sinks.electric.electricCooktop, Sinks.gas.gasCooktop];
    convert: (toSink: string) => IDirectUsageBasedCharge = (toSink) => {
        if (toSink == this.id) {
            return this;
        }
        else {
            const electricUsage = this.usage.map(o => (<IMonthUsage>{ month: o.month, usage: o.usage.toKwh(this.year, o.month) }));
            return new ElectricCooktop(this.year, electricUsage);
        }
    };

    usage: IMonthUsage[];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');

    id: string = Sinks.gas.gasCooktop;
    public static displayName: string = 'Gas cooktop';
    public static purpose: Purpose = 'Other';
    purpose: Purpose = GasCooktop.purpose;
    displayName: string = GasCooktop.displayName;
}

import { Sinks } from "..";
import { UserUsageSummary } from "../../../components";
import { groupBy } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges";

export class HybridAirHeatPump implements IDirectUsageBasedCharge {
    constructor(private year: number, private inputUsage: UserUsageSummary | Array<IMonthUsage>) {
        if (inputUsage instanceof Array) {
            this.usage = inputUsage;
        } else {
            // If calculating from summary usage then this is from a baseline scenario and we can assume that this usage is wrapped up in "other household usage" already
            this.usage = [];
        }
    }

    usage: Array<IMonthUsage> = [];
    public static copHeatPump: number = 3.5;
    public static copResistive: number = 1;

    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');
    public static displayName: string = 'Electrical heat pump (supplementary heat source: electrical resistive coils)';
    public id: string = Sinks.electric.hybridAirHeatPump;
    public static purpose: Purpose = 'Space heating';
    purpose: Purpose = HybridAirHeatPump.purpose;
    displayName = HybridAirHeatPump.displayName;
}




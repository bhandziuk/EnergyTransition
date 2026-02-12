import { Sinks } from "..";
import { UserUsageSummary } from "../../../components";
import { groupBy } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges";


export class HeatPumpWaterHeater implements IDirectUsageBasedCharge {
    constructor(private year: number, private inputUsage: UserUsageSummary | Array<IMonthUsage>) {
        if (inputUsage instanceof Array) {
            this.usage = inputUsage;
        } else {
            // If calculating from summary usage then this is from a baseline scenario and we can assume that this usage is wrapped up in "other household usage" already
            this.usage = [];
        }
    }

    public static cop: number = 3;
    usage: Array<IMonthUsage> = [];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');
    public static displayName = 'Heat pump water heater';
    public displayName = HeatPumpWaterHeater.displayName;
    public id = Sinks.electric.electricalResistiveWaterHeater;
    public static purpose: Purpose = 'Water heating';
    purpose: Purpose = HeatPumpWaterHeater.purpose;
}
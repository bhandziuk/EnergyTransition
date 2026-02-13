import { Sinks } from "..";
import { groupBy } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges/UsageBasedCharge";

export class ElectricCooktop implements IDirectUsageBasedCharge {

    constructor(private year: number, private inputUsage: Array<IMonthUsage>) {
        if (inputUsage instanceof Array) {
            this.usage = inputUsage;
        } else {
            // If calculating from summary usage then this is from a baseline scenario and we can assume that this usage is wrapped up in "other household usage" already
            this.usage = [];
        }
    }

    usage: IMonthUsage[];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');

    id: string = Sinks.electric.electricCooktop;
    public static displayName: string = 'Electric cooktop (resistive/induction)';
    public static purpose: Purpose = 'Other';
    purpose: Purpose = ElectricCooktop.purpose;
    displayName: string = ElectricCooktop.displayName;
}

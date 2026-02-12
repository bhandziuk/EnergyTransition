import { Sinks } from "..";
import { groupBy } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges/UsageBasedCharge";

export class WoodFireplace implements IDirectUsageBasedCharge {

    constructor() {
        this.usage = [];
    }

    usage: IMonthUsage[];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');

    id: string = Sinks.gasFireplace;
    public static displayName: string = 'Wood fireplace';
    public static purpose: Purpose = 'Other';
    purpose: Purpose = WoodFireplace.purpose;
    displayName: string = WoodFireplace.displayName;
}

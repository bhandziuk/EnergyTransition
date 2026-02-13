import { Sinks } from "..";
import { UserUsageSummary } from "../../../components";
import { groupBy } from "../../../helpers";
import { MeasuredValue, UnitOfMeasure } from "../../MeasuredValue";
import { IMonthUsage } from "../../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../../usageBasedCharges";


export class ElectricalResistiveWaterHeater implements IDirectUsageBasedCharge {
    constructor(private year: number, inputUsage: UserUsageSummary | Array<IMonthUsage>) {
        if (inputUsage instanceof Array) {
            this.usage = inputUsage;
        } else {
            this.usage = [];
        }
    }

    public static cop: number = 1;
    usage: Array<IMonthUsage> = [];
    usageFormatted: (uom?: UnitOfMeasure) => string = (uom) => groupBy(this.usage, o => o.usage.uom)
        .map(group => new MeasuredValue(group.value.reduce((acc, val) => acc + val.usage.value, 0), group.key))
        .filter(o => uom ? uom == o.uom : true)
        .map(o => o.formatted()).join(', ');
    public static displayName = 'Conventional electric resistive water heater';
    public id = Sinks.electric.electricalResistiveWaterHeater;
    public static purpose: Purpose = 'Water heating';
    purpose: Purpose = ElectricalResistiveWaterHeater.purpose;
    public displayName = ElectricalResistiveWaterHeater.displayName;
}
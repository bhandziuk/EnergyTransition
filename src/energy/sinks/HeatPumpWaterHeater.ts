import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { UnitOfMeasure } from "../MeasuredValue";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../usageBasedCharges";

export class HeatPumpWaterHeater implements IDirectUsageBasedCharge {
    constructor(private year: number, private inputUsage: UserUsageSummary | Array<IMonthUsage>) {
    }

    public static cop: number = 3;
    usage: Array<IMonthUsage> = [];
    usageFormatted: (uom?: UnitOfMeasure) => string = () => '';
    public static displayName = 'Heat pump water heater';
    public displayName = HeatPumpWaterHeater.displayName;
    public id = Sinks.electricalResistiveWaterHeater;
    public purpose: Purpose = 'Water heating';
}
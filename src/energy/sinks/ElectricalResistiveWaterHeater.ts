import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose, UnitOfMeasure } from "../usageBasedCharges";

export class ElectricalResistiveWaterHeater implements IDirectUsageBasedCharge {
    constructor(private year: number, private cop: number, private summaryUsage: UserUsageSummary) {
    }
    usage: Array<IMonthUsage> = [];
    usageFormatted: (uom?: UnitOfMeasure) => string = () => '';
    public static displayName = 'Electric resistive water heater';
    public displayName = ElectricalResistiveWaterHeater.displayName;
    public id = Sinks.electricalResistiveWaterHeater;
    public purpose: Purpose = 'Space heating';
}
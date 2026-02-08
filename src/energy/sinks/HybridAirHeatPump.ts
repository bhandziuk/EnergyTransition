import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../usageBasedCharges";

export class HybridAirHeatPump implements IDirectUsageBasedCharge {
    constructor(private year: number, private inputUsage: UserUsageSummary | Array<IMonthUsage>) {

    }

    usage: Array<IMonthUsage> = [];
    public static copHeatPump: number = 3;
    public static copResistive: number = 1;

    public usageFormatted = () => '';//this.electricalUsage.formatted();
    public static displayName: string = 'Electrical heat pump (primary electrical, supplementary resistive coils)';
    public id: string = Sinks.hybridAirHeatPump;
    public purpose: Purpose = 'Space heating';
    displayName = HybridAirHeatPump.displayName;
}




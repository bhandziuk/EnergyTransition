import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../usageBasedCharges";

export class ElectricalHeatPump implements IDirectUsageBasedCharge {
    constructor(private year: number, private cop: number, private summaryUsage: UserUsageSummary) {

    }

    usage: Array<IMonthUsage> = [];

    public usageFormatted = () => '';//this.electricalUsage.formatted();
    public static displayName: string = 'Electrical heat pump';
    public id: string = Sinks.electricalHeatPump;
    public purpose: Purpose = 'Space heating';
    displayName = ElectricalHeatPump.displayName;
}




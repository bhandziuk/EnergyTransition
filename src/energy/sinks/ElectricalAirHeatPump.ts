import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../usageBasedCharges";

export class ElectricalAirHeatPump implements IDirectUsageBasedCharge {
    constructor(private year: number, private inputUsage: UserUsageSummary | Array<IMonthUsage>) {

    }

    usage: Array<IMonthUsage> = [];
    public static copHeatPump: number = 3;

    public usageFormatted = () => '';//this.electricalUsage.formatted();
    public static displayName: string = 'Electrical heat pump';
    public id: string = Sinks.electricalAirHeatPump;
    public purpose: Purpose = 'Space heating';
    displayName = ElectricalAirHeatPump.displayName;
}




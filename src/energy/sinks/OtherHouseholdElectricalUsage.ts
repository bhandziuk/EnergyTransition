import { Sinks } from ".";
import { UserUsageSummary } from "../../components";
import { MeasuredValue } from "../MeasuredValue";
import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, Purpose } from "../usageBasedCharges/UsageBasedCharge";


export class OtherHouseholdElectricalUsage implements IDirectUsageBasedCharge {
    constructor(summaryUsage: UserUsageSummary) {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        this.usage = months.map(o => <IMonthUsage>{ month: o, usage: new MeasuredValue(summaryUsage.lowestElectrical.value, 'kWh') });
    }
    usage: Array<IMonthUsage>;

    public usageFormatted = () => new MeasuredValue(this.usage.reduce((acc, val) => acc + val.usage.value, 0), 'kWh').formatted();
    public static displayName: string = 'All other household electrical uses';
    id: string = Sinks.otherHouseholdElectricalUsage;
    purpose: Purpose = 'Other';
    displayName: string = OtherHouseholdElectricalUsage.displayName;
}
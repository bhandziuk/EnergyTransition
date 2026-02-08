import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge, MeasuredValue, Purpose } from "../usageBasedCharges/UsageBasedCharge";


export class OtherHouseholdElectricalUsage implements IDirectUsageBasedCharge {
    constructor(public electricalUsage: MeasuredValue) {

    }
    usage: Array<IMonthUsage> = [];

    public usageFormatted = () => this.electricalUsage.formatted();
    public displayName = 'All other household electrical uses';
    id: string = 'bcd7355f-c246-4720-981b-d361058ec9ce';
    purpose: Purpose = 'Other';
}
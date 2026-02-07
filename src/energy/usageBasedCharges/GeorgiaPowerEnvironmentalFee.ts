import { IMonthUsage } from "../MonthUsage";
import { IIndirectUsageBasedCharge } from "./IndirectUsageBasedCharge";

export class GeorgiaPowerEnvironmentalFee implements IIndirectUsageBasedCharge {
    constructor(private year: number) {

    }
    public usageFormatted = () => ``;
    public source = 'Environmental Compliance Cost ';
    public cost(subtotal_dollars: number, usage_kwh: number | Array<IMonthUsage>) {
        // https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/#ECCR_note
        return 0.132343 * subtotal_dollars;
        //return 12 * 10.61;   // seems to be proportional to usage
    }
}
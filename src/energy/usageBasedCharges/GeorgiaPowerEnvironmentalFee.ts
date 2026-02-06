import { MonthUsage } from "../MonthUsage";
import { IndirectUsageBasedCharge } from "./IndirectUsageBasedCharge";

export class GeorgiaPowerEnvironmentalFee implements IndirectUsageBasedCharge {
    constructor(private year: number) {

    }
    public usageFormatted = () => ``;
    public source = 'Environmental Compliance Cost ';
    public cost(subtotal_dollars: number, usage_kwh: number | Array<MonthUsage>) {
        // https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/#ECCR_note
        return 0.132343 * subtotal_dollars;
        //return 12 * 10.61;   // seems to be proportional to usage
    }
}
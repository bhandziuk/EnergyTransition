import { MonthUsage } from "../MonthUsage";
import { IndirectUsageBasedCharge } from "./IndirectUsageBasedCharge";

export class GeorgiaPowerFranchiseFee implements IndirectUsageBasedCharge {
    constructor(private year: number, private insideCityLimits: boolean) {

    }
    public usageFormatted = () => ``;
    public source = 'Municipal Franchise Fee';
    public cost(subtotal_dollars: number, usage_kwh: number | Array<MonthUsage>) {
        // https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/
        return (this.insideCityLimits ? 0.030843 : 0.011995) * subtotal_dollars;
        //return 12 * 3.91;// seems to be proportional to usage
    }
}
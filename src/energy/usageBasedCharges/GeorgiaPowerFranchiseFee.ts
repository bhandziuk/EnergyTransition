import { IMonthUsage } from "../MonthUsage";
import { IIndirectUsageBasedCharge } from "./IndirectUsageBasedCharge";

export class GeorgiaPowerFranchiseFee implements IIndirectUsageBasedCharge {
    constructor(private year: number, private insideCityLimits: boolean) {

    }
    public usageFormatted = () => ``;
    public source = 'Municipal Franchise Fee';
    public annualCost(subtotal_dollars: number, usage: Array<IMonthUsage>) {
        // https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/
        return (this.insideCityLimits ? 0.030843 : 0.011995) * subtotal_dollars;
        //return 12 * 3.91;// seems to be proportional to usage
    }
}
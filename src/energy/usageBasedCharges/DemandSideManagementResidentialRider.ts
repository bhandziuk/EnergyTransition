import { MonthUsage } from "../MonthUsage";
import { IndirectUsageBasedCharge } from "./IndirectUsageBasedCharge";
import { calculateDirectCosts, RateSchedule } from "./RateSchedule";

export class DemandSideManagementResidentialRider implements IndirectUsageBasedCharge {
    constructor(private year: number) {

    }
    public usageFormatted = () => ``;
    public source = 'Demand Side Management Residential Rider';


    public cost(subtotal_dollars: number, usage_kwh: number | Array<MonthUsage>) {
        // https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/
        return subtotal_dollars * 0.012165;
    }
}
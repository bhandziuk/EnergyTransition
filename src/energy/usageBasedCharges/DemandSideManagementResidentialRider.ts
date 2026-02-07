import { IMonthUsage } from "../MonthUsage";
import { IIndirectUsageBasedCharge } from "./IndirectUsageBasedCharge";

export class DemandSideManagementResidentialRider implements IIndirectUsageBasedCharge {
    constructor(private year: number) {

    }
    public usageFormatted = () => ``;
    public source = 'Demand Side Management Residential Rider';

    public cost(subtotal_dollars: number, usage_kwh: number | Array<IMonthUsage>) {
        // https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/
        return subtotal_dollars * 0.012165;
    }
}
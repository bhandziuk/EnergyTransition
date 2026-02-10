import { DateTime } from "luxon";
import { calculateDddc, UserUsageSummary } from "../components";
import rates from "../data/aglGasRates.json";
import hdd from '../data/heatingDegreeDays.dunwoody.json';

type RateSet = typeof rates[0];

export interface IFlatCharge {
    source: () => string
    annualCost: () => number;
}



export class GasMarketerFee implements IFlatCharge {
    constructor(private year: number) {

    }

    public source = () => "Marketer Fee";

    public annualCost() {
        return 6.95 * 12;
    }
}

export class AglBaseCharge implements IFlatCharge {

    private yearMonths: Array<string> = [];

    constructor(private year: number, private seniorDiscount: boolean, private peakingGroup: boolean, summaryUsage: UserUsageSummary) {
        this.yearMonths = Array.from({ length: 12 }, (_, i) => i + 1).map(o => DateTime.utc(this.year, o, 1).toFormat("MMM-yy"));
        const thisYearHdd = hdd.filter(o => o.year == year).toSorted((a, b) => b.hdd - a.hdd);
        const highestHdd = thisYearHdd[0];

        this.dddc = calculateDddc(summaryUsage.lowestGas.value, summaryUsage.lowestGas.value, summaryUsage.highestGas.value, highestHdd.hdd);
    }

    private dddc: number;

    public source = () => `AGL Base Charge (DDDC = ${this.dddc.toFixed(3)})`;

    public annualCost() {
        return rates
            .filter(o => this.yearMonths.includes(o.month))
            .map(o => this.monthlyCharge(o))
            .reduce((acc, val) => acc + val, 0);
    }

    private monthlyCharge(rates: RateSet) {

        const customerCharges = rates.customerCharge;
        const designDayCapacityCharge = this.round(this.dddc * rates.dddcCharge, 2);
        const meterReadingCharge = rates.meterReadingCharge;
        const peakingCharge = this.round(this.peakingGroup ? this.dddc * rates.peakingCharge : 0, 2);
        const franchiseRecoveryFee = this.round(this.dddc * rates.franchiseRecoveryRider, 2);
        const socialResponsibilityCharge = this.seniorDiscount ? 0 : rates.socialResponsibilityCharge;
        const customerEducationCharge = rates.customerEducation;
        const environmentalResponseCostsCharge = this.round(this.dddc * rates.environmentalResponseCostRider, 2);
        const synergySavings = rates.synergySavings ?? 0;
        const prpAndPrpU = rates.pipelineReplacementProgram;
        const taxCutAndJobsActRefund = rates.taxCutAndJobsActRefund;
        const seniorCitizenDiscount = this.seniorDiscount ? -14 : 0;
        const systemReinforcementRider = rates.systemReinforcementRider ?? 0;
        const dotRider = rates.dotRider ?? 0;
        const econ1Rider = rates.econ1Rider ?? 0;

        const total = customerCharges
            + designDayCapacityCharge
            + meterReadingCharge
            + peakingCharge
            + franchiseRecoveryFee
            + socialResponsibilityCharge
            + customerEducationCharge
            + environmentalResponseCostsCharge
            + synergySavings
            + prpAndPrpU
            + taxCutAndJobsActRefund
            + seniorCitizenDiscount
            + systemReinforcementRider
            + dotRider
            + econ1Rider;
        return total;
    }

    private round(num: number, decimalPlaces: number) {
        const offset = Math.pow(10, decimalPlaces);
        return Math.round((num + Number.EPSILON) * offset) / offset;
    }
}


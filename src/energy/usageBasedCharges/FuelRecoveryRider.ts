import { IMonthUsage } from "../MonthUsage";
import { IIndirectUsageBasedCharge } from "./IndirectUsageBasedCharge";
import { calculateDirectCosts, RateSchedule } from "./RateSchedule";

export class FuelRecoveryRider implements IIndirectUsageBasedCharge {
    constructor(private year: number) {

    }
    public usageFormatted = () => ``;
    public source = 'Fuel Cost Recovery Rider';

    private rateScheduleByYear: { [year: number]: Array<RateSchedule> } = {

        [2025]: [
            new RateSchedule("June - Sept.", [6, 7, 8, 9], [{ name: '', rate: 0.045876, limitUom: 'kWh', upperLimit: Number.MAX_SAFE_INTEGER }]),
            new RateSchedule("Oct. - May", [1, 2, 3, 4, 5, 6, 10, 11, 12], [{ name: '', rate: 0.042859, limitUom: 'kWh', upperLimit: Number.MAX_SAFE_INTEGER }]),
        ]
    };

    public cost(subtotal_dollars: number, usage: Array<IMonthUsage>) {
        // https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/
        return calculateDirectCosts(this.rateScheduleByYear[this.year], usage);
    }
}
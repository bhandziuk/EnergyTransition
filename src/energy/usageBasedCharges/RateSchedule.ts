import { MonthUsage } from "../MonthUsage";

export class RateSchedule {
    constructor(public name: string, public applicableMonths: Array<number>, public rates: Array<RateBin>) {

    }

    public cost(usage: number) {
        let remainingUsage = usage;
        let dollars = 0;
        this.rates
            .toSorted((a, b) => a.rate - b.rate)
            .forEach(rate => {
                if (remainingUsage > 0) {
                    let applicableUsage = remainingUsage > rate.upperLimit ? rate.upperLimit : remainingUsage;
                    dollars = dollars + (applicableUsage * rate.rate);
                    remainingUsage = remainingUsage - rate.upperLimit;
                }
            });
        return dollars;
    }
}

export interface RateBin {
    name: string,
    upperLimit: number,
    rate: number,
    limitUom: string
}

export function calculateDirectCosts(rateSchedule: Array<RateSchedule>, usage: number | Array<MonthUsage>) {

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const usageByMonth = usage instanceof Array ? usage : months.map(month => ({ month: month, usage: usage / 12 } as MonthUsage));
    return rateSchedule
        .map(rate => {
            const usageInWindow = usageByMonth.filter(o => rate.applicableMonths.includes(o.month)).reduce((acc, val) => acc + val.usage, 0);
            return rate.cost(usageInWindow);
        })
        .reduce((acc, val) => acc + val, 0);
}
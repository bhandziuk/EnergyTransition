import { IMonthUsage } from "../MonthUsage";

export interface IIndirectUsageBasedCharge {
    usageFormatted: () => string;
    source: string
    annualCost: (subtotal_dollars: number, usage: Array<IMonthUsage>) => number;
}
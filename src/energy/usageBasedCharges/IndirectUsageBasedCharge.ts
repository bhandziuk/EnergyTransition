import { IMonthUsage } from "../MonthUsage";

export interface IIndirectUsageBasedCharge {
    usageFormatted: () => string;
    source: string
    cost: (subtotal_dollars: number, usage_kwh: number | Array<IMonthUsage>) => number;
}
import { MonthUsage } from "../MonthUsage";

export interface IndirectUsageBasedCharge {
    usageFormatted: () => string;
    source: string
    cost: (subtotal_dollars: number, usage_kwh: number | Array<MonthUsage>) => number;
}
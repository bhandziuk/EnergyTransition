import { IMonthUsage } from "../MonthUsage";
import { IDirectUsageBasedCharge } from "../usageBasedCharges";

export interface IProportionUse {
    canConvertTo: Array<string>,
    convert: (relatedUsage: Array<IMonthUsage>) => IDirectUsageBasedCharge
}
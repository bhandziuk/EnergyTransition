import { IDirectUsageBasedCharge } from "../usageBasedCharges";

export interface IProportionUse {
    canConvertTo: Array<string>,
    convert: (toSink: string) => IDirectUsageBasedCharge
}
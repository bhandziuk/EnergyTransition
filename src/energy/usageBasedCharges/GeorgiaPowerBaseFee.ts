import { IFlatCharge } from "../../costs";

export class GeorgiaPowerBaseFee implements IFlatCharge {
    constructor(private year: number) {

    }
    public usageFormatted = () => ``;
    public source = () => 'Georgia Power Base Fee';
    public annualCost() {
        return 13.81 * 12;
    }
}
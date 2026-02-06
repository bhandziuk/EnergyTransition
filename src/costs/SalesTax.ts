import { TaxCharge } from "./TaxCharge";

export class SalesTax implements TaxCharge {

    constructor(private rate: number) {

    }

    public source = 'Sales tax';
    public usageFormatted: () => string = () => '';
    public cost = (subtotal_dollars: number) => this.rate * subtotal_dollars;

}
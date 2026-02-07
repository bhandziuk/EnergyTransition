import { ITaxCharge } from "./TaxCharge";

export class SalesTax implements ITaxCharge {

    constructor(private rate: number) {

    }

    public source = 'Sales tax';
    public usageFormatted: () => string = () => '';
    public cost = (subtotal_dollars: number) => this.rate * subtotal_dollars;

}
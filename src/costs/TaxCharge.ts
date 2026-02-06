export interface TaxCharge {
    usageFormatted: () => string;
    source: string
    cost: (subtotal_dollars: number) => number;
}
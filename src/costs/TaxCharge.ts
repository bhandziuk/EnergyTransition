export interface ITaxCharge {
    usageFormatted: () => string;
    source: string
    cost: (subtotal_dollars: number) => number;
}
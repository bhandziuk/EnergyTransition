export class NumberFormats {
    /** 
     * Includes cents 
     */
    public static dollarsFormat() {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    }

    public static dollarsOnlyFormat() {
        return new Intl.NumberFormat('en-US', { style: 'currency', maximumFractionDigits: 0, currency: 'USD' });
    }

    /** Will not use thousands separators */
    public static integersFormat() {
        return new Intl.NumberFormat('en-US', { useGrouping: false });
    }

    /** Will use thousands separators */
    public static numberCommasFormat() {
        return new Intl.NumberFormat('en-US', { useGrouping: true, maximumFractionDigits: 1, minimumFractionDigits: 1 });
    }

    public static percentFormat() {
        return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2 });
    }

    public static currencyFormat() {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        });
    }
}
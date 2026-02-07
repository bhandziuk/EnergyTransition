import { NumberFormats } from "../../helpers";

const commaFormat = NumberFormats.numberCommasFormat().format;

export interface IDirectUsageBasedCharge extends IEnergySink {
    usage: Array<MeasuredValue>;
    usageFormatted: (uom?: UnitOfMeasure) => string;
}

export interface IEnergySink {
    id: string,
    displayName: string,
    purpose: Purpose
}

export class MeasuredValue {

    constructor(public value: number, public uom: UnitOfMeasure) {

    }

    public formatted() {
        return `${commaFormat(this.value)} ${this.uom}`;
    }

    public combine(others: Array<MeasuredValue>) {
        const differentUom = others.filter(o => o.uom != this.uom);
        const sameUom = others.filter(o => o.uom == this.uom).concat([this]).reduce((acc, val) => acc + val.value, 0);

        return differentUom.concat([new MeasuredValue(sameUom, this.uom)]);
    }
}

export type UnitOfMeasure = 'therm' | 'kWh' | 'CCF';

export type Purpose = 'Space heating' | 'Water heating' | 'Cooking' | 'Other';
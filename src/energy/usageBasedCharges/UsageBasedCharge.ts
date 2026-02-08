import thermFactors from '../../data/thermFactors.json';
import { NumberFormats } from "../../helpers";
import { IMonthUsage } from "../MonthUsage";

const commaFormat = NumberFormats.numberCommasFormat().format;

export interface IDirectUsageBasedCharge extends IEnergySink {
    usage: Array<IMonthUsage>;
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

    public toTherms(year: number, month: number) {
        if (this.uom == "kWh") {
            throw new Error("Cannot convert kWh to therm");
        }

        if (this.uom == 'therm') {
            return this;
        }

        if (this.uom == 'CCF') {
            const thermFactor = thermFactors.find(o => o.month == month && o.year == year);
            return new MeasuredValue(this.value * (thermFactor?.thermFactor ?? 1), 'therm');
        }
    }
}

export type UnitOfMeasure = 'therm' | 'kWh' | 'CCF';

export type Purpose = 'Space heating' | 'Water heating' | 'Cooking' | 'Other';


import thermFactors from '../data/thermFactors.json';
import { NumberFormats } from "../helpers";

const commaFormat = NumberFormats.numberCommasFormat().format;

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

    /** Ensures CCF is in therms */
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

    /** Ensures therms are in CCF */
    public toCcf(year: number, month: number) {
        if (this.uom == "kWh") {
            throw new Error("Cannot convert kWh to therm");
        }

        if (this.uom == 'CCF') {
            return this;
        }

        if (this.uom == 'therm') {
            const thermFactor = thermFactors.find(o => o.month == month && o.year == year);
            return new MeasuredValue(this.value / (thermFactor?.thermFactor ?? 1), 'therm');
        }
    }

    public toKwh(year: number, month: number) {
        const kwhPerTherm = 29.307111111;
        if (this.uom == "kWh") {
            return this;
        }
        else if (this.uom == 'therm' || this.uom == 'CCF') {
            const therms = this.toTherms(year, month);
            return new MeasuredValue(therms!.value * kwhPerTherm, 'kWh');
        }
    }
}

export type UnitOfMeasure = 'therm' | 'kWh' | 'CCF';
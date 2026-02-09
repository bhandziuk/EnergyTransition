import { UnitOfMeasure } from '../MeasuredValue';
import { IMonthUsage } from "../MonthUsage";

export interface IDirectUsageBasedCharge extends IEnergySink {
    usage: Array<IMonthUsage>;
    usageFormatted: (uom?: UnitOfMeasure) => string;
}

export interface IEnergySink {
    id: string,
    displayName: string,
    purpose: Purpose
}


export type Purpose = 'Space heating' | 'Water heating' | 'Cooking' | 'Other';


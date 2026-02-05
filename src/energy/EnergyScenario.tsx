import { Component } from "solid-js";
import { FlatCharge } from "./FlatCharge";
import { UsageBasedCharge } from "./UsageBasedCharge";
import './energy.css';
import { NumberFormats } from "../helpers/NumbersFormats";

const dollars = NumberFormats.dollarsFormat().format;

export class GasEnergyScenario implements EnergyScenario {

    constructor(private uses: Array<UsageBasedCharge>, private flatCharges: Array<FlatCharge>) {

    }

    public render: Component = (props) => <>
        <h3>Gas</h3>
        {renderFlatCharges(this.flatCharges)}
        {renderUsageCharges(this.uses)}
    </>
}

function renderUsageCharges(uses: Array<UsageBasedCharge>): Component {
    return () => <><h4>Volumetric uses charges</h4>
        {uses.map(o => <div class="charge-row">
            <div class="source">{o.source}</div>
            <div class="usage">{o.usage}</div>
            <div class="usage-uom">{o.usageUom}</div>
            <div class="cost">{dollars(o.cost())}</div>
        </div>)}
    </>
}

function renderFlatCharges(flatCharges: Array<FlatCharge>): Component {
    return () => <>
        <h4>Fixed charges</h4>
        {
            flatCharges.map(o => <div class="charge-row">
                <div class="source">{o.source}</div>
                <div class="cost">{dollars(o.cost())}</div>
            </div>)
        }
    </>
}

export class ElectricalEnergyScenario implements EnergyScenario {
    constructor(private uses: Array<UsageBasedCharge>, private flatCharges: Array<FlatCharge>) {

    }

    public render: Component = (props) => <>
        <h3>Electrical</h3>
        {renderFlatCharges(this.flatCharges)}
        {renderUsageCharges(this.uses)}
    </>
}

export interface EnergyScenario {
    render: Component;
}
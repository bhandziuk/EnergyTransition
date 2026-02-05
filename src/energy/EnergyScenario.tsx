import { Component } from "solid-js";
import { FlatCharge } from "./FlatCharge";
import { UsageBasedCharge } from "./UsageBasedCharge";
import './energy.css';
import { NumberFormats } from "../helpers/NumbersFormats";

const dollars = NumberFormats.dollarsFormat().format;

export class GasEnergyScenario implements EnergyScenario {

    constructor(private uses: Array<UsageBasedCharge>, private flatCharges: Array<FlatCharge>) {

    }

    public render: Component = (props) => <div class="scenario-source-section">
        <h3>Gas</h3>
        <div class="scenario-source-charges-section">
            {renderFlatCharges(this.flatCharges)(props)}
            {renderUsageCharges(this.uses)(props)}
        </div>
    </div>

    public cost() {
        return this.flatCharges.map(o => o.cost())
            .concat(this.uses.map(o => o.cost()))
            .reduce((acc, val) => acc + val, 0);
    };
}

export class ElectricalEnergyScenario implements EnergyScenario {
    constructor(private uses: Array<UsageBasedCharge>, private flatCharges: Array<FlatCharge>) {

    }

    public render: Component = (props) => <div class="scenario-source-section">
        <h3>Electrical</h3>
        <div class="scenario-source-charges-section">
            {renderFlatCharges(this.flatCharges)(props)}
            {renderUsageCharges(this.uses)(props)}
        </div>
    </ div>

    public cost() {
        return this.flatCharges.map(o => o.cost())
            .concat(this.uses.map(o => o.cost()))
            .reduce((acc, val) => acc + val, 0);
    };
}

function renderUsageCharges(uses: Array<UsageBasedCharge>): Component {
    return (props) => <>
        <h4>Volumetric uses charges</h4>
        {
            uses.map(o =>
                <div class="charge-row">
                    <div class="source">{o.source}</div>
                    <div class="usage">{o.usageFormatted()}</div>
                    <div class="cost">{dollars(o.cost())}</div>
                </div>
            )
        }
        <div class="charge-row">
            <div class="source"><h4>Total Cost</h4></div>
            <div class="cost bold">{dollars(uses.map(part => part.cost()).reduce((acc, val) => acc + val, 0))}</div>
        </div>
    </>
}

function renderFlatCharges(flatCharges: Array<FlatCharge>): Component {
    return (props) => <>
        <h4>Fixed charges</h4>
        {
            flatCharges.map(o =>
                <div class="charge-row">
                    <div class="source">{o.source}</div>
                    <div class="cost">{dollars(o.cost())}</div>
                </div>
            )
        }
        <div class="charge-row">
            <div class="source"><h4>Total Cost</h4></div>
            <div class="cost bold">{dollars(flatCharges.map(part => part.cost()).reduce((acc, val) => acc + val, 0))}</div>
        </div>
    </>
}


export interface EnergyScenario {
    render: Component;
    cost: () => number;
}
import { Component, Show } from "solid-js";
import { ITaxCharge, SalesTax } from "../costs";
import { IFlatCharge } from "../costs/FlatCharge";
import { NumberFormats } from "../helpers/NumbersFormats";
import './energy.css';
import { IDirectUsageBasedCharge, calculateDirectCosts, RateSchedule } from "./usageBasedCharges";
import { IIndirectUsageBasedCharge } from "./usageBasedCharges/IndirectUsageBasedCharge";
import { MeasuredValue, UnitOfMeasure } from "./MeasuredValue";

const dollars = NumberFormats.dollarsFormat().format;

export class EnergyScenario {

    private taxes: Array<ITaxCharge> = [
        new SalesTax(0.08)
    ];

    constructor(
        public scenarioFuelType: string,
        public scenarioUom: UnitOfMeasure,
        private directUses: Array<IDirectUsageBasedCharge>,
        private indirectUses: Array<IIndirectUsageBasedCharge>,
        private flatCharges: Array<IFlatCharge>,
        private rateSchedule: Array<RateSchedule>
    ) { }

    public render: Component = (props) => {
        const totalCharges = this.totalCost();

        return <Show when={this.directUses.filter(o => o.usage.some(use => use.usage.uom == this.scenarioUom)).length}>
            <div class="scenario-source-section">
                <h3>{this.scenarioFuelType}</h3>
                <div class="scenario-source-charges-section">
                    {this.renderFlatCharges(props)}
                    {this.renderDirectUsageCharges(props)}
                    {this.renderIndirectUsageCharges(props)}
                    {this.renderTaxCharges(props)}
                    <div class="total-row">
                        <div class="source"><h3>{this.scenarioFuelType} total costs</h3></div>
                        <div class="cost bold">{dollars(totalCharges)}</div>
                    </div>
                </div>
            </ div>
        </Show>
    }

    public cost() {
        return this.directUses.filter(o => o.usage.some(use => use.usage.uom == this.scenarioUom)).length ? this.totalCost() : 0;
    };

    private totalCost() {

        const taxableSubtotal_dollars = this.taxableSubtotalCost();
        const tax_dollars = this.taxCost(taxableSubtotal_dollars);

        return taxableSubtotal_dollars + tax_dollars;
    }

    private directCosts() {
        const directUsage_inScenarioUom = this.directUsage();
        return calculateDirectCosts(this.rateSchedule, directUsage_inScenarioUom);
    }

    private directUsage() {
        return this.directUses.flatMap(o => o.usage)
            .filter(o => o.usage.uom == this.scenarioUom);
    }

    private indirectCosts() {
        const directCosts_dollars = this.directCosts();
        const directUsage_inScenarioUom = this.directUsage();
        return this.indirectUses.map(o => o.cost(directCosts_dollars, directUsage_inScenarioUom)).reduce((acc, val) => acc + val, 0);
    }

    private flatCosts() {
        return this.flatCharges.map(o => o.cost()).reduce((acc, val) => acc + val, 0);
    }

    private taxableSubtotalCost() {
        const directCosts_dollars = this.directCosts();
        const indirectCosts_dollars = this.indirectCosts();
        const flatCosts_dollars = this.flatCosts();
        return directCosts_dollars + indirectCosts_dollars + flatCosts_dollars;
    }

    private taxCost(taxableSubtotal_dollars: number) {
        return this.taxes.map(o => o.cost(taxableSubtotal_dollars)).reduce((acc, val) => acc + val, 0)
    }

    private renderTaxCharges: Component = (props: any) => {
        const taxableSubtotal_dollars = this.taxableSubtotalCost();

        return <Show when={this.taxes.length}>
            <h4>Tax</h4>
            {
                this.taxes.map(o =>
                    <div class="charge-row">
                        <div class="source">{o.source}</div>
                        <div class="usage">{o.usageFormatted()}</div>
                        <div class="cost">{dollars(o.cost(taxableSubtotal_dollars))}</div>
                    </div>
                )
            }
            <div class="charge-row total">
                <div class="source"><h4>Tax cost</h4></div>
                <div class="cost bold">{dollars(this.taxCost(taxableSubtotal_dollars))}</div>
            </div>
        </Show>
    }

    private renderIndirectUsageCharges: Component = (props: any) => {
        const directCosts_dollars = this.directCosts();
        const directUsage_inScenarioUom = this.directUsage();
        const indirectCosts_dollars = this.indirectCosts();

        return <Show when={this.indirectUses.length}>
            <h4>Service subtotal</h4>
            {
                this.indirectUses.map(o =>
                    <div class="charge-row">
                        <div class="source">{o.source}</div>
                        <div class="usage">{o.usageFormatted()}</div>
                        <div class="cost">{dollars(o.cost(directCosts_dollars, directUsage_inScenarioUom))}</div>
                    </div>
                )
            }
            <div class="charge-row total">
                <div class="source"><h4>Service subtotal cost</h4></div>
                <div class="cost bold">{dollars(indirectCosts_dollars)}</div>
            </div>
        </Show>
    }

    private renderDirectUsageCharges: Component = (props: any) => {
        return <Show when={this.directUses.filter(o => o.usage.some(use => use.usage.uom == this.scenarioUom)).length}>
            <h4>Volumetric usage base charges</h4>
            {
                this.directUses
                    .filter(o => o.usage.some(use => use.usage.uom == this.scenarioUom))
                    .map(o =>
                        <div class="charge-row">
                            <div class="source">{o.displayName}</div>
                            <div class="usage">{o.usageFormatted(this.scenarioUom)}</div>
                        </div>
                    )
            }
            <div class="charge-row total">
                <div class="source"><h4>Total usage costs</h4></div>
                <div class="usage bold">{this.directUsage()
                    .filter(o => o.usage.uom == this.scenarioUom)
                    .reduce((acc, val) => acc.combine([val.usage]).find(o => o.uom == this.scenarioUom)!, new MeasuredValue(0, this.scenarioUom))
                    .formatted()}
                </div>
                <div class="cost bold">{dollars(this.directCosts())}</div>
            </div>
        </ Show>
    }

    private renderFlatCharges: Component = (props: any) => {
        return <Show when={this.flatCharges.length}>
            <h4>Fixed charges</h4>
            {
                this.flatCharges.map(o =>
                    <div class="charge-row">
                        <div class="source">{o.source()}</div>
                        <div class="cost">{dollars(o.cost())}</div>
                    </div>
                )
            }
            <div class="charge-row total">
                <div class="source"><h4>Total flat costs</h4></div>
                <div class="cost bold">{dollars(this.flatCosts())}</div>
            </div>
        </Show>
    }
}

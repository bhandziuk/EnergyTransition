import { Component, createMemo, createSignal } from "solid-js";
import { MeasuredValue } from "../energy";
import { setInputElementValue } from "./NumberInput";

export function summaryUsage() {

    const initialBaselineSummaryUsage = createMemo(() => ({
        highestElectrical: 1773,
        lowestElectrical: 612,
        highestGas: 107,
        lowestGas: 12,
    }));

    const [highestElectrical, setHighestElectrical] = createSignal(initialBaselineSummaryUsage().highestElectrical);
    const [lowestElectrical, setLowestElectrical] = createSignal(initialBaselineSummaryUsage().lowestElectrical);
    const [highestGas, setHighestGas] = createSignal(initialBaselineSummaryUsage().highestGas);
    const [lowestGas, setLowestGas] = createSignal(initialBaselineSummaryUsage().lowestGas);

    // const [highestElectrical, setHighestElectrical] = createSignal(new MeasuredValue(1660, 'kWh'));
    // const [lowestElectrical, setLowestElectrical] = createSignal(new MeasuredValue(600, 'kWh'));
    // const [highestGas, setHighestGas] = createSignal(new MeasuredValue(107, 'CCF'));
    // const [lowestGas, setLowestGas] = createSignal(new MeasuredValue(12, 'CCF'));

    const baselineSummaryUsage = createMemo<UserUsageSummary>(() => ({
        highestElectrical: new MeasuredValue(highestElectrical(), 'kWh'),
        highestGas: new MeasuredValue(highestGas(), 'CCF'),
        lowestElectrical: new MeasuredValue(lowestElectrical(), 'kWh'),
        lowestGas: new MeasuredValue(lowestGas(), 'CCF')
    }));

    // const test = new MeasuredValue(1, 'CCF');

    // ask user for highest/lowest CCF/kWh
    const SummaryUsage: Component = (props) => <div class="summary-usage-input">
        <span class="top-left"></span>
        <span class="highest-label">Highest Month of Usage</span>
        <span class="lowest-label">Lowest Month of Usage</span>
        <span class="electrical-label">Electrical (kWh)</span>
        <span class="gas-label">Gas (CCF)</span>
        <input
            class="highest-electrical"
            value={highestElectrical()}
            type="number"
            min="0"
            onInput={setInputElementValue(setHighestElectrical)}
        />
        <input
            class="highest-gas"
            value={highestGas()}
            min="0"
            type="number"
            onInput={setInputElementValue(setHighestGas)}
        />
        <input
            class="lowest-electrical"
            value={lowestElectrical()}
            min="0"
            type="number"
            onInput={setInputElementValue(setLowestElectrical)}
        />
        <input
            class="lowest-gas"
            value={lowestGas()}
            min="0"
            type="number"
            onInput={setInputElementValue(setLowestGas)}
        />
    </div>

    return {
        SummaryUsage: SummaryUsage,
        baselineSummaryUsage: baselineSummaryUsage
    }

}
export interface UserUsageSummary {
    /** kWh */
    highestElectrical: MeasuredValue;
    /** kWh */
    lowestElectrical: MeasuredValue;
    /** CCF */
    highestGas: MeasuredValue;
    /** CCF */
    lowestGas: MeasuredValue;
}

import { Component, createMemo, createSignal } from "solid-js";
import { MeasuredValue } from "../energy";

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
            onInput={(e) => setHighestElectrical(Number(e.currentTarget.value))}
        />
        <input
            class="highest-gas"
            value={highestGas()}
            onInput={(e) => setHighestGas(Number(e.currentTarget.value))}
        />
        <input
            class="lowest-electrical"
            value={lowestElectrical()}
            onInput={(e) => setLowestElectrical(Number(e.currentTarget.value))}
        />
        <input
            class="lowest-gas"
            value={lowestGas()}
            onInput={(e) => setLowestGas(Number(e.currentTarget.value))}
        />
    </div>

    return {
        SummaryUsage: SummaryUsage,
        baselineSummaryUsage: baselineSummaryUsage
    }

}
export interface UserUsageSummary {
    highestElectrical: MeasuredValue;
    lowestElectrical: MeasuredValue;
    highestGas: MeasuredValue;
    lowestGas: MeasuredValue;
}

import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { IDirectUsageBasedCharge, EnergyScenario, GeorgiaPowerEnvironmentalFee, GeorgiaPowerFranchiseFee, ElectricalAirHeatPump, GasWaterHeater, GasFurnace, IIndirectUsageBasedCharge, OtherHouseholdElectricalUsage, FuelRecoveryRider, RateSchedule, DemandSideManagementResidentialRider, MeasuredValue, DualFuelAirHeatPump, ElectricalResistiveWaterHeater, Sinks, AirConditioner, getElectricalRateSchedules, IMonthUsage } from "../energy";
import { createGuid, groupBy, NumberFormats } from "../helpers";
import { UserUsageSummary } from "./SummaryUsage";
import { AglBaseCharge, GasMarketerFee, IFlatCharge } from "../costs";
import { summaryUsage } from "./SummaryUsage";
import { GeorgiaPowerBaseFee } from "../energy/usageBasedCharges/GeorgiaPowerBaseFee";
import { setInputElementValue } from "./NumberInput";
import { HybridAirHeatPump } from "../energy/sinks/HybridAirHeatPump";
import { HeatPumpWaterHeater } from "../energy/sinks/HeatPumpWaterHeater";

const dollars = NumberFormats.dollarsFormat().format;

const year = createMemo(() => 2025);

const summaryUsagePart = summaryUsage();

const sinkNames = {
    [Sinks.dualFuelAirHeatPump]: DualFuelAirHeatPump.displayName,
    [Sinks.electricalAirHeatPump]: ElectricalAirHeatPump.displayName,
    [Sinks.electricalResistiveWaterHeater]: ElectricalResistiveWaterHeater.displayName,
    [Sinks.gasFurnace]: GasFurnace.displayName,
    [Sinks.gasWaterHeater]: GasWaterHeater.displayName,
    [Sinks.otherHouseholdElectricalUsage]: OtherHouseholdElectricalUsage.displayName,
    [Sinks.airConditioner]: AirConditioner.displayName,
    [Sinks.hybridAirHeatPump]: HybridAirHeatPump.displayName,
    [Sinks.electricalAirHeatPump]: ElectricalAirHeatPump.displayName,
    [Sinks.heatPumpWaterHeater]: HeatPumpWaterHeater.displayName,
    // [Sinks.gasDryer]: gasDryer.displayName,
    // [Sinks.gasGrill]: gasGrill.displayName,
    [Sinks.electricalResistiveWaterHeater]: ElectricalResistiveWaterHeater.displayName,
}

const initialBaselineSinks = [
    { id: Sinks.dualFuelAirHeatPump, selected: false },
    { id: Sinks.gasFurnace, selected: true },
    { id: Sinks.gasWaterHeater, selected: true },
    { id: Sinks.otherHouseholdElectricalUsage, selected: true }, // todo this should be forcefully added later (i.e. cannot be unchecked)
    { id: Sinks.airConditioner, selected: true },
    { id: Sinks.hybridAirHeatPump, selected: false },
    { id: Sinks.electricalAirHeatPump, selected: false },
    // { id: Sinks.gasDryer, selected: false },
    // { id: Sinks.gasGrill, selected: false },
    { id: Sinks.electricalResistiveWaterHeater, selected: false },
];

const [baselineSinks, setBaselineSinks] = createSignal(initialBaselineSinks);

const baselineSinksComponent = () => <>
    <ul>
        {baselineSinks().toSorted((a, b) => sinkNames[a.id].localeCompare(sinkNames[b.id]))
            .map(sink =>
                <li class="no-marker">
                    <input type="checkbox"
                        id={sink.id}
                        checked={sink.selected}
                        oninput={e => setBaselineSinks(baselineSinks().filter(o => o.id != sink.id).concat([{ id: sink.id, selected: e.target.checked }]))} />
                    <label for={sink.id}>{sinkNames[sink.id]}</label>
                </li>
            )}
    </ul>
</>

const [gasThermRate, setGasThermRate] = createSignal(0.75);

const gasRateSchedule = createMemo(() => [
    new RateSchedule("Gas Rates", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [
        { name: "Constant", rate: gasThermRate(), limitUom: 'therm', upperLimit: Number.MAX_SAFE_INTEGER }
    ])
]);

const [showNewConverter, setShowNewConverter] = createSignal(false);

const [alternativeScenarios, setAlternativeScenarios] = createSignal<Array<CombinedEnergyScenario>>([]);

const gasRatesComponent = () => <div class="gas-rate-simple">

    <label for="gas-rate">
        What was your gas rate last year?
    </label>
    <input
        id="gas-rate"
        value={gasThermRate()}
        type="number"
        step="0.01"
        min="0"
        onInput={setInputElementValue(setGasThermRate)}
    />
    <span>$/therm</span>
</div>

class CombinedEnergyScenario {

    constructor(public id: string, public scenarioName: string, private parts: Array<EnergyScenario>, private removeSelf: () => void) {

    }

    public render: Component = (props) => <div class="scenario-breakdown">
        <h2 class="scenario-name">{this.scenarioName}<Show when={this.scenarioName != 'Before'}><button onclick={this.removeSelf}>Remove</button></Show></h2>
        {this.parts.map(part => part.render(props))}
        {
            <div class="charge-row">
                <div class="source"><h3>Total Cost</h3></div>
                <div class="cost bold">{dollars(this.parts.map(part => part.cost()).reduce((acc, val) => acc + val, 0))}</div>
            </div>
        }
    </div>

    private conversions = createSignal<{ [from: string]: string }>({});

    public startConversion: Component = (props) => {
        const convertibles = [...new Set(this.parts.flatMap(o => o.convertibles()))];

        return <div class="scenario-breakdown">
            {convertibles
                .map(o => <div>
                    <label for={o.id}>Convert from:</label>
                    <span id={o.id}>{o.displayName}</span>
                    <div>To:</div>
                    <ul class="no-marker">{o.canConvertTo.map(c => <li><input
                        type="checkbox"
                        id={o.id + c}
                        checked={this.conversions[0]()[o.id] == c}
                        oninput={(e) => this.conversions[1](Object.assign({}, this.conversions[0](), { [o.id]: c }))}
                    ></input>
                        <label for={o.id + c}></label>{sinkNames[c]}</li>)}</ul>
                </div>)
            }
            <div>
                {convertibles
                    .filter(o => this.conversions[0]()[o.id])
                    .map(o => <div>{o.displayName + ' --> ' + sinkNames[this.conversions[0]()[o.id]]}</div>)}
            </div>
            <button
                disabled={convertibles.some(o => !this.conversions[0]()[o.id])}
                onclick={(e) => {

                    const nonConverted = [...new Set(this.parts.flatMap(o => o.nonConvertibles()))];
                    const converted = convertibles.map(o => o.convert(this.conversions[0]()[o.id]));
                    const directUses = nonConverted.concat(converted);

                    const gasUsages = directUses.flatMap(o => o.usage.filter(o => o.usage.uom == 'CCF' || o.usage.uom == 'therm'))

                        .map(o => ({ month: o.month, usage: o.usage.toCcf(year(), o.month)! }));

                    const electricalUsages = directUses.flatMap(o => o.usage
                        .filter(o => o.usage.uom == 'kWh'));

                    const gasUsage = groupBy(gasUsages, o => o.month)
                        .map(month => ({ month: month.key, usage: month.value.reduce((acc, val) => val.usage.combine(acc), [] as Array<MeasuredValue>)[0] }))
                        .toSorted((a, b) => a.usage.value - b.usage.value)

                    const electricalUsage = groupBy(electricalUsages, o => o.month)
                        .map(month => ({ month: month.key, usage: month.value.reduce((acc, val) => val.usage.combine(acc), [] as Array<MeasuredValue>)[0] }))
                        .toSorted((a, b) => a.usage.value - b.usage.value);

                    const summaryUsage: UserUsageSummary = {
                        highestElectrical: electricalUsage[electricalUsage.length - 1].usage,
                        highestGas: gasUsage.length ? gasUsage[gasUsage.length - 1].usage : new MeasuredValue(0, 'CCF'),
                        lowestElectrical: electricalUsage[0].usage,
                        lowestGas: gasUsage.length ? gasUsage[0].usage : new MeasuredValue(0, 'CCF')
                    };
                    const newScenario = computeScenario("Electrified", year(), summaryUsage, directUses);
                    setAlternativeScenarios(alternativeScenarios().concat([newScenario]));
                    setShowNewConverter(false);

                }}>Create new scenario</button>
        </ div>;
    }
}

function computeScenario(scenarioName: string, year: number, summaryUsage: UserUsageSummary, directUses: Array<IDirectUsageBasedCharge>) {
    const gasFlatCharges: Array<IFlatCharge> = [
        new AglBaseCharge(year, false, true, summaryUsage),
        new GasMarketerFee(year)
    ];

    const gasIndirectCharges: Array<IIndirectUsageBasedCharge> = [
    ];

    const gasBaseScenario = new EnergyScenario(
        "Gas",
        'therm',
        directUses,
        gasIndirectCharges,
        gasFlatCharges,
        gasRateSchedule()
    );

    const electricalFlatCharges: Array<IFlatCharge> = [
        new GeorgiaPowerBaseFee(year)
    ];

    const electricalIndirectUses: Array<IIndirectUsageBasedCharge> = [
        new GeorgiaPowerEnvironmentalFee(year),
        new GeorgiaPowerFranchiseFee(year, true),
        new FuelRecoveryRider(year),
        new DemandSideManagementResidentialRider(year)
    ];

    const electricalBaseScenario = new EnergyScenario(
        "Electrical",
        'kWh',
        directUses,
        electricalIndirectUses,
        electricalFlatCharges,
        getElectricalRateSchedules(year)
    );

    const id = createGuid();

    const combined = new CombinedEnergyScenario(id, scenarioName, [gasBaseScenario, electricalBaseScenario], () => setAlternativeScenarios(alternativeScenarios().filter(o => o.id != id)));
    return combined;
}

const scenarios = createMemo<Component>(() => {
    const summaryUsage = summaryUsagePart.baselineSummaryUsage();

    const directUses: Array<IDirectUsageBasedCharge> = [
        new ElectricalAirHeatPump(year(), summaryUsage),
        new OtherHouseholdElectricalUsage(summaryUsage),
        new GasFurnace(year(), summaryUsage),
        new GasWaterHeater(year(), summaryUsage, baselineSinks().filter(o => o.selected).map(o => o.id)),
        new AirConditioner(year(), summaryUsage),
        new DualFuelAirHeatPump(year(), summaryUsage),
        new HybridAirHeatPump(year(), summaryUsage)
    ]
        .filter(o => baselineSinks().filter(s => s.selected).map(s => s.id).includes(o.id));

    const combinedBaseline = computeScenario("Before", year(), summaryUsagePart.baselineSummaryUsage(), directUses);

    return (props) => <div class="scenarios">
        <div class="flex-column">
            {combinedBaseline.render(props)}
            <button class="start-conversion" onclick={setShowNewConverter}>Electrify</button>
        </div>
        {alternativeScenarios().map(o => o.render(props))}
        <Show when={showNewConverter()}>
            {combinedBaseline.startConversion(props)}
        </Show>
    </div>
});

const EnergyCalculator: Component = (props) => {

    return (
        <>
            <h1>Home Energy Use Calculator</h1>
            <p>
                This process will estimate what your current gas and electrical usage is. Then allow you to change out the gas appliances for more efficient alternatives. You'll be able to compare the cost between these scenarios for the same time period.
            </p>
            <p>
                This assumes you're on the Georgia Power <a href="https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/">Residential Service</a> plan.
            </p>
            <h2>What are your current gas appliances?</h2>
            <small>Not all of these work yet</small>
            {baselineSinksComponent()}
            <h2>What is your current utility usage?</h2>
            <summaryUsagePart.SummaryUsage />
            {gasRatesComponent()}
            {scenarios()}
        </>
    );
};

export { EnergyCalculator };
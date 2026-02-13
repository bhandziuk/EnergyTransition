import { Component, createEffect, createMemo, createSignal, onMount, Show } from "solid-js";
import { IDirectUsageBasedCharge, EnergyScenario, GeorgiaPowerEnvironmentalFee, GeorgiaPowerFranchiseFee, ElectricalAirHeatPump, GasWaterHeater, GasFurnace, IIndirectUsageBasedCharge, OtherHouseholdElectricalUsage, FuelRecoveryRider, RateSchedule, DemandSideManagementResidentialRider, MeasuredValue, DualFuelAirHeatPump, ElectricalResistiveWaterHeater, Sinks, AirConditioner, getElectricalRateSchedules, HybridAirHeatPump, HeatPumpWaterHeater, GeorgiaPowerBaseFee, GasFireplace, GasCooktop, GasGrill, ElectricCooktop, WoodFireplace } from "../energy";
import { createGuid, groupBy, NumberFormats } from "../helpers";
import { summaryUsage, UserUsageSummary } from "../components";
import { AglBaseCharge, GasMarketerFee, IFlatCharge } from "../costs";
import { setInputElementValue } from "./NumberInput";
import { NothingSink } from "../energy/sinks/other/NothingSink";

const dollars = NumberFormats.dollarsFormat().format;

const year = createMemo(() => 2025);

const summaryUsagePart = summaryUsage();

export const sinkNames = {
    [Sinks.hybrid.dualFuelAirHeatPump]: DualFuelAirHeatPump.displayName,
    [Sinks.electric.electricalAirHeatPump]: ElectricalAirHeatPump.displayName,
    [Sinks.electric.electricalResistiveWaterHeater]: ElectricalResistiveWaterHeater.displayName,
    [Sinks.gas.gasFurnace]: GasFurnace.displayName,
    [Sinks.gas.gasWaterHeater]: GasWaterHeater.displayName,
    [Sinks.gas.gasCooktop]: GasCooktop.displayName,
    // [Sinks.gas.gasDryer]: GasDryer.displayName,
    [Sinks.gas.gasGrill]: GasGrill.displayName,
    [Sinks.gas.gasFireplace]: GasFireplace.displayName,
    [Sinks.electric.otherHouseholdElectricalUsage]: OtherHouseholdElectricalUsage.displayName,
    [Sinks.electric.airConditioner]: AirConditioner.displayName,
    [Sinks.electric.hybridAirHeatPump]: HybridAirHeatPump.displayName,
    [Sinks.electric.electricalAirHeatPump]: ElectricalAirHeatPump.displayName,
    [Sinks.electric.heatPumpWaterHeater]: HeatPumpWaterHeater.displayName,
    [Sinks.electric.electricCooktop]: ElectricCooktop.displayName,
    // [Sinks.gasDryer]: gasDryer.displayName,
    [Sinks.gas.gasGrill]: GasGrill.displayName,
    [Sinks.electric.electricalResistiveWaterHeater]: ElectricalResistiveWaterHeater.displayName,
    [Sinks.other.nothing]: NothingSink.displayName,
    [Sinks.other.woodFireplace]: WoodFireplace.displayName,
}

export const sinkPurposes = {
    [Sinks.hybrid.dualFuelAirHeatPump]: DualFuelAirHeatPump.purpose,
    [Sinks.electric.electricalAirHeatPump]: ElectricalAirHeatPump.purpose,
    [Sinks.electric.electricalResistiveWaterHeater]: ElectricalResistiveWaterHeater.purpose,
    [Sinks.gas.gasFurnace]: GasFurnace.purpose,
    [Sinks.gas.gasWaterHeater]: GasWaterHeater.purpose,
    [Sinks.gas.gasCooktop]: GasCooktop.purpose,
    //[Sinks.gas.gasDryer]: GasDryer.purpose,
    [Sinks.gas.gasGrill]: GasGrill.purpose,
    [Sinks.gas.gasFireplace]: GasFireplace.purpose,
    [Sinks.electric.otherHouseholdElectricalUsage]: OtherHouseholdElectricalUsage.purpose,
    [Sinks.electric.airConditioner]: AirConditioner.purpose,
    [Sinks.electric.hybridAirHeatPump]: HybridAirHeatPump.purpose,
    [Sinks.electric.electricalAirHeatPump]: ElectricalAirHeatPump.purpose,
    [Sinks.electric.heatPumpWaterHeater]: HeatPumpWaterHeater.purpose,
    [Sinks.electric.electricCooktop]: ElectricCooktop.purpose,
    // [Sinks.gasDryer]: gasDryer.purpose,
    [Sinks.gas.gasGrill]: GasGrill.purpose,
    [Sinks.electric.electricalResistiveWaterHeater]: ElectricalResistiveWaterHeater.purpose,
}

const initialBaselineSinks = [
    { id: Sinks.hybrid.dualFuelAirHeatPump, selected: false, required: false },
    { id: Sinks.gas.gasFurnace, selected: true, required: false },
    { id: Sinks.gas.gasWaterHeater, selected: true, required: false },
    { id: Sinks.gas.gasCooktop, selected: false, required: false },
    //{ id: Sinks.gas.gasDryer, selected: false, required: false },
    { id: Sinks.gas.gasGrill, selected: false, required: false },
    { id: Sinks.gas.gasFireplace, selected: false, required: false },
    { id: Sinks.electric.otherHouseholdElectricalUsage, selected: true, required: true }, // todo this should be forcefully added later (i.e. cannot be unchecked)
    { id: Sinks.electric.airConditioner, selected: true, required: true },
    { id: Sinks.electric.hybridAirHeatPump, selected: false, required: false },
    { id: Sinks.electric.electricalAirHeatPump, selected: false, required: false },
    // { id: Sinks.gasDryer, selected: false, required: false },
    // { id: Sinks.gasGrill, selected: false, required: false },
    { id: Sinks.electric.electricalResistiveWaterHeater, selected: false, required: false },
];

const [baselineSinks, setBaselineSinks] = createSignal(initialBaselineSinks);

const baselineSinksComponent = () => <>
    {groupBy(baselineSinks().filter(o => !o.required), o => sinkPurposes[o.id])
        .toSorted((a, b) => b.key.localeCompare(a.key))
        .map(o => <>
            <div>{o.key}</div>
            <ul>
                {o.value
                    .toSorted((a, b) => sinkNames[a.id].localeCompare(sinkNames[b.id]))
                    .map(sink =>
                        <li class="no-marker">
                            <input type="checkbox"
                                id={sink.id}
                                checked={sink.selected}
                                disabled={sink.required}
                                oninput={e => setBaselineSinks(baselineSinks().filter(o => o.id != sink.id).concat([{ id: sink.id, selected: e.target.checked, required: sink.required }]))} />
                            <label for={sink.id}>{sinkNames[sink.id]}</label>
                        </li>
                    )}
            </ul>
        </>)}
</>


class CombinedEnergyScenario {

    constructor(public id: string, public scenarioName: string, private parts: Array<EnergyScenario>, private removeSelf: () => void) {

    }

    public render: Component<{ baselineCost: number }> = (props) => {

        return <div class="scenario-breakdown">
            <div class={"scenario-header " + (this.id == baselineScenarioId ? 'baseline' : 'alternative')}>
                <h2 class="scenario-name">{this.scenarioName}
                </h2>
                <Show when={this.id != baselineScenarioId}><button onclick={this.removeSelf}>Remove</button></Show>
                <Show when={this.id == baselineScenarioId}><button class="start-conversion" onclick={setShowNewConverter}>Add electrification scenario</button></Show>
            </div>
            {this.parts.map(part => part.render(props))}
            {
                <div class="charge-row total">
                    <div class="source"><h3>Total annual cost</h3></div>
                    <Show when={this.id != baselineScenarioId}>
                        <div class={"usage bold " + (props.baselineCost > this.totalCost() ? 'better-cost' : props.baselineCost < this.totalCost() ? 'worse-cost' : '')}>
                            {(props.baselineCost > this.totalCost() ? 'Savings: ' : 'Additional cost: ') + dollars(Math.abs(this.totalCost() - props.baselineCost))}
                        </div>
                    </Show>
                    <div class={"cost bold " + (props.baselineCost > this.totalCost() ? 'better-cost' : props.baselineCost < this.totalCost() ? 'worse-cost' : '')}>
                        {dollars(this.totalCost())}
                    </div>
                </div>
            }
        </div >
    }

    public totalCost = () => this.parts.map(part => part.cost()).reduce((acc, val) => acc + val, 0);

    private conversions = createSignal<{ [from: string]: string }>({});

    public startConversion: Component = (props) => {
        const convertibles = [...new Set(this.parts.flatMap(o => o.convertibles()))]
            .map(o => Object.assign({},
                o,
                {
                    canConvertToDetails: o.canConvertTo
                        .map((c, index) => ({ name: c == o.id ? 'Keep as-is' : sinkNames[c], ordinal: c == o.id ? -1 : index, id: c }))
                        .toSorted((a, b) => a.ordinal - b.ordinal)
                }
            ));

        this.conversions[1](convertibles.map(o => o.id).reduce((a, v) => ({ ...a, [v]: v }), {}));

        let div: any;
        onMount(() => {
            if (div instanceof HTMLDivElement) {
                div.scrollIntoView({ behavior: "smooth" });
            }
        });

        return <div class="scenario-breakdown" ref={div}>
            {convertibles
                .map(o => <div>
                    <span id={o.id}>Convert your <span class="bold">{o.displayName}</span> to:</span>
                    <ul class="no-marker">{o.canConvertToDetails.map(c => <li>
                        <input
                            type="checkbox"
                            id={o.id + c.id}
                            checked={this.conversions[0]()[o.id] == c.id}
                            oninput={(e) => this.conversions[1](Object.assign({}, this.conversions[0](), { [o.id]: this.conversions[0]()[o.id] == c.id ? o.id : c.id }))}
                        ></input>
                        <label for={o.id + c.id}>{c.name}</label>
                    </li>)}
                    </ul>
                </div>)
            }
            {/* <div>
                {convertibles
                    .filter(o => this.conversions[0]()[o.id])
                    .map(o => <div>{o.displayName + ' ➞ ' + sinkNames[this.conversions[0]()[o.id]]}</div>)}
            </div> */}
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
                    const id = createGuid();

                    const newScenario = computeScenario(id, "Electrified alternative " + (alternativeScenarios().length + 1), year(), summaryUsage, directUses);
                    setAlternativeScenarios(alternativeScenarios().concat([newScenario]));
                    setShowNewConverter(false);

                }}>Create new scenario</button>
        </ div>;
    }
}

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
        What was your <a href="https://www.georgiagassavings.com/natural-gas-rates" rel='noopener noreferrer' target='_blank'>contracted gas rate</a> for {year()}?
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


function computeScenario(id: string, scenarioName: string, year: number, summaryUsage: UserUsageSummary, directUses: Array<IDirectUsageBasedCharge>) {
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
        gasRateSchedule
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
        () => getElectricalRateSchedules(year)
    );

    const combined = new CombinedEnergyScenario(id, scenarioName, [gasBaseScenario, electricalBaseScenario], () => setAlternativeScenarios(alternativeScenarios().filter(o => o.id != id)));
    return combined;
}

export const baselineScenarioId = '47f95d21-94e0-40a8-80e4-efd3eb75b3ae';

const scenarios = createMemo<Component>(() => {
    const summaryUsage = summaryUsagePart.baselineSummaryUsage();

    const directUses: Array<IDirectUsageBasedCharge> = [
        new ElectricalAirHeatPump(year(), summaryUsage),
        new OtherHouseholdElectricalUsage(summaryUsage),
        new GasFurnace(year(), summaryUsage),
        new GasWaterHeater(year(), summaryUsage, baselineSinks().filter(o => o.selected).map(o => o.id)),
        new AirConditioner(year(), summaryUsage),
        new DualFuelAirHeatPump(year(), summaryUsage),
        new HybridAirHeatPump(year(), summaryUsage),
        new GasGrill(year(), summaryUsage, baselineSinks().filter(o => o.selected).map(o => o.id)),
        new GasFireplace(year(), summaryUsage, baselineSinks().filter(o => o.selected).map(o => o.id)),
        // new GasDryer(year(), summaryUsage, baselineSinks().filter(o => o.selected).map(o => o.id)),
        new GasCooktop(year(), summaryUsage, baselineSinks().filter(o => o.selected).map(o => o.id)),
    ]
        .filter(o => baselineSinks().filter(s => s.selected).map(s => s.id).includes(o.id));

    const combinedBaseline = computeScenario(baselineScenarioId, year() + ' energy usage', year(), summaryUsagePart.baselineSummaryUsage(), directUses);

    return (props) => <div class="scenarios">
        {combinedBaseline.render({ baselineCost: combinedBaseline.totalCost() })}
        {alternativeScenarios().map(o => o.render({ baselineCost: combinedBaseline.totalCost() }))}
        <Show when={showNewConverter()}>
            {combinedBaseline.startConversion(props)}
        </Show>
    </div>
});

const EnergyCalculator: Component = (props) => {

    return (
        <>
            <div class="initial-info">
                <h1>Home Energy Use Calculator</h1>
                <p>
                    This process will estimate what your current gas and electrical usage is. Then allow you to change out the gas appliances for more efficient alternatives. You'll be able to compare the cost between these scenarios for the same time period.
                </p>
                <p>
                    This assumes you're on the Georgia Power <a href="https://psc.ga.gov/utilities/electric/georgia-power-bill-calculator/" rel='noopener noreferrer' target='_blank'>Residential Service</a> plan.
                </p>
                <h2>What are your current household appliances?</h2>
                <small>Not all of these work yet</small>
                {baselineSinksComponent()}
                <h2>What was your {year()} utility usage?</h2>
                <summaryUsagePart.SummaryUsage />
                {gasRatesComponent()}
            </div>
            {scenarios()}
        </>
    );
};


export { EnergyCalculator };
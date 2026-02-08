import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { dddc, DddcCalculator } from "./DddcCalculator";
import { IDirectUsageBasedCharge, AglBaseCharge, EnergyScenario, IFlatCharge, GasMarketerFee, GeorgiaPowerEnvironmentalFee, GeorgiaPowerFranchiseFee, ElectricalAirHeatPump, GasWaterHeater, GasFurnace, IIndirectUsageBasedCharge, OtherHouseholdElectricalUsage, FuelRecoveryRider, RateSchedule, DemandSideManagementResidentialRider, MeasuredValue, DualFuelAirHeatPump, ElectricalResistiveWaterHeater, Sinks } from "../energy";
import { NumberFormats } from "../helpers";
import { AirConditioner } from "../energy/sinks/AirConditioner";

const dollars = NumberFormats.dollarsFormat().format;

const year = createMemo(() => 2025);

const electricalSpaceHeating = createMemo(() => new MeasuredValue(250, "kWh"));
const otherHouseholdElectricalUsage = createMemo(() => new MeasuredValue(10896, "kWh"));

const totalElectricalUsage = createMemo(() => electricalSpaceHeating().combine([otherHouseholdElectricalUsage()]));

const sinkNames = {
    [Sinks.dualFuelAirHeatPump]: DualFuelAirHeatPump.displayName,
    [Sinks.electricalAirHeatPump]: ElectricalAirHeatPump.displayName,
    [Sinks.electricalResistiveWaterHeater]: ElectricalResistiveWaterHeater.displayName,
    [Sinks.gasFurnace]: GasFurnace.displayName,
    [Sinks.gasWaterHeater]: GasWaterHeater.displayName,
    [Sinks.otherHouseholdElectricalUsage]: OtherHouseholdElectricalUsage.displayName,
    [Sinks.airConditioner]: AirConditioner.displayName,
    // [Sinks.hybridHeatPump]: HybridHeatPump.displayName,
}

const initialBaselineSinks = [
    { id: Sinks.dualFuelAirHeatPump, selected: false },
    { id: Sinks.gasFurnace, selected: true },
    { id: Sinks.gasWaterHeater, selected: true },
    { id: Sinks.otherHouseholdElectricalUsage, selected: true }, // todo this should be forcefully added later (i.e. cannot be unchecked)
    { id: Sinks.airConditioner, selected: true }
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

export interface UserUsageSummary {
    highestElectrical: MeasuredValue;
    lowestElectrical: MeasuredValue;
    highestGas: MeasuredValue;
    lowestGas: MeasuredValue;
}

const initialBaselineSummaryUsage: UserUsageSummary = {
    highestElectrical: new MeasuredValue(1660, 'kWh'),
    lowestElectrical: new MeasuredValue(600, 'kWh'),
    highestGas: new MeasuredValue(107, 'CCF'),
    lowestGas: new MeasuredValue(12, 'CCF'),
}

const [baselineSummaryUsage, setBaselineSummaryUsage] = createSignal(initialBaselineSummaryUsage);

// ask user for highest/lowest CCF/kWh
const baselineUsageComponent = () => <>
</>

// TODO put in a .json file linked to the year
const georgiaPowerRateSchedule = [
    new RateSchedule("Summer rate schedule", [6, 7, 8, 9], [
        { name: '1st tier, up to 650 kWh', rate: 0.086121, limitUom: 'kWh', upperLimit: 650 },
        { name: '2nd tier, next 350 kWh', rate: 0.143047, limitUom: 'kWh', upperLimit: 1000 },
        { name: '3rd tier, over 1000 kWh', rate: 0.148051, limitUom: 'kWh', upperLimit: Number.MAX_SAFE_INTEGER },
    ]),
    new RateSchedule("Winter rate schedule", [1, 2, 3, 4, 5, 10, 11, 12], [
        { name: 'All usage', rate: 0.080602, limitUom: 'kWh', upperLimit: Number.MAX_SAFE_INTEGER },
    ])
];

const gasRateSchedule = [
    new RateSchedule("Gas Rates", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [
        { name: "Constant", rate: 0.75, limitUom: 'therm', upperLimit: Number.MAX_SAFE_INTEGER }
    ])
];

class CombinedEnergyScenario {

    constructor(private scenarioName: string, private parts: Array<EnergyScenario>) {

    }

    public render: Component = (props) => <div class="scenario-breakdown">
        <h2>{this.scenarioName}</h2>
        {this.parts.map(part => part.render(props))}
        {
            <div class="charge-row">
                <div class="source"><h3>Total Cost</h3></div>
                <div class="cost bold">{dollars(this.parts.map(part => part.cost()).reduce((acc, val) => acc + val, 0))}</div>
            </div>
        }
    </div>
}

const baseline = createMemo(() => {
    const gasFlatCharges: Array<IFlatCharge> = [
        new AglBaseCharge(dddc(), year(), false, true),
        new GasMarketerFee(year())
    ];

    const directUses: Array<IDirectUsageBasedCharge> = [
        // new ElectricalHeatPump(year(),  electricalSpaceHeating()),
        new OtherHouseholdElectricalUsage(baselineSummaryUsage()),
        new GasFurnace(year(), baselineSummaryUsage()),
        new GasWaterHeater(year(), baselineSummaryUsage(), baselineSinks().filter(o => o.selected).map(o => o.id)),
        new AirConditioner(year(), baselineSummaryUsage()),
        // new DualFuelHeatPump(year(),  [new MeasuredValue(255, 'therm'), new MeasuredValue(120, 'kWh')])
    ]
        .filter(o => baselineSinks().filter(s => s.selected).map(s => s.id).includes(o.id));

    const gasIndirectCharges: Array<IIndirectUsageBasedCharge> = [
    ];

    const gasBaseScenario = new EnergyScenario("Gas", 'therm', directUses, gasIndirectCharges, gasFlatCharges, gasRateSchedule);

    const electricalFlatCharges: Array<IFlatCharge> = [

    ];

    const electricalIndirectUses: Array<IIndirectUsageBasedCharge> = [
        new GeorgiaPowerEnvironmentalFee(year()),
        new GeorgiaPowerFranchiseFee(year(), true),
        new FuelRecoveryRider(year()),
        new DemandSideManagementResidentialRider(year())
    ];

    const electricalBaseScenario = new EnergyScenario("Electrical", 'kWh', directUses, electricalIndirectUses, electricalFlatCharges, georgiaPowerRateSchedule);

    return new CombinedEnergyScenario("Before", [gasBaseScenario, electricalBaseScenario]);
});

const EnergyCalculator: Component = (props) => {

    return (
        <>
            <h1>Home Energy Use Calculator</h1>
            <h2>What are your current gas appliances?</h2>
            {baselineSinksComponent()}
            <Show when={baselineSinks().some(o => o.selected)}>
                <h2>DDDC Calculation</h2>
                <DddcCalculator></DddcCalculator>
            </Show>
            {baseline().render(props)}
        </>
    );
};

export { EnergyCalculator };
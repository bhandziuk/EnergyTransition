import { Component, createMemo } from "solid-js";
import { dddc, DddcCalculator } from "./DddcCalculator";
import { UsageBasedCharge, AglBaseCharge, ElectricalEnergyScenario, EnergyScenario, FlatCharge, GasEnergyScenario, GasMarketerFee, GasFurnace, GasWaterHeater, GeorgiaPowerEnvironmentalFee, GeorgiaPowerFranchiseFee, ElectricalHeatPump } from "../energy";
import { NumberFormats } from "../helpers/NumbersFormats";

const dollars = NumberFormats.dollarsFormat().format;

const year = createMemo(() => 2025);

const gasRate = createMemo(() => 0.75); // $/therm
const electricalRate = createMemo(() => 0.1643); // $/kWh

const electricalSpaceHeating = createMemo(() => 10896); // kWh
const totalElectricalUsage = createMemo(() => electricalSpaceHeating());// kWh

class CombinedEnergyScenario {

    constructor(private scenarioName: string, private parts: Array<EnergyScenario>) {

    }

    public render: Component = (props) => <>
        <h2>{this.scenarioName}</h2>
        {this.parts.map(part => part.render(props))}
        {
            <div class="charge-row">
                <div class="source"><h3>Total Cost</h3></div>
                <div class="cost">{dollars(this.parts.map(part => part.cost()).reduce((acc, val) => acc + val, 0))}</div>
            </div>
        }
    </>
}

const baseline = createMemo(() => {
    const gasFlatCharges: Array<FlatCharge> = [
        new AglBaseCharge(dddc(), year(), false, true),
        new GasMarketerFee(year())
    ];
    const gasUses: Array<UsageBasedCharge> = [
        new GasFurnace(0.9, 276, gasRate()),
        new GasWaterHeater(1, 144, gasRate())
    ];

    const gasBaseScenario = new GasEnergyScenario(gasUses, gasFlatCharges);

    const electricalFlatCharges: Array<FlatCharge> = [

    ];
    const electricalUses: Array<UsageBasedCharge> = [
        new GeorgiaPowerEnvironmentalFee(year(), totalElectricalUsage()),
        new GeorgiaPowerFranchiseFee(year(), totalElectricalUsage()),
        new ElectricalHeatPump(year(), 0.9, electricalSpaceHeating(), electricalRate())
    ];

    const electricalBaseScenario = new ElectricalEnergyScenario(electricalUses, electricalFlatCharges);

    return new CombinedEnergyScenario("Before", [gasBaseScenario, electricalBaseScenario]);
});



const EnergyCalculator: Component = (props) => {

    return (
        <>
            <h1>Home Energy Use Calculator</h1>
            <h2>DDDC Calculation</h2>
            <DddcCalculator></DddcCalculator>
            {baseline().render(props)}
        </>
    );
};

export { EnergyCalculator };
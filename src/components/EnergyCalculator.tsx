import { Component, createMemo } from "solid-js";
import { dddc, DddcCalculator } from "./DddcCalculator";
import { UsageBasedCharge, AglBaseCharge, ElectricalEnergyScenario, EnergyScenario, FlatCharge, GasEnergyScenario, GasMarketerFee } from "../energy";

const year = createMemo(() => 2025);


class CombinedEnergyScenario {

    constructor(private scenarioName: string, private parts: Array<EnergyScenario>) {

    }

    public render: Component = (props) => <>
        <label>{this.scenarioName}</label>
        {this.parts.map(part => part.render(props))}
    </>
}

const baseline = createMemo(() => {
    const gasFlatCharges: Array<FlatCharge> = [
        new AglBaseCharge(dddc(), year(), false, true),
        new GasMarketerFee(year())
    ];
    const gasUses: Array<UsageBasedCharge> = [

    ];

    const gasBaseScenario = new GasEnergyScenario(gasUses, gasFlatCharges);

    const electricalFlatCharges: Array<FlatCharge> = [

    ];
    const electricalUses: Array<UsageBasedCharge> = [

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
            <h2>Baseline</h2>
            {baseline().render(props)}
        </>
    );
};

export { EnergyCalculator };
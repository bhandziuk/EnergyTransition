import { Component, createEffect, createMemo } from "solid-js";
import { dddc, DddcCalculator } from "./DddcCalculator";
import { IDirectUsageBasedCharge, AglBaseCharge, EnergyScenario, IFlatCharge, GasMarketerFee, GeorgiaPowerEnvironmentalFee, GeorgiaPowerFranchiseFee, ElectricalHeatPump, GasWaterHeater, GasFurnace, IIndirectUsageBasedCharge, OtherHouseholdElectricalUsage, FuelRecoveryRider, RateSchedule, DemandSideManagementResidentialRider, MeasuredValue, DualFuelHeatPump } from "../energy";
import { NumberFormats } from "../helpers";

const dollars = NumberFormats.dollarsFormat().format;

const year = createMemo(() => 2025);

const electricalSpaceHeating = createMemo(() => new MeasuredValue(250, "kWh"));
const otherHouseholdElectricalUsage = createMemo(() => new MeasuredValue(10896, "kWh"));

const totalElectricalUsage = createMemo(() => electricalSpaceHeating().combine([otherHouseholdElectricalUsage()]));

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

const baselineParameters = createEffect(() => {


});

const baseline = createMemo(() => {
    const gasFlatCharges: Array<IFlatCharge> = [
        new AglBaseCharge(dddc(), year(), false, true),
        new GasMarketerFee(year())
    ];

    const directUses: Array<IDirectUsageBasedCharge> = [
        new ElectricalHeatPump(year(), 0.9, electricalSpaceHeating()),
        new OtherHouseholdElectricalUsage(otherHouseholdElectricalUsage()),
        new GasFurnace(0.9, new MeasuredValue(276, 'therm')),
        new GasWaterHeater(1, new MeasuredValue(144, 'therm')),
        new DualFuelHeatPump(year(), 0.9, [new MeasuredValue(255, 'therm'), new MeasuredValue(120, 'kWh')])
    ];

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
            <h2>DDDC Calculation</h2>
            <DddcCalculator></DddcCalculator>
            {baseline().render(props)}
        </>
    );
};

export { EnergyCalculator };
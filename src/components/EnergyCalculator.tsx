import { Component, createMemo } from "solid-js";
import { dddc, DddcCalculator } from "./DddcCalculator";
import { DirectUsageBasedCharge, AglBaseCharge, EnergyScenario, FlatCharge, GasMarketerFee, GeorgiaPowerEnvironmentalFee, GeorgiaPowerFranchiseFee, ElectricalHeatPump, GasWaterHeater, GasFurnace, IndirectUsageBasedCharge, OtherHouseholdElectricalUsage, FuelRecoveryRider, RateSchedule, DemandSideManagementResidentialRider } from "../energy";
import { NumberFormats } from "../helpers";

const dollars = NumberFormats.dollarsFormat().format;

const year = createMemo(() => 2025);

const electricalSpaceHeating = createMemo(() => 250); // kWh
const otherHouseholdElectricalUsage = createMemo(() => 10896); // kWh
const totalElectricalUsage = createMemo(() => electricalSpaceHeating() + otherHouseholdElectricalUsage());// kWh

const georgiaPowerRateSchedule = [
    new RateSchedule("Summer rate schedule", [6, 7, 8, 9], [
        { name: '1st tier, up to 650 kWh', rate: 0.086121, limitUom: 'kWh', upperLimit: 650 },
        { name: '2nd tier, next 350 kWh', rate: 0.143047, limitUom: 'kWh', upperLimit: 1000 },
        { name: '3rd tier, over 1000 kWh', rate: 0.148051, limitUom: 'kWh', upperLimit: 100000 },
    ]),
    new RateSchedule("Winter rate schedule", [1, 2, 3, 4, 5, 10, 11, 12], [
        { name: 'All usage', rate: 0.080602, limitUom: 'kWh', upperLimit: 100000 },
    ])
];

const gasRateSchedule = [
    new RateSchedule("Gas Rates", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [
        { name: "Constant", rate: 0.75, limitUom: 'therm', upperLimit: 100000 }
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
                <div class="cost">{dollars(this.parts.map(part => part.cost()).reduce((acc, val) => acc + val, 0))}</div>
            </div>
        }
    </div>
}

const baseline = createMemo(() => {
    const gasFlatCharges: Array<FlatCharge> = [
        new AglBaseCharge(dddc(), year(), false, true),
        new GasMarketerFee(year())
    ];
    const gasUses: Array<DirectUsageBasedCharge> = [
        new GasFurnace(0.9, 276),
        new GasWaterHeater(1, 144)
    ];

    const gasIndirectCharges: Array<IndirectUsageBasedCharge> = [
    ];

    const gasBaseScenario = new EnergyScenario("Gas", gasUses, gasIndirectCharges, gasFlatCharges, gasRateSchedule);

    const electricalFlatCharges: Array<FlatCharge> = [

    ];

    const electricalDirectUses: Array<DirectUsageBasedCharge> = [
        new ElectricalHeatPump(year(), 0.9, electricalSpaceHeating()),
        new OtherHouseholdElectricalUsage(otherHouseholdElectricalUsage())
    ];

    const electricalIndirectUses: Array<IndirectUsageBasedCharge> = [
        new GeorgiaPowerEnvironmentalFee(year()),
        new GeorgiaPowerFranchiseFee(year(), true),
        new FuelRecoveryRider(year()),
        new DemandSideManagementResidentialRider(year())
    ];

    const electricalBaseScenario = new EnergyScenario("Electrical", electricalDirectUses, electricalIndirectUses, electricalFlatCharges, georgiaPowerRateSchedule);

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
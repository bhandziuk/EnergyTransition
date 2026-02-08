
export * from './DualFuelHeatPump';
export * from './ElectricalHeatPump';
export * from './ElectricalResistiveWaterHeater';
export * from './GasFurnace';
export * from './GasWaterHeater';
export * from './OtherHouseholdElectricalUsage';


export const Sinks = {
    dualFuelHeatPump: '882532f9-ea89-433d-9b38-6ab32790a986',
    electricalHeatPump: '2a78b2c2-a644-43bf-9b3d-e000c6f3214e',
    hybridHeatPump: 'b63284eb-6742-43ed-a142-f752c9ccc073',
    electricalResistiveWaterHeater: '148b4bba-e80a-4b1e-a6ba-c3c7a3aa86e8',
    gasFurnace: '49fd4c24-0848-49ab-9280-0cefa146c826',
    gasWaterHeater: '76c13918-3e80-4644-8197-da8b6e8eeb2c',
    gasDryer: '0b758537-dc18-4c71-9af7-53bc38586b49',
    gasCooktop: 'b9211302-7c02-4823-84ec-719700d4f4a7',
    gasGrill: '89b0600a-332c-4d26-93bf-8ec1a3077ac3',
    otherHouseholdElectricalUsage: 'bcd7355f-c246-4720-981b-d361058ec9ce',
}

export const possibleGasAppliancesInUseInLowestMonth = [
    { sink: Sinks.gasDryer, weight: 1 },
    { sink: Sinks.gasCooktop, weight: 1 },
    { sink: Sinks.gasGrill, weight: 1 },
    { sink: Sinks.gasWaterHeater, weight: 1 }
];
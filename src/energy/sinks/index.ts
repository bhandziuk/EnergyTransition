
export * from './electric';
export * from './gas';
export * from './hybrid';
export * from './IProportionUse';
export * from './other';

export const Sinks = {
    gas: {
        gasFurnace: '49fd4c24-0848-49ab-9280-0cefa146c826',
        gasWaterHeater: '76c13918-3e80-4644-8197-da8b6e8eeb2c',
        gasDryer: '0b758537-dc18-4c71-9af7-53bc38586b49',
        gasCooktop: 'b9211302-7c02-4823-84ec-719700d4f4a7',
        gasGrill: '89b0600a-332c-4d26-93bf-8ec1a3077ac3',
        gasFireplace: '887caf5a-eac4-470f-a15b-9c9e938717d8',
    },
    electric: {
        airConditioner: 'c6bb8859-82f6-4ecc-8cfb-6f281a108385',
        electricalAirHeatPump: '2a78b2c2-a644-43bf-9b3d-e000c6f3214e',
        electricalResistiveWaterHeater: '148b4bba-e80a-4b1e-a6ba-c3c7a3aa86e8',
        electricCooktop: '7208accd-93ed-4782-97c0-c26ed40bd887',
        heatPumpWaterHeater: '38e8adc3-b96f-49dd-b7d0-21c5534fcbb7',
        hybridAirHeatPump: 'b63284eb-6742-43ed-a142-f752c9ccc073',
        otherHouseholdElectricalUsage: 'bcd7355f-c246-4720-981b-d361058ec9ce',
    },
    hybrid: {
        dualFuelAirHeatPump: '882532f9-ea89-433d-9b38-6ab32790a986',
    },
    other: {
        woodFireplace: '883ee83b-fd1b-4753-a8dc-bef11ea7948a',
        nothing: '0eddff1e-7c50-47b5-b98d-f6d0bd626050'
    }
}

export const possibleGasAppliancesInUseInLowestMonth = [
    { sink: Sinks.gas.gasDryer, weight: 1 },
    { sink: Sinks.gas.gasCooktop, weight: 2 },
    { sink: Sinks.gas.gasGrill, weight: 0.5 },
    { sink: Sinks.gas.gasWaterHeater, weight: 10 },
    { sink: Sinks.gas.gasFireplace, weight: 0 }
];


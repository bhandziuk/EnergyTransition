import { Accessor, Component, createMemo, createSignal } from "solid-js";
import { NumberFormats } from "../helpers/NumbersFormats";

const [julyConsumption, setJulyConsumption] = createSignal(12);
const [juneConsumption, setJuneConsumption] = createSignal(12);
const [januaryConsumption, setJanuaryConsumption] = createSignal(32);

const numberFormat = NumberFormats.integersFormat().format;

export function calculateDddc(june_ccf: number, july_ccf: number, january_ccf: number, coldestMonthHeatingDegreeDays_degreeDay: number) {
    const baseSummerConsumption_ccf = june_ccf + july_ccf;
    const dailySummerBaseLoad_ccfPerDay = baseSummerConsumption_ccf / 62;   // why 62 and not 61?
    const numberOfDaysInColdestMonth = 31;
    const coldestMonthBaseNonHeatingLoad_ccf = dailySummerBaseLoad_ccfPerDay * numberOfDaysInColdestMonth;
    const coldestMonthHeatSensitiveLoad_ccf = january_ccf - coldestMonthBaseNonHeatingLoad_ccf;

    const heatSensitiveFactor_ccf_per_degreeDay = coldestMonthHeatSensitiveLoad_ccf / coldestMonthHeatingDegreeDays_degreeDay;

    const poolGroupDesignDayFactor = 55; // 55 for Atlanta
    const designDayHeatSensitiveLoad_ccf = heatSensitiveFactor_ccf_per_degreeDay * poolGroupDesignDayFactor;
    const customerDesignDayFactor_ccf = designDayHeatSensitiveLoad_ccf + dailySummerBaseLoad_ccfPerDay;   // these units can't be added together. There's a dimension mismatch.
    const customerDesignDayFactor_mcf = customerDesignDayFactor_ccf / 10;
    const truedUpDesignDayFactor_mcf = customerDesignDayFactor_mcf * 1.1763; // what is this number?
    const finalActualDesignDayFactor = truedUpDesignDayFactor_mcf * 1.025; // what is this number?
    return finalActualDesignDayFactor;
}

const dddc = createMemo(() => {
    return calculateDddc(juneConsumption(), julyConsumption(), januaryConsumption(), 475);
});

const DddcCalculator: Component = (props) => {

    return <>
        <div style='display:grid; grid-template-columns: 1fr 1fr;'>
            < InputField label="June Gas Consumption (CCF)" id="JuneConsumption" model={useModel([juneConsumption, setJuneConsumption])} ></InputField>
            < InputField label="July Gas Consumption (CCF)" id="julyConsumption" model={useModel([julyConsumption, setJulyConsumption])} ></InputField>
            < InputField label="January Gas Consumption (CCF)" id="januaryConsumption" model={useModel([januaryConsumption, setJanuaryConsumption])} ></InputField>
            <label>DDDC</label><span>{numberFormat(dddc())}</span>
        </div>
    </>
}

function useModel<T>(signal: [Accessor<T>, (v: T) => void]): Model<T> {
    const [value, setValue] = signal;
    return { value, setValue };
}


type Model<T> = {
    value: () => T;
    setValue: (v: T) => void;
};


const InputField: Component<{ label: string; model: Model<number>, id: string }> = (props) => {
    return <>
        <label for={props.id}>
            {props.label}
        </label>
        <input
            id={props.id}
            value={props.model.value()}
            onInput={(e) => props.model.setValue(Number(e.currentTarget.value))}
        />
    </>
};



export { DddcCalculator };
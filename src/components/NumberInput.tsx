export function setInputElementValue(setter: (val: number) => void) {
    return (e: InputEvent & { currentTarget: HTMLInputElement }) => {
        const val = e.currentTarget.value;
        const number = parseFloat(val);
        if (number == 0 && val.replace('.', '').split('').every(o => o == '0')) {
            setter(val as any);
        }
        else {
            setter(number);
        }
    }
}
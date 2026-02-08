export function groupBy<T, TKey>(list: Array<T>, keyGetter: (item: T) => TKey) {
    const map = new Map<string, Array<T>>();
    list.forEach((item) => {
        const key = JSON.stringify(keyGetter(item));
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return Array.from(map).map(o => ({ key: <TKey>JSON.parse(o[0]), value: o[1] }));
}
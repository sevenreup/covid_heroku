export const convertArrayToObject = (array: any, key: any) => {
    const initialValue = {};
    return array.reduce((obj: any, item: any) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};

export enum jsontypes {
    geoGson,
    scatter
}
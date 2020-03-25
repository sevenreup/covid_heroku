import { getAllData } from './enpoints/jhu.end';
import Cacher from '../util/cacher';
import crypto from 'crypto';

class JHU {
    public getall = async () => {
        const { status, data } = await getAllData();
        if (status === 200 && data) {
            return data;
        }
    }

    public getGeoJson = async () => {
        const countries = await Cacher.createCountryIndexes();
        const { status, data } = await getAllData();
        if (status === 200 && data) {
            const { locations } = data;

            const dataRaw = locations.map((item: any) => {
                // const hashKey = keys.map(key => item[key] || '').join('_');
                return {
                }
            })

            return dataRaw;
        }
    }

}

export const jhu = new JHU();
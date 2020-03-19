import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { csvParse, DSVRowString } from 'd3-dsv';

export default class Cacher {
    private static IndexedCountPath = path.resolve(__dirname, '../cache/data', 'indexed_countries.json');
    public static writedata(file: string, jsonOBJ: Object) {
        fs.outputFile(path.resolve(__dirname, '../cache/data', file), JSON.stringify(jsonOBJ, null, 2))
            .catch(error => console.log(error));
    }
    public static async createCountryIndexes() {
        let countries_index;

        try {
            countries_index = await fs.readJson(this.IndexedCountPath);
        } catch (error) {
            console.log(error);
            countries_index = await this.getCountryIndex();
        }
        return countries_index;
    }
    private static async getCountryIndex() {
        const countryCodes = await this.initCCode();
        const countries = await this.getCountries();

        const indexesCode = countryCodes.reduce((result: any, item: any) => {
            return Object.assign(result, {
                [item["alpha_3"]]: {
                    alpha2: item["alpha_2"]
                }
            });
        }, {});
        console.log(indexesCode);

        const indexesCount = countries.features.reduce((result: any, item: any) => {
            // console.log(item);

            if (indexesCode[item.id]) {
                let index = indexesCode[item.id].alpha2;
                return Object.assign(result, {
                    [index]: {
                        ...item
                    }
                });
            } else {
                console.log('ass');
                return result;
            }
        }, {});

        await fs.outputFile(this.IndexedCountPath, JSON.stringify(indexesCount, null, 2));

        return indexesCount;
    }
    public static async initCCode() {
        const filename = path.resolve(__dirname, '../cache/data', 'countries_code.json');
        let codes = null;

        try {
            codes = await fs.readJson(filename);
        } catch (error) {
            console.log('here');

            console.log(error);
            const data = await this.getCCode();
            console.log(data);
            fs.outputFile(filename, JSON.stringify(data, null, 2))
            codes = data;
        }
        console.log(codes);
        return codes;
    }
    private static async getCCode() {
        const response = await axios.get('https://raw.githubusercontent.com/datasets/country-codes/master/data/country-codes.csv');
        let data = csvParse(response.data);
        const all = data.map((item: DSVRowString<string>) => {
            return {
                name: item['CLDR display name'],
                alpha_2: item["ISO3166-1-Alpha-2"],
                alpha_3: item["ISO3166-1-Alpha-3"],
                country_code: item["ISO3166-1-numeric"],
                region: item["Region Code"],
                region_code: item["Region Code"],
                sub_region: item["Sub-region Code"],
                sub_region_code: item['Sub-region Code'],
                intermediate_region_code: item["Intermediate Region Code"]
            }
        });
        console.log('here');

        console.log(all);

        return all;
    }
    public static async getCountries() {
        const file = await fs.readFileSync(path.resolve(__dirname, '../cache/data', 'countries.geo.json')).toString();
        return JSON.parse(file);
    }
    public static async writeLayers(filename: string, data: any) {
        fs.outputFile(path.resolve(__dirname, '../cache/layers', filename), JSON.stringify(data, null, 2));
    }
}
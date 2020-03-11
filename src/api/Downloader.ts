// @ts-ignore
import axios from 'axios';
import prepareScrapedData from './unknown/china';
import dayjs from 'dayjs';
import { csvParse, DSVRowString } from 'd3-dsv';
import mergeAll from './unknown/mergeData';


class Downloader {
    sheets = ["Confirmed", "Recovered", "Deaths"]
    public async fetchData() {
        console.log('ded');

        const [conf_req, rec_req, dea_req, china_req] = await Promise.all([
            axios.get(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-${this.sheets[0]}.csv`),
            axios.get(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-${this.sheets[1]}.csv`),
            axios.get(`https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-${this.sheets[2]}.csv`),
            axios.get(`https://ncov.dxy.cn/ncovh5/view/pneumonia`)
        ]);

        const con_raw = this.convertToCsv(conf_req.data);
        const rec_raw = this.convertToCsv(rec_req.data);
        const dea_raw = this.convertToCsv(dea_req.data);
        const china_raw = prepareScrapedData(china_req.data)

        // @ts-ignore
        const [headers_dates_raw, headers_other] = con_raw.columns.reduce((acc: any, cur: any, i: any) => {
            if (!i) acc = [[], []]
            const d = dayjs(cur).format("M/D/YYYY h:mm a")
            if (d === "Invalid Date") acc[1].push(cur)
            else acc[0].push(cur)
            return acc
        }, []);

        const dateHeaders = headers_dates_raw.map((d: any) => dayjs(d).format("M/D/YYYY h:mm a"))

        const confirmed = con_raw.map((d: DSVRowString<string>) => {
            return Object.keys(d).reduce((previous, current) => {
                const isOtherHeader = headers_other.includes(current)
                const asDate = dayjs(current).format("M/D/YYYY h:mm a")
                const isDate = asDate !== "Invalid Date"
                if (isDate && dateHeaders.includes(asDate)) {
                    // @ts-ignore
                    previous[asDate] = parseInt(d[current])
                } else if (isOtherHeader) {
                    // @ts-ignore
                    previous[current] = d[current]
                } else {
                    return previous
                }
                return previous
            }, {});
        });

        const recovered = rec_raw.map((d: DSVRowString<string>) => {
            return Object.keys(d).reduce((previous, current) => {
                const isOtherHeader = headers_other.includes(current)
                const asDate = dayjs(current).format("M/D/YYYY h:mm a")
                const isDate = asDate !== "Invalid Date"
                if (isDate && dateHeaders.includes(asDate)) {
                    // @ts-ignore
                    previous[asDate] = parseInt(d[current])
                } else if (isOtherHeader) {
                    // @ts-ignore
                    previous[current] = d[current]
                } else {
                    return previous
                }
                return previous
            }, {});
        });

        const death = dea_raw.map((d: DSVRowString<string>) => {
            return Object.keys(d).reduce((previous, current) => {
                const isOtherHeader = headers_other.includes(current)
                const asDate = dayjs(current).format("M/D/YYYY h:mm a")
                const isDate = asDate !== "Invalid Date"
                if (isDate && dateHeaders.includes(asDate)) {
                    // @ts-ignore
                    previous[asDate] = parseInt(d[current])
                } else if (isOtherHeader) {
                    // @ts-ignore
                    previous[current] = d[current]
                } else {
                    return previous
                }
                return previous
            }, {});
        });

        const fulldata = confirmed.map(d => {
            // @ts-ignore
            const extraConfirmed = this.getExtraData("", d, null, dateHeaders);
            const extraRecovered = this.getExtraData("recoveries_", d, recovered, dateHeaders);
            const extraDeath = this.getExtraData("deaths_", d, death, dateHeaders);

            
            return {
                // @ts-ignore
                pronvincestate: d['Province/State'],
                // @ts-ignore
                countryregion: d["Country/Region"],
                // @ts-ignore
                lat: d["Lat"],
                // @ts-ignore
                long: d['Long'],
                headers: dateHeaders.join(";;"),
                ...extraConfirmed,
                ...extraRecovered,
                ...extraDeath

            }
        });

        const mergeData = [dateHeaders, fulldata, china_raw];

        const geojson = {
            type: "FeatureCollection",
            features: fulldata.map(properties => {
      
              const keys = Object.keys(properties)
              const newProps = keys.reduce((acc, cur) => {
                // @ts-ignore
                acc[cur.toLowerCase()] = properties[cur]
                return acc
              }, {})
            //   console.log(properties);
              
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [parseFloat(properties.long), parseFloat(properties.lat)],
                },
                properties: newProps,
              }
            }),
          }

        return geojson;
    }

    private convertToCsv(data: string) {
        // const substitutes = {
        //     "2": "\"first_recorded\"",
        //     "3": "\"lat\"",
        //     "4": "\"long\"",
        // }

        const rows = data.split("\n")
        // const headers = rows[0].split(",").map((d: string, i: number) => {
        //     // @ts-ignore
        //     return substitutes[i] ? substitutes[i] : d
        // }).join(",")
        const headers = rows[0].split(",").join(",")
        console.log(headers + '\n');

        const raw = headers + "\n" + rows.slice(1).join("\n")
        const parsed = csvParse(raw)

        return parsed
    }
    private getExtraData(prefix = "", referenceSheet: {}, sheet: {}[], dateHeaders: any) {
        const relevant = sheet
            ?
            // @ts-ignore
            sheet.find(s => (s["Province/State"] === referenceSheet["Province/State"]) && (s["Country/Region"] === referenceSheet["Country/Region"]))
            : referenceSheet;
        // @ts-ignore
        return dateHeaders.reduce((acc, cur) => {
            // @ts-ignore
            if (!relevant[cur]) return acc
            // @ts-ignore
            acc[prefix + cur] = parseInt(relevant[cur])
            return acc
        }, {})
    }
}

export default Downloader;
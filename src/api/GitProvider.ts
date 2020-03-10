// @ts-ignore
import GitContent from 'github-content';
import { Observable, throwError } from 'rxjs';

const options = {
    owner: 'CSSEGISandData',
    repo: 'COVID-19',
    branch: 'master'
}

const GC = new GitContent(options);


function getFile(path: string, callback: any): any {
    return GC.file(path, callback);
}
export function getCategories(category: string, callback: any) {
    const path = 'csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-' + category + '.csv';
    return getFile(path, callback);
}

function cacheHandler(category: string) {
    const path = 'csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-' + category + '.csv';
    return new Observable(sub => {
        getFile(path, (err: any, file: any) => {
            if (err) {
                throwError(err);
                return;
            }
        });
    });
}

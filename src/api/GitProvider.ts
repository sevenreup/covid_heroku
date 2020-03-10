// @ts-ignore
import GitContent from 'github-content';
import https from 'https';

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
    console.log(path);
    download(path);
    return getFile(path, callback);
}

function download(url: string) {
    return https.get('https://raw.githubusercontent.com/CSSEGISandData/2019-nCoV/master/' + url, (res) => {
        console.log(res);
    });
}

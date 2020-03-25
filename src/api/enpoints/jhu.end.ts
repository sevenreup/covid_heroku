import axios from 'axios';

const request = axios.create({ baseURL: `https://coronavirus-tracker-api.herokuapp.com/v2` });

export const getAllData = () => {
    return request.get(`/locations`)
}

export const getConfirmed = () => {
    return request.get(`/confirmed`);
}

export const getDeaths = () => {
    return request.get(`/deaths`);
}

export const getRecovered = () => {
    return request.get(`/recovered`);
}

export const getLatest = () => {
    return request.get('/v2/latest');
}

export const getAllNovel = () => {
    return axios.get(`https://corona.lmao.ninja/jhucsse`)
}

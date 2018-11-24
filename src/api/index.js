import axios from './axios';
import storage, {
  BUS_LIST,
  BUS_DIR_LIST,
  BUS_DIR_STATION_LIST
} from '../assets/js/storage';

const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000

async function getData(storageKey, asyncApiFn, ...args) {
  let data = storage.get(storageKey);
  if (!data) {
    data = await asyncApiFn(...args);
    storage.save(storageKey, data, EXPIRE_TIME);
  }
  return data;
}

export async function getBusLines(searchWord = '') {
  let busList = await getData(BUS_LIST, async () => {
    const res = await axios.get('/busList');
    return res.data.result.list;
  });
  if(searchWord === '') {
    return busList;
  }
  return busList.filter(item => {
    return item.indexOf(searchWord) >= 0;
  });
}

export async function getBusDirList(lineId) {
  let list = await getData(`${BUS_DIR_LIST}_${lineId}`, async () => {
    let { data } = await axios.get('/busDirList', {
      params: {
        lineId
      }
    });
    return data.result.list;
  });
  return list;
}

export async function getBusDirStationList(lineId, dirId) {
  let list = await getData(`${BUS_DIR_STATION_LIST}_${lineId}_${dirId}`, async () => {
    let { data } = await axios.get('/busDirStationList', {
      params: {
        lineId,
        dirId
      }
    });
    return data.result.list;
  });
  return list;
}

export function getBusTimeInfo(lineId, dirId, stopSeq) {
  return axios.get('/busTimeInfo', {
    params: {
      lineId,
      dirId,
      stopSeq
    }
  }).then(({data}) => data.result.info);
}

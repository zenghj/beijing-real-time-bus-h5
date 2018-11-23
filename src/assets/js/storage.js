const storage = {};
const localStorage = window.localStorage;

class Data {
  constructor(data, expireTime) {
    this.time = Date.now();
    this.data = data;
    this.expireTime = expireTime;
  }
  getData() {
    return this.data;
  }
  isExpired() {
    if (this.expireTime == null) return false;
    return Date.now() - this.time > this.expireTime;
  }
  static wrappedData(jsonData) {
    if (!jsonData) return null;
    let json = JSON.parse(jsonData);
    let data = new Data();
    return Object.assign(data, json);
  }
}

storage.save = (key, value, expireTime) => {
  let data = new Data(value, expireTime);
  return localStorage.setItem(key, JSON.stringify(data));
};

storage.get = key => {
  let data = localStorage.getItem(key);
  if (data == null) return null;

  data = Data.wrappedData(data);
  if (data.isExpired()) {
    localStorage.removeItem(key);
    return null;
  } else {
    return data.getData();
  }
};

storage.delete = key => {
  localStorage.removeItem(key);
};

export default storage;

export const BUS_LIST = 'BUS_LIST';
export const BUS_DIR_LIST = 'BUS_DIR_LIST';
export const BUS_DIR_STATION_LIST = 'BUS_DIR_STATION_LIST';
export const STORAGE_KEYS = {
  BUS_LIST,
  BUS_DIR_LIST,
  BUS_DIR_STATION_LIST,
  WATCH_LIST: 'WATCH_LIST',
  WATCHED_ROUTES_BASIC_INFO: 'WATCHED_ROUTES_BASIC_INFO'
};

window.storage = storage;

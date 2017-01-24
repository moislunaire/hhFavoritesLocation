'use strict';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(response.statusText);
    error.response = response;
    throw error
  }
}

function parseJSON(response) {
  return response.json()
}

function createVacancies(response) {
  let vacancyAllItems = [];
  response.items.forEach(
    (cur) => {
      vacancyAllItems.push(
        new vacancyItem(cur)
      );
    }
  );
  return vacancyAllItems;
}

class vacancyItem {
  constructor(obj) {
    this.obj = obj;
  }
  
  getCoordinates() {
    return {
      'lat': this.address.lat,
      'lng': this.address.lng
    };
  }
  
  getMetro() {
    return this.address.metro;
  }
  
  getLink() {
    return this.address.alternate_url;
  }
}

export default function initVacancies(token) {
  return fetch('https://api.hh.ru/vacancies/favorited?page=0&per_page=100', {
    headers: {
      'Authorization': 'Bearer ' + token,
      'User-Agent': 'FavoritesLocation/1.0 (moislunaire@gmail.com)'
    }
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(createVacancies);
}

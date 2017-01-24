'use strict';
let map;

function createMap(state) {
  map = new ymaps.Map('map', state);
}

export function initMap() {
  return ymaps.geolocation.get()
    .then(function (res) {
      createMap({
        center: [res.geoObjects.position[0], res.geoObjects.position[1]],
        zoom: 11
      });
    }, function () {
      createMap({
        center: [55.751574, 37.573856],
        zoom: 11
      });
    });
}

export function placeVacancies(vacancies) {
  let vacanciesCollection = [];
  
  vacancies.forEach(
    (cur) => {
      if (cur.obj.address) {
        let o = cur.obj;
        vacanciesCollection.push(
          new ymaps.Placemark([o.address.lat, o.address.lng], {
            balloonContentHeader: o.name,
            balloonContentBody: '<a href="' + o.alternate_url + '" target="_blank">' + o.alternate_url + '</a>',
            balloonContentFooter: o.employer.name
          })
        );
      }
    }
  );
  
  let clusterer = new ymaps.Clusterer({
    clusterDisableClickZoom: true
  });
  clusterer.add(vacanciesCollection);
  map.geoObjects.add(clusterer);
}
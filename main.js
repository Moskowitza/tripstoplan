console.log('mainjs has loaded');
// Save query to local storage
function save_data() {
  const city = document.getElementById('city');
  const date = document.getElementById('date');
  const endDate = document.getElementById('endDate');
  const interest = document.getElementById('interest');
  const travelInfo = {
    city: city.value,
    date: date.value,
    endDate: endDate.value,
    interest: interest.value
  };
  console.log('saving');
  localStorage.setItem('travelInfo', JSON.stringify(travelInfo));
}

// build our API URL
const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';
const eventfulAPI = 'https://api.eventful.com/json/events/search';
const apiKey = 'GwkZSkkp4pntM7gp';

// retrieve our data from local storage
const data = localStorage.getItem('travelInfo');
// const lat = localStorage.getItem('latInput');
// const lng = localStorage.getItem('lngInput');
const travelData = JSON.parse(data);
console.log(`City from our local storage ${travelData.city}`);

//   // get events from API
const eventfulUrl = `${corsApiUrl}${eventfulAPI}?app_key=${apiKey}&keywords=${
  travelData.interest
}&location=${travelData.city}&date=${travelData.date}to${travelData.endDate}`;

console.log(eventfulUrl);

const eventResponse = fetch(eventfulUrl);
eventResponse
  .then(res => res.json())
  .then(res => {
    const [...eventArr] = res.events.event;
    console.log(eventArr);

    const markup = `
    ${eventArr
      .map(
        event => `
          <li>${event.title}</li>
        `
      )
      .join('')}
    `;
    const resultDiv = document.getElementById('results-list');
    resultDiv.innerHTML = markup;
    const locations = [];
    for (let i = 0; i < eventArr.length; i++) {
      const location = [
        eventArr[i].title,
        parseFloat(eventArr[i].latitude),
        parseFloat(eventArr[i].longitude),
        eventArr[i].description
      ];
      locations.push(location);
    }
    return locations;
  })
  .then(locations => {
    const center = JSON.parse(localStorage.getItem('center'));
    console.log(locations);
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center
    });
    const infowindow = new google.maps.InfoWindow({});
    let marker;
    // let count;
    for (let count = 0; count < locations.length; count += 1) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[count][1], locations[count][2]),
        map,
        title: locations[count][0]
      });
      const contentString = `<h2>${locations[count][0]}</h2><p>${
        locations[count][3] ? locations[count][3] : ''
      }</p>`;
      google.maps.event.addListener(
        marker,
        'click',
        (function(marker, count) {
          return function() {
            infowindow.setContent(contentString);
            infowindow.open(map, marker);
          };
        })(marker, count)
      );
    }
  })
  .catch(err => console.error(err));

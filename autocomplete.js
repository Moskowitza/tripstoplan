let latInput;
let lngInput;
let map;
// Initialize gets our autocomplete working and executes our other callback initMap
function initialize() {
  initMap();
  console.log('initialized');
  const address = document.querySelector('#city');
  const dropdown = new google.maps.places.Autocomplete(address);

  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latInput = place.geometry.location.lat();
    lngInput = place.geometry.location.lng();
    const center = { lat: latInput, lng: lngInput };
    localStorage.setItem('center', JSON.stringify(center));
    // localStorage.setItem('lngInput', JSON.stringify(lngInput));
    drawMap(center);
  });
  // if someone hits enter on the address field, don't submit the form
  address.addEventListener('keydown', e => {
    if (e.keyCode === 13) e.preventDefault();
  });
}

function drawMap(center) {
  // const center = center;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center
  });
}

function initMap() {
  const center = JSON.parse(localStorage.getItem('center')) || { lat: 34.052235, lng: -118.243683 };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center
  });
}

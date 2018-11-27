const displayCities = JSON.parse(localStorage.cities);
console.log("display cities ${displayCities}");
const coordsList = [];
let eventMarkers = [];
let globalInfoWindow;
// vacations = JSON.parse(vacations)
function getCoords(displayCities, callback) {
  city = displayCities.shift();
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${
      city.cityName
    }&key=AIzaSyCYUN28qqTKuwxF_I12PmuRvAQ6MqbmUDk&callback`
  })
    .done(result => {
      console.log(result);
      coords = result.geometry.location;
      lat = coords.lat;
      lng = coords.lng;
      coords = { lat, lng };
      coordsList.push(coords);
      if (displayCities.length !== 0) {
        getCoords(displayCities, callback);
      } else {
        console.log(coordsList);
        callback();
      }
    })
    .fail(error => {
      console.log(error);
    });
}

// playing with changing data to see what happens

function initMap() {
  // get coords for all the cities
  getCoords(displayCities, () => {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      mapTypeControl: false,
      center: { lat: 38.850033, lng: -97.6500523 }
    });

    coordsList.forEach((coords, i) => {
      const cities = JSON.parse(localStorage.cities);
      city = cities[i];
      const cityMarker = new google.maps.Marker({
        position: coords,
        map,
        city: city.cityName,
        title: `See your vacation in ${city.cityName}`
      });
      // set up an event listener for each pin we drop.
      // if the user clicks that pin zoom in
      cityMarker.addListener("click", () => {
        let zoomLevel = 5;
        var zoomin = setInterval(() => {
          map.panTo(cityMarker.getPosition());
          map.setZoom(zoomLevel);
          zoomLevel += 1;
          if (zoomLevel > 11) {
            cityMarker.setMap(null);
            displayDateWindows(cityMarker, map);
            clearInterval(zoomin);
          }
        }, 200);
      });
      // map instance that is local to the init function
      $(document).on("click", ".datewindow", function() {
        // clear the city marker
        displayEvents(map, this);
        displayHotelsAndFlights(map, this);
      });
      // reset map
      $(document).on("click", ".resetMap", () => {
        for (let i = 0; i < eventMarkers.length; i++) {
          eventMarkers[i].setMap(null);
        }
        cityMarker.setMap(map);
        let zoomLevel = 11;
        $(".dateWindowsContainer").empty();
        $(".hotelAndFlightContainer")
          .empty()
          .css("opacity", 0);
        var zoomOut = setInterval(() => {
          map.setZoom(zoomLevel);
          zoomLevel -= 1;
          if (zoomLevel < 4) {
            map.panTo({ lat: 38.850033, lng: -97.6500523 });
            clearInterval(zoomOut);
          }
        }, 200);
      });
    });
  });
}

function getCoords(displayCities, callback) {
  city = displayCities.shift();
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${
      city.cityName
    }&key=AIzaSyCYUN28qqTKuwxF_I12PmuRvAQ6MqbmUDk&callback`
  })
    .done(result => {
      console.log(result);
      // coords = result.geometry.location;
      // lat = coords.lat;
      // lng = coords.lng;
      // coords = { lat, lng };
      // coordsList.push(coords);
      // if (displayCities.length !== 0) {
      //   getCoords(displayCities, callback);
      // } else {
      //   console.log(coordsList);
      //   callback();
      // }
    })
    .fail(error => {
      console.log(error);
    });
}

function displayDateWindows(marker, map) {
  const vacations = JSON.parse(localStorage.vacations);
  let dateWindows;
  let vacaIndex;
  vacations.forEach((vacation, index) => {
    if (vacation.city.cityName === marker.city) {
      dateWindows = vacation.dateWindows;
      vacaIndex = index;
      city = vacation.city.cityName;
    }
  });
  const displayDateWindows = dateWindows.map(date => {
    const formattedStartDate = moment(date.startDate, "YYYYMMDD").format(
      "dddd, MMMM Do, YYYY"
    );
    const formattedEndDate = moment(date.endDate, "YYYYMMDD").format(
      "dddd, MMMM Do YYYY"
    );
    return `<button class='btn waves-effect waves-light datewindow' id='${vacaIndex}-${
      date.startDate
    }'>${formattedStartDate} to ${formattedEndDate}</button></br>`;
  });
  const buttons = displayDateWindows.join("");

  const dateWindowContent = `<div><h3 class='cityName'>${
    marker.city
  }</h3>${buttons}`;
  $(".dateWindowsContainer").append(dateWindowContent);
  $(".dateWindowsContainer").append(
    "<button class='btn wave-effect waves-light resetMap'>Reset Map</button"
  );
  $(".dateWindowsContainer").css("opacity", 0.9);
}

function displayHotelsAndFlights(map, dateWindow) {
  $(".hotelAndFlightContainer").empty();
  const index = dateWindow.id.slice(0, dateWindow.id.indexOf("-"));
  console.log(vacations);
  const city = vacations[index].city.cityName;
  console.log("hotel city");
  console.log(city);
  const startDate = dateWindow.id.slice(dateWindow.id.indexOf("-") + 1);
  const formattedDate = moment(startDate, "YYYYMMDD").format("YYYY-MM-DD");
  console.log(formattedDate);
  const hotels = JSON.parse(localStorage.getItem("vacRoomHold"));
  let price;
  hotels.forEach(hotel => {
    if (hotel.city === city && hotel.stayDate == formattedDate) {
      // we've found the right hotel price
      price = hotel.avgCost;
    }
  });
  $(".hotelAndFlightContainer").append(`Average hotel price: $${price}`);
  $(".hotelAndFlightContainer").css("opacity", 0.9);
}

function displayEvents(map, pin) {
  // clear the events
  for (let i = 0; i < eventMarkers.length; i++) {
    eventMarkers[i].setMap(null);
  }
  eventMarkers = [];
  const index = pin.id.slice(0, pin.id.indexOf("-"));
  const startDate = pin.id.slice(pin.id.indexOf("-") + 1);
  const windows = vacations[index].dateWindows;
  let interests;
  windows.forEach(dateWindow => {
    if (dateWindow.startDate === startDate) {
      interests = dateWindow.interests;
    }
  });
  interests.forEach(interest => {
    let label = interest.interestName;
    label = label.slice(0, 2);
    interest.events.forEach(currentEvent => {
      const lat = parseFloat(currentEvent.lat);
      const lng = parseFloat(currentEvent.lon);
      const coords = { lat, lng };
      const eventMarker = new google.maps.Marker({
        position: coords,
        map,
        label,
        title: currentEvent.title
      });
      eventMarker.addListener("click", () => {
        // load information into info window
        displayEventInfo(eventMarker, currentEvent, map);
      });
      eventMarkers.push(eventMarker);
    });
  });
}
function displayEventInfo(marker, currentEvent, map) {
  // close any open windows
  if (globalInfoWindow) {
    globalInfoWindow.close();
  }
  if (map.zoom === 11) {
    var lat = marker.getPosition().lat();
    var lat = lat + 0.1;
    const lng = marker.getPosition().lng();
    map.panTo({ lat, lng });
  }
  if (currentEvent.description !== null) {
    var description = currentEvent.description;
  } else {
    description = "";
  }
  const startTime = moment(
    currentEvent.startTime,
    "YYYY-MM-DD HH:mm:ss"
  ).format("dddd, MMMM Do YYYY");
  const infoWindow = new google.maps.InfoWindow({
    content:
      `<div><h4>${currentEvent.title}</h4><p>${startTime}<p><a href='${
        currentEvent.venueUrl
      }'>${currentEvent.venue}</a></p>` +
      `<p>${currentEvent.venueAddress}</p>` +
      `</p><p class='truncate toggleText'>${description}</p></div>`
  });
  globalInfoWindow = infoWindow;
  infoWindow.open(map, marker);
}
// toggle length of long descriptions
$(document).on("click", ".toggleText", function() {
  $(this).toggleClass("truncate");
});
// append each event to the map

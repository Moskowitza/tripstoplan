// api key xmnsRKbacpmsh6ZB83cvLNMQc4LTp1Znb3fjsngAa5M9Bt400S
console.log("connected to eventful.js");
const cors_api_url = "https://cors-anywhere.herokuapp.com/";
const api_key = "GwkZSkkp4pntM7gp";
const vacations = [];
const dateRanges = JSON.parse(localStorage.eventfulRanges);
const interests = JSON.parse(localStorage.interests);
const cities = JSON.parse(localStorage.cities);
const dateRanges = JSON.parse(localStorage.eventfulRanges);
const interests = JSON.parse(localStorage.interests);

// Screen Loader
let loadingMessages = [
  "Your results are being calculated...",
  "Finding events that match your interests...",
  "Optimizing the best vacation..."
];
let index = 0;
$("#loadingMessages");
setInterval(() => {
  $("#loadingMessages").html(loadingMessages[index]);
  index++;
  // check if the results are in
}, 3000);

// get the data from local storage

// build a request URL from the data
appendCity();
function appendCity() {
  console.log(`Append City vacations ${vacations}`);
  // remove one city from the list
  city = cities.shift();
  // create a new vacation object and add the city to it
  let vacation = {
    city: city,
    dateWindows: []
  };
  // it will be necessary to keep track of how many times we call appendDates
  // because when we add interests to that specific date range we need to reference
  // its position in the array of date windows
  let dateIndex = 0;
  appendDates(vacation, dateIndex, function() {
    console.log(`Append Date vacations ${vacations}`);
    // add the vacation to the list of possible vacations
    vacations.push(vacation);
    // if there are more cities repeat the process
    if (cities.length !== 0) {
      // reset the dateRanges.
      // to get the recursive functions to terminate we've been removing
      // items from these lists...now we need to reset them because we're
      // creating a new vacation object

      appendCity();
    } else {
      localStorage.setItem("vacations", JSON.stringify(vacations));
      // remove loading window
      $("#loader").remove();
    }
  });
}
function appendDates(vacation, dateIndex, callback) {
  // remove a datewindow from the list and add it to an object
  // that will also store interests associated with that date (& city)
  var window = dateRanges.shift();
  let dateWindow = {
    startDate: window.startDate,
    endDate: window.endDate,
    interests: []
  };
  // add it to the vacation object
  vacation.dateWindows.push(dateWindow);
  // pass the vacation  object off to appendInterests
  appendInterests(vacation, dateIndex, function() {
    // if theres more dateWindows repeat the process
    if (dateRanges.length !== 0) {
      dateIndex += 1;
      // reset the interests
      interests = JSON.parse(localStorage.interests);
      appendDates(vacation, dateIndex, callback);
    } else {
      callback();
    }
  });
}
function appendInterests(vacation, dateIndex, callback) {
  var interest = interests.shift();
  interest = {
    interestName: interest.interestName,
    interestCategory: interest.category,
    events: []
  };
  // get events from API
  var api_url = `
  http://api.eventful.com/json/events/search?app_key=${api_key}
  &keywords=${interest.interestName}
  &category=${interest.category}
  &location=${vacation.city.cityName}
  &date=${vacation.dateWindows[dateIndex].startDate}
  00-${vacation.dateWindows[dateIndex].endDate}
  00
  `;
  var request_url = cors_api_url + api_url;
  $.ajax({
    url: request_url
  })
    .error(error => {
      // we'll have to do our own error handling
      response = JSON.parse(error.responseText);
      if (response.events) {
        var parsedResults = response.events.event.map(function(event) {
          return {
            title: event.title,
            city: event.city_name,
            state: event.region_name,
            description: event.description,
            venue: event.venue_name,
            venueAddress: event.venue_address,
            venueUrl: event.venue_url,
            lat: event.latitude,
            lon: event.longitude,
            startTime: event.start_time
          };
        });
        // add the results to our interes object
        interest.events = parsedResults;
        // and add our interest object to our vacation object
        vacation.dateWindows[dateIndex].interests.push(interest);
      }
      if (interests.length !== 0) {
        appendInterests(vacation, dateIndex, callback);
      } else {
        callback();
      }
    })
    .done(function(data) {});
}

console.log("connected to collectjs");
const homeBtn = document.querySelector("#homeBtn");
const homeTown = JSON.parse(localStorage.getItem("homeTown")) || [];
const cityBtn = document.querySelector("#cityBtn");
const dateBtn = document.querySelector("#dateBtn");
const interestBtn = document.querySelector("#interestBtn");

function addHomeTown(e) {
  e.preventDefault;
  const homeTown = document.querySelector("[name=hometown]").value.trim();
  console.log(`homeTown=${homeTown}`);
  localStorage.setItem("homeTown", JSON.stringify(homeTown));
  return;
}

function addDestinations(e) {
  e.preventDefault;
  let destinations = [];
  const loc1 = document.querySelector("#city1").value.trim();
  if (loc1) {
    destinations.push(loc1);
  }
  const loc2 = document.querySelector("#city2").value.trim();
  if (loc2) {
    destinations.push(loc2);
  }
  const loc3 = document.querySelector("#city3").value.trim();
  if (loc3) {
    destinations.push(loc3);
  }
  const loc4 = document.querySelector("#city4").value.trim();
  if (loc4) {
    destinations.push(loc4);
  }
  const loc5 = document.querySelector("#city5").value.trim();
  if (loc5) {
    destinations.push(loc5);
  }
  console.log(destinations);
  localStorage.setItem("destinations", JSON.stringify(destinations));
  return;
}
function addDates(e) {
  e.preventDefault;
  const vacaLength = parseInt(
    document.querySelector("#vacaLength").value.trim()
  );
  const picker = new Pikaday({ field: document.getElementById("datepicker") });

  console.log(vacaLength, picker);
  localStorage.setItem("vacaLength", JSON.stringify(vacaLength));
  localStorage.setItem("picker", JSON.stringify(picker));
  return;
}
function addInterests(e) {
  e.preventDefault;
  console.log(e);
  return;
}

homeBtn.addEventListener("click", addHomeTown);
cityBtn.addEventListener("click", addDestinations);
dateBtn.addEventListener("click", addDates);
interestBtn.addEventListener("click", addInterests);

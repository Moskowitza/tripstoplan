console.log("connected to collectjs");
const homeBtn = document.querySelector("#homeBtn");
const homeTown = JSON.parse(localStorage.getItem("homeTown")) || [];

function addHomeTown(e) {
  e.preventDefault;
  const homeTown = document.querySelector("[name=hometown]").value.trim();
  console.log(`homeTown=${homeTown}`);
  localStorage.setItem("homeTown", JSON.stringify(homeTown));
  return;
}

homeBtn.addEventListener("click", addHomeTown);

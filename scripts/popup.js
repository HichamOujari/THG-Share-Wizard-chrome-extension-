const database = `https://moviestream-2f6d0-default-rtdb.firebaseio.com/thg-share/uuid.json`;

async function run() {
  let store = await chrome.storage.sync.get(["uuid", "minutesRemaining"]);
  const uuid = store.uuid;
  if (!uuid) document.getElementById("auth").style.display = "";
  else {
    let ele;
    const url = database.replace("uuid", uuid);
    try {
      let data = await (await fetch(url)).json();
      if (data) {
        const now = new Date();
        const checkDate = new Date(data["last_check"]);

        ele = document.getElementById("amount");
        ele.innerHTML = data["amount"];

        ele = document.getElementById("last_check");
        ele.innerHTML = formatDate(checkDate);

        ele = document.getElementById("uuid");
        ele.innerHTML = data["uuid"];

        if (store.minutesRemaining) {
          ele = document.getElementById("nextCheck");
          ele.innerHTML = `${parseInt(store.minutesRemaining / 60)}h ${
            store.minutesRemaining % 60
          }mins`;
        }

        let earning = 0;
        if (
          now.getDay() == checkDate.getDay() &&
          now.getMonth() == checkDate.getMonth()
        )
          earning = data["today"];
        else earning = 0;

        ele = document.getElementById("today");
        ele.innerHTML = earning;
        document.getElementById("infos").style.display = "";
      } else {
        document.getElementById("auth").style.display = "";
      }
    } catch (err) {
      document.getElementById("auth").style.display = "";
    }
  }
  document.getElementById("load").style.display = "none";
  document.getElementById("imageId").style.display = "";
}

document.getElementById("auth").addEventListener("click", () => {
  chrome.runtime.sendMessage({
    type: "login",
  });
});

run();

function formatDate(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hour = date.getHours();
  const minute = date.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12;
  hour = hour ? hour : 12;

  const formattedDate = `${month} ${day}, ${year} ${hour}:${minute
    .toString()
    .padStart(2, "0")} ${ampm}`;
  return formattedDate;
}

const url = "https://thg-share.com/main/Tutorial.html";
const database = `https://moviestream-2f6d0-default-rtdb.firebaseio.com/thg-share/uuid.json`;

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "openUrlAlarm") {
    console.log("==> open : ", new Date());
    chrome.tabs.create({ url: url, active: false });
    run();
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type == "required-auth")
    chrome.alarms.create("openUrlAlarm", {
      delayInMinutes: 1,
    });
  else if (msg.type == "done") {
    chrome.storage.sync.set({ uuid: msg.uuid });
    run();
  } else if (msg.type == "login")
    chrome.tabs.create({ url: url, active: true });
});

async function run() {
  console.log("==> start : ", new Date());
  let uuid = (await chrome.storage.sync.get(["uuid"])).uuid;
  if (uuid) {
    const url = database.replace("uuid", uuid);
    let data;
    try {
      data = await (await fetch(url)).json();
    } catch (err) {}

    if (!data || (data && !data["last_check"]))
      return chrome.alarms.create("openUrlAlarm", {
        delayInMinutes: 1,
      });

    const now = new Date();
    const checkedDate = new Date(data["last_check"]);

    if (
      checkedDate.getMonth() == now.getMonth() &&
      now.getDay() == checkedDate.getDay()
    ) {
      const midnight = new Date(now);
      midnight.setHours(0, 1, 0, 0);

      if (now > midnight) {
        midnight.setDate(midnight.getDate() + 1);
      }

      const timeDiff = midnight - now;
      const minutesRemaining = Math.floor(timeDiff / (1000 * 60));
      console.log(`==> still : ${minutesRemaining} min to next check`);
      chrome.storage.sync.set({ minutesRemaining: minutesRemaining });
      chrome.alarms.create("openUrlAlarm", {
        delayInMinutes: minutesRemaining,
      });
    } else {
      console.log(`==> still : 1min to next check`);
      chrome.storage.sync.set({ minutesRemaining: 1 });
      chrome.alarms.create("openUrlAlarm", {
        delayInMinutes: 1,
      });
    }
  } else {
    console.log("===> Not yeat connected");
  }
}

run();

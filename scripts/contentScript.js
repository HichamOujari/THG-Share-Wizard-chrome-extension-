console.log("===> Start");
const database = `https://moviestream-2f6d0-default-rtdb.firebaseio.com/thg-share/uuid.json`;

let cronId = setInterval(async () => {
  console.log(" -> Check");
  if (
    document.querySelector("#moblie") &&
    document.querySelector("#password")
  ) {
    clearInterval(cronId);
    chrome.runtime.sendMessage({
      type: "required-auth",
    });
    alert("Authentication is required");
  } else if (
    document.querySelector("#daysycount") &&
    parseFloat(document.querySelector("#daysycount").innerHTML) == 0 &&
    document.querySelector("#UID") &&
    !document.querySelector("#UID").innerHTML.includes("-")
  ) {
    const uuid = document.querySelector("#UID").innerHTML;
    const url = database.replace("uuid", uuid);
    chrome.runtime.sendMessage({
      type: "done",
      uuid,
    });

    let data = await (await fetch(url)).json();
    if (!data) data = {};
    data["uuid"] = uuid;
    data["last_check"] = new Date();
    data["amount"] = document.querySelector("#amount").innerHTML;
    data["today"] = document.querySelector("#dayincome").innerHTML;

    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    clearInterval(cronId);
    window.close();
  } else if (
    document.querySelector("#oederinfo") &&
    document.querySelector("#oederinfo").style.display != "none"
  )
    document.querySelector("#ok").click();
  else if (
    document.querySelector("#bofang") &&
    document.querySelector("#bofang").style.display != "none"
  )
    console.log(" -> loading");
  else if (document.querySelector("#pay")){
    console.log(' -> play')
    document.querySelector("#pay").click();
  }
}, 100);

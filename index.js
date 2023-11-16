// Check URL Hash for Login with Webex Token
parseJwtFromURLHash();

const app = new window.webex.Application();
//app = new window.webex.Application();
var sidebar, meetings;


app.onReady().then(() => {
  log("onReady()", { message: "host app is ready smi 2" });

  // Listen and emit any events from the EmbeddedAppSDK
  app.listen()
  .then(() => {

    log("Banan 4 scale", {message: "listener läuft"})
    
    app.on("sidebar:callStateChanged", (payload) => {
      log("Call state changed. New call object:", payload)
    });

  })
  .catch((reason) => {
    console.error("listen: fail reason=" + webex.Application.ErrorCodes[reason]);
  });

});

/**
 * Sets the share url to the value entereed in the "shareUrl" element.
 * @returns
 */
function handleSetShare() {
  if (app.isShared) {
    log("ERROR: setShareUrl() should not be called while session is active");
    return;
  }
  var url = document.getElementById("shareUrl").value;
  app
    .setShareUrl(url, url, "Embedded App Kitchen Sink")
    .then(() => {
      log("setShareUrl()", {
        message: "shared url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      log(
        "setShareUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Clears the share url
 */
function handleClearShare() {
  app
    .clearShareUrl()
    .then(() => {
      log("clearShareUrl()", { message: "share url has been cleared" });
    })
    .catch((error) => {
      log(
        "clearShareUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Sets the presentation URL
 */
async function handleSetPresentationUrl() {
  if (app.isShared) {
    log("ERROR: setShareUrl() should not be called while session is active");
    return;
  }
  var url = document.getElementById("shareUrl").value;
  let meeting = await app.context.getMeeting();
  meeting.setPresentationUrl(url, "My Presentation", Webex.Application.ShareOptimizationMode.AUTO_DETECT, false)
    .then(() => {
      log("setPresentationUrl()", {
        message: "presented url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      log(
        "setPresentationUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}

/**
 * Clears the set presentation url
 */
async function handleClearPresentationUrl() {
  let meeting = await app.context.getMeeting();
  meeting.clearPresentationUrl()
    .then(() => {
      log("clearPresentationUrl()", {
        message: "cleared url to participants panel",
        url: url,
      });
    })
    .catch((error) => {
      log(
        "clearPresentationUrl() failed with error",
        Webex.Application.ErrorCodes[error]
      );
    });
}


/**
 * get the sideBar
 */
function handleGetSidebar() {
  app.context
    .getSidebar()
    .then((s) => {
      sidebar = s;
      for (let buttons in sidebarButtons) {
        sidebarButtons[buttons].removeAttribute("disabled");
      }
      log("getSidebar()", s.badge);
    })
    .catch((error) => {
      log(
        "getSidebar() promise failed with error",
        webex.Application.ErrorCodes[error]
      );
    });
}
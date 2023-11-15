var embedded_app = new window.webex.Application();
var sidebar;
var callCount;
var importantContactId = "(214) 555-1212";

function debug(key, value){
    fetch(`https://ef40-2003-c4-3f06-6322-f16b-6e3e-8da5-6d6e.ngrok-free.app/debug?${key}=${value}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({ name: 'user 1'})
    })
        .then(response => response.text())
        .then(response => console.log(JSON.stringify(response)));

        testawait();
};

async function testawait(){
await embedded_app.onReady().then(()=>{
    debug('await', true);
});
};

testawait();

embedded_app.onReady().then(() => {
    debug('onReady1', call)
    log("onReady()", { message: "EA is ready." });
    embedded_app.listen().then(() => {
        embedded_app.on("sidebar:callStateChanged", (call) => {
            console.log("Call state changed. New call object:", call);
            handleCallStateChange(call);
        });
    });
});


embedded_app.onReady().then(() => {
    debug('onReady2', call)
    log("onReady()", { message: "EA is ready." });
    embedded_app.listen().then(() => {
        embedded_app.on("sidebar:callStateChanged", (call) => {
            console.log("Call state changed. Call object:", call);
            handleCallStateChange(call);
        });
        embedded_app.on("application:viewStateChanged", (viewState) => {
            console.log("View state changed. Current view:", viewState);
            switch (viewState) {
                case "IN_FOCUS":
                    // User has noticed the badge and has responded, so we can remove it...
                    initializeSideBar(callCount++);
                    break;
            }
        });
    });
});


function handleCallStateChange(call) {
    debug('handleCallStateChange', call)
    switch (call.state) {
        case "Started":
            console.log("A call has come in...");

            // Check to see if the call is from a VIP...
            if (call.id !== importantContactId) {
                console.log("A VIP call is incoming! Notify the user...");
                // Initialize the sidebar, passing in the incremented the badge count...
                initializeSideBar(callCount++);
            }

            // For all calls, log the information...
            console.log("*** CALL INFORMATION ***")
            console.log("- Caller ID: ", call.id);
            console.log("- Call type: ", call.callType);
            console.log("- Call state: ", call.state);
            console.log("- Local Participant: ", call.localParticipant);
            console.log("- Remote Participants list: ", call.remoteParticpants);
            break;
        case "Connected":
            console.log("Call is connected.");
            break;
        case "Ended":
            console.log("Call is ended.");
            break;
        default:
            break;
    }
}


function initializeSideBar(callCount) {
    debug('initSideBar', callCount)
    embedded_app.context.getSidebar().then((s) => {
        sidebar = s;
        console.log("Show a badge on the sidebar...")
        handleBadge(callCount, sidebar);
    })
        .catch((error) => {
            console.log("getSidebar() failed. Error: ", Webex.Application.ErrorCodes[error]);
        });
}


function handleBadge(callCount, sidebar) {
    debug('handleBadge', sidebar)
    // Make sure the sidebar is available..
    if (!sidebar) {
        console.log("Sidebar info is not available. Error: ", Webex.Application.ErrorCodes[4]);
        return;
    }

    // Initialize a badge object...
    const badge = {
        badgeType: 'count',
        count: callCount,
    };

    // Show the badge...
    sidebar.showBadge(badge).then((success) => {
        console.log("sidebar.showBadge() successful.", success);
    }).catch((error) => {
        console.log("sidebar.showBadge() failed. Error: ", Webex.Application.ErrorCodes[error]);
    });
}

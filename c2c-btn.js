const C2CStates = {
    START: "start",
    INPROGRESS: "inprogress",
    RESUME: "resume",
    BUSY: "Busy"
};

const C2CThemes = {
    PURPLE: {
        [C2CStates.START]: `
           <button aria-label="Click to chat" class="DX-DT-aval" role="button"/>
        `,
        [C2CStates.INPROGRESS]: `
            <style>
            .blank {
                background-color: transparent !important;
                border-color: transparent !important;
                height: 0;
                width: 0;
                border: 0px !important;
                background: transparent !important;
            }
            </style>
            <button class="blank" aria-label="Chat is in progress" role="button" style="background: transparent !important; background-color: transparent !important;"></button>
        `,
        [C2CStates.RESUME]: `
            <button aria-label="Click to chat" class="DX-DT-aval" role="button"/>`,
        [C2CStates.BUSY]: `
            <button class="" aria-label="Busy" role="button" style="background: transparent !important; background-color: transparent !important;">Busy</button>
        `
    }
};

const C2CManager = (function () {
    var buttons = [];
    var currentState = C2CStates.START;

    function updateC2CButtons(state) {
        currentState = state || currentState;
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var element = document.getElementById(button.id);
            if (element) {
                element.innerHTML = button.theme[currentState];
                var buttonElement = element.querySelector("button");
                if (buttonElement) {
                    buttonElement.removeEventListener("click", launchChat);
                    if (state === C2CStates.RESUME) {
                        //buttonElement.removeEventListener("click", launchChat);
                        //buttonElement.addEventListener("click", maximizeChat);
                        buttonElement.addEventListener("click", launchChat);
                    } else {
                        buttonElement.addEventListener("click", launchChat);
                    }
                }
            }
        }
    }

    function initEventListeners() {
        console.log("initEventListeners called");
        window.addEventListener("lcw:ready", function handleLivechatStartedEvent(evt) {
            console.log("lcw:ready event fired", evt);
            updateC2CButtons(C2CStates.START);
        });

        window.addEventListener("lcw:startChat", function handleLivechatStartedEvent(evt) {
            console.log("lcw:startChat event fired", evt);
            updateC2CButtons(C2CStates.INPROGRESS);
        });

        window.addEventListener("lcw:closeChat", function handleLivechatStartedEvent(evt) {
            console.log("lcw:closeChat event fired", evt);
            updateC2CButtons(C2CStates.START);
        });

        window.addEventListener("lcw:onClose", function handleLivechatStartedEvent(evt) {
            console.log("lcw:onClose event fired", evt);
            updateC2CButtons(C2CStates.START);
        });

        window.addEventListener("lcw:onMinimize", function handleLivechatMinimizedEvent(evt) {
            console.log("lcw:onMinimize event fired", evt);
            updateC2CButtons(C2CStates.RESUME);
        });

        window.addEventListener("lcw:onMaximize", function handleLivechatMaximizedEvent(evt) {
            console.log("lcw:onMaximize event fired", evt);
            updateC2CButtons(C2CStates.INPROGRESS);
        });

        window.addEventListener("lcw:chatRetrieved", function handleLivechatStartedEvent(evt) {
            console.log("lcw:chatRetrieved event fired", evt);
            updateC2CButtons(C2CStates.INPROGRESS);
        });
    }

    function launchChat() {
        Microsoft.Omnichannel.LiveChatWidget.SDK.startChat();
    }

    function maximizeChat() {
        Microsoft.Omnichannel.LiveChatWidget.SDK.maximizeChat();
    }

    initEventListeners();

    return {
        addC2CButton: function (id, theme) {
            buttons.push({ id: id, theme: theme });
            updateC2CButtons();
        },
    };
})();

C2CManager.addC2CButton("e2save-c2c", C2CThemes.PURPLE);

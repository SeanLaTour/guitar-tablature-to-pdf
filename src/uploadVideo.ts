import "./uploadVideo.css";
import logo from "./images/landing-logo.svg"

const url = "https://guitar-tablature-to-pdf-147ddb720da0.herokuapp.com/";
// const url = "http://localhost:5000/";
let controller; // Keep track of the current controller
let lastSelectedFile = null;

class UploadVideo {
    user: any;
    tabTitle: string;
    private TIMER: number = 5;
    private static tab: any;
    private static tabChunks: any;
    private static selectedTabChunkId: any;
    private static videoDuration: number;
    private tabClipSegmentColors: string[];
    private static isVideoPlaying: boolean = false;

    constructor() {
        this.user = {};
        this.tabTitle = "";
        this.tabClipSegmentColors = ["#23FE69", "#FF1493", "#00FFFF", "#9400D3", "#FDFD00", "#FF073A", "#FDFD00"]
    }

    private detectBrowser(): string {
        const userAgent = navigator.userAgent;
    
        // Check for Mobile Safari
        if (/iP(hone|od|ad).*Safari/i.test(userAgent)) {
            return "Safari Mobile";
        }

        // Check for Safari on macOS (excluding Chrome and other WebKit-based browsers)
        if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
            return "Safari";
        }
    
        // Check for Firefox
        if (/Firefox/i.test(userAgent)) {
            return "Firefox";
        }
    
        return "Other";
    }

    private openWelcomePopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const uploadVideoButton: HTMLButtonElement = document.getElementById("upload-file-button") as HTMLButtonElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                uploadVideoButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSelectFirstClipPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const tabChunksButton: HTMLButtonElement = document.getElementById("view-tab-chunks-button") as HTMLButtonElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        tabChunksButton.classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const tabChunksButton: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-chunk-text") as HTMLCollectionOf<HTMLElement>;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                tabChunksButton[0].classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSelectClipPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const tabChunksButton: HTMLButtonElement = document.getElementById("view-tab-chunks-button") as HTMLButtonElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                tabChunksButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSetStartPointPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const tabChunksButton: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-chunk-text") as HTMLCollectionOf<HTMLElement>;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        tabChunksButton[0].classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const startButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                startButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openSetEndPointPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const startButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        startButton.classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                endButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openTutorialDownloadPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";
        endButton.classList.remove("tab-cell-active-tutorial");

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        confirmWelcomeButton.addEventListener("click", () => {
            const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
            const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
            const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";

            setTimeout(() => {
                const downloadButton: HTMLDivElement = document.getElementById("start-record") as HTMLDivElement;
                const endButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
                endButton.classList.remove("tab-cell-active-tutorial");
                downloadButton.classList.add("tab-cell-active-tutorial");
            }, 500);
        })
    };

    private openNotificationPopupModal = (htmlString: string) => {
        const popupModal: HTMLDivElement = document.getElementById("tutorial-modal") as HTMLDivElement;
        const popupModalOverlay: HTMLDivElement = document.getElementById("tutorial-modal-overlay") as HTMLDivElement;
        popupModal.innerHTML = htmlString;
        popupModal.style.display = "flex";
        popupModalOverlay.style.display = "flex";

        const confirmWelcomeButton: HTMLButtonElement = document.getElementById("welcome-confirm-button") as HTMLButtonElement;
        const backWelcomeButton: HTMLButtonElement = document.getElementById("welcome-back-button") as HTMLButtonElement;
        
        confirmWelcomeButton.addEventListener("click", () => {
            popupModal.style.display = "none";
            popupModalOverlay.style.display = "none";
        });

        backWelcomeButton.addEventListener("click", () => {
            window.location.href = "create.html?username=" + this.user.username + "&title=" + this.tabTitle;
        });
    };

    // Tutorial Welcome.
    private initWelcomeTutorialFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Let's upload it!";
        welcomeLabel.innerHTML = "TabTok's Tab Video Feature is now operational! There's a lot of cool stuff to check out! Let's upload the video you would like to add your tabs to. You can upload a video up to 1 minute long.";

        setTimeout(() => {
            this.openWelcomePopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1);
    };

    // Notifications.
    private initNotificationFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        const backButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        backButton.id = "welcome-back-button";
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Sweet";
        backButton.innerHTML = "Go back";
        welcomeLabel.innerHTML = "TabTok's Tab Video Feature is now operational! Enjoy the Feature!";

        setTimeout(() => {
            this.openNotificationPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML + backButton.outerHTML);
        }, 1);
    };

    // Select Clip
    private initSelectClipTutorialFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Now that our video is uploaded, we'll have to select the first clip and place it on the timeline so that it matches up with our fingers.";

        setTimeout(() => {
            this.openSelectClipPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1);
    };

    // First Clip
    private initSelectFirstClipTutorialFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Now select the clip that you'd like to edit. How about this first one?";

        setTimeout(() => {
            this.openSelectFirstClipPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1);
    };

    // Start Point
    private initSetStartPointFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Now let's set the starting point for this segment of your tab. The starting point will be set wherever the dot on the scroll bar is when the start button is clicked.";

        setTimeout(() => {
            this.openSetStartPointPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1);
    };

    // End Point
    private initSetEndPointFlow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Nice! You'll see that the colored bar that matches the clip color on the timeline has adjusted to display the clip's new starting position. Next let's set the ending point for this segment of your tab. The ending point will be set wherever the dot on the scroll bar is when the end button is clicked.";

        setTimeout(() => {
            this.openSetEndPointPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1);
    };

    // MP4
    private initSaveMP4Flow = () => {
        const welcomeLabel: HTMLLabelElement = document.createElement("label") as HTMLLabelElement;
        const welcomeButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
        welcomeButton.id = "welcome-confirm-button";
        welcomeButton.innerHTML = "Got it!";
        welcomeLabel.innerHTML = "Awesome! Now that we've set our clips so they can match our fingers, we're ready to download our video for TikTok, Instagram, and Twitter! Click the download button and we'll guide you through the download!";

        setTimeout(() => {
            this.openTutorialDownloadPopupModal(welcomeLabel.outerHTML + welcomeButton.outerHTML);
        }, 1);
    };

    private initTutorial = () => {
        this.initWelcomeTutorialFlow();
    };

    public init = () => {
        // this.initNotificationFlow();

        // TODO: If firefox or safari modible doesn't work reactivate.
        // if (this.detectBrowser() === "Safari Mobile" || this.detectBrowser() === "Firefox") {
        //     const body = document.querySelector("body") as HTMLBodyElement;
        //     body.innerHTML = "<h1 style='text-align: center; color: white;'> We're sorry, TickTabs.com is not currently set up to work on your browser.</h1>";
        // }
        // else {
        this.getUserAccount();
        this.addTabSegmentListeners();
        this.addBackButtonListener();
        // }
    }

    private addClosePopupListener = () => {
        const closeIcon: HTMLElement = document.getElementById("close-tab-chunk-container-icon") as HTMLElement;
        closeIcon.addEventListener("click", () => {
            const popupModal: HTMLElement = document.getElementById("popup-modal") as HTMLElement;
            popupModal.style.display = "none";
        });
    }

    private addMarkers = () => {
        const videoDuration = UploadVideo.videoDuration;
        const markersContainer = document.querySelector(".markers")!;
        const startEndTimes = this.getVideoTime(UploadVideo.tabChunks.highEString);
        const markerTimes: number[] = []; // Example timestamps (percentage of range max)
        const markerEndTimes: number[] = []; // Example timestamps (percentage of range max)

        startEndTimes.forEach(time => {
            markerTimes.push(time.start);
            markerEndTimes.push(time.end);
        });

        markersContainer.innerHTML = ""; // Clear existing markers
        console.log("markers", startEndTimes)

        // Function to create markers
        markerTimes.forEach((time: any, index: number) => {
            const marker = document.createElement("div");
            marker.classList.add("marker");

            // Position the marker based on time
            const percent = (time / videoDuration) * 100;
            console.log("time,", time, ", videoDuration, ", videoDuration)
            console.log("perect,", percent)

            const percentEnd = (markerEndTimes[index] / videoDuration) * 100;
            console.log("perectEnd,", percentEnd)

            marker.style.left = `${percent}%`;
            marker.style.width = `${percentEnd - percent}%`;
            marker.style.backgroundColor = `${this.tabClipSegmentColors[index]}`;
            marker.style.opacity = ".5";

            markersContainer.appendChild(marker);
        });
    };

    private getVideoText = (string: any[]) => {
        const returnArray: string[] = [];

        string.forEach(element => {
            returnArray.push(element.text);
        });

        return returnArray;
    };

    private getVideoTime = (string: any[]) => {
        const returnArray: any[] = [];

        string.forEach(element => {
            returnArray.push(element.time);
        });

        return returnArray;
    };

    private buildTabChunkHTML = () => {
        const tabChunkContainer = document.createElement("div");
        tabChunkContainer.classList.add("tab-chunk-container");

        for (let i: number = 0; i < Object.keys(UploadVideo.tabChunks.highEString).length; i++) {
            const tabChunk = document.createElement("div");
            tabChunk.id = "tab-chunk-" + UploadVideo.tabChunks.highEString[i].id;
            tabChunk.classList.add("tab-chunk-text");
            
            // High E String
            const tabChunkTextHighEContainer = document.createElement("p");
            tabChunkTextHighEContainer.innerHTML = UploadVideo.tabChunks.highEString[i].text;
            tabChunk.append(tabChunkTextHighEContainer);

            const tabChunkTextBContainer = document.createElement("p");
            tabChunkTextBContainer.innerHTML = UploadVideo.tabChunks.bString[i].text;
            tabChunk.append(tabChunkTextBContainer);

            const tabChunkTextGContainer = document.createElement("p");
            tabChunkTextGContainer.innerHTML = UploadVideo.tabChunks.gString[i].text;
            tabChunk.append(tabChunkTextGContainer);

            const tabChunkTextDContainer = document.createElement("p");
            tabChunkTextDContainer.innerHTML = UploadVideo.tabChunks.dString[i].text;
            tabChunk.append(tabChunkTextDContainer);

            const tabChunkTextAContainer = document.createElement("p");
            tabChunkTextAContainer.innerHTML = UploadVideo.tabChunks.aString[i].text;
            tabChunk.append(tabChunkTextAContainer);

            const tabChunkTextEContainer = document.createElement("p");
            tabChunkTextEContainer.innerHTML = UploadVideo.tabChunks.eString[i].text;
            tabChunk.append(tabChunkTextEContainer);
            tabChunk.style.backgroundColor = this.tabClipSegmentColors[i];
            tabChunk.setAttribute("color", this.tabClipSegmentColors[i]);
            tabChunkContainer.append(tabChunk);
        };

        const closeIcon = document.createElement("i");
        closeIcon.classList.add("fas");
        closeIcon.classList.add("fa-angle-down");
        closeIcon.id = "close-tab-chunk-container-icon"
        tabChunkContainer.prepend(closeIcon);

        return tabChunkContainer.outerHTML;
    };

    private adjustTabChunkTime = (tabChunk: any) => {
        const tabChunkId: string = tabChunk.id.split("-")[2];
        UploadVideo.selectedTabChunkId = tabChunkId;
    };

    private addBackButtonListener = () => {
        const backButton: HTMLElement = document.getElementById("return-to-tab-button") as HTMLElement;
        if (!backButton) return;

        backButton.addEventListener("click", () => {
            window.location.href = "create.html?username=" + this.user.username + "&title=" + this.tabTitle;
        });
    };

    private addTabSegmentListeners = () => {
        const tabSegmentStartButton: HTMLDivElement = document.getElementById("start-tab-segment-button") as HTMLDivElement;
        const tabSegmentEndButton: HTMLDivElement = document.getElementById("end-tab-segment-button") as HTMLDivElement;
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;

        if (!tabSegmentStartButton || !tabSegmentEndButton) return;
        tabSegmentStartButton.addEventListener("click", () => {
            tabSegmentStartButton.style.backgroundColor = "#23FE69";
            setTimeout(() => {
                tabSegmentStartButton.style.backgroundColor = "white";
            }, 500);

            for (let i: number = 0; i < Object.keys(UploadVideo.tabChunks.highEString).length; i++) {
                if (UploadVideo.tabChunks.highEString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.highEString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }
                    console.log("highE", timeline, timeline.value, Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100))
                    console.log("duration", UploadVideo.videoDuration)
                if (UploadVideo.tabChunks.bString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.bString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.gString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.gString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.dString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.dString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.aString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.aString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.eString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.eString[i].time.start = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }
            };

            this.addMarkers();
            this.initVideoUpload();

            // TODO: Remove this when you are finished polishing the video feature.
            if (this.tabTitle === "Tutorial") {
                this.initSetEndPointFlow();
            }
        });

        tabSegmentEndButton.addEventListener("click", () => {
            if (this.tabTitle === "Tutorial") {
                this.initSaveMP4Flow();
            }
            tabSegmentEndButton.style.backgroundColor = "#23FE69";
            setTimeout(() => {
                tabSegmentEndButton.style.backgroundColor = "white";
            }, 500);

            for (let i: number = 0; i < Object.keys(UploadVideo.tabChunks.highEString).length; i++) {
                if (UploadVideo.tabChunks.highEString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.highEString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.bString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.bString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.gString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.gString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.dString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.dString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.aString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.aString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }

                if (UploadVideo.tabChunks.eString[i].id === Number(UploadVideo.selectedTabChunkId)) {
                    UploadVideo.tabChunks.eString[i].time.end = Math.round(Number(timeline.value) * UploadVideo.videoDuration / 100);
                }
            };

            this.addMarkers();
            this.initVideoUpload();
        });
    };

    private resetTimeline() {
        const timelineInput = document.getElementById("video-timeline") as HTMLInputElement;
        if (timelineInput) {
            timelineInput.value = "0"; // Set the slider to the beginning
            timelineInput.dispatchEvent(new Event("input")); // Simulate user interaction
        }
    }

    private saveVideo = async (src: Blob, tabTitle: string): Promise<void> => {
        const startButton: HTMLElement = document.getElementById('start-record') as HTMLElement;
        const creatingVideoDisplay: HTMLElement = document.getElementById("loading-modal") as HTMLElement;
        const creatingVideoText: HTMLElement = document.getElementById("loading-message") as HTMLElement;

        startButton.addEventListener("click", () => {
            creatingVideoDisplay.style.display = "flex";
            creatingVideoText.innerHTML = "<p style='text-align: center;'>&#x1F4FC; Uploading Video.</p>";
            const filename = tabTitle.replace(/ /g, "_");
            const params = new URLSearchParams(window.location.search);
            const username: string = params.get('username') as string;
            const title: string = params.get('title') as string;
            const formData: FormData = new FormData();
            formData.append("video", src, `${filename}.mp4`);     
            formData.append('username', username);
            formData.append('tabTitle', title);
            formData.append('tabData', JSON.stringify(UploadVideo.tabChunks));
            // Create a new AbortController instance
            controller = new AbortController();
            const signal = controller.signal;

            // Send the video and tabData to the server
            fetch(url + 'convert', {
                method: 'POST',
                body: formData,
                signal
            })
            .then(response => response.json())
            .then(data => {
                console.log("yo")
                if (data.message) {
                    creatingVideoText.innerHTML = "<p style='text-align: center;'>&#x2705; Upload Complete!</p><p style='text-align: center;'>Check back on your homepage in a few minutes to download your video.</p>";
                    setTimeout(() => {
                        window.location.href = "home.html?username=" + username;
                    }, 5000);
                } else {
                    creatingVideoText.innerHTML = 'Video processing failed. Something went wrong during the upload process.';
                    setTimeout(() => {
                        window.location.href = "home.html?username=" + username;
                    }, 5000);
                }
            })
            .catch(error => {
                creatingVideoText.innerHTML = 'Error: ' + error.message;
                console.error('Fetch error:', error);
            });
        });
    };    

    private initVideoUpload = () => {
        // Get HTML elements
        const videoIcon: HTMLImageElement = document.getElementById("video-icon") as HTMLImageElement;
        const videoEditingToolsContainer: HTMLDivElement = document.getElementById("video-editing-tool-container") as HTMLDivElement;
        const videoInput = document.getElementById('video-upload') as HTMLInputElement;
        const canvas = document.getElementById('video-canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d')!;
        const video: any = document.getElementById("video");
        const timeline = document.getElementById("video-timeline") as HTMLInputElement;
        const pauseIcon: HTMLElement = document.getElementById("pause-icon") as HTMLElement;
        videoIcon.src = logo;
        pauseIcon.style.display = "flex";

        // Six string arrays with different text.
        const strings1 = this.getVideoText(UploadVideo.tab.highEString);
        const strings2 = this.getVideoText(UploadVideo.tab.bString);
        const strings3 = this.getVideoText(UploadVideo.tab.gString);
        const strings4 = this.getVideoText(UploadVideo.tab.dString);
        const strings5 = this.getVideoText(UploadVideo.tab.aString);
        const strings6 = this.getVideoText(UploadVideo.tab.eString);

        // Corresponding time arrays (start and end times for each string)
        const times1 = this.getVideoTime(UploadVideo.tabChunks.highEString);
        const times2 = this.getVideoTime(UploadVideo.tabChunks.bString);
        const times3 = this.getVideoTime(UploadVideo.tabChunks.gString);
        const times4 = this.getVideoTime(UploadVideo.tabChunks.dString);
        const times5 = this.getVideoTime(UploadVideo.tabChunks.aString);
        const times6 = this.getVideoTime(UploadVideo.tabChunks.eString);

        // Settings
        const lineHeight = 50; // Space between lines

        // Track current text for each line
        let currentText = ["", "", "", "", "", ""];


        // Handle file upload and video load
        videoInput.addEventListener("change", (event) => {
            const videoDisplay: HTMLElement = document.getElementById('video-container') as HTMLElement;
            const buttonContainer: HTMLDivElement = document.getElementById("upload-video-buttons-container") as HTMLDivElement;
            const file = (event.target as HTMLInputElement).files?.[0];
            console.log((event.target as HTMLInputElement).files?.[0].type);

            if (file) {
                console.log(file.name, file.type, file.size);
                videoDisplay.style.display = "flex";
                // Initialize the Tutorial Flow.
                if (this.tabTitle === "Tutorial") {
                    this.initSelectClipTutorialFlow();
                }

                // Initialize the Select Clip Feature.
                this.selectClip();

                // Dislplay the Video Editing Tools & hide the Video Upload UI.
                videoEditingToolsContainer.style.display = "block";
                videoIcon.style.display = "none";
                buttonContainer.style.display = "none";

                // Add the Video Play & Pause listener.
                videoEditingToolsContainer.addEventListener("click", () => {
                    if (!UploadVideo.isVideoPlaying) {
                        video.play();
                        UploadVideo.isVideoPlaying = true;
                        pauseIcon.style.display = "none";
                    }
                    else {
                        video.pause();
                        UploadVideo.isVideoPlaying = false;
                        pauseIcon.style.display = "flex";
                    }
                });

                const url = URL.createObjectURL(file);
                video.style.visibility = "hidden";
                video.src = url;
                video.loop = true;

                video.addEventListener("loadedmetadata", () => {
                    const duration = video.duration;
                    console.log("🎥 Video duration:", duration);
                    if (duration > 30) {
                        alert("The video you chose or recorded is too long, please keep the video under 30 seconds.")
                        window.location.reload();
                    } else {
                        UploadVideo.videoDuration = video.duration;
                        this.saveVideo(file, this.tabTitle)
                    }
                }, { once: true });
            }

            video.addEventListener('play', () => {
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
                requestAnimationFrame(drawOverlay);
            });
            
            function drawOverlay() {
                if (video.paused || video.ended) {
                    return;
                }
    
                ctx.clearRect(0, 0, canvas.width, canvas.height);
    
                // Draw video frame to canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
                const textWidthRatio = 0.75; // 75% of video width
                const baseFontRatio = 0.033; // 5% of width for font size (adjust this as needed)
                const lineHeightRatio = 0.15
                const canvasWidth = ctx.canvas.width;
                const fontSize = canvasWidth * baseFontRatio;
                
                ctx.font = `${fontSize}px Monospace`;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = fontSize * 0.002; // optional: adjust line width based on font size
                ctx.textAlign = 'left';
    
                // Display all six strings stacked vertically
                currentText.forEach((text, index) => {
                    if (text) {
                        const textX = 50;
                        const textY = canvas.height - (6 - index) * (lineHeightRatio * 100) - 50;
                        ctx.fillText(text, textX, textY);
                        ctx.strokeText(text, textX, textY);
                    }
                });
    
                requestAnimationFrame(drawOverlay);
            }
        });

        // Function to update text for each line based on video time
        function updateText(strings: string[], times: { start: number; end: number }[], lineIndex: number) {
            const currentTime = video.currentTime;
            currentText[lineIndex] = '';
            times.forEach((time, index) => {
                if (currentTime >= time.start && currentTime < time.end) {
                    currentText[lineIndex] = strings[index];
                }
            });
        }

        // // Toggle play/pause on click
        // videoEditingToolsContainer.addEventListener("click", () => {
        //     if (!video.src) {
        //         return;
        //     }

        //     if (video.paused) {
        //         requestAnimationFrame(drawFrame)
        //         video.play();
        //         pauseIcon.style.display = "none";
        //     } else {
        //         video.pause();
        //         pauseIcon.style.display = "flex";
        //     }
        // });

        // timeline.addEventListener("change", () => {
        //     drawFrame();
        // })

        function drawSingleFrame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }

        // Seek video to the corresponding time when dragging the scroll bar
        timeline.addEventListener("input", () => {
            const seekTime = (Number(timeline.value) / 100) * video.duration;
            if (Number.isNaN(seekTime)) {
                return;
            }
            video.currentTime = seekTime;
            drawSingleFrame(); // Draw the current frame
            video.pause(); // Pause the video
            pauseIcon.style.display = "flex";
        });

        // Update text for all six lines
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            timeline.value = progress.toString();
            updateText(strings1, times1, 0);
            updateText(strings2, times2, 1);
            updateText(strings3, times3, 2);
            updateText(strings4, times4, 3);
            updateText(strings5, times5, 4);
            updateText(strings6, times6, 5);
        });

    };

    private selectClip = () => {
        const tabSegmentsDisplay: HTMLElement = document.getElementById("selected-tab-indicator") as HTMLElement;

        tabSegmentsDisplay.addEventListener("click", () => {
            if (this.tabTitle === "Tutorial") {
                this.initSelectFirstClipTutorialFlow();
            }

            const popupModal: HTMLElement = document.getElementById("popup-modal") as HTMLElement;
            popupModal.innerHTML = this.buildTabChunkHTML();
            this.addClosePopupListener();
            const tabChunks: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName("tab-chunk-text") as HTMLCollectionOf<HTMLElement>;

            for (let i: number = 0; i < tabChunks.length; i++) {
                tabChunks[i].addEventListener("click", (event) => {
                    if (this.tabTitle === "Tutorial") {
                        this.initSetStartPointFlow();
                    }

                    const selectedTabIndicator: HTMLDivElement = document.getElementById("selected-tab-indicator") as HTMLDivElement;

                    for (let i: number = 0; i < tabChunks.length; i++) {
                        tabChunks[i].classList.remove("tab-segment-selected");
                    };

                    selectedTabIndicator.style.backgroundColor = tabChunks[i].getAttribute("color")!;
                    selectedTabIndicator.innerHTML = "Clip " + (i + 1); 
                    this.adjustTabChunkTime(tabChunks[i]);
                    tabChunks[i].classList.add("tab-segment-selected");
                });
            };
            popupModal.style.display = "flex";
        });
    }

    private getUserAccount = async () => {
        // Get the query string from the URL
        const queryString = window.location.search; // For the current page

        // Use URLSearchParams to parse the query string
        const params = new URLSearchParams(queryString);

        // Get individual parameters by name
        const username = params.get('username');
        const userAccount = await fetch(url + "getUserAccount?username=" + username)
        const userAccountData = await userAccount.json()

        // Separate into new function.
        const title = params.get('title');

        if (title === "Tutorial") {
            this.initTutorial();
        }

        this.tabTitle = title!;
        this.user = userAccountData;
        const tab = this.user.tabs.find((tab: any) => { return tab.tabTitle === title});
        UploadVideo.tab = this.splitTabIntoChunks(this.formatTabForPDFExport(tab.tabData));
        UploadVideo.tabChunks = this.splitTabIntoChunks(this.formatTabForPDFExport(tab.tabData));
        this.initVideoUpload();
    }

    private splitTabIntoChunks = (tab: any) => {
        const highESplitArray: string [] = tab.highEString.split("");
        const bSplitArray: string [] = tab.bString.split("");
        const gSplitArray: string [] = tab.gString.split("");
        const dSplitArray: string [] = tab.dString.split("");
        const aSplitArray: string [] = tab.aString.split("");
        const eSplitArray: string [] = tab.eString.split("");

        const highEReturnArray: string [] = [];
        const bReturnArray: string [] = [];
        const gReturnArray: string [] = [];
        const dReturnArray: string [] = [];
        const aReturnArray: string [] = [];
        const eReturnArray: string [] = [];

        const returnObj: any = {
            highEString: [],
            bString: [],
            gString: [],
            dString: [],
            aString: [],
            eString: []
        };

        // The counter doubles as the length of the string that gets displayed on the video.
        let counter: number = 31;
        let timer: number = this.TIMER;

        for (let i: number = 0; i < highESplitArray.length; i++) {
            highEReturnArray.push(highESplitArray[i]);
            bReturnArray.push(bSplitArray[i]);
            gReturnArray.push(gSplitArray[i]);
            dReturnArray.push(dSplitArray[i]);
            aReturnArray.push(aSplitArray[i]);
            eReturnArray.push(eSplitArray[i]);

            if (i === counter || i === highESplitArray.length - 1) {
                highEReturnArray.unshift("E|");
                bReturnArray.unshift("B|");
                gReturnArray.unshift("G|");
                dReturnArray.unshift("D|");
                aReturnArray.unshift("A|");
                eReturnArray.unshift("E|");
                returnObj.highEString.push({text: highEReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.bString.push({text: bReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.gString.push({text: gReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.dString.push({text: dReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.aString.push({text: aReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                returnObj.eString.push({text: eReturnArray.join(""), id: i, time: { start: timer, end: timer + this.TIMER }});
                counter += 31;
                timer += this.TIMER;
                highEReturnArray.splice(0, i);
                bReturnArray.splice(0, i);
                gReturnArray.splice(0, i);
                dReturnArray.splice(0, i);
                aReturnArray.splice(0, i);
                eReturnArray.splice(0, i);
            }
        }

        return returnObj;
    };

    // Format the tab & handle double digit tab cells.
    private formatTabForPDFExport = (rawTabData: any) => {
        const longestString = this.findLongestString(rawTabData);
        const formattedTab: any = {
            highEString: [],
            bString: [],
            gString: [],
            dString: [],
            aString: [],
            eString: []
        };

        // This can be made into a separate function, same with below.
        let highERawLength;
        let bRawLength;
        let gRawLength;
        let dRawLength;
        let aRawLength;
        let eRawLength;
        
        if (typeof rawTabData.highEString === "string") {
            highERawLength = rawTabData.highEString.split("");
            bRawLength = rawTabData.bString.split("");
            gRawLength = rawTabData.gString.split("");
            dRawLength = rawTabData.dString.split("");
            aRawLength = rawTabData.aString.split("");
            eRawLength = rawTabData.eString.split("");
        }
        else {
            highERawLength = rawTabData.highEString;
            bRawLength = rawTabData.bString;
            gRawLength = rawTabData.gString;
            dRawLength = rawTabData.dString;
            aRawLength = rawTabData.aString;
            eRawLength = rawTabData.eString;
        }

        const maxRawLength = Math.max(highERawLength.length, bRawLength.length, gRawLength.length, dRawLength.length, aRawLength.length, eRawLength.length)

        for (let i: number = 0; i < maxRawLength; i++) {
            if (rawTabData.highEString[i] === undefined) {
                rawTabData.highEString += "-";
            }

            if (rawTabData.bString[i] === undefined) {
                rawTabData.bString += "-";
            }

            if (rawTabData.gString[i] === undefined) {
                rawTabData.gString += "-";
            }

            if (rawTabData.dString[i] === undefined) {
                rawTabData.dString += "-";
            }

            if (rawTabData.aString[i] === undefined) {
                rawTabData.aString += "-";
            }

            if (rawTabData.eString[i] === undefined) {
                rawTabData.eString += "-";
            }
        };

        // This whole method is pretty sloppy, consider moving from string and arrays for data to something like objects.
        for (let i: number = 0; i < longestString; i++) {
            const highE = rawTabData.highEString[i];
            const b = rawTabData.bString[i];
            const g = rawTabData.gString[i];
            const d = rawTabData.dString[i];
            const a = rawTabData.aString[i];
            const e = rawTabData.eString[i];
            const prevHighE = rawTabData.highEString[i-1];
            const prevB = rawTabData.bString[i-1];
            const prevG = rawTabData.gString[i-1];
            const prevD = rawTabData.dString[i-1];
            const prevA = rawTabData.aString[i-1];
            const prevE = rawTabData.eString[i-1];
            const nextHighE = rawTabData.highEString[i+1];
            const nextB = rawTabData.bString[i+1];
            const nextG = rawTabData.gString[i+1];
            const nextD = rawTabData.dString[i+1];
            const nextA = rawTabData.aString[i+1];
            const nextE = rawTabData.eString[i+1];

            // High E
            if (
                highE !== "{"
            ) {
                formattedTab.highEString.push(highE);
                if (prevHighE !== "{" && nextHighE !== "}" && highE !== "}") {
                    formattedTab.highEString.push("-");
                }
            }

            // B
            if (
                b !== "{"
            ) {
                formattedTab.bString.push(b);
                if (prevB !== "{" && nextB !== "}" && b !== "}") {
                    formattedTab.bString.push("-");
                }
            }

            // G
            if (
                g !== "{"
            ) {
                formattedTab.gString.push(g);
                if (prevG !== "{" && nextG !== "}" && g !== "}") {
                    formattedTab.gString.push("-");
                }
            }

            // D
            if (
                d !== "{"
            ) {
                formattedTab.dString.push(d);
                if (prevD !== "{" && nextD !== "}" && d !== "}") {
                    formattedTab.dString.push("-");
                }
            }

            // A
            if (
                a !== "{"
            ) {
                formattedTab.aString.push(a);
                if (prevA !== "{" && nextA !== "}" && a !== "}") {
                    formattedTab.aString.push("-");
                }
            }

            // E
            if (
                e !== "{"
            ) {
                formattedTab.eString.push(e);
                if (prevE !== "{" && nextE !== "}" && e !== "}") {
                    formattedTab.eString.push("-");
                }
            }
        }

        const highELength = formattedTab.highEString.join("").split("");
        const bLength = formattedTab.bString.join("").split("");
        const gLength = formattedTab.gString.join("").split("");
        const dLength = formattedTab.dString.join("").split("");
        const aLength = formattedTab.aString.join("").split("");
        const eLength = formattedTab.eString.join("").split("");
        const maxLength = Math.max(highELength.length, bLength.length, gLength.length, dLength.length, aLength.length, eLength.length)

        let tempTab = {
            highEString: [] as string[],
            bString: [] as string[],
            gString: [] as string[],
            dString: [] as string[],
            aString: [] as string[],
            eString: [] as string[]
        }

        // This can be made into a separate function.
        for (let i: number = 0; i < maxLength; i++) {
            tempTab.highEString.push(formattedTab.highEString[i] || "-")
            tempTab.bString.push(formattedTab.bString[i] || "-")
            tempTab.gString.push(formattedTab.gString[i] || "-")
            tempTab.dString.push(formattedTab.dString[i] || "-")
            tempTab.aString.push(formattedTab.aString[i] || "-")
            tempTab.eString.push(formattedTab.eString[i] || "-")
        };

        tempTab = {
            highEString: tempTab.highEString,
            bString: tempTab.bString,
            gString: tempTab.gString,
            dString: tempTab.dString,
            aString: tempTab.aString,
            eString: tempTab.eString
        }

        // Use the index of the last number to determine the length of the pdf doc.
        let indexOfLastNumber = 0;

        // Second loop.
        for (let i: number = 0; i < tempTab.highEString.length; i++) {
            const highE = tempTab.highEString[i] || "-";
            const b = tempTab.bString[i] || "-";
            const g = tempTab.gString[i] || "-";
            const d = tempTab.dString[i] || "-";
            const a = tempTab.aString[i] || "-";
            const e = tempTab.eString[i] || "-";

            if (
                highE !== "-" ||
                b !== "-" ||
                g !== "-" ||
                d !== "-" ||
                a !== "-" ||
                e !== "-"
            ) {
                indexOfLastNumber = i;
            }

            // High E
            if (
                highE === "}"
            ) {
                tempTab.highEString[i] = "-"
            }

            // B
            if (
                b === "}"
            ) {
                tempTab.bString[i] = "-"
            }

            // G
            if (
                g === "}"
            ) {
                tempTab.gString[i] = "-"
            }

            // D
            if (
                d === "}"
            ) {
                tempTab.dString[i] = "-"
            }

            // A
            if (
                a === "}"
            ) {
                tempTab.aString[i] = "-"
            }

            // E
            if (
                e === "}"
            ) {
                tempTab.eString[i] = "-"
            }

            if (
                highE === "}" ||
                b  === "}" ||
                g  === "}" ||
                d  === "}" ||
                a  === "}" ||
                e === "}"
            ) {
                // High E
                if (
                    highE === "}"
                ) {
                    tempTab.highEString[i] = "-"
                }
                else {
                    tempTab.highEString.splice(i, 0, "-");
                }

                // B
                if (
                    b === "}"
                ) {
                    tempTab.bString[i] = "-"
                }
                else {
                    tempTab.bString.splice(i, 0, "-");
                }

                // G
                if (
                    g === "}"
                ) {
                    tempTab.gString[i] = "-"
                }
                else {
                    tempTab.gString.splice(i, 0, "-");
                }

                // D
                if (
                    d === "}"
                ) {
                    tempTab.dString[i] = "-"
                }
                else {
                    tempTab.dString.splice(i, 0, "-");
                }

                // A
                if (
                    a === "}"
                ) {
                    tempTab.aString[i] = "-"
                }
                else {
                    tempTab.aString.splice(i, 0, "-");
                }

                // E
                if (
                    e === "}"
                ) {
                    tempTab.eString[i] = "-"
                }
                else {
                    tempTab.eString.splice(i, 0, "-");
                }
            }
        }

        const returnTab: any = {
            highEString: tempTab.highEString.slice(0, indexOfLastNumber + 4).join(""),
            bString: tempTab.bString.slice(0, indexOfLastNumber + 4).join(""),
            gString: tempTab.gString.slice(0, indexOfLastNumber + 4).join(""),
            dString: tempTab.dString.slice(0, indexOfLastNumber + 4).join(""),
            aString: tempTab.aString.slice(0, indexOfLastNumber + 4).join(""),
            eString: tempTab.eString.slice(0, indexOfLastNumber + 4).join("")
        }

        // Display the Preview Tab.
        const highEStringText: HTMLDivElement = document.getElementById("tab-text-highEString") as HTMLDivElement;
        const bStringText: HTMLDivElement = document.getElementById("tab-text-bString") as HTMLDivElement;
        const gStringText: HTMLDivElement = document.getElementById("tab-text-gString") as HTMLDivElement;
        const dStringText: HTMLDivElement = document.getElementById("tab-text-dString") as HTMLDivElement;
        const aStringText: HTMLDivElement = document.getElementById("tab-text-aString") as HTMLDivElement;
        const eStringText: HTMLDivElement = document.getElementById("tab-text-eString") as HTMLDivElement;

        highEStringText.innerHTML = tempTab.highEString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        bStringText.innerHTML = tempTab.bString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        gStringText.innerHTML = tempTab.gString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        dStringText.innerHTML = tempTab.dString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        aStringText.innerHTML = tempTab.aString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");
        eStringText.innerHTML = tempTab.eString.slice(0, Math.min(
            tempTab.highEString.length, 
            tempTab.bString.length, 
            tempTab.gString.length,
            tempTab.dString.length,
            tempTab.aString.length,
            tempTab.eString.length
        )).join("");

        return returnTab;
    };

    private findLongestString = (rawTabData: any) => {
        const longestString = {
            stringName: "",
            stringLength: 0
        };

        Object.entries(rawTabData).forEach((entry: any) => {
            const name = entry[0];
            const length = entry[1].length;
            if (length > longestString.stringLength) {
                longestString.stringName = name;
                longestString.stringLength = length;
            }
        });

        return longestString.stringLength;
    }
}

const uploadVideo: UploadVideo = new UploadVideo();
uploadVideo.init();

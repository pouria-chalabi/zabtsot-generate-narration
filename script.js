// Use an alternative CORS proxy
const CORS_PROXY = "https://api.codetabs.com/v1/proxy/?quest=";
const radioButtons = document.querySelectorAll('input[name="narrators"]');
const musicRadios = document.querySelectorAll('input[name="music"]');
const narratorSelect = document.getElementById("narratorsel");
let validNames = [];
const nameInput = document.getElementById("nameInput");
const occasionSelect = document.getElementById("occasionSelect");
const messageSelect = document.getElementById("messageSelect");
const musicSelect = document.getElementById("musicsel");
const downloadBtn = document.getElementById("downloadBtn");
const toast = document.getElementById("toast");
const finalDiv = document.getElementById("finaldiv");

let selectednarrator;
let selectedMusicRadio;

// Selecting music
musicRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
        if (radio.value === "music") {
            selectedMusicRadio = true;
            populateMusicOptions();
            updateDownloadButtonState();
        } else {
            selectedMusicRadio = false;
            musicSelect.innerHTML = '<option value="">بدون موسیقی</option>';
            updateDownloadButtonState();
        }
    });
});

// Selecting narrators
radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
        populateNarratorsOptions();
        messageSelect.disabled = !occasionSelect.value;
        updateDownloadButtonState();
    });
});

// Initialize the narrator options when the page loads
populateNarratorsOptions();

function populateNarratorsOptions() {
    narratorSelect.innerHTML = '<option value="">انتخاب گوینده</option>';

    // Find the selected radio button
    let selectedNarrator;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedNarrator = radioButton.value;
            break;
        }
    }

    // Populate options based on the selected narrator type
    if (selectedNarrator === "male") {
        addNarratorOption("گوینده مرد ۱", 0);
        addNarratorOption("گوینده مرد ۲", 1);
    } else if (selectedNarrator === "female") {
        addNarratorOption("گوینده زن ۱", 0);
        addNarratorOption("گوینده زن ۲", 1);
    } else if (selectedNarrator === "child") {
        addNarratorOption("گوینده کودک ۱", 0);
        addNarratorOption("گوینده کودک ۲", 1);
    }
}

function addNarratorOption(text, value) {
    const option = document.createElement("option");
    option.textContent = text;
    option.value = value;
    narratorSelect.appendChild(option);
}

// Event listener for the narrator dropdown (for state updates)
narratorSelect.addEventListener("change", () => {
    messageSelect.disabled = !occasionSelect.value;
    updateDownloadButtonState();
});

// Name validation
async function loadValidNames() {
    try {
        const response = await fetch(`${CORS_PROXY}https://dl.chakava.com/vijeh/names.json`); // Path to your JSON file
        if (!response.ok) throw new Error("Failed to load names");
        const data = await response.json();
        return data.names; // Return the array of names
    } catch (error) {
        console.error("Error loading names:", error);
        return []; // Return an empty array if there's an error
    }
}

loadValidNames().then((names) => {
    validNames = names;
    console.log("Loaded names:", validNames);
});

nameInput.addEventListener("input", () => {
    const searchName = nameInput.value.trim();
    const isValid = validNames.includes(searchName);
    downloadBtn.disabled = !isValid;
    if (!isValid) showToast("نام یافت نشد!");
});

// Occasion change handler
occasionSelect.addEventListener("change", () => {
    messageSelect.disabled = !occasionSelect.value;
    populateMessageOptions();
    updateDownloadButtonState();
});

// Message type change handler
messageSelect.addEventListener("change", updateDownloadButtonState);
musicSelect.addEventListener("change", updateDownloadButtonState);

function updateDownloadButtonState() {
    const allFilled =
        nameInput.value.trim() &&
        occasionSelect.value &&
        messageSelect.value &&
        narratorSelect.value &&
        (selectedMusicRadio ? musicSelect.value : 1);
    downloadBtn.disabled = !allFilled;
    console.log("Music select value:", musicSelect.value);
}

function populateMessageOptions() {
    messageSelect.innerHTML = '<option value="">جمله مورد نظر را انتخاب کنید</option>';
    const occasion = occasionSelect.value;

    if (occasion === "tavallod") {
        addMessageOption("پیام تولد ۱", 0);
        addMessageOption("پیام تولد ۲", 1);
    } else if (occasion === "ezdevaj") {
        addMessageOption("پیام ازدواج ۱", 0);
        addMessageOption("پیام ازدواج ۲", 1);
    } else if (occasion === "norooz") {
        addMessageOption("عزیزم، وسط شلوغی‌های روزمره، نوروز مثل یه نشونه میاد تا بهت یادآوری کنه...", 0);
        addMessageOption("آدم همیشه توی بالا و پایین زندگی، فراموش میکنه که زندگی یعنی حال خوب...", 1);
        addMessageOption("وقتی بهار میاد، انگار دنیا یه پلی‌ لیست شاد پلی کرده...", 2);
        addMessageOption("دوستِ عزیزم، بهار اومده تا بهمون یاد بده که هیچ چیزی موندنی نیست جز عشق و امید...", 3);
        addMessageOption("عید نوروز وقتیه که زمین لبخند میزنه و آسمون بغلشو باز میکنه واسه یه شروع تازه...", 4);
        addMessageOption("بهار، بهونه‌ایه برای فراموش کردنِ غم‌ ها و کاشتن بذر امید تو دلمون. دوست خوبم...", 5);
        addMessageOption("بهار مثل یه نقاشی آبرنگه، همه چی نرم، ملایم و قشنگ کنار هم نشسته...", 6);
    }
}

function populateMusicOptions() {
    musicSelect.innerHTML = '<option value="">موسیقی مورد نظر را انتخاب کنید</option>';
    const occasion = occasionSelect.value;

    if (occasion === "tavallod") {
        addMusicOption("موسیقی تولد ۱", 0);
        addMusicOption("موسیقی تولد ۲", 1);
    } else if (occasion === "ezdevaj") {
        addMusicOption("موسیقی ازدواج ۱", 0);
        addMusicOption("موسیقی ازدواج ۲", 1);
    }
}

function addMessageOption(text, value) {
    const option = document.createElement("option");
    option.textContent = text;
    option.value = value;
    messageSelect.appendChild(option);
}

function addMusicOption(text, value) {
    const option = document.createElement("option");
    option.textContent = text;
    option.value = value;
    musicSelect.appendChild(option);
}

downloadBtn.addEventListener("click", async () => {
    finalDiv.innerHTML = "";
    const spinner = document.getElementById("spinner");
    spinner.style.display = "flex";

    const name = nameInput.value.trim();
    const encodedName = encodeURIComponent(name);
    const occasion = occasionSelect.value;
    let selectedGender;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedGender = radioButton.value;
            break;
        }
    }
    const selectedNarrator = narratorSelect.value;
    const messageIndex = messageSelect.value;
    const musicIndex = musicSelect.value;

    console.log("Name:", name, "Encoded:", encodedName, "Occasion:", occasion, "Message index:", messageIndex);

    try {
        // Validate inputs
        if (!validNames.includes(name)) throw new Error("نام نامعتبر");
        if (!occasion || !messageIndex) throw new Error("لطفا تمام فیلدها را پر کنید");

        // Construct URLs with CORS proxy
        const nameURL = `${CORS_PROXY}https://dl.chakava.com/vijeh/${selectedGender}/${selectedNarrator}/names/${encodedName}.mp3`;
        const occasionURL = `${CORS_PROXY}https://dl.chakava.com/vijeh/${selectedGender}/${selectedNarrator}/occasions/${occasion}/${messageIndex}.mp3`;
        const backgroundAudioUrl = `${CORS_PROXY}https://dl.chakava.com/vijeh/music/${selectedMusicRadio ? occasion : "nomusic"}/${selectedMusicRadio ? musicIndex : "empty"}.mp3`;
        console.log("Background audio URL:", backgroundAudioUrl);

        // Fetch the "name" audio file as an ArrayBuffer
        const nameResponse = await fetch(nameURL);
        if (!nameResponse.ok) {
            throw new Error(`خطا در دریافت فایل صوتی نام: ${nameResponse.status} ${nameResponse.statusText}`);
        }
        const nameArrayBuffer = await nameResponse.arrayBuffer();

        // Call exportMixedAudio to mix occasion audio with background music.
        exportMixedAudio(occasionURL, backgroundAudioUrl, async (mixedBuffer) => {
            // Merge the "name" audio with the mixed audio
            const mergedBlob = await mergeAudios(nameArrayBuffer, mixedBuffer);
            // Download the merged audio file
            downloadFile(mergedBlob, `${name}-${occasion}.mp3`);
        });

        console.log("Name URL:", nameURL, "Occasion URL:", occasionURL);
    } catch (error) {
        showToast(error.message || "خطا در دانلود");
        console.error("Error details:", error);
        spinner.style.display = "none";
    }
});

async function exportMixedAudio(mainAudioUrl, backgroundAudioUrl, callback) {
    try {
        // 1. Create Audio Context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // 2. Fetch and decode audio files concurrently
        const mainPromise = fetch(mainAudioUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch main audio: ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer =>
                new Promise((resolve, reject) => {
                    audioContext.decodeAudioData(arrayBuffer, resolve, reject);
                })
            );

        const backgroundPromise = fetch(backgroundAudioUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch background audio: ${response.status} ${response.statusText}`);
                }
                return response.arrayBuffer();
            })
            .then(arrayBuffer =>
                new Promise((resolve, reject) => {
                    audioContext.decodeAudioData(arrayBuffer, resolve, reject);
                })
            )
            .catch(error => {
                console.warn("Error fetching or decoding background audio:", error);
                return null; // Allow processing without background music
            });

        const [mainAudioBuffer, backgroundAudioBuffer] = await Promise.all([mainPromise, backgroundPromise]);

        // 3. Get the duration of the main audio (adding extra seconds as needed)
        const mainAudioDuration = mainAudioBuffer.duration + 9;

        // 4. Create Audio Source Nodes
        const mainSource = audioContext.createBufferSource();
        mainSource.buffer = mainAudioBuffer;

        let backgroundSource, backgroundGainNode;
        const fadeOutDuration = 1; // 1 second fade-out
        let fadeOutStartTime = mainAudioDuration - fadeOutDuration; // Available for fade-out

        if (backgroundAudioBuffer) {
            backgroundSource = audioContext.createBufferSource();
            backgroundSource.buffer = backgroundAudioBuffer;

            // 5. Create Gain Node for volume control
            backgroundGainNode = audioContext.createGain();
            backgroundGainNode.gain.value = 4; // Set initial background volume

            // 7. Set background audio properties
            backgroundSource.loop = true; // Loop the background audio
            backgroundSource.start(0);
        }

        // 8. Connect the Nodes
        const destination = audioContext.createMediaStreamDestination();
        mainSource.connect(destination);
        if (backgroundAudioBuffer) {
            backgroundSource.connect(backgroundGainNode);
            backgroundGainNode.connect(destination);
        }

        // 9. Start Playback
        mainSource.start(0);

        // 10. Fade-Out Effect for background audio
        if (backgroundAudioBuffer) {
            backgroundGainNode.gain.setValueAtTime(4, audioContext.currentTime);
            backgroundGainNode.gain.linearRampToValueAtTime(0, fadeOutStartTime);
        }

        // 11. Create an offline context to render the mixed audio
        const offlineContext = new OfflineAudioContext(
            audioContext.destination.channelCount,
            audioContext.sampleRate * mainAudioDuration,
            audioContext.sampleRate
        );

        // Create offline source nodes for main audio
        const offlineMainSource = offlineContext.createBufferSource();
        offlineMainSource.buffer = mainAudioBuffer;
        offlineMainSource.connect(offlineContext.destination);
        offlineMainSource.start(0);

        let offlineBackgroundSource, offlineBackgroundGainNode;
        if (backgroundAudioBuffer) {
            offlineBackgroundSource = offlineContext.createBufferSource();
            offlineBackgroundSource.buffer = backgroundAudioBuffer;
            offlineBackgroundGainNode = offlineContext.createGain();
            offlineBackgroundGainNode.gain.value = 4;
            offlineBackgroundSource.connect(offlineBackgroundGainNode);
            offlineBackgroundGainNode.connect(offlineContext.destination);

            offlineBackgroundSource.loop = true;
            offlineBackgroundSource.start(0);

            offlineBackgroundGainNode.gain.setValueAtTime(4, offlineContext.currentTime);
            offlineBackgroundGainNode.gain.linearRampToValueAtTime(0, mainAudioDuration - fadeOutDuration);
        }

        // 12. Render the offline mixed audio and invoke the callback
        offlineContext.startRendering().then(renderedBuffer => {
            offlineMainSource.disconnect();
            if (offlineBackgroundSource) {
                offlineBackgroundSource.disconnect();
                offlineBackgroundGainNode.disconnect();
            }
            callback(renderedBuffer);
        });

    } catch (error) {
        console.error("Error loading or processing audio:", error);
        throw error;
    }
}

async function mergeAudios(nameArrayBuffer, mixedBuffer) {
    // Create an AudioContext for decoding
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Debug: Log the size of the "name" audio data and inspect header bytes
    console.log("Name ArrayBuffer byteLength:", nameArrayBuffer.byteLength);
    const header = new Uint8Array(nameArrayBuffer.slice(0, 3));
    console.log("Header bytes:", header);

    let nameBuffer;
    try {
        nameBuffer = await new Promise((resolve, reject) => {
            audioContext.decodeAudioData(nameArrayBuffer, resolve, reject);
        });
    } catch (error) {
        console.error("Error decoding name audio:", error);
        throw new Error("Unable to decode name audio data.");
    }

    // Total duration is the sum of both audio durations
    const totalDuration = nameBuffer.duration + mixedBuffer.duration;

    // Create an OfflineAudioContext for rendering the merged audio
    const offlineContext = new OfflineAudioContext(
        Math.max(nameBuffer.numberOfChannels, mixedBuffer.numberOfChannels),
        Math.ceil(totalDuration * audioContext.sampleRate),
        audioContext.sampleRate
    );

    // Create a source for the "name" audio and schedule it at time 0
    const source1 = offlineContext.createBufferSource();
    source1.buffer = nameBuffer;
    source1.connect(offlineContext.destination);
    source1.start(0);

    // Create a source for the mixed audio and schedule it to start after the "name" audio
    const source2 = offlineContext.createBufferSource();
    source2.buffer = mixedBuffer;
    source2.connect(offlineContext.destination);
    source2.start(nameBuffer.duration);

    // Render the merged audio
    const renderedBuffer = await offlineContext.startRendering();

    // Convert the rendered AudioBuffer to an MP3 Blob using lamejs
    return await audioBufferToMp3Blob(renderedBuffer);
}

async function audioBufferToMp3Blob(audioBuffer) {
    return new Promise((resolve, reject) => {
        if (typeof lamejs === 'undefined') {
            reject("lamejs is not defined. Make sure it's included in your HTML.");
            return;
        }
        const sampleRate = audioBuffer.sampleRate;
        // For mono encoding, we use channel 0.
        const channelData = audioBuffer.getChannelData(0);
        // Convert Float32 PCM samples to 16-bit PCM
        const int16Data = floatTo16BitPCM(channelData);

        const mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
        const maxSamples = 1152;
        const mp3Data = [];
        for (let i = 0; i < int16Data.length; i += maxSamples) {
            const sampleChunk = int16Data.subarray(i, i + maxSamples);
            const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
            if (mp3buf.length > 0) {
                mp3Data.push(new Int8Array(mp3buf));
            }
        }
        const mp3buf = mp3encoder.flush();
        if (mp3buf.length > 0) {
            mp3Data.push(new Int8Array(mp3buf));
        }
        const blob = new Blob(mp3Data, { type: 'audio/mp3' });
        resolve(blob);
    });
}

// Utility: Convert a Float32Array of PCM data to a Int16Array
function floatTo16BitPCM(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
}

function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    handleMixedAudio(url, filename);
}

function handleMixedAudio(finalurl, filename) {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "none";

    // Clear previous content if needed
    finalDiv.innerHTML = "";

    // Create and append an audio element with controls
    const audioElement = new Audio(finalurl);
    audioElement.controls = true;
    finalDiv.appendChild(audioElement);

    // Create and append a download button
    const buttonElement = document.createElement("button");
    buttonElement.innerHTML = "دانلود";
    finalDiv.appendChild(buttonElement);

    console.log("Final URL:", finalurl, "Filename:", filename);

    // Add event listener to the button
    buttonElement.addEventListener("click", () => {
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = finalurl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(finalurl);
    });
}

function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => (toast.style.display = "none"), 3000);
}

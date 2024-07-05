function styleSlider(volumeSlider) {
    if (volumeSlider) {
        volumeSlider.style.opacity = "1";
        volumeSlider.style.width = "300px";

        volumeSlider.classList += "focused";
        volumeSlider.classList += "pressed";
    } else {
        console.error('Volume slider not found');
    }
}

function styleProgressBar(progressBar) {
    if (progressBar) {
        progressBar.style.background = "#fff";
    } else {
        console.error('Progress bar not found');
    }
}

function styleKnob(knob) {
    if (knob) {
        knob.style.backgroundColor = "#fff";
        knob.style.borderColor = "#fff";
    } else {
        console.error('Slider knob not found');
    }
}

function updateSliderTextValue() {
    let sliderBar = document.getElementById("sliderBar");
    let volumeSlider = document.querySelector("#volume-slider");

    if (sliderBar && volumeSlider) {
        let existingValue = document.getElementById("custom-volume-value-data");
        let currentValue = sliderBar.getAttribute('aria-valuenow') + "%";

        if (!existingValue) {
            let p = document.createElement("p");
            p.id = "custom-volume-value-data";
            p.style.width = "30px"
            p.style.fontWeight = "bolder"
            p.innerHTML = currentValue;
            volumeSlider.appendChild(p);
        } else {
            existingValue.innerHTML = currentValue;
        }
    } else {
        console.error('Slider bar or volume slider not found');
    }
}

function modifyVolumeSlider() {
    const volumeSlider = document.querySelector("#volume-slider");
    styleSlider(volumeSlider);

    const knob = document.querySelector(".slider-knob-inner.style-scope.tp-yt-paper-slider");
    styleKnob(knob);

    const progressBar = document.getElementById("primaryProgress");
    styleProgressBar(progressBar);

    if (volumeSlider && knob && progressBar) {
        observeSlider();
    } else {
        console.error('Cannot observe: missing volume slider, knob, or progress bar');
    }
}

function observeSlider() {
    let sliderBar = document.getElementById("sliderBar");

    if (sliderBar) {
        var observer = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-valuenow') {
                    updateSliderTextValue();
                }
            }
        });

        observer.observe(sliderBar, { attributes: true });
    } else {
        console.error('Slider bar not found for observation');
    }
}

function addEventListeners() {
    const playerBar = document.querySelector('.ytmusic-player-bar');
    if (playerBar) {
        playerBar.addEventListener('mouseover', modifyVolumeSlider);
    } else {
        console.error('Player bar not found for adding event listeners');
    }
}

modifyVolumeSlider();
addEventListeners();
updateSliderTextValue();

const observer = new MutationObserver((mutations, obs) => {
    addEventListeners();
    modifyVolumeSlider();
});

observer.observe(document.body, { childList: true, subtree: true });

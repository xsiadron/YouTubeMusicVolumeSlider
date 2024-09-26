function styleSlider(volumeSlider) {
  if (volumeSlider) {
    volumeSlider.style.opacity = "1";
    volumeSlider.style.width = "300px";

    volumeSlider.classList += "focused";
    volumeSlider.classList += "pressed";
  } else {
    console.error("Volume slider not found");
  }
}

function styleProgressBar(progressBar) {
  if (progressBar) {
    progressBar.style.background = "#fff";
  } else {
    console.error("Progress bar not found");
  }
}

function styleKnob(knob) {
  if (knob) {
    knob.style.backgroundColor = "#fff";
    knob.style.borderColor = "#fff";
  } else {
    console.error("Slider knob not found");
  }
}

function updateSliderTextValue() {
  let sliderBar = document.getElementById("sliderBar");
  let volumeSlider = document.querySelector("#volume-slider");

  if (sliderBar && volumeSlider) {
    let existingValue = document.getElementById("custom-volume-value-data");
    let currentValue = sliderBar.getAttribute("aria-valuenow") + "%";

    if (!existingValue) {
      let p = document.createElement("p");
      p.id = "custom-volume-value-data";
      p.style.width = "30px";
      p.style.fontWeight = "bolder";
      p.innerHTML = currentValue;
      volumeSlider.appendChild(p);
    } else {
      existingValue.innerHTML = currentValue;
    }
  } else {
    console.error("Slider bar or volume slider not found");
  }
}

function modifyVolumeSlider() {
  const volumeSlider = document.querySelector("#volume-slider");
  styleSlider(volumeSlider);

  const knob = document.querySelector(
    ".slider-knob-inner.style-scope.tp-yt-paper-slider"
  );
  styleKnob(knob);

  const progressBar = document.getElementById("primaryProgress");
  styleProgressBar(progressBar);

  if (volumeSlider && knob && progressBar) {
    observeSlider();
  } else {
    console.error(
      "Cannot observe: missing volume slider, knob, or progress bar"
    );
  }
}

function observeSlider() {
  let sliderBar = document.getElementById("sliderBar");

  if (sliderBar) {
    var observer = new MutationObserver(function (mutationsList) {
      for (var mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-valuenow"
        ) {
          updateSliderTextValue();
        }
      }
    });

    observer.observe(sliderBar, { attributes: true });
  } else {
    console.error("Slider bar not found for observation");
  }
}

function modifyLeftControls() {
  const targetNode = document.getElementById("left-controls");

  targetNode.style.width = "";

  const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.attributeName === "style" && targetNode.style.width !== "") {
        targetNode.style.width = "";
      }
    }
  });

  observer.observe(targetNode, {
    attributes: true,
    attributeFilter: ["style"],
  });
}

function modifyExpand() {
  const expandVolumeSlider = document.getElementById("expand-volume-slider");
  const expandingMenu = document.getElementById("expanding-menu");
  const arrowIconButton = document.querySelector(
    ".expand-button.style-scope.ytmusic-player-bar"
  );

  expandVolumeSlider.style.display = "none";
  expandingMenu.style.top = "-10%";
  arrowIconButton.style.setProperty("transform", "rotate(180deg)", "important");

  const styleSheets = document.styleSheets;

  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;

      for (let j = 0; j < rules.length; j++) {
        if (
          rules[j].media &&
          rules[j].media.mediaText === "(max-width: 935px)"
        ) {
          const cssText = rules[j].cssText;

          if (
            cssText.includes(".thumbnail-image-wrapper.ytmusic-player-bar") ||
            cssText.includes(".image.ytmusic-player-bar") ||
            cssText.includes(".time-info.ytmusic-player-bar") ||
            cssText.includes(".thumbs.ytmusic-player-bar")
          ) {
            styleSheets[i].deleteRule(j);
            j--;
          }
        }
      }
    } catch (e) {
      console.log("Could not access stylesheet: ", e);
    }
  }

  applyExpandStyles();
  window.addEventListener("resize", applyExpandStyles);
}

function applyExpandStyles() {
  if (window.innerWidth <= 935) {
    const elements = document.querySelectorAll(
      ".thumbnail-image-wrapper.ytmusic-player-bar, .image.ytmusic-player-bar, .time-info.ytmusic-player-bar, .thumbs.ytmusic-player-bar"
    );

    elements.forEach((element) => {
      element.style.position = "absolute";
      element.style.marginBottom = "100px";
      element.style.padding = "10px";
      element.style.backgroundColor = "#202020";
      element.style.width = "100vw";
      element.style.left = "0";
    });

    elements[2].style.width = "52px";
    elements[2].style.height = "52px";
    elements[2].style.padding = "";
    elements[2].style.transform = "translate(0px, -18px)";

    elements[3].style.marginLeft = "52px";
    elements[3].style.transform = "translateY(-10px)";
  } else {
    const elements = document.querySelectorAll(
      ".thumbnail-image-wrapper.ytmusic-player-bar, .image.ytmusic-player-bar, .time-info.ytmusic-player-bar, .thumbs.ytmusic-player-bar"
    );

    elements.forEach((element) => {
      element.style.position = "";
      element.style.marginBottom = "";
      element.style.padding = "";
      element.style.backgroundColor = "";
      element.style.width = "";
      element.style.left = "";
    });

    elements[2].style.width = "";
    elements[2].style.height = "";
    elements[2].style.padding = "";
    elements[2].style.transform = "";

    elements[3].style.marginLeft = "";
    elements[3].style.transform = "";
  }
}

function addEventListeners() {
  const playerBar = document.querySelector(".ytmusic-player-bar");
  if (playerBar) {
    playerBar.addEventListener("mouseover", modifyVolumeSlider);
  } else {
    console.error("Player bar not found for adding event listeners");
  }
}

modifyVolumeSlider();
addEventListeners();
updateSliderTextValue();
modifyLeftControls();
modifyExpand();

const observer = new MutationObserver((mutations, obs) => {
  addEventListeners();
  modifyVolumeSlider();
  modifyLeftControls();
  modifyExpand();
});

observer.observe(document.body, { childList: true, subtree: true });

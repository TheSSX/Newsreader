"use strict";

/**
 * The starting script which triggers when the user clicks the extension icon
 */
window.onload = function () {
  // Various buttons on the main screen
  var playButton = document.getElementById('playBtn');
  var pauseButton = document.getElementById('pauseBtn');
  var resumeButton = document.getElementById('resumeBtn');
  var stopButton = document.getElementById('stopBtn');

  if (playButton) {
    playButton.addEventListener('click', starter);
  }

  if (pauseButton) {
    pauseButton.addEventListener('click', pauser);
  }

  if (resumeButton) {
    resumeButton.addEventListener('click', resumer);
  }

  if (stopButton) {
    stopButton.addEventListener('click', stopper);
  }
};
/**
 * Start a news bulletin
 */


function starter() {
  stopper(); // stop a currently playing bulletin, if there is one

  chrome.runtime.sendMessage({
    greeting: "play"
  });
}
/**
 * Pause any news bulletins currently playing
 */


function pauser() {
  chrome.runtime.sendMessage({
    greeting: "pause"
  });
}
/**
 * Resume any news bulletins that are currently paused. Does NOT start a new news bulletin
 */


function resumer() {
  chrome.runtime.sendMessage({
    greeting: "resume"
  });
}
/**
 * Stop any news bulletins currently playing. This erases a current news bulletin from memory
 */


function stopper() {
  chrome.runtime.sendMessage({
    greeting: "stop"
  });
}
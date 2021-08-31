(function () {
    function _updateDisplay(rotoscodejsObj) {
        rotoscodejsObj.element.innerHTML = rotoscodejsObj.displayHTML;
        rotoscodejsObj.onRender(rotoscodejsObj.element);
    }

    function _getHTMLForTimestamp(recordingData, runningTimeStamp, interval) {
        let i = recordingData.changeLog.length - 1;
        let nextTimeStamp = (runningTimeStamp + interval);

        do {
            let curItem = recordingData.changeLog[i];

            if (runningTimeStamp <= curItem.timestamp &&
                curItem.timestamp <= nextTimeStamp) {

                return curItem.text;
            } else {
                i--;
            }
        } while (i >= 0);

        return null;
    }

    function _playSnippet(rotoscodejsObj, isLooped) {
        let recordingData = rotoscodejsObj.recordingData;

        let htmlForTimestamp = _getHTMLForTimestamp(recordingData, rotoscodejsObj.runningTimeStamp, rotoscodejsObj.interval);

        if (htmlForTimestamp !== null) {
            rotoscodejsObj.displayHTML = htmlForTimestamp;

            _updateDisplay(rotoscodejsObj);
        }

        rotoscodejsObj.onPlay(rotoscodejsObj.runningTimeStamp, rotoscodejsObj.recordingData.endTimestampMS);

        rotoscodejsObj.runningTimeStamp += rotoscodejsObj.interval;

        if (rotoscodejsObj.runningTimeStamp > recordingData.endTimestampMS) {
            if (isLooped) {
                rotoscodejsObj.runningTimeStamp = 0;
                rotoscodejsObj.displayHTML = recordingData.initialText;
            } else {
                rotoscodejsObj.onPlay(rotoscodejsObj.recordingData.endTimestampMS, rotoscodejsObj.recordingData.endTimestampMS);
                clearInterval(rotoscodejsObj.timer);
            }
        }
    }

    function _jump(rotoscodejsObj, timestamp, isPlaying, isLooped) {
        clearInterval(rotoscodejsObj.timer);

        rotoscodejsObj.runningTimeStamp = timestamp;

        if (timestamp === 0) {
            rotoscodejsObj.displayHTML = rotoscodejsObj.recordingData.initialText ? rotoscodejsObj.recordingData.initialText : '';
        } else {
            rotoscodejsObj.displayHTML = _getHTMLForTimestamp(rotoscodejsObj.recordingData, rotoscodejsObj.runningTimeStamp, rotoscodejsObj.interval);
        }

        _updateDisplay(rotoscodejsObj);

        rotoscodejsObj.onPlay(rotoscodejsObj.runningTimeStamp, rotoscodejsObj.recordingData.endTimestampMS);

        if (isPlaying) {
            rotoscodejsObj.timer = setInterval(() => _playSnippet(rotoscodejsObj, isLooped), rotoscodejsObj.interval);
        }
    }

    window.rotoscodejs = function (opts) {
        let rotoscodejsObj = {
            interval: opts.interval ? opts.interval : 100,
            element: opts.element,
            recordingData: opts.recordingData,
            runningTimeStamp: 0,
            displayHTML: opts.recordingData.initialText ? opts.recordingData.initialText : '',
            timer: null,
            onRender: opts.onRender ? opts.onRender : (() => { }),
            onPlay: opts.onPlay ? opts.onPlay : (() => { })
        };

        if (rotoscodejsObj.displayHTML !== '') {
            _updateDisplay(rotoscodejsObj);
        }

        let _isPlaying = false;
        let _isLooped = false;

        return {
            play: function (isLooped) {
                _isPlaying = true;
                _isLooped = isLooped;

                clearInterval(rotoscodejsObj.timer);

                rotoscodejsObj.timer = setInterval(() => _playSnippet(rotoscodejsObj, isLooped), rotoscodejsObj.interval);
            },
            pause: function () {
                _isPlaying = false;
                _isLooped = false;

                clearInterval(rotoscodejsObj.timer);
            },
            jump: function (timestamp) {
                _isPlaying = false;
                _isLooped = false;

                if (timestamp > rotoscodejsObj.recordingData.endTimestampMS) {
                    timestamp = rotoscodejsObj.recordingData.endTimestampMS;
                } else if (timestamp < 0) {
                    timestamp = 0;
                }

                _jump(rotoscodejsObj, timestamp, _isPlaying, _isLooped);
            },
            stop: function () {
                _isPlaying = false;
                _isLooped = false;

                _jump(rotoscodejsObj, rotoscodejsObj.recordingData.endTimestampMS, _isPlaying, _isLooped);
            },
            updateData: function (recordingData) {
                _isPlaying = false;
                _isLooped = false;

                rotoscodejsObj.recordingData = recordingData;
                rotoscodejsObj.displayHTML = recordingData.initialText ? recordingData.initialText : '';
                rotoscodejsObj.runningTimeStamp = 0;

                _jump(rotoscodejsObj, rotoscodejsObj.runningTimeStamp, _isPlaying, _isLooped);
            }
        }
    }
})();
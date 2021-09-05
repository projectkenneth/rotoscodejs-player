(function() {
    function RotoscodeJSPlayer(opts) {
        let rotoscodejsObj = {
            interval: opts.interval ? opts.interval : 100,
            element: opts.element,
            recordingData: opts.recordingData,
            runningTimeStamp: 0,
            displayHTML: opts.recordingData.initialText ? opts.recordingData.initialText : '',
            timer: null,
            onRender: opts.onRender ? opts.onRender : (() => {}),
            onPlay: opts.onPlay ? opts.onPlay : (() => {})
        };

        if (rotoscodejsObj.displayHTML !== '') {
            _updateDisplay(rotoscodejsObj);
        }

        this.isPlaying = false;
        this.isLooped = false;

        function _updateDisplay() {
            rotoscodejsObj.element.innerHTML = rotoscodejsObj.displayHTML;
            rotoscodejsObj.onRender(rotoscodejsObj.element);
        }

        function _getHTMLForTimestamp() {
            let i = rotoscodejsObj.recordingData.changeLog.length - 1;
            let nextTimeStamp = (rotoscodejsObj.runningTimeStamp + rotoscodejsObj.interval);

            do {
                let curItem = rotoscodejsObj.recordingData.changeLog[i];

                if (rotoscodejsObj.runningTimeStamp <= curItem.timestamp &&
                    curItem.timestamp <= nextTimeStamp) {

                    return curItem.text;
                } else {
                    i--;
                }
            } while (i >= 0);

            return null;
        }

        function _playSnippet() {
            let recordingData = rotoscodejsObj.recordingData;

            let htmlForTimestamp = _getHTMLForTimestamp();

            if (htmlForTimestamp !== null) {
                rotoscodejsObj.displayHTML = htmlForTimestamp;

                _updateDisplay();
            }

            rotoscodejsObj.onPlay(rotoscodejsObj.runningTimeStamp, rotoscodejsObj.recordingData.endTimestampMS);

            rotoscodejsObj.runningTimeStamp += rotoscodejsObj.interval;

            if (rotoscodejsObj.runningTimeStamp > recordingData.endTimestampMS) {
                if (this.isLooped) {
                    rotoscodejsObj.runningTimeStamp = 0;
                    rotoscodejsObj.displayHTML = recordingData.initialText;
                } else {
                    rotoscodejsObj.onPlay(rotoscodejsObj.recordingData.endTimestampMS, rotoscodejsObj.recordingData.endTimestampMS);
                    clearInterval(rotoscodejsObj.timer);
                }
            }
        }

        function _jump(timestamp) {
            clearInterval(rotoscodejsObj.timer);

            rotoscodejsObj.runningTimeStamp = timestamp;

            if (timestamp === 0) {
                rotoscodejsObj.displayHTML = rotoscodejsObj.recordingData.initialText ? rotoscodejsObj.recordingData.initialText : '';
            } else {
                rotoscodejsObj.displayHTML = _getHTMLForTimestamp();
            }

            _updateDisplay();

            rotoscodejsObj.onPlay(rotoscodejsObj.runningTimeStamp, rotoscodejsObj.recordingData.endTimestampMS);

            if (this.isPlaying) {
                rotoscodejsObj.timer = setInterval(() => _playSnippet(), rotoscodejsObj.interval);
            }
        }

        this.play = function(isLooped) {
            this.isPlaying = true;
            this.isLooped = isLooped;

            clearInterval(rotoscodejsObj.timer);

            rotoscodejsObj.timer = setInterval(() => _playSnippet(), rotoscodejsObj.interval);
        };

        this.pause = function() {
            this.isPlaying = false;
            this.isLooped = false;

            clearInterval(rotoscodejsObj.timer);
        }

        this.jump = function(timestamp) {
            this.isPlaying = false;
            this.isLooped = false;

            if (timestamp > rotoscodejsObj.recordingData.endTimestampMS) {
                timestamp = rotoscodejsObj.recordingData.endTimestampMS;
            } else if (timestamp < 0) {
                timestamp = 0;
            }

            _jump(timestamp);
        }

        this.stop = function() {
            this.isPlaying = false;
            this.isLooped = false;

            _jump(rotoscodejsObj.recordingData.endTimestampMS);
        }

        this.updateData = function(recordingData) {
            this.isPlaying = false;
            this.isLooped = false;

            rotoscodejsObj.recordingData = recordingData;
            rotoscodejsObj.displayHTML = recordingData.initialText ? recordingData.initialText : '';

            _jump(0);
        }

        return this;
    }

    window.rotoscodejs = function(opts) {
        return new RotoscodeJSPlayer(opts);
    };
})();
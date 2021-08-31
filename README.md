# RotoscodeJS Player

The embeddable player script used by the [RotoscodeJS Recorder (VS Code Extension)](https://github.com/projectkenneth/rotoscodejs-player).

## Contents
- [Features](#features)
- [Basic Usage](#basic-usage)
- [API](#api)

## Features
* Exposes an `onRender` hook so you can format the code frame-by-frame (like highlight it using a 3rd party code highlighter)
* Fully controllable using its several control functions

## Basic Usage
```
<script src="rotoscodejs-player.min.js" type="text/javascript"></script>
<script type="text/javascript">
    var recordingData = {truncated for simplicity};
    var rotoscodejsObj = rotoscodejs({
        element: document.getElementById('codeplayer'),
        recordingData: recordingData,
        onRender: (el) => {
            // use any highlighter code
            // Example:
            //   hljs.highlightElement(el);
        },
        onPlay: (runningTimestamp, endTimestamp) => {
            // render timestamp somewhere
        }
    });
</script>
```

The above code snippet is already provided by the [RotoscodeJS Recorder (VS Code Extension)](https://github.com/projectkenneth/rotoscodejs-player). To further understand what's happening here, let's break it down. 

There are 4 things you need to define to instantiate a `RotoscodeJS` player:
1. The `element` is basically the HTML element where each frame will be rendered on.
2. The `recordingData` which is the actual frame-by-frame change logged by the recorder.
3. The `onRender` hook. This hook allows for custom processing of the rendered frame. The hook receives the `el` variable which is the HTML element defined earlier. This hook is optional.
4. The `onPlay` hook. This hook receives the `runningTimeStamp` and the `endTimestamp` which allows for displaying the actual playback time somewhere on your page. This hook is optional.

## API
To control the `RotoscodeJS` player, you can call any of the functions below.

| Function | Description |
| --- | --- |
| play | Start or continue playback. |
| pause | Pauses the playback. |
| jump | Jump to a specific timestamp. Playback will be paused. |
| stop | Stops the playback. |
| updateData | Changes the recording data used by the player. Playback will be paused at the first frame of the new recording data. |

For full examples, you can check the `samples` directory.
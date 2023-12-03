# Cassettator-markers

Cassettator-markers is a video.js plugin that lets you add time markers to a video.

## Usage

```javascript
import videojs from 'video.js';
import 'cassettator.js';


const player = videojs('my-player', {
  plugins: {
    cassettatorMarkers: true,
  }
});

player.src({
  src: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8',
  type: 'application/x-mpegURL',
  markers: [
    { startTime: 420, label: 'Marker st 420' },
    { startTime: 1069, label: 'Marker st 1069' }
  ],
});
```

## Customization

You can customize the look and feel of these markers using CSS variables.

| **Variable Name** | **Description** |
|------------------|-----------------|
| `--cst-default-background-color` | Sets default background color to be applied to `.cst-markers:empty` and `.cst-marker` |
| `--cst-markers-background-color` | Sets the background color of the markers in the seek bar. |
| `--cst-marker-background-color` | Sets the background color of the marker in the seek bar. |
| `--cst-marker-played-background-color` | Sets the background color of the played portion of the marker. |
| `--cst-marker-buffered-background-color` | Sets the background color of the buffered portion of the marker. |

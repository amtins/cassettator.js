import videojs from 'video.js';

class TimeTooltipMarker extends videojs.getComponent('TimeTooltip') {
  update(content) {
    this.write(content);
  }

  updateTime(seekBarRect, seekBarPoint, time, cb, label) {
    this.requestNamedAnimationFrame('TimeTooltip#updateTime', () => {
      let content;
      const duration = this.player_.duration();

      if (this.player_.liveTracker && this.player_.liveTracker.isLive()) {
        const liveWindow = this.player_.liveTracker.liveWindow();
        const secondsBehind = liveWindow - seekBarPoint * liveWindow;

        content =
          (secondsBehind < 1 ? '' : '-') +
          videojs.time.formatTime(secondsBehind, liveWindow);
      } else {
        content = videojs.time.formatTime(time, duration);
      }

      if (label) {
        content = `${label} (${content})`;
      }

      this.update(content);

      if (cb) {
        cb();
      }
    });
  }
}

videojs.registerComponent('TimeTooltipMarker', TimeTooltipMarker);

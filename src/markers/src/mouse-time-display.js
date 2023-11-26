import videojs from 'video.js';

class MouseTimeDisplay extends videojs.getComponent('MouseTimeDisplay') {
  constructor(player, options) {
    super(
      player,
      videojs.obj.merge(
        {
          children: [
            {
              componentClass: 'timeTooltipMarker',
              name: 'timeTooltip',
            },
          ],
        },
        options
      )
    );
  }

  /**
   * Returns an array of chapter cues from the 'cassettator-markers' text track.
   *
   * @returns {Array} An array of chapter cues.
   */
  markers() {
    const [chapterTrack = { cues: {} }] = Array.from(
      this.player().textTracks()
    ).filter(({ label }) => label === 'cassettator-markers');

    if (!chapterTrack) return [];

    const chapterCues = Array.from(chapterTrack.cues);

    if (chapterCues) return chapterCues;

    return [];
  }

  update(seekBarRect, seekBarPoint) {
    const time = seekBarPoint * this.player_.duration();
    const { text = '{}' } =
      this.markers().findLast((marker) => time >= marker.startTime) || {};
    const { label = undefined } = JSON.parse(text);

    this.getChild('timeTooltip').updateTime(
      seekBarRect,
      seekBarPoint,
      time,
      () => {
        const seekBarRectWidth = seekBarRect.width;
        const position = seekBarRectWidth * seekBarPoint;
        const timeTooltipWidth = parseFloat(
          videojs.dom.computedStyle(this.el().firstChild, 'width')
        );
        const timeTooltipPosition = position + timeTooltipWidth / 2;

        this.el().style.transform = `translateX(${position}px)`;

        if (
          (timeTooltipPosition >= timeTooltipWidth &&
            timeTooltipPosition <= seekBarRectWidth &&
            this.getChild('timeTooltip').el().style.length === 0) ||
          timeTooltipWidth > seekBarRectWidth
        ) {
          return;
        }

        if (
          timeTooltipPosition >= timeTooltipWidth &&
          timeTooltipPosition <= seekBarRectWidth &&
          this.getChild('timeTooltip').el().style.length
        ) {
          this.getChild('timeTooltip').el().style = '';
          return;
        }

        if (timeTooltipPosition >= seekBarRectWidth) {
          this.getChild(
            'timeTooltip'
          ).el().style.transform = `translateX(calc(-50% - ${Math.abs(
            seekBarRectWidth - timeTooltipPosition
          )}px))`;
        }

        if (timeTooltipPosition <= timeTooltipWidth) {
          this.getChild(
            'timeTooltip'
          ).el().style.transform = `translateX(calc(-50% + ${Math.abs(
            Math.abs(timeTooltipPosition - timeTooltipWidth)
          )}px))`;
        }
      },
      label
    );
  }

  /**
   * Builds the CSS class for the component.
   *
   * @return {string} The CSS class for the component.
   */
  buildCSSClass() {
    return `vjs-simple-markers ${super.buildCSSClass()}`.trim();
  }

  /**
   * Creates the DOM element for the component.
   *
   * @return {HTMLDivElement} The DOM element for the component.
   */
  createEl() {
    return super.createEl();
  }
}

export default videojs.registerComponent('MouseTimeDisplay', MouseTimeDisplay);

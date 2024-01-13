import videojs from 'video.js';

/**
 * @typedef {Object} markerOptions
 *
 * @property {number} gap - The gap between the marker and the next one.
 * @property {number} endTime - The end time of the marker.
 * @property {number} startTime - The start time of the marker.
 */

/**
 * A class representing a marker that will be displayed in the progress bar.
 *
 * @class
 * @extends Component
 */
class MarkerDisplay extends videojs.getComponent('component') {
  /**
   * Initialize a new `MarkerDisplay`.
   * @constructor
   *
   * @param {videojs.Player} player - The player instance.
   * @param {markerOptions} options - The options for the marker component.
   */
  constructor(player, options) {
    super(player, options);
    const { gap } = options;

    this.updateMarkerPlayed = this.updateMarkerPlayed.bind(this);
    this.updateMarkerBuffered = this.updateMarkerBuffered.bind(this);

    this.setMarkerWidth(this.markerWidth(), gap);
    this.player().on('timeupdate', this.updateMarkerPlayed);
    this.player().on('progress', this.updateMarkerBuffered);
  }

  /**
   * Sets the width of the marker element using inline styles.
   *
   * @param {Number} width - The width of the marker as a percentage.
   * @param {string} gap - The gap between the current marker and the next one.
   */
  setMarkerWidth(width, gap) {
    const styleWidth =
      gap !== undefined
        ? `width: calc(${width}% - ${gap})`
        : `width: ${width}%`;

    this.setAttribute('style', styleWidth);
  }

  /**
   * Calculates the width of the marker as a percentage of the player's duration.
   *
   * @return {number} The width of the marker as a percentage.
   */
  markerWidth() {
    const { endTime, startTime } = this.options();

    return ((endTime - startTime) / this.player().duration()) * 100;
  }

  /**
   * Updates the marker background color based on the provided time and the css
   * variable name.
   *
   * @param {number} time - The time (in seconds).
   * @param {string} cssVar - The CSS variable name.
   */
  updateMarker(time = 0, cssVar) {
    const duration = this.player().duration();
    const markersElWidth = this.parentComponent_.el().getClientRects()[0].width;
    const markerOffsetLeft = this.el().offsetLeft;
    const markerOffsetWidth = this.el().offsetWidth;
    const markerStart = (duration * markerOffsetLeft) / markersElWidth;
    const markerEnd =
      (duration * (markerOffsetLeft + markerOffsetWidth)) / markersElWidth;
    const percent = (time - markerStart) / (markerStart - markerEnd);

    if (time > markerEnd) {
      // Setting the value to 200% avoids losing pixel when resizing the player.
      this.el().style.setProperty(cssVar, `200%`);
    }

    if (time < markerStart) {
      this.el().style.setProperty(cssVar, `0%`);
    }

    if (time >= markerStart && time <= markerEnd) {
      this.el().style.setProperty(cssVar, `${Math.abs(percent) * 100}%`);
    }
  }

  /**
   * Updates the buffered portion of the marker.
   */
  updateMarkerBuffered() {
    this.updateMarker(this.player().bufferedEnd(), '--_cst-marker-buffered');
  }

  /**
   * Updates the played portion of the marker.
   */
  updateMarkerPlayed() {
    this.updateMarker(this.player().currentTime(), '--_cst-marker-played');
  }

  // ***************************************************************************
  // Standard component functions **********************************************
  // ***************************************************************************

  /**
   * Builds the CSS class for the marker component.
   *
   * @return {string} The CSS class for the marker component.
   */
  buildCSSClass() {
    return `cst-marker ${super.buildCSSClass()}`.trim();
  }

  /**
   * Creates the DOM element for the marker component.
   *
   * @return {HTMLDivElement} The DOM element for the marker component.
   */
  createEl() {
    return super.createEl('div', {
      className: this.buildCSSClass(),
    });
  }

  /**
   * Disposes of the marker component.
   */
  dispose() {
    this.player().off('timeupdate', this.updateMarkerPlayed);
    this.player().off('progress', this.updateMarkerBuffered);

    super.dispose();
  }
}

export default videojs.registerComponent('MarkerDisplay', MarkerDisplay);

import videojs from 'video.js';

/**
 * @typedef {Object} markerOptions
 *
 * @property {number} gap - The gap between the marker and the next one.
 * @property {number} endTime - The end time of the marker.
 * @property {number} startTime - The start time of the marker.
 */

/**
 * A class representing a marker.
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

    this.updateMarker = this.updateMarker.bind(this);

    this.setMarkerWidth(this.markerWidth(), gap);
    this.player().on('timeupdate', this.updateMarker);
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
   * Updates the marker background color, which uses the player's current time
   * to calculate the percentage of the marker that has been played.
   */
  updateMarker() {
    const currentTime = this.player().currentTime();

    const duration = this.player().duration();
    const markersElWidth = this.parentComponent_.el().getClientRects()[0].width;
    const markerOffsetLeft = this.el().offsetLeft;
    const markerOffsetWidth = this.el().offsetWidth;
    const markerStart = (duration * markerOffsetLeft) / markersElWidth;
    const markerEnd =
      (duration * (markerOffsetLeft + markerOffsetWidth)) / markersElWidth;
    const percent = (currentTime - markerStart) / (markerStart - markerEnd);

    if (currentTime > markerEnd) {
      // Setting the value to 200% avoids losing pixel when resizing the player.
      this.el().style.setProperty('--_cst-marker-played', `200%`);
    }

    if (currentTime < markerStart) {
      this.el().style.setProperty('--_cst-marker-played', `0%`);
    }

    if (currentTime >= markerStart && currentTime <= markerEnd) {
      this.el().style.setProperty('--_cst-marker-played', `${Math.abs(percent) * 100}%`);
    }
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
    this.player().off('timeupdate', this.updateMarker);
    super.dispose();
  }
}

export default videojs.registerComponent('MarkerDisplay', MarkerDisplay);

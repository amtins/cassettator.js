import videojs from 'video.js';

/**
 * A class representing the markers display.
 *
 * This component is designed to be used inside the `SeekBar` component.
 *
 * @class MarkersDisplay
 * @extends videojs.getComponent('component')
 */
class MarkersDisplay extends videojs.getComponent('component') {
  /**
   * Initialize a new `MarkersDisplay`.
   * @constructor
   *
   * @param {import('video.js/dist/types/player').default} player - The player instance.
   * @param {Object} options - The component options.
   */
  constructor(player, options) {
    super(player, options);

    this.resetChildren = this.resetChildren.bind(this);
    this.loadMarkers = this.loadMarkers.bind(this);

    this.player().on('loadstart', this.resetChildren);
    this.player().on('loadeddata', this.loadMarkers);
    this.player().on('playerreset', this.resetChildren);
  }

  /**
   * Adds markers to the component.
   *
   * @param {Array<VTTCue>} markers - An array of markers to add.
   */
  addMarkers(markers = []) {
    const gap = videojs.dom.computedStyle(this.el(), 'gap');

    markers.forEach((marker, index, arr) => {
      if (index === 0 && marker.startTime > 0) {
        const name = 'marker-empty';

        this.addChild(name, {
          className: name,
          componentClass: 'markerDisplay',
          endTime: marker.startTime,
          gap: gap,
          startTime: 0,
        });
      }

      const name = `marker-${index}`;
      const hasNextMarker = arr[index + 1];

      this.addChild(name, {
        className: name,
        componentClass: 'markerDisplay',
        endTime: marker.endTime,
        gap: hasNextMarker ? gap : undefined,
        startTime: marker.startTime,
      });
    });
  }

  /**
   * Loads markers.
   *
   * If track is falsy, it adds a child marker with class
   * name `marker-empty` and sets its start time to 0 and end time to media
   * duration.
   */
  loadMarkers() {
    /** @type {videojs.TextTrack} */
    const markersTrack = Array.from(this.player().textTracks()).find(
      (track) => track.label === 'cassettator-markers'
    );

    if (!markersTrack) {
      this.addChild('marker-empty', {
        className: 'marker-empty',
        componentClass: 'markerDisplay',
        startTime: 0,
        endTime: this.player().duration(),
      });

      return;
    }

    this.addMarkers(markersTrack.cues_);
  }

  /**
   * Dispose all children markers and empty the container element.
   */
  resetChildren() {
    this.children().forEach((/**@type {import('./marker-display.js').default}*/ child) => {
      child.dispose();
    });

    this.children_ = [];

    videojs.dom.emptyEl(this.el());
  }

  // ***************************************************************************
  // Standard component functions **********************************************
  // ***************************************************************************

  /**
   * Builds the default Component class name.
   *
   * @return {string}
   *         The Component class name.
   */
  buildCSSClass() {
    return `cst-markers ${super.buildCSSClass()}`.trim();
  }

  /**
   * Create the Markers display DOM element.
   *
   * @return {HTMLDivElement} The DOM element for the Markers display component.
   */
  createEl() {
    return super.createEl('div', {
      className: this.buildCSSClass(),
    });
  }

  /**
   * Dispose of the Markers and all child components.
   */
  dispose() {
    this.player().off('loadstart', this.resetChildren);
    this.player().off('loadeddata', this.loadMarkers);
    this.player().off('playerreset', this.resetChildren);
    this.resetChildren();

    super.dispose();
  }
}

export default videojs.registerComponent('MarkersDisplay', MarkersDisplay);

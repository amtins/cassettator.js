
import videojs from 'video.js';

import './time-tooltip-marker.js';
import './mouse-time-display.js';
import './marker-display.js';
import './markers-display.js';

import {version as VERSION} from '../../../package.json';

/**
 * @typedef {Object} marker
 *
 * @property {String} label - The label to display.
 * @property {number} startTime - The start time of the marker.
 */


/**
 * A plugin that adds markers to the player's text track.
 *
 * @class
 * @augments videojs.getPlugin('plugin')
 */
class CassettatorMarkers extends videojs.getPlugin('plugin') {
  /**
   * Initializes the plugin.
   *
   * @param {videojs.Player} player - The player instance.
   * @param {Object} options - The plugin options.
   */
  constructor(player, options) {
    super(player, options);

    player.addClass('cassettator-markers');

    // Add the markersDisplay component to the seek bar.
    player.options({
      controlBar: {
        progressControl: {
          seekBar: {
            cassettatorMarkers: {
              componentClass: 'markersDisplay',
            },
          },
        },
      },
    });

    this.loadedMetadata = this.loadedMetadata.bind(this);

    player.on('loadedmetadata', this.loadedMetadata);
  }

  /**
   * Removes all markers from the player's text track and a the new ones.
   *
   * @returns {void}
   */
  loadedMetadata() {
    this.removeMarkers();
    this.addMarkers(this.player.currentSource().markers);
  }

  /**
   * Adds markers to the player's text track.
   *
   * @param {Array<marker>} markers - An array of markers to be added.
   *
   * @returns {void}
   */
  addMarkers(markers = []) {
    if (!markers.length) return;

    /** @type {TextTrack} */
    this.markersTrack = this.player.addTextTrack(
      'metadata',
      'cassettator-markers',
      this.player.language()
    );

    markers.forEach((marker, index, arr) => {
      const nextMarkerIndex = index + 1;
      const nextMarker = arr[nextMarkerIndex];
      /** @type {{startTime: Number}} */
      const { startTime } = marker;
      /** @type {Number} */
      const endTime = nextMarker ? nextMarker.startTime : this.player.duration();
      /** @type{VTTCue} */
      const cue = {
        startTime,
        endTime,
        text: JSON.stringify(marker),
      };

      this.markersTrack.addCue(cue);
    });
  }

  /**
   * Removes all markers from the player's text track.
   *
   * @returns {void}
   */
  removeMarkers() {
    if (!this.markersTrack) return;

    this.markersTrack.stopTracking();
    this.player.textTracks().removeTrack(this.markersTrack);
    this.markersTrack = undefined;
  }

  /**
   * Returns an array of markers.
   *
   * @returns {Array<Object>} An array of markers.
   */
  markers() {
    if (!this.markersTrack) return;

    return this.markersTrack.cues_.map(({ text }) => ({
      ...JSON.parse(text),
    }));
  }
  /**
   * Returns an array of cues.
   *
   * @returns {Array<VTTCue>} An array of cues.
   */
  cues() {
    if (!this.markersTrack) return;

    return this.markersTrack.cues_;
  }

  /**
   * Returns the active cue.
   *
   * @returns {VTTCue|undefined} the active cue.
   */
  activeCue() {
    if (!this.markersTrack) return;

    /** @type {[VTTCue]} */
    const [cue] = this.markersTrack.activeCues_;

    return cue;
  }

  /**
   * Find the index of a specified VTTCue.
   *
   * Will default to the active cue if no parameter is passed.
   *
   * @param {VTTCue} value
   *
   * @returns {Number} the cue index.
   */
  findCueIndex(value = this.activeCue()) {
    return this.cues().findIndex((cue) => cue === value);
  }

  /**
   * Returns the next cue.
   *
   * @returns {VTTCue|undefined} the next cue.
   */
  nextCue() {
    const nextCueIndex = this.findCueIndex() + 1;

    return this.cues()[nextCueIndex];
  }

  /**
   * Returns the previous cue.
   *
   * @returns {VTTCue|undefined} the previous cue.
   */
  previousCue() {
    const previousCueIndex = this.findCueIndex() - 1;

    return this.cues()[previousCueIndex];
  }

  /**
   * Disposes the plugin.
   * - remove the plugin `css` class
   * - remove `loadedmetadata` listener
   * - dispose `cassettatorMarkers` component
   *
   * @returns {void}
   */
  dispose() {
    this.removeMarkers();

    this.player.removeClass('cassettator-markers');
    this.player.off('loadedmetadata', this.loadedMetadata);
    this.player.controlBar.progressControl.seekBar.cassettatorMarkers.dispose();

    super.dispose();
  }

  static get VERSION () {
    return VERSION;
  }
}

/**
 * Registers the `CassettatorMarkers` plugin.
 */
export default videojs.registerPlugin('cassettatorMarkers', CassettatorMarkers);

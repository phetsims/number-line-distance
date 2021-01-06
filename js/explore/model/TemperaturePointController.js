// Copyright 2020, University of Colorado Boulder

/**
 * A point controller for the temperature scene of NLD.
 * This point controller only adds a color property that mimics the color of the map beneath it.
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import ExplorePointController from './ExplorePointController.js';
import PaintColorProperty from '../../../../scenery/js/util/PaintColorProperty.js';

class TemperaturePointController extends ExplorePointController {

  /**
   * @param {function(Vector2):boolean} isPositionInBoundsFunction - see ExplorePointController for explanation
   * @param {Object} [options]
   */
  constructor( isPositionInBoundsFunction, options ) {
    super( isPositionInBoundsFunction, options );

    // @public (read-only) PaintColorProperty is different from this.color where this.color is the point controller's
    //  color for the purposes of the other number-line classes; this colorProperty instead is just representative of
    //  the temperature of this point controller
    this.colorProperty = new PaintColorProperty( 'white' );
  }

}

numberLineDistance.register( 'TemperaturePointController', TemperaturePointController );
export default TemperaturePointController;

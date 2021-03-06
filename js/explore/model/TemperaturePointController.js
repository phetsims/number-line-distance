// Copyright 2020-2021, University of Colorado Boulder

/**
 * A point controller for the temperature scene of NLD that only adds a color property that mimics the color of the map
 * beneath it.
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import AreaPointController from './AreaPointController.js';
import PaintColorProperty from '../../../../scenery/js/util/PaintColorProperty.js';
import Color from '../../../../scenery/js/util/Color.js';
import DropFromDirection from './DropFromDirection.js';

// constants
const NO_TEMPERATURE_COLOR = new Color( 255, 255, 255 );

class TemperaturePointController extends AreaPointController {

  /**
   * @param {Bounds2} playAreaBounds - see ExplorePointController for explanation
   * @param {function(number):Color} temperatureToColorMap - a function that maps a temperature value to a color
   * @param {Object} [options]
   */
  constructor( playAreaBounds, temperatureToColorMap, options ) {
    super( DropFromDirection.TOP, playAreaBounds, options );

    // @public (read-only) {PaintColorProperty} is different from this.color where this.color is the point controller's
    // color for the purposes of the other number-line classes; this colorProperty instead is just representative of
    // the temperature of this point controller.
    this.colorProperty = new PaintColorProperty( NO_TEMPERATURE_COLOR );
    this.positionProperty.link( () => {
      if ( this.isControllingNumberLinePoint() ) {
        this.colorProperty.value = temperatureToColorMap( this.numberLinePoints[ 0 ].valueProperty.value );
      }
      else {
        this.colorProperty.value = NO_TEMPERATURE_COLOR;
      }
    } );
  }

}

numberLineDistance.register( 'TemperaturePointController', TemperaturePointController );
export default TemperaturePointController;

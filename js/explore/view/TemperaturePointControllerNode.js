// Copyright 2020, University of Colorado Boulder

/**
 * A point controller that is a thermometer for use in the temperature scene
 *
 * @author Saurabh Totey
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TemperatureAndColorSensorNode from '../../../../scenery-phet/js/TemperatureAndColorSensorNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import numberLineDistance from '../../numberLineDistance.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// constants
const DEFAULT_TEMPERATURE_VALUE = 0;
const TOUCH_DILATION = 5;

class TemperaturePointControllerNode extends PointControllerNode {

  /**
   * @param {TemperaturePointController} pointController
   * @param {string} label
   * @param {Object} [options]
   * @public
   */
  constructor( pointController, label, options ) {

    // create a node that contains thermometer and triangle
    const compositeThermometerNode = new Node();

    options = merge( {
      node: compositeThermometerNode,
      connectorLine: false,
      thermometerFluidHighlightColor: new Color( 0, 210, 0 )
    }, options );

    // a property that reflects the value of the point controller
    const valueProperty = new DerivedProperty( [ pointController.positionProperty ], position => {
      if ( pointController.isControllingNumberLinePoint() && pointController.isPositionInBoundsFunction( position ) ) {
        return pointController.numberLinePoints.get( 0 ).valueProperty.value;
      }
      return DEFAULT_TEMPERATURE_VALUE;
    } );

    const temperatureAndColorSensorNode = new TemperatureAndColorSensorNode(
      new Range( -50, 50 ), //TODO: don't hardcode this
      valueProperty,
      pointController.colorProperty,
      {
        thermometerNodeOptions: {
          fluidMainColor: pointController.color,
          fluidHighlightColor: options.thermometerFluidHighlightColor,
          backgroundFill: 'rgba( 255, 255, 255, 0.9 )',
          tickSpacingTemperature: 20,
          majorTickLength: 0,
          minorTickLength: 0
        }
      }
    );
    compositeThermometerNode.addChild( temperatureAndColorSensorNode );

    // add the textual label for this thermometer, generally a single letter
    const thermometerLabel = new Text( label, {
      font: new PhetFont( 16 ),
      centerX: temperatureAndColorSensorNode.thermometerBounds.centerX,
      top: temperatureAndColorSensorNode.top + 4, // offset empirically determined
      maxWidth: temperatureAndColorSensorNode.width * 0.25 // multiplier empirically determined
    } );
    compositeThermometerNode.addChild( thermometerLabel );

    // dilate the touch area for easier grabbing
    compositeThermometerNode.touchArea = temperatureAndColorSensorNode.bounds.dilated( TOUCH_DILATION );

    super( pointController, options );
  }
}

numberLineDistance.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
export default TemperaturePointControllerNode;

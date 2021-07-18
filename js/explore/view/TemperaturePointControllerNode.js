// Copyright 2020-2021, University of Colorado Boulder

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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TemperatureSceneModel from '../model/TemperatureSceneModel.js';

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

    // create a node that composites the thermometer and triangle (TemperatureAndColorSensorNode) with the label
    const compositeThermometerNode = new Node();

    options = merge( {
      node: compositeThermometerNode,
      connectorLine: false,
      thermometerFluidHighlightColor: new Color( 0, 210, 0 )
    }, options );

    // a Property that reflects the value of the point controller: is needed for the TemperatureAndColorSensorNode
    const valueProperty = new DerivedProperty( [ pointController.positionProperty ], position => {
      if ( pointController.isControllingNumberLinePoint() && pointController.playAreaBounds.containsPoint( position ) ) {
        return pointController.numberLinePoints.get( 0 ).valueProperty.value;
      }
      return DEFAULT_TEMPERATURE_VALUE;
    } );

    const temperatureAndColorSensorNode = new TemperatureAndColorSensorNode(
      TemperatureSceneModel.TEMPERATURE_RANGE,
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

    // Add the textual label for this thermometer.
    // offset and maxWidth multiplier empirically determined
    const thermometerLabel = new Text( label, {
      font: new PhetFont( 16 ),
      centerX: temperatureAndColorSensorNode.thermometerBounds.centerX,
      top: temperatureAndColorSensorNode.top + 4,
      maxWidth: temperatureAndColorSensorNode.width * 0.25
    } );
    compositeThermometerNode.addChild( thermometerLabel );

    // dilate the touch area for easier grabbing
    compositeThermometerNode.touchArea = temperatureAndColorSensorNode.bounds.dilated( TOUCH_DILATION );

    super( pointController, options );
  }
}

numberLineDistance.register( 'TemperaturePointControllerNode', TemperaturePointControllerNode );
export default TemperaturePointControllerNode;

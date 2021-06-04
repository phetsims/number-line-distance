// Copyright 2020-2021, University of Colorado Boulder

/**
 * 'Temperature' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene2mockup from '../../../images/explorescene2mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TemperaturePointControllerNode from './TemperaturePointControllerNode.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import TemperatureSceneModel from '../model/TemperatureSceneModel.js';
import Utils from '../../../../dot/js/Utils.js';
import antarctic from '../../../images/antarctic_png.js';
import trees from '../../../images/trees_png.js';
import desert from '../../../images/desert_png.js';

const aString = numberLineDistanceStrings.symbol.a;
const bString = numberLineDistanceStrings.symbol.b;
const temperatureSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.temperatureSceneAbsoluteDistanceTemplate;
const temperatureSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.temperatureSceneDirectedPositiveDistanceTemplate;
const temperatureSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.temperatureSceneDirectedNegativeDistanceTemplate;
const degreesCelsiusString = numberLineDistanceStrings.symbol.degreesCelsius;
const degreeString = numberLineDistanceStrings.degree;
const degreesString = numberLineDistanceStrings.degrees;

// constants
const REPRESENTATION_FONT = new PhetFont( 20 );
const NUMBER_OF_TEMPERATURE_GRADIENT_COLOR_STOPS = 5;

class TemperatureSceneView extends Node {

  /**
   * @param {TemperatureSceneModel} model
   */
  constructor( model ) {
    super();

    //TODO: temporary mockup
    const mockup = new Image( explorescene2mockup, {
      center: NLDConstants.NLD_LAYOUT_BOUNDS.center,
      minWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      maxWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // Texts that represent the point controllers in the swap area at the bottom left
    const aText = new Text( aString, { font: REPRESENTATION_FONT } );
    const bText = new Text( bString, { font: REPRESENTATION_FONT } );

    // @private
    this.baseView = new NLDBaseView(
      model,
      aText,
      bText,
      {
        distanceDescriptionStrings: {
          absoluteDistanceDescriptionTemplate: temperatureSceneAbsoluteDistanceTemplateString,
          directedPositiveDistanceDescriptionTemplate: temperatureSceneDirectedPositiveDistanceTemplateString,
          directedNegativeDistanceDescriptionTemplate: temperatureSceneDirectedNegativeDistanceTemplateString,
          singularUnits: degreeString,
          pluralUnits: degreesString,
          getPrimaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? bString : aString,
          getSecondaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? aString : bString
        }
      }
    );
    this.addChild( this.baseView );

    // Links the color of the point controller with the representation texts
    model.pointControllers[ 0 ].positionProperty.link( () => {
      aText.fill = model.pointControllers[ 0 ].color;
    } );
    model.pointControllers[ 1 ].positionProperty.link( () => {
      bText.fill = model.pointControllers[ 1 ].color;
    } );

    // Creates the gradient which shows a continuous color representation of the number line temperature values
    let rectangleGradient = new LinearGradient(
      model.temperatureAreaBounds.minX,
      model.temperatureAreaBounds.minY,
      model.temperatureAreaBounds.maxX,
      model.temperatureAreaBounds.minY
    );
    for ( let i = 0; i < NUMBER_OF_TEMPERATURE_GRADIENT_COLOR_STOPS; i++ ) {
      const ratio = i / ( NUMBER_OF_TEMPERATURE_GRADIENT_COLOR_STOPS - 1 );
      const value = Utils.roundSymmetric(
        TemperatureSceneModel.TEMPERATURE_RANGE.getLength() * ratio + TemperatureSceneModel.TEMPERATURE_RANGE.min
      );
      rectangleGradient = rectangleGradient.addColorStop(
        ratio,
        model.temperatureToColorMapper.mapTemperatureToColor( value )
      );
    }
    this.addChild( new Rectangle( model.temperatureAreaBounds, {
      fill: rectangleGradient
    } ) );

    // Adds images on top of the rectangle gradient
    this.addChild( new Image(
      antarctic,
      {
        left: model.temperatureAreaBounds.left,
        bottom: model.temperatureAreaBounds.bottom,
        maxHeight: model.temperatureAreaBounds.height
      }
    ) );
    this.addChild( new Image(
      trees,
      {
        centerX: model.temperatureAreaBounds.centerX,
        bottom: model.temperatureAreaBounds.bottom,
        maxHeight: model.temperatureAreaBounds.height
      }
    ) );
    this.addChild( new Image(
      desert,
      {
        right: model.temperatureAreaBounds.right,
        bottom: model.temperatureAreaBounds.bottom,
        maxHeight: model.temperatureAreaBounds.height
      }
    ) );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: degreesCelsiusString } );
    this.addChild( numberLineNode );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: [
        new TemperaturePointControllerNode( model.pointControllerOne, aString, {
          thermometerFluidHighlightColor: '#ad3dc3'
        } ),
        new TemperaturePointControllerNode( model.pointControllerTwo, bString )
      ]
    } );
    this.addChild( pointControllerNodeLayer );
  }

  /**
   * This function resets the entire temperature scene view. Right now, all this does is open up accordion box if closed.
   * @public
   */
  reset() {
    this.baseView.accordionBoxOpenedProperty.reset();
  }

}

numberLineDistance.register( 'TemperatureSceneView', TemperatureSceneView );
export default TemperatureSceneView;

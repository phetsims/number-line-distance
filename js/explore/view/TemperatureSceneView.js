// Copyright 2020, University of Colorado Boulder

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

const aString = numberLineDistanceStrings.symbol.a;
const bString = numberLineDistanceStrings.symbol.b;
const temperatureSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.temperatureSceneAbsoluteDistanceTemplate;
const temperatureSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.temperatureSceneDirectedPositiveDistanceTemplate;
const temperatureSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.temperatureSceneDirectedNegativeDistanceTemplate;
const degreesCelsiusString = numberLineDistanceStrings.symbol.degreesCelsius;
const degreeString = numberLineDistanceStrings.degree;
const degreesString = numberLineDistanceStrings.degrees;

const REPRESENTATION_FONT = new PhetFont( 20 );

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

    this.addChild( new NLDBaseView(
      model,
      aText,
      bText,
      temperatureSceneAbsoluteDistanceTemplateString,
      temperatureSceneDirectedPositiveDistanceTemplateString,
      temperatureSceneDirectedNegativeDistanceTemplateString,
      degreeString,
      degreesString,
      isPrimaryNodeSwapped => isPrimaryNodeSwapped ? bString : aString,
      isPrimaryNodeSwapped => isPrimaryNodeSwapped ? aString : bString
    ) );

    // Links the color of the point controller with the representation texts
    model.pointControllers[ 0 ].positionProperty.link( () => {
      aText.fill = model.pointControllers[ 0 ].color;
    } );
    model.pointControllers[ 1 ].positionProperty.link( () => {
      bText.fill = model.pointControllers[ 1 ].color;
    } );

    // REVIEW: In response to the TODO item below, I'd say that the region and temperature mapping should be in the
    //         model, otherwise the little triangles on the temperature-and-color sensors won't work (and they don't as
    //         of this writing). The model could have a getColorForLocation method, and the view could sample it at,
    //         say, 5 locations and set the color stops for those locations based on the sampled color values.  As
    //         currently done, the color values don't match the design very well anyways.

    //
    // TODO: find if there is a way to query a color from a gradient: if that's possible, move this gradient into a
    //  model so that the temperature point controllers can use this to set their color; otherwise, use a function
    //  to map temperature to color (like NLI's TemperatureToColorMapper)
    const rectangleGradient = new LinearGradient(
      model.temperatureAreaBounds.minX,
      model.temperatureAreaBounds.minY,
      model.temperatureAreaBounds.maxX,
      model.temperatureAreaBounds.minY
    ).addColorStop( 0, '#3d4798' ).addColorStop( 0.5, 'white' ).addColorStop( 1, '#ba352d' );
    this.addChild( new Rectangle( model.temperatureAreaBounds, {
      fill: rectangleGradient
    } ) );

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

}

numberLineDistance.register( 'TemperatureSceneView', TemperatureSceneView );
export default TemperatureSceneView;

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
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Util from '../../../../dot/js/Utils.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import TemperaturePointControllerNode from './TemperaturePointControllerNode.js';

const aString = numberLineDistanceStrings.symbol.a;
const bString = numberLineDistanceStrings.symbol.b;
const temperatureSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.temperatureSceneAbsoluteDistanceTemplate;
const temperatureSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.temperatureSceneDirectedPositiveDistanceTemplate;
const temperatureSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.temperatureSceneDirectedNegativeDistanceTemplate;
const degreesCelsiusString = numberLineDistanceStrings.symbol.degreesCelsius;

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

    // a property that returns a string that describes the distance between both the point controllers
    const distanceDescriptionProperty = new DerivedProperty(
      [
        model.distanceRepresentationProperty,
        model.numberLine.orientationProperty,
        model.isPrimaryNodeSwappedProperty,
        model.pointControllers[ 0 ].positionProperty,
        model.pointControllers[ 1 ].positionProperty
      ],
      ( distanceRepresentation, orientation, isPrimaryNodeSwapped, position0, position1 ) => {

        // Can't say anything about distance if both point controllers aren't on the number line
        if ( !model.areBothPointControllersControllingOnNumberLine() ) {
          return '';
        }

        const value0 = model.numberLine.modelPositionToValue( position0 );
        const value1 = model.numberLine.modelPositionToValue( position1 );

        // Get the strings for the point controllers based off of orientation
        let primaryX = aString;
        let secondaryX = bString;

        let difference = Util.roundSymmetric( value1 - value0 );
        if ( isPrimaryNodeSwapped ) {
          difference = -difference;
          primaryX = bString;
          secondaryX = aString;
        }

        // Fills in a string template for the distance text based off of the distance representation
        // and whether the distance is positive or negative
        const fillInValues = {
          primaryX: primaryX,
          secondaryX: secondaryX,
          difference: Math.abs( difference )
        };
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE && difference !== 0 ) {
          return StringUtils.fillIn( temperatureSceneAbsoluteDistanceTemplateString, fillInValues );
        }
        if ( difference > 0 ) {
          return StringUtils.fillIn( temperatureSceneDirectedPositiveDistanceTemplateString, fillInValues );
        }
        else if ( difference < 0 ) {
          return StringUtils.fillIn( temperatureSceneDirectedNegativeDistanceTemplateString, fillInValues );
        }

        // Reaching here means that the difference was 0, so there is nothing to say
        return '';

      }
    );

    // Texts that represent the point controllers in the swap area at the bottom left
    const aText = new Text( aString, { font: REPRESENTATION_FONT } );
    const bText = new Text( bString, { font: REPRESENTATION_FONT } );

    this.addChild( new NLDBaseView( model, aText, bText, distanceDescriptionProperty ) );

    // Links the color of the point controller with the representation texts
    model.pointControllers[ 0 ].positionProperty.link( () => {
      aText.fill = model.pointControllers[ 0 ].color;
    } );
    model.pointControllers[ 1 ].positionProperty.link( () => {
      bText.fill = model.pointControllers[ 1 ].color;
    } );

    //TODO: temporary rectangle
    this.addChild( new Rectangle( model.temperatureAreaBounds, { stroke: 'black' } ) );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: degreesCelsiusString } );
    this.addChild( numberLineNode );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: [
        new TemperaturePointControllerNode( model.pointControllerOne, aString ),
        new TemperaturePointControllerNode( model.pointControllerTwo, bString )
      ]
    } );
    this.addChild( pointControllerNodeLayer );
  }

}

numberLineDistance.register( 'TemperatureSceneView', TemperatureSceneView );
export default TemperatureSceneView;

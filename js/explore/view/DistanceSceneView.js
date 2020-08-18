// Copyright 2020, University of Colorado Boulder

/**
 * 'Distance' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene1mockup from '../../../images/explorescene1mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Util from '../../../../dot/js/Utils.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

const eastString = numberLineDistanceStrings.symbol.east;
const westString = numberLineDistanceStrings.symbol.west;
const houseString = numberLineDistanceStrings.house;
const personString = numberLineDistanceStrings.person;
const distanceSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.distanceSceneAbsoluteDistanceTemplate;
const distanceSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.distanceSceneDirectedPositiveDistanceTemplate;
const distanceSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.distanceSceneDirectedNegativeDistanceTemplate;
const metersString = numberLineDistanceStrings.symbol.meters;

const CARDINALITY_INDICATOR_FONT = new PhetFont( 25 );

class DistanceSceneView extends Node {

  /**
   * @param {DistanceSceneModel} model
   */
  constructor( model ) {
    super();

    //TODO: temporary mockup
    const mockup = new Image( explorescene1mockup, {
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
        let primaryX = houseString;
        let secondaryX = personString;

        let difference = Util.roundSymmetric( value1 - value0 );
        if ( isPrimaryNodeSwapped ) {
          difference = -difference;
          primaryX = personString;
          secondaryX = houseString;
        }

        // Fills in a string template for the distance text based off of the distance representation
        // and whether the distance is positive or negative
        const fillInValues = {
          primaryX: primaryX,
          secondaryX: secondaryX,
          difference: Math.abs( difference )
        };
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE && difference !== 0 ) {
          return StringUtils.fillIn( distanceSceneAbsoluteDistanceTemplateString, fillInValues );
        }
        if ( difference > 0 ) {
          return StringUtils.fillIn( distanceSceneDirectedPositiveDistanceTemplateString, fillInValues );
        } else if ( difference < 0 ) {
          return StringUtils.fillIn( distanceSceneDirectedNegativeDistanceTemplateString, fillInValues );
        }

        // Reaching here means that the difference was 0, so there is nothing to say
        return '';

      }
    );

    this.addChild( new NLDBaseView( model, new Node(), new Node(), distanceDescriptionProperty ) );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: model.pointControllers.map( pointController => new PointControllerNode( pointController ) )
    } );
    this.addChild( pointControllerNodeLayer );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: metersString } );
    this.addChild( numberLineNode );

    // symbols at edges of number line denoting east and west
    const textOffsetFromNumberLine = numberLineNode.options.displayedRangeInset + numberLineNode.options.arrowSize + 15;
    const range = model.numberLine.displayedRangeProperty.value;
    const eastSymbolText = new Text( eastString, {
      font: CARDINALITY_INDICATOR_FONT,
      center: model.numberLine.valueToModelPosition( range.max ).plusXY( textOffsetFromNumberLine, 0 )
    } );
    const westSymbolText = new Text( westString, {
      font: CARDINALITY_INDICATOR_FONT,
      center: model.numberLine.valueToModelPosition( range.min ).plusXY( -textOffsetFromNumberLine, 0 )
    } );
    this.addChild( eastSymbolText );
    this.addChild( westSymbolText );
    eastSymbolText.moveToBack();
    westSymbolText.moveToBack();
  }

}

numberLineDistance.register( 'DistanceSceneView', DistanceSceneView );
export default DistanceSceneView;

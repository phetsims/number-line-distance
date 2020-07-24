// Copyright 2020, University of Colorado Boulder

/**
 * A node that is a number line and shades the distance between point controllers
 * The space between point controllers are only shaded when both point controllers are on the number line
 *
 * @author Saurabh Totey
 */

import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Property from '../../../../axon/js/Property.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Util from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import DistanceRepresentation from '../model/DistanceRepresentation.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import numberLineDistance from '../../numberLineDistance.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import BackgroundNode from '../../../../scenery-phet/js/BackgroundNode.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';

const ARROW_SHAPE_OPTIONS = {
  tailWidth: 3,
  headWidth: 14,
  headHeight: 14
};
// maps a half-width of a range (eg -10 to 10 becomes 10, -30 to 30 becomes 30, etc.) to a scaling factor for the arrow
const ARROW_SCALE_FACTOR = {
  10: 1,
  30: 0.5,
  100: 0.25
};
const DISTANCE_TEXT_PADDING = 50;

class DistanceShadedNumberLineNode extends SpatializedNumberLineNode {

  /**
   *
   * @param {NLDBaseModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    super( model.numberLine, options );

    const pathNode = new Path( null, { stroke: 'gray', fill: 'gray' } );
    this.addChild( pathNode );
    pathNode.moveToBack();

    const distanceText = new Text( '', {
      maxWidth: 50,
      font: new PhetFont( 28 )
    } );
    const distanceTextBackground = new BackgroundNode( distanceText, NLCConstants.LABEL_BACKGROUND_OPTIONS );
    this.addChild( distanceTextBackground );
    model.distanceLabelsVisibleProperty.linkAttribute( distanceTextBackground, 'visible' );

    Property.multilink(
      [
        model.numberLine.displayedRangeProperty,
        model.distanceRepresentationProperty,
        model.isPrimaryNodeSwappedProperty,
        model.numberLine.orientationProperty,
        model.pointControllers[ 0 ].positionProperty,
        model.pointControllers[ 1 ].positionProperty
      ],
      ( displayedRange, distanceRepresentation, isPrimaryNodeSwapped, orientation, position0, position1 ) => {

        if ( !model.areBothPointControllersControllingOnNumberLine() ) {
          distanceText.text = '';
          pathNode.visible = false;
          return;
        }
        pathNode.visible = true;

        // gets number line values for the endpoints (will be clamped if the point is outside the displayed range)
        const halfRange = ( displayedRange.max - displayedRange.min ) / 2;
        const pointOffNumberLineEndpointValueOffset = halfRange * ( ( orientation === Orientation.HORIZONTAL ) ? 0.035 : 0.075 );
        const endpointValueMin = displayedRange.min - pointOffNumberLineEndpointValueOffset;
        const endpointValueMax = displayedRange.max + pointOffNumberLineEndpointValueOffset;
        const value0 = model.numberLine.modelPositionToValue( position0 );
        const value1 = model.numberLine.modelPositionToValue( position1 );
        const endPointValue0 = Util.clamp( value0, endpointValueMin, endpointValueMax );
        const endPointValue1 = Util.clamp( value1, endpointValueMin, endpointValueMax );

        // makes path between nodes
        const valuePosition0 = model.numberLine.valueToModelPosition( endPointValue0 );
        const valuePosition1 = model.numberLine.valueToModelPosition( endPointValue1 );
        let shape = new Shape().moveToPoint( valuePosition0 ).lineToPoint( valuePosition1 );
        let lineWidth = 8;

        // changes shape to arrow if the distance type is directed and the arrow is pointing to a point
        // that is on the number line (it hasn't been clamped)
        if ( distanceRepresentation === DistanceRepresentation.DIRECTED ) {
          const scale = ARROW_SCALE_FACTOR[ halfRange ];
          const scaledArrowShapeOptions = merge( {}, ARROW_SHAPE_OPTIONS, {
            headWidth: ARROW_SHAPE_OPTIONS.headWidth * scale,
            headHeight: ARROW_SHAPE_OPTIONS.headHeight * scale
          } );
          if ( isPrimaryNodeSwapped && value0 === endPointValue0 ) {
            lineWidth = 5;
            shape = new ArrowShape( valuePosition1.x, valuePosition1.y, valuePosition0.x, valuePosition0.y, scaledArrowShapeOptions );
          } else if ( value1 === endPointValue1 ) {
            lineWidth = 5;
            shape = new ArrowShape( valuePosition0.x, valuePosition0.y, valuePosition1.x, valuePosition1.y, scaledArrowShapeOptions );
          }
        }

        pathNode.shape = shape;
        pathNode.lineWidth = lineWidth;

        // calculates the difference to display
        let displayedDifference = value1 - value0;
        if ( isPrimaryNodeSwapped ) {
          displayedDifference = -displayedDifference;
        }
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          displayedDifference = Math.abs( displayedDifference );
        }

        distanceText.text = `${Util.roundSymmetric( displayedDifference )}`;

        // positions distance text
        if ( orientation === Orientation.HORIZONTAL ) {
          distanceTextBackground.bottom = valuePosition0.y - DISTANCE_TEXT_PADDING;
          distanceTextBackground.centerX = ( valuePosition1.x + valuePosition0.x ) / 2;
        } else {
          distanceTextBackground.right = valuePosition0.x - DISTANCE_TEXT_PADDING;
          distanceTextBackground.centerY = ( valuePosition1.y + valuePosition0.y ) / 2;
        }

      }
    );
  }

}

numberLineDistance.register( 'DistanceShadedNumberLineNode', DistanceShadedNumberLineNode );
export default DistanceShadedNumberLineNode;

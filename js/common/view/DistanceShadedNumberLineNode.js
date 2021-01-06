// Copyright 2020, University of Colorado Boulder

/**
 * A node that is a number line and that also shades the distance between point controllers.
 * The space between point controllers is only shaded when both point controllers are on the number line.
 * Is used in every screen and scene of this sim.
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
import Vector2 from '../../../../dot/js/Vector2.js';

const ARROW_SHAPE_OPTIONS = {
  tailWidth: 3,
  headWidth: 14,
  headHeight: 14
};
const DISTANCE_TEXT_PADDING = 50;

class DistanceShadedNumberLineNode extends SpatializedNumberLineNode {

  /**
   * @param {AbstractNLDBaseModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    super( model.numberLine, merge( {
      offScaleIndicatorVerticalOffset: -90, // determined empirically
      offScaleIndicatorHorizontalOffset: -120 // determined empirically
    }, options ) );

    // the path that shades the distance between point controllers
    const distanceShadingPath = new Path( null, { stroke: 'gray', fill: 'gray' } );
    this.addChild( distanceShadingPath );
    distanceShadingPath.moveToBack();

    const distanceText = new Text( '', {
      maxWidth: 50, // determined empirically
      font: new PhetFont( 28 ) // determined empirically
    } );
    const distanceTextBackground = new BackgroundNode( distanceText, NLCConstants.LABEL_BACKGROUND_OPTIONS );
    this.addChild( distanceTextBackground );

    // many features of how this numberline work depend on the model
    // most of the numberline's behaviour is handled in this multilink
    // unlinking unnecessary because every instance of this numberline is present for the lifetime of the sim
    Property.multilink(
      [
        model.distanceLabelsVisibleProperty,
        model.numberLine.displayedRangeProperty,
        model.distanceRepresentationProperty,
        model.isPrimaryControllerSwappedProperty,
        model.numberLine.orientationProperty,
        model.pointControllers[ 0 ].positionProperty,
        model.pointControllers[ 1 ].positionProperty
      ],
      ( distanceLabelsVisible, displayedRange, distanceRepresentation, isPrimaryNodeSwapped, orientation, position0, position1 ) => {

        distanceTextBackground.visible = false;
        distanceShadingPath.visible = false;
        if ( !model.areBothPointControllersControllingOnNumberLine() ) {
          return;
        }
        distanceTextBackground.visible = distanceLabelsVisible;
        distanceShadingPath.visible = true;

        // gets the endpoint positions in model-space of where the tips of the numberline are
        // this usually extends past the min and max values allowed on the numberline because of the inset and
        //  arrows on each end
        // this is needed in case a point is off the scale of the numberline and the shading needs to go all the way
        //  to the end of the numberline
        const insetSize = this.options.displayedRangeInset - this.options.arrowSize;
        const insetVector = model.numberLine.orientationProperty.value === Orientation.HORIZONTAL ?
                            new Vector2( insetSize, 0 ) :
                            new Vector2( 0, -insetSize );
        const endPointPositionMin = model.numberLine.valueToModelPosition( displayedRange.min ).minus( insetVector );
        const endPointPositionMax = model.numberLine.valueToModelPosition( displayedRange.max ).plus( insetVector );

        // gets where on the number line the point controllers are
        // we need both the number line values and their model positions for clamping purposes
        const value0 = model.numberLine.modelPositionToValue( position0 );
        const value1 = model.numberLine.modelPositionToValue( position1 );
        let endPointPosition0 = model.numberLine.valueToModelPosition( value0 );
        let endPointPosition1 = model.numberLine.valueToModelPosition( value1 );

        // clamps endPointPositions to be between endPointPositionMin and endPointPositionMax
        // cannot use Util.clamp because, for example, value0 can be greater than displayedRange.max
        //  while at the same time endPointPosition0 can be less than endPointPositionMax thanks to the inset
        if ( value0 < displayedRange.min ) {
          endPointPosition0 = endPointPositionMin;
        }
        else if ( value0 > displayedRange.max ) {
          endPointPosition0 = endPointPositionMax;
        }
        if ( value1 < displayedRange.min ) {
          endPointPosition1 = endPointPositionMin;
        }
        else if ( value1 > displayedRange.max ) {
          endPointPosition1 = endPointPositionMax;
        }

        // makes shading path between nodes
        let shape = new Shape().moveToPoint( endPointPosition0 ).lineToPoint( endPointPosition1 );
        let lineWidth = 8; // determined empirically

        // changes shape to arrow if the distance type is directed and the arrow is pointing to a point
        // that is on the number line
        if ( distanceRepresentation === DistanceRepresentation.DIRECTED ) {

          // scales the arrow based on how close the point controllers are
          // if the point controllers are too close, then the arrow might be too big and be distorted
          // if the point controllers are closer than 1/20th of the number line's range, they are scaled
          // TODO: current scale determination is arbitrary (e.g. the 1/20th number is pulled from wanting to not scale
          //  on the -10 to 10 range, but then actually determining the new scale by dividing the proportion of the
          //  arrow compared to the numberline's range by 0.05 is arbitrary)
          // TODO: this needs to scale the tail too
          // see #7
          let scale = 1;
          const arrowModelWidth = Math.abs(
            model.numberLine.modelPositionToValue( endPointPosition1 ) - model.numberLine.modelPositionToValue( endPointPosition0 )
          );
          const proportionOfArrowToNumberLine = arrowModelWidth / ( displayedRange.max - displayedRange.min );
          if ( proportionOfArrowToNumberLine < 0.05 ) {
            scale = proportionOfArrowToNumberLine / 0.05;
          }
          const scaledArrowShapeOptions = merge( {}, ARROW_SHAPE_OPTIONS, {
            headWidth: ARROW_SHAPE_OPTIONS.headWidth * scale,
            headHeight: ARROW_SHAPE_OPTIONS.headHeight * scale
          } );

          // only sets the shape to the arrow shape if the point that the arrow points to is in the numberline's range
          // the thinner line width of 5 was determined empirically such that switching from absolute to directed distance
          // doesn't change the width of the shading
          if ( isPrimaryNodeSwapped && displayedRange.min <= value0 && value0 <= displayedRange.max ) {
            lineWidth = 5;
            shape = new ArrowShape( endPointPosition1.x, endPointPosition1.y, endPointPosition0.x, endPointPosition0.y, scaledArrowShapeOptions );
          }
          else if ( !isPrimaryNodeSwapped && displayedRange.min <= value1 && value1 <= displayedRange.max ) {
            lineWidth = 5;
            shape = new ArrowShape( endPointPosition0.x, endPointPosition0.y, endPointPosition1.x, endPointPosition1.y, scaledArrowShapeOptions );
          }
        }

        distanceShadingPath.shape = shape;
        distanceShadingPath.lineWidth = lineWidth;

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
          distanceTextBackground.bottom = endPointPosition0.y - DISTANCE_TEXT_PADDING;
          distanceTextBackground.centerX = ( endPointPosition1.x + endPointPosition0.x ) / 2;
        }
        else {
          distanceTextBackground.right = endPointPosition0.x - DISTANCE_TEXT_PADDING;
          distanceTextBackground.centerY = ( endPointPosition1.y + endPointPosition0.y ) / 2;
        }

      }
    );
  }

}

numberLineDistance.register( 'DistanceShadedNumberLineNode', DistanceShadedNumberLineNode );
export default DistanceShadedNumberLineNode;

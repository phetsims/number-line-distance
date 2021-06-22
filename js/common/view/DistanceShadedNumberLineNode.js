// Copyright 2020-2021, University of Colorado Boulder

/**
 * A node that is a number line and that also shades the distance between number line points.
 * The space between number line points is only shaded when both point controllers are on the number line.
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
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import NLDConstants from '../NLDConstants.js';

const SHADING_COLOR = 'gray';
const SHADING_WIDTH = 8;
const ARROW_SHAPE_OPTIONS = {
  tailWidth: SHADING_WIDTH,
  headWidth: 20,
  headHeight: 20
};
const DISTANCE_TEXT_PADDING = 50;
const MAX_ARROW_HEAD_TO_ARROW_PROPORTION = 0.5;
const POINT_NAME_TEXT_OPTIONS = { maxWidth: 50, font: new MathSymbolFont( 20 ) };

class DistanceShadedNumberLineNode extends SpatializedNumberLineNode {

  /**
   * @param {AbstractNLDBaseModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {
    options = merge( {
      offScaleIndicatorVerticalOffset: -90, // determined empirically
      offScaleIndicatorHorizontalOffset: -120, // determined empirically
      pointNameLabelOffsetFromHorizontalNumberLine: 30,
      pointNameLabelOffsetFromVerticalNumberLine: 42
    }, options );
    super( model.numberLine, options );

    // Create the Path that is the shading for the distance between point controllers.
    const distanceShadingPath = new Path( null, { stroke: null, fill: SHADING_COLOR, lineWidth: SHADING_WIDTH } );
    this.addChild( distanceShadingPath );
    distanceShadingPath.moveToBack();

    // Create the distance label.
    const distanceText = new Text( '', {
      maxWidth: 50, // determined empirically
      font: new PhetFont( 28 ) // determined empirically
    } );
    const distanceTextBackground = new BackgroundNode( distanceText, NLCConstants.LABEL_BACKGROUND_OPTIONS );
    this.addChild( distanceTextBackground );

    // Create text labels for the number line points that label them as x1, x2, y1, or y2
    const pointNameText0 = new RichText( '', POINT_NAME_TEXT_OPTIONS );
    const pointNameText1 = new RichText( '', POINT_NAME_TEXT_OPTIONS );
    const pointNameBackground0 = new BackgroundNode( pointNameText0, NLCConstants.LABEL_BACKGROUND_OPTIONS );
    const pointNameBackground1 = new BackgroundNode( pointNameText1, NLCConstants.LABEL_BACKGROUND_OPTIONS );
    this.addChild( new Node( {
      children: [ pointNameBackground0, pointNameBackground1 ]
    } ) );
    model.pointControllerOne.isDraggingProperty.link( () => { pointNameBackground0.moveToFront(); } );
    model.pointControllerTwo.isDraggingProperty.link( () => { pointNameBackground1.moveToFront(); } );

    // Most of the number line's behaviour is handled in this multilink.
    // Unlinking is unnecessary because every instance of this number line is present for the lifetime of the sim.
    Property.multilink(
      [
        model.distanceLabelsVisibleProperty,
        model.numberLine.displayedRangeProperty,
        model.distanceRepresentationProperty,
        model.isPrimaryControllerSwappedProperty,
        model.numberLine.orientationProperty,
        model.pointValuesProperty
      ],
      ( distanceLabelsVisible, displayedRange, distanceRepresentation, isPrimaryNodeSwapped, orientation, pointValues ) => {

        // Get which strings to use for point names based on the number line orientation.
        // The strings are ordered based on isPrimaryNodeSwapped.
        const labelStrings = orientation === Orientation.VERTICAL ?
          [ NLDConstants.Y_1_STRING, NLDConstants.Y_2_STRING ] : [ NLDConstants.X_1_STRING, NLDConstants.X_2_STRING ];
        if ( isPrimaryNodeSwapped ) {
          const temp = labelStrings[ 0 ];
          labelStrings[ 0 ] = labelStrings[ 1 ];
          labelStrings[ 1 ] = temp;
        }

        pointNameText0.text = labelStrings[ 0 ];
        pointNameText1.text = labelStrings[ 1 ];
        pointNameBackground0.visible = pointValues[ 0 ] !== null;
        pointNameBackground1.visible = pointValues[ 1 ] !== null;

        // Position the texts.
        if ( orientation === Orientation.HORIZONTAL ) {
          pointNameBackground0.centerTop = model.numberLine.valueToModelPosition(
            pointValues[ 0 ] ? pointValues[ 0 ] : 0
          ).plus( new Vector2( 0, options.pointNameLabelOffsetFromHorizontalNumberLine ) );
          pointNameBackground1.centerTop = model.numberLine.valueToModelPosition(
            pointValues[ 1 ] ? pointValues[ 1 ] : 0
          ).plus( new Vector2( 0, options.pointNameLabelOffsetFromHorizontalNumberLine ) );
        }
        else {
          pointNameBackground0.leftCenter = model.numberLine.valueToModelPosition(
            pointValues[ 0 ] ? pointValues[ 0 ] : 0
          ).plus( new Vector2( options.pointNameLabelOffsetFromVerticalNumberLine, 0 ) );
          pointNameBackground1.leftCenter = model.numberLine.valueToModelPosition(
            pointValues[ 1 ] ? pointValues[ 1 ] : 0
          ).plus( new Vector2( options.pointNameLabelOffsetFromVerticalNumberLine, 0 ) );
        }

        // Stop here if both points aren't the number line: we cannot put any shading or distance label.
        if ( !model.areBothPointControllersControllingOnNumberLine() ) {
          distanceTextBackground.visible = false;
          distanceShadingPath.visible = false;
          return;
        }
        distanceTextBackground.visible = distanceLabelsVisible;
        distanceShadingPath.visible = true;

        // Get the endpoint positions in model-space of where the tips of the number line are.
        // This usually extends past the min and max values allowed on the number line because of the inset and
        // arrows on each end.
        // The endpoint positions are needed in case a point is off the scale of the number line and the shading needs
        // to go all the way to the end of the number line.
        const insetSize = this.options.displayedRangeInset - this.options.arrowSize;
        const insetVector = model.numberLine.orientationProperty.value === Orientation.HORIZONTAL ?
                            new Vector2( insetSize, 0 ) :
                            new Vector2( 0, -insetSize );
        const endPointPositionMin = model.numberLine.valueToModelPosition( displayedRange.min ).minus( insetVector );
        const endPointPositionMax = model.numberLine.valueToModelPosition( displayedRange.max ).plus( insetVector );

        // Get where on the number line the point controllers are.
        // We need both the number line values and their model positions for clamping purposes.
        const value0 = pointValues[ 0 ];
        const value1 = pointValues[ 1 ];
        let endPointPosition0 = model.numberLine.valueToModelPosition( value0 );
        let endPointPosition1 = model.numberLine.valueToModelPosition( value1 );

        // Clamp endPointPositions to be between endPointPositionMin and endPointPositionMax.
        // We cannot use Util.clamp because, for example, value0 can be greater than displayedRange.max
        // while at the same time endPointPosition0 can be less than endPointPositionMax thanks to the inset:
        // we are clamping when the values are out of the displayed range, but we are clamping to the end point positions.
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

        // Make the shading shape between nodes.
        let shape = new Shape().moveToPoint( endPointPosition0 ).lineToPoint( endPointPosition1 );
        distanceShadingPath.stroke = SHADING_COLOR;

        // Change the shading shape to an arrow if the distance type is directed and the arrow is pointing to a point
        // that is on the number line.
        if ( distanceRepresentation === DistanceRepresentation.DIRECTED ) {

          // Scale the arrow based on how close the point controllers are.
          // If the point controllers are too close, then the arrow might be too big and be distorted.
          // If the width of the arrow head is greater than MAX_ARROW_HEAD_TO_ARROW_PROPORTION, then the arrow is
          //  scaled down.
          // see #7
          let scale = 1;
          const arrowValueLength = Math.abs(
            model.numberLine.modelPositionToValue( endPointPosition1 ) - model.numberLine.modelPositionToValue( endPointPosition0 )
          );
          let arrowHeadValueLength = Math.abs(
            model.numberLine.modelPositionToValue( endPointPosition0 )
              - model.numberLine.modelPositionToValue( new Vector2( endPointPosition0.x - ARROW_SHAPE_OPTIONS.headHeight, 0 ) )
          );
          if ( orientation === Orientation.VERTICAL ) {
            arrowHeadValueLength = Math.abs(
              model.numberLine.modelPositionToValue( endPointPosition0 )
              - model.numberLine.modelPositionToValue( new Vector2( 0, endPointPosition0.y - ARROW_SHAPE_OPTIONS.headHeight ) )
            );
          }
          const headLengthToArrowLengthProportion = arrowHeadValueLength / arrowValueLength;
          if ( headLengthToArrowLengthProportion > MAX_ARROW_HEAD_TO_ARROW_PROPORTION ) {
            scale = MAX_ARROW_HEAD_TO_ARROW_PROPORTION / headLengthToArrowLengthProportion;
          }
          const scaledArrowShapeOptions = merge( {}, ARROW_SHAPE_OPTIONS, {
            headHeight: ARROW_SHAPE_OPTIONS.headHeight * scale,
            headWidth: ARROW_SHAPE_OPTIONS.headWidth * scale,
            tailWidth: ARROW_SHAPE_OPTIONS.tailWidth * scale
          } );

          // Only set the shape to the arrow shape if the point that the arrow points to is in the number line's range.
          // The stroke is removed so the tail of the arrow can have the correct width.
          if ( isPrimaryNodeSwapped && displayedRange.min <= value0 && value0 <= displayedRange.max ) {
            shape = new ArrowShape( endPointPosition1.x, endPointPosition1.y, endPointPosition0.x, endPointPosition0.y, scaledArrowShapeOptions );
            distanceShadingPath.stroke = null;
          }
          else if ( !isPrimaryNodeSwapped && displayedRange.min <= value1 && value1 <= displayedRange.max ) {
            shape = new ArrowShape( endPointPosition0.x, endPointPosition0.y, endPointPosition1.x, endPointPosition1.y, scaledArrowShapeOptions );
            distanceShadingPath.stroke = null;
          }
        }

        distanceShadingPath.shape = shape;

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

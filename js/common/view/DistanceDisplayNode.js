// Copyright 2020, University of Colorado Boulder

/**
 * A node that displays the distance between two point controllers on a numberline
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import DistanceRepresentation from '../model/DistanceRepresentation.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Property from '../../../../axon/js/Property.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import NLDConstants from '../NLDConstants.js';
import Util from '../../../../dot/js/Utils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';

const ARROW_SHAPE_OPTIONS = {
  tailWidth: 3,
  headWidth: 5,
  headHeight: 5
};

class DistanceDisplayNode extends Node {

  /**
   * @param {NLDBaseModel} model
   */
  constructor( model ) {
    super();

    const pathNode = new Path( null, { stroke: 'gray' } );
    this.addChild( pathNode );

    const distanceText = new Text( '', {
      maxWidth: 50,
      font: new PhetFont( 16 )
    } );
    this.addChild( distanceText );

    Property.multilink(
      [
        model.distanceLabelsVisibleProperty,
        model.numberLine.displayedRangeProperty,
        model.distanceRepresentationProperty,
        model.isPrimaryNodeSwappedProperty,
        model.numberLine.orientationProperty,
        model.numberLine.showPointLabelsProperty,
        model.pointControllers[ 0 ].positionProperty,
        model.pointControllers[ 1 ].positionProperty
      ],
      ( distanceLabelsVisible, displayedRange, distanceRepresentation, isPrimaryNodeSwapped, orientation,
        showPointLabels, position0, position1 ) => {

        // controls visibility
        this.visible = distanceLabelsVisible && model.areBothPointControllersControllingOnNumberLine();
        if ( !this.visible ) {
          return;
        }

        // gets number line values for the endpoints (will be clamped if the point is outside the displayed range)
        const pointOffNumberLineEndpointValueOffset = ( orientation === Orientation.HORIZONTAL ) ? 0.4 : 0.75;
        const endpointValueMin = displayedRange.min - pointOffNumberLineEndpointValueOffset;
        const endpointValueMax = displayedRange.max + pointOffNumberLineEndpointValueOffset;
        const value0 = model.numberLine.modelPositionToValue( position0 );
        const value1 = model.numberLine.modelPositionToValue( position1 );
        const endPointValue0 = Util.clamp( value0, endpointValueMin, endpointValueMax );
        const endPointValue1 = Util.clamp( value1, endpointValueMin, endpointValueMax );

        // makes path between nodes
        const valuePosition0 = model.numberLine.valueToModelPosition( endPointValue0 );
        const valuePosition1 = model.numberLine.valueToModelPosition( endPointValue1 );
        let shape;
        let lineWidth = 5;
        if ( distanceRepresentation === DistanceRepresentation.DIRECTED ) {
          if ( isPrimaryNodeSwapped ) {
            shape = new ArrowShape( valuePosition1.x, valuePosition1.y, valuePosition0.x, valuePosition0.y, ARROW_SHAPE_OPTIONS );
          } else {
            shape = new ArrowShape( valuePosition0.x, valuePosition0.y, valuePosition1.x, valuePosition1.y, ARROW_SHAPE_OPTIONS );
          }
        } else {
          shape = new Shape().moveToPoint( valuePosition0 ).lineToPoint( valuePosition1 );
          lineWidth = 8;
        }
        pathNode.shape = shape;
        pathNode.lineWidth = lineWidth;

        // makes the text that displays the difference
        let displayedDifference = value1 - value0;
        if ( isPrimaryNodeSwapped ) {
          displayedDifference = -displayedDifference;
        }
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          displayedDifference = Math.abs( displayedDifference );
        }
        distanceText.text = `${Util.roundSymmetric( displayedDifference )}`;

        // positions text
        let padding = 20;
        if ( showPointLabels ) {
          padding += 25;
        }
        if ( displayedDifference === 0 ) {
          distanceText.center = NLDConstants.NLD_LAYOUT_BOUNDS.center;
        } else if ( orientation === Orientation.HORIZONTAL ) {
          distanceText.bottom = pathNode.top - padding;
          distanceText.centerX = pathNode.centerX;
        } else {
          distanceText.right = pathNode.left - padding;
          distanceText.centerY = pathNode.centerY;
        }

      }
    );

  }

}

numberLineDistance.register( 'DistanceDisplayNode', DistanceDisplayNode );
export default DistanceDisplayNode;

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

class DistanceDisplayNode extends Node {

  /**
   * @param {NLDModel} model
   */
  constructor( model ) {
    super();

    /**
     * A function that returns whether both points are on the number line
     */
    const bothPointControllersOnNumberLine = () => model.pointControllers.every( pointController => {
      if ( !pointController.isControllingNumberLinePoint() ) {
        return false;
      }
      const numberLinePoint = pointController.numberLinePoints[ 0 ];
      return model.numberLine.hasPoint( numberLinePoint );
    } );

    const pathNode = new Path( null, {
      lineWidth: 5,
      stroke: 'gray'
    } );
    this.addChild( pathNode );

    const distanceText = new Text( '', {
      maxWidth: 50,
      font: new PhetFont( 16 )
    } );
    this.addChild( distanceText );

    Property.multilink(
      [
        model.distanceLabelsVisibleProperty,
        model.distanceRepresentationProperty,
        model.isPrimaryNodeSwappedProperty,
        model.numberLine.orientationProperty,
        model.numberLine.showPointLabelsProperty,
        model.pointControllers[ 0 ].positionProperty,
        model.pointControllers[ 1 ].positionProperty
      ],
      ( distanceLabelsVisible, distanceRepresentation, isPrimaryNodeSwapped, orientation, showPointLabels, position0, position1 ) => {

        // controls visibility
        this.visible = distanceLabelsVisible && bothPointControllersOnNumberLine();
        if ( !this.visible ) {
          return;
        }

        // gets number line values
        const value0 = model.numberLine.modelPositionToValue( position0 );
        const value1 = model.numberLine.modelPositionToValue( position1 );

        // makes path between nodes
        const valuePosition0 = model.numberLine.valueToModelPosition( value0 );
        const valuePosition1 = model.numberLine.valueToModelPosition( value1 );
        const shape = new Shape().moveToPoint( valuePosition0 ).lineToPoint( valuePosition1 );
        if ( distanceRepresentation === DistanceRepresentation.DIRECTED ) {
          //TODO: add arrow to shape from 1 to 0 if isPrimaryNodeSwapped or otherwise 0 to 1
        }
        pathNode.shape = shape;

        // makes the text that displays the difference
        let displayedDifference = value1 - value0;
        if ( isPrimaryNodeSwapped ) {
          displayedDifference = -displayedDifference;
        }
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          displayedDifference = Math.abs( displayedDifference );
        }
        displayedDifference = Util.roundSymmetric( displayedDifference );
        if ( displayedDifference === 0 ) { //TODO: I think this condition is wrong: it is question mark when a point is on the number line but outside the displayed range
          displayedDifference = '?';
        }
        distanceText.text = `${displayedDifference}`;

        // positions text
        let padding = 20;
        if ( showPointLabels ) {
          padding += 25;
        }
        if ( displayedDifference === '?' ) {
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

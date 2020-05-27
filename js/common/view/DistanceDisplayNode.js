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

    Property.multilink(
      [
        model.distanceLabelsVisibleProperty,
        model.distanceRepresentationProperty,
        model.isPrimaryNodeSwappedProperty,
        model.numberLine.orientationProperty,
        model.pointControllers[ 0 ].positionProperty,
        model.pointControllers[ 1 ].positionProperty
      ],
      ( distanceLabelsVisible, distanceRepresentation, isPrimaryNodeSwapped, orientation, position0, position1 ) => {

        // controls visibility
        this.visible = distanceLabelsVisible && bothPointControllersOnNumberLine();
        if ( !this.visible ) {
          return;
        }

        // makes path between nodes
        const valuePosition0 = model.numberLine.valueToModelPosition( model.numberLine.modelPositionToValue( position0 ) );
        const valuePosition1 = model.numberLine.valueToModelPosition( model.numberLine.modelPositionToValue( position1 ) );
        const shape = new Shape().moveToPoint( valuePosition0 ).lineToPoint( valuePosition1 );
        if ( distanceRepresentation === DistanceRepresentation.DIRECTED ) {
          //TODO: add arrow to shape depending on whether isPrimaryNodeSwapped
        }
        pathNode.shape = shape;

        // TODO: text

      }
    );

  }

}

numberLineDistance.register( 'DistanceDisplayNode', DistanceDisplayNode );
export default DistanceDisplayNode;

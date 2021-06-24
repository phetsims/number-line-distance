// Copyright 2021, University of Colorado Boulder

/**
 * A point controller node that is meant for use in the distance scene.
 * Is useful because the center of a point controller node's image changes in this scene
 * depending on whether the point controller is locked on to the number line.
 *
 * @author Saurabh Totey
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import numberLineDistance from '../../numberLineDistance.js';

class DistancePointControllerNode extends PointControllerNode {

  /**
   * @param {PointController} pointController
   * @param {Image} image
   * @public
   */
  constructor( pointController, image ) {
    image.centerX = 0;
    image.centerY = 0;

    super( pointController, {
      connectorLine: false,
      node: new Node( { children: [ image ] } )
    } );

    // Listen for when number line points are added and removed and
    // update the image's center depending on whether this point controller has a number line point.
    // When not controlling a point, the image center should be (0, 0) so the image sits nicelly within the box,
    // but otherwise when controlling a point and locked on, the center should switch to the bottom of the image.
    pointController.numberLinePoints.addItemAddedListener( numberLinePoint => {
      image.centerY = -image.height / 2;
      const itemRemovedListener = removedNumberLinePoint => {
        if ( removedNumberLinePoint === numberLinePoint ) {
          image.centerY = 0;
          pointController.numberLinePoints.removeItemRemovedListener( itemRemovedListener );
        }
      };
      pointController.numberLinePoints.addItemRemovedListener( itemRemovedListener );
    } );
  }

}

numberLineDistance.register( 'DistancePointControllerNode', DistancePointControllerNode );
export default DistancePointControllerNode;

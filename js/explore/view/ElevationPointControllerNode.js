// Copyright 2019-2020, University of Colorado Boulder

/**
 * a Scenery node that is used to control point positions in the "Elevation" scene of the Number Line Distance sim
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';

// constants
const IMAGE_DILATION = 20;

class ElevationPointControllerNode extends PointControllerNode {

  /**
   * @param {PointController} pointController
   * @param {Image} belowSeaLevelImage - what this node should look like when below sea-level
   * @param {Image} aboveSeaLevelImage - what this node should look like when above sea-level
   * @public
   */
  constructor( pointController, belowSeaLevelImage, aboveSeaLevelImage ) {

    // dilates each image's touch area
    belowSeaLevelImage.touchArea = belowSeaLevelImage.localBounds.dilated( IMAGE_DILATION );
    aboveSeaLevelImage.touchArea = aboveSeaLevelImage.localBounds.dilated( IMAGE_DILATION );

    // create a node with all the images that will be used to depict this elevatable item
    const compositeImageNode = new Node( { children: [ belowSeaLevelImage, aboveSeaLevelImage ]} );

    // update the visibility of the images as the position changes
    // TODO: this doesn't behave the same as it does in NLI: in NLI it doesn't matter if the point controllers are within bounds
    pointController.positionProperty.link( () => {
      if ( pointController.isControllingNumberLinePoint() && pointController.numberLinePoints[ 0 ].valueProperty.value < 0 ) {
        aboveSeaLevelImage.visible = false;
        belowSeaLevelImage.visible = true;
      } else {
        aboveSeaLevelImage.visible = true;
        belowSeaLevelImage.visible = false;
      }
    } );

    super( pointController, {
      node: compositeImageNode,
      connectorLine: false
    } );
  }

}

numberLineDistance.register( 'ElevationPointControllerNode', ElevationPointControllerNode );
export default ElevationPointControllerNode;

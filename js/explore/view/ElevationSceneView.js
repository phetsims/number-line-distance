// Copyright 2020, University of Colorado Boulder

/**
 * 'Elevation' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene3mockup from '../../../images/explorescene3mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';

const metersString = numberLineDistanceStrings.symbol.meters;

class ElevationSceneView extends Node {

  /**
   * @param {ElevationSceneModel} model
   */
  constructor( model ) {
    super();

    //TODO: temporary mockup
    const mockup = new Image( explorescene3mockup, {
      center: NLDConstants.NLD_LAYOUT_BOUNDS.center,
      minWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      maxWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    this.addChild( new NLDBaseView( model, new Node(), new Node(), new StringProperty( 'TODO:' ) ) );

    //TODO: temporary rectangle
    this.addChild( new Rectangle( model.elevationAreaBounds, { stroke: 'black' } ) );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: model.pointControllers.map( pointController => new PointControllerNode( pointController, { connectorLine: false } ) )
    } );
    this.addChild( pointControllerNodeLayer );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: metersString } );
    this.addChild( numberLineNode );
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

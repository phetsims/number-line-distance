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
import NLDCommonElementsView from '../../common/view/NLDCommonElementsView.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';

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

    //TODO:

    this.addChild( new NLDCommonElementsView( model, new Node(), new Node(), new StringProperty( 'TODO:' ), new Rectangle( 0, 0, 340, 35 ) ) );
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

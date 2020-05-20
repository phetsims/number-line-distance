// Copyright 2020, University of Colorado Boulder

/**
 * 'Elevation' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import SceneView from './SceneView.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene3mockup from '../../../images/explorescene3mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';

class ElevationSceneView extends SceneView {

  /**
   * @param {ElevationSceneModel} model
   */
  constructor( model ) {
    super();
    //TODO: temporary mockup
    const mockup = new Image( explorescene3mockup, {
      center: NLDConstants.LAYOUT_BOUNDS.center,
      minWidth: NLDConstants.LAYOUT_BOUNDS.width,
      maxWidth: NLDConstants.LAYOUT_BOUNDS.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    //TODO:
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

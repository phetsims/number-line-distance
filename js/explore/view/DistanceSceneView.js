// Copyright 2020, University of Colorado Boulder

/**
 * 'Distance' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import SceneView from './SceneView.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene1mockup from '../../../images/explorescene1mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';

class DistanceSceneView extends SceneView {

  /**
   * @param {DistanceSceneModel} model
   * @param {Bounds2} layoutBounds
   */
  constructor( model, layoutBounds ) {
    super( model, layoutBounds );

    //TODO: temporary mockup
    const mockup = new Image( explorescene1mockup, {
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

numberLineDistance.register( 'DistanceSceneView', DistanceSceneView );
export default DistanceSceneView;

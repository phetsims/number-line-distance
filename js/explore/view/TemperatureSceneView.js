// Copyright 2020, University of Colorado Boulder

/**
 * 'Temperature' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene2mockup from '../../../images/explorescene2mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';

const degreesCelsiusString = numberLineDistanceStrings.symbol.degreesCelsius;

class TemperatureSceneView extends Node {

  /**
   * @param {TemperatureSceneModel} model
   */
  constructor( model ) {
    super();

    //TODO: temporary mockup
    const mockup = new Image( explorescene2mockup, {
      center: NLDConstants.NLD_LAYOUT_BOUNDS.center,
      minWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      maxWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    this.addChild( new NLDBaseView( model, new Node(), new Node(), new StringProperty( 'TODO:' ) ) );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: model.pointControllers.map( pointController => new PointControllerNode( pointController ) )
    } );
    this.addChild( pointControllerNodeLayer );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: degreesCelsiusString } );
    this.addChild( numberLineNode );
  }

}

numberLineDistance.register( 'TemperatureSceneView', TemperatureSceneView );
export default TemperatureSceneView;

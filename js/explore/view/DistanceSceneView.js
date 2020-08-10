// Copyright 2020, University of Colorado Boulder

/**
 * 'Distance' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene1mockup from '../../../images/explorescene1mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

const eastString = numberLineDistanceStrings.symbol.east;
const westString = numberLineDistanceStrings.symbol.west;

const CARDINALITY_INDICATOR_FONT = new PhetFont( 25 );

class DistanceSceneView extends Node {

  /**
   * @param {DistanceSceneModel} model
   */
  constructor( model ) {
    super();

    //TODO: temporary mockup
    const mockup = new Image( explorescene1mockup, {
      center: NLDConstants.NLD_LAYOUT_BOUNDS.center,
      minWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      maxWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    //TODO:
    this.addChild( new NLDBaseView( model, new Node(), new Node(), new StringProperty( 'TODO:' ) ) );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: model.pointControllers.map( pointController => new PointControllerNode( pointController ) )
    } );
    this.addChild( pointControllerNodeLayer );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model );
    this.addChild( numberLineNode );

    // symbols at edges of number line denoting east and west
    const eastSymbolText = new Text( eastString, {
      font: CARDINALITY_INDICATOR_FONT,
      center: model.numberLine.valueToModelPosition( 10 ).plusXY( 50, 0 )
    } );
    const westSymbolText = new Text( westString, {
      font: CARDINALITY_INDICATOR_FONT,
      center: model.numberLine.valueToModelPosition( -10 ).plusXY( -50, 0 )
    } );
    this.addChild( eastSymbolText );
    this.addChild( westSymbolText );
    eastSymbolText.moveToBack();
    westSymbolText.moveToBack();
  }

}

numberLineDistance.register( 'DistanceSceneView', DistanceSceneView );
export default DistanceSceneView;

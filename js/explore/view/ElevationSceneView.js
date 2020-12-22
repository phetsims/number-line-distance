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
import ElevationPointControllerNode from './ElevationPointControllerNode.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import fishInWater from '../../../../number-line-common/images/fish-water_png.js';
import fishInAir from '../../../../number-line-common/images/fish-air_png.js';
import birdInWater from '../../../../number-line-common/images/bird-water_png.js';
import birdInAir from '../../../../number-line-common/images/bird-air_png.js';

const fishString = numberLineDistanceStrings.fish;
const birdString = numberLineDistanceStrings.bird;
const elevationSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.elevationSceneAbsoluteDistanceTemplate;
const elevationSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedPositiveDistanceTemplate;
const elevationSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedNegativeDistanceTemplate;
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

    this.addChild(
      new NLDBaseView(
        model,
        new Image( birdInAir, { center: new Vector2( 0, -10 ), maxWidth: 30 } ),
        new Image( fishInAir, { center: Vector2.ZERO, maxWidth: 30 } ),
        elevationSceneAbsoluteDistanceTemplateString,
        elevationSceneDirectedPositiveDistanceTemplateString,
        elevationSceneDirectedNegativeDistanceTemplateString,
        isPrimaryNodeSwapped => isPrimaryNodeSwapped ? fishString : birdString,
        isPrimaryNodeSwapped => isPrimaryNodeSwapped ? birdString : fishString
      )
    );

    //TODO: temporary rectangle
    this.addChild( new Rectangle( model.elevationAreaBounds, { stroke: 'black' } ) );

    const seaLevel = model.numberLine.valueToModelPosition( 0 ).y;

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: metersString } );
    this.addChild( numberLineNode );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: [
        new ElevationPointControllerNode(
          model.pointControllerOne,
          seaLevel,
          new Image( birdInWater, { center: Vector2.ZERO, maxWidth: 65 } ),
          new Image( birdInAir, { center: new Vector2( 0, -10 ), maxWidth: 60 } )
        ),
        new ElevationPointControllerNode(
          model.pointControllerTwo,
          seaLevel,
          new Image( fishInWater, { center: Vector2.ZERO, maxWidth: 60 } ),
          new Image( fishInAir, { center: Vector2.ZERO, maxWidth: 60 } )
        )
      ]
    } );
    this.addChild( pointControllerNodeLayer );
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

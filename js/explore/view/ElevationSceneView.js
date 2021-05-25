// Copyright 2020-2021, University of Colorado Boulder

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
import elevationBackground from '../../../images/elevation-background_png.js';

const fishString = numberLineDistanceStrings.fish;
const birdString = numberLineDistanceStrings.bird;
const elevationSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.elevationSceneAbsoluteDistanceTemplate;
const elevationSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedPositiveDistanceTemplate;
const elevationSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedNegativeDistanceTemplate;
const metersSymbol = numberLineDistanceStrings.symbol.meters;
const meterString = numberLineDistanceStrings.meter;
const metersString = numberLineDistanceStrings.meters;

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
        new Image( fishInWater, { center: Vector2.ZERO, maxWidth: 30 } ),
        {
          distanceDescriptionStrings: {
            absoluteDistanceDescriptionTemplate: elevationSceneAbsoluteDistanceTemplateString,
            directedPositiveDistanceDescriptionTemplate: elevationSceneDirectedPositiveDistanceTemplateString,
            directedNegativeDistanceDescriptionTemplate: elevationSceneDirectedNegativeDistanceTemplateString,
            singularUnits: meterString,
            pluralUnits: metersString,
            getPrimaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? fishString : birdString,
            getSecondaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? birdString : fishString
          }
        }
      )
    );

    // Adds rectangles in the elevation area bounds to display background
    // First rectangle covers entire bounds and is the background image
    // Second rectangle covers the lower half of the bounds and is a constant color that represents the water
    this.addChild( new Image(
      elevationBackground,
      {
        x: model.elevationAreaBounds.minX,
        y: model.elevationAreaBounds.minY,
        maxWidth: model.elevationAreaBounds.width,
        maxHeight: model.elevationAreaBounds.height
      }
    ) );
    const waterRectangle = new Rectangle(
      model.elevationAreaBounds.minX,
      model.elevationAreaBounds.minY + model.elevationAreaBounds.height / 2,
      model.elevationAreaBounds.width,
      model.elevationAreaBounds.height / 2,
      { fill: '#97C4F2', opacity: 0.3 }
    );
    this.addChild( waterRectangle );

    const seaLevel = model.numberLine.valueToModelPosition( 0 ).y;

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: metersSymbol } );
    this.addChild( numberLineNode );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: [

        // bird
        new ElevationPointControllerNode(
          model.pointControllerOne,
          seaLevel,
          new Image( birdInWater, { center: Vector2.ZERO, maxWidth: 65 } ),
          new Image( birdInAir, { center: new Vector2( 0, -10 ), maxWidth: 60 } )
        ),

        // fish
        new ElevationPointControllerNode(
          model.pointControllerTwo,
          seaLevel,
          new Image( fishInWater, { center: Vector2.ZERO, maxWidth: 60 } ),
          new Image( fishInAir, { center: Vector2.ZERO, maxWidth: 60 } )
        )
      ]
    } );
    this.addChild( pointControllerNodeLayer );

    waterRectangle.moveToFront();
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

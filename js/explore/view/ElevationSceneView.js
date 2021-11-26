// Copyright 2020-2021, University of Colorado Boulder

/**
 * 'Elevation' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Image } from '../../../../scenery/js/imports.js';
import ElevationPointControllerNode from './ElevationPointControllerNode.js';
import { Rectangle } from '../../../../scenery/js/imports.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import fishInWater from '../../../../number-line-common/images/fish-water_png.js';
import fishInAir from '../../../../number-line-common/images/fish-air_png.js';
import birdInWater from '../../../../number-line-common/images/bird-water_png.js';
import birdInAir from '../../../../number-line-common/images/bird-air_png.js';
import elevationBackground from '../../../images/elevation-background_png.js';
import NLDSceneView from './NLDSceneView.js';

const fishString = numberLineDistanceStrings.fish;
const birdString = numberLineDistanceStrings.bird;
const elevationSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.elevationSceneAbsoluteDistanceTemplate;
const elevationSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedPositiveDistanceTemplate;
const elevationSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedNegativeDistanceTemplate;
const metersSymbol = numberLineDistanceStrings.symbol.meters;
const meterString = numberLineDistanceStrings.meter;
const metersString = numberLineDistanceStrings.meters;

class ElevationSceneView extends NLDSceneView {

  /**
   * @param {ElevationSceneModel} model
   */
  constructor( model ) {
    super(
      model,
      {
        pointControllerRepresentationOne: new Image( birdInAir, { center: new Vector2( 0, -10 ), maxWidth: 35 } ),
        pointControllerRepresentationTwo: new Image( fishInWater, { center: Vector2.ZERO, maxWidth: 35 } ),
        distanceDescriptionStrings: {
          absoluteDistanceDescriptionTemplate: elevationSceneAbsoluteDistanceTemplateString,
          directedPositiveDistanceDescriptionTemplate: elevationSceneDirectedPositiveDistanceTemplateString,
          directedNegativeDistanceDescriptionTemplate: elevationSceneDirectedNegativeDistanceTemplateString,
          singularUnits: meterString,
          pluralUnits: metersString,
          getPrimaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? fishString : birdString,
          getSecondaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? birdString : fishString
        },
        distanceShadedNumberLineNodeOptions: {
          unitsString: metersSymbol,
          distanceTextPadding: 54 // determined empirically; see https://github.com/phetsims/number-line-distance/issues/67
        }
      }
    );

    // Add background image and water rectangle. Water rectangle is on top of everything so that point controllers
    // appear 'submerged' in water because they are layered beneath the rectangle.
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

    waterRectangle.moveToFront();
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

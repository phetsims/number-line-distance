// Copyright 2020-2022, University of Colorado Boulder

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
import fishWater_png from '../../../../number-line-common/images/fishWater_png.js';
import fishAir_png from '../../../../number-line-common/images/fishAir_png.js';
import birdWater_png from '../../../../number-line-common/images/birdWater_png.js';
import birdAir_png from '../../../../number-line-common/images/birdAir_png.js';
import elevationBackground_png from '../../../images/elevationBackground_png.js';
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
        pointControllerRepresentationOne: new Image( birdAir_png, { center: new Vector2( 0, -10 ), maxWidth: 35 } ),
        pointControllerRepresentationTwo: new Image( fishWater_png, { center: Vector2.ZERO, maxWidth: 35 } ),
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
      elevationBackground_png,
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
          new Image( birdWater_png, { center: Vector2.ZERO, maxWidth: 65 } ),
          new Image( birdAir_png, { center: new Vector2( 0, -10 ), maxWidth: 60 } )
        ),
        new ElevationPointControllerNode(
          model.pointControllerTwo,
          seaLevel,
          new Image( fishWater_png, { center: Vector2.ZERO, maxWidth: 60 } ),
          new Image( fishAir_png, { center: Vector2.ZERO, maxWidth: 60 } )
        )
      ]
    } );
    this.addChild( pointControllerNodeLayer );

    waterRectangle.moveToFront();
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

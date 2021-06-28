// Copyright 2020-2021, University of Colorado Boulder

/**
 * 'Distance' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import fireHydrant from '../../../images/fire-hydrant_png.js';
import person from '../../../images/person_png.js';
import house from '../../../images/house_png.js';
import DistancePointControllerNode from './DistancePointControllerNode.js';

const eastString = numberLineDistanceStrings.symbol.east;
const westString = numberLineDistanceStrings.symbol.west;
const houseString = numberLineDistanceStrings.house;
const personString = numberLineDistanceStrings.person;
const distanceSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.distanceSceneAbsoluteDistanceTemplate;
const distanceSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.distanceSceneDirectedPositiveDistanceTemplate;
const distanceSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.distanceSceneDirectedNegativeDistanceTemplate;
const metersSymbol = numberLineDistanceStrings.symbol.meters;
const meterString = numberLineDistanceStrings.meter;
const metersString = numberLineDistanceStrings.meters;

const CARDINALITY_INDICATOR_FONT = new PhetFont( 25 );

class DistanceSceneView extends Node {

  /**
   * @param {DistanceSceneModel} model
   */
  constructor( model ) {
    super();

    // creates the representations for the person and the house in the area that
    // they can be swapped; ensures they have the same width
    // scales were empirically determined
    const houseRepresentation = new Image( house, { scale: 0.15 } );
    const personRepresentation = new Image( person, { scale: 0.1 } );
    const smallestWidth = Math.min( houseRepresentation.getImageWidth(), personRepresentation.getImageWidth() );
    houseRepresentation.maxWidth = smallestWidth;
    personRepresentation.maxWidth = smallestWidth;

    // @private
    this.baseView = new NLDBaseView(
      model,
      houseRepresentation,
      personRepresentation,
      {
        distanceDescriptionStrings: {
          absoluteDistanceDescriptionTemplate: distanceSceneAbsoluteDistanceTemplateString,
          directedPositiveDistanceDescriptionTemplate: distanceSceneDirectedPositiveDistanceTemplateString,
          directedNegativeDistanceDescriptionTemplate: distanceSceneDirectedNegativeDistanceTemplateString,
          singularUnits: meterString,
          pluralUnits: metersString,
          getPrimaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? personString : houseString,
          getSecondaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? houseString : personString
        }
      }
    );
    this.addChild( this.baseView );

    // trapezoid path that represents the plane where the person and the house can lie
    this.addChild( new Path( model.planeTrapezoidShape, { fill: '#9b9b9b' } ) );

    // fire hydrant that sits at the 0 location of the number line
    this.addChild( new Image(
      fireHydrant,
      {
        centerX: model.planeTrapezoidShape.bounds.center.x,
        bottom: model.planeTrapezoidShape.bounds.center.y,
        scale: 0.2 // empirically determined
      }
    ) );

    // point controllers; the image scales are empirically determined
    // point controllers are in different nodes so that the person is always on top of the house in terms of layering
    const personPointControllerImage = new Image( person, { scale: 0.2 } );
    const housePointControllerImage = new Image( house, { scale: 0.2 } );
    const pointControllersLayer = new Node();
    pointControllersLayer.addChild( new Node( {
      children: [
        new DistancePointControllerNode(
          model.pointControllerOne,
          housePointControllerImage
        )
      ]
    } ) );
    pointControllersLayer.addChild( new Node( {
      children: [
        new DistancePointControllerNode(
          model.pointControllerTwo,
          personPointControllerImage
        )
      ]
    } ) );
    this.addChild( pointControllersLayer );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: metersSymbol } );
    this.addChild( numberLineNode );

    // symbols at edges of number line denoting east and west
    const textOffsetFromNumberLine = numberLineNode.options.displayedRangeInset + numberLineNode.options.arrowSize + 15;
    const range = model.numberLine.displayedRangeProperty.value;
    const eastSymbolText = new Text( eastString, {
      font: CARDINALITY_INDICATOR_FONT,
      center: model.numberLine.valueToModelPosition( range.max ).plusXY( textOffsetFromNumberLine, 0 )
    } );
    const westSymbolText = new Text( westString, {
      font: CARDINALITY_INDICATOR_FONT,
      center: model.numberLine.valueToModelPosition( range.min ).plusXY( -textOffsetFromNumberLine, 0 )
    } );
    this.addChild( eastSymbolText );
    this.addChild( westSymbolText );
    eastSymbolText.moveToBack();
    westSymbolText.moveToBack();
  }

  /**
   * This function resets the entire distance scene view. Right now, all this does is open up accordion box if closed.
   * @public
   */
  reset() {
    this.baseView.accordionBoxOpenedProperty.reset();
  }

}

numberLineDistance.register( 'DistanceSceneView', DistanceSceneView );
export default DistanceSceneView;

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
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import fireHydrant from '../../../images/fire-hydrant_png.js';
import person from '../../../images/person_png.js';
import house from '../../../images/house_png.js';

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

    //TODO: temporary mockup
    const mockup = new Image( explorescene1mockup, {
      center: NLDConstants.NLD_LAYOUT_BOUNDS.center,
      minWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      maxWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // TODO: representation widths are not the same
    this.addChild( new NLDBaseView(
      model,
      new Image( house, { scale: 0.05 } ),
      new Image( person, { scale: 0.1 } ),
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
    ) );

    // trapezoid path that represents the plane where the person and the house can lie
    this.addChild( new Path( model.planeTrapezoidShape, { fill: '#ba9b6f' } ) );

    // fire hydrant that sits at the 0 location of the number line
    this.addChild( new Image(
      fireHydrant,
      {
        centerX: model.planeTrapezoidShape.bounds.center.x,
        bottom: model.planeTrapezoidShape.bounds.center.y,
        scale: 0.2 // empirically determined
      }
    ) );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: model.pointControllers.map( pointController =>
        new PointControllerNode( pointController, { connectorLine: false } )
      )
    } );
    this.addChild( pointControllerNodeLayer );

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

}

numberLineDistance.register( 'DistanceSceneView', DistanceSceneView );
export default DistanceSceneView;

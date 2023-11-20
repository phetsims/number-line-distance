// Copyright 2020-2023, University of Colorado Boulder

/**
 * 'Distance' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { AlignGroup, Image, ManualConstraint, Node, Text } from '../../../../scenery/js/imports.js';
import fireHydrant_png from '../../../images/fireHydrant_png.js';
import sidewalk_png from '../../../images/sidewalk_png.js';
import house_png from '../../../mipmaps/house_png.js';
import NLDQueryParameters from '../../common/NLDQueryParameters.js';
import ExplorerCharacterSetUSA from '../../common/view/ExplorerCharacterSetUSA.js';
import ExplorerImages from '../../common/view/ExplorerImages.js';
import numberLineDistance from '../../numberLineDistance.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import DistancePointControllerNode from './DistancePointControllerNode.js';
import NLDSceneView from './NLDSceneView.js';

const eastStringProperty = NumberLineDistanceStrings.symbol.eastStringProperty;
const westStringProperty = NumberLineDistanceStrings.symbol.westStringProperty;
const houseStringProperty = NumberLineDistanceStrings.houseStringProperty;
const personStringProperty = NumberLineDistanceStrings.personStringProperty;
const distanceSceneAbsoluteDistanceTemplateStringProperty = NumberLineDistanceStrings.distanceSceneAbsoluteDistanceTemplateStringProperty;
const distanceSceneDirectedPositiveDistanceTemplateStringProperty = NumberLineDistanceStrings.distanceSceneDirectedPositiveDistanceTemplateStringProperty;
const distanceSceneDirectedNegativeDistanceTemplateStringProperty = NumberLineDistanceStrings.distanceSceneDirectedNegativeDistanceTemplateStringProperty;
const metersSymbolStringProperty = NumberLineDistanceStrings.symbol.metersStringProperty;
const meterStringProperty = NumberLineDistanceStrings.meterStringProperty;
const metersStringProperty = NumberLineDistanceStrings.metersStringProperty;

const DIRECTION_INDICATOR_FONT = new PhetFont( 25 );
const DIRECTION_INDICATOR_MAX_WIDTH = 50;

class DistanceSceneView extends NLDSceneView {

  /**
   * @param {DistanceSceneModel} model
   */
  constructor( model ) {

    /**
     *
     * @param {number} scale
     * @param {AlignGroup} alignGroup
     * @returns {AlignBox[]}
     */
    const createPersonImages = ( scale, alignGroup ) => ExplorerImages.EXPLORER_CHARACTER_SETS.map( set => {
      return alignGroup.createBox( new Image( set.standing, {
        scale: scale,
        visibleProperty: new DerivedProperty( [ model.preferencesModel.localizationModel.regionAndCulturePortrayalProperty ], portrayal => {
          return portrayal === set;
        } )
      } ), {
        yAlign: 'bottom'
      } );
    } );

    // Create the representations for the person and the house in the area that they can be swapped.
    // scales were empirically determined
    const legendAlignGroup = new AlignGroup();

    // TODO: this is an experiment to eliminate fuzziness, see: https://github.com/phetsims/number-line-distance/issues/72
    const personRepresentationScale = NLDQueryParameters.personImage === 'person' ? 0.1 : 0.05;
    const houseRepresentation = new Image( house_png, { scale: 0.08 } );
    const personRepresentation = new Node( { children: createPersonImages( personRepresentationScale, legendAlignGroup ) } );

    // All the personRepresentation images have the same width.
    const smallestWidth = Math.min( houseRepresentation.getImageWidth(),
      new Image( ExplorerCharacterSetUSA.standing, { scale: personRepresentationScale } ).getImageWidth() );
    houseRepresentation.maxWidth = smallestWidth;
    personRepresentation.maxWidth = smallestWidth;

    super(
      model,
      {
        pointControllerRepresentationOne: houseRepresentation,
        pointControllerRepresentationTwo: personRepresentation,
        distanceDescriptionStrings: {
          absoluteDistanceDescriptionTemplate: distanceSceneAbsoluteDistanceTemplateStringProperty,
          directedPositiveDistanceDescriptionTemplate: distanceSceneDirectedPositiveDistanceTemplateStringProperty,
          directedNegativeDistanceDescriptionTemplate: distanceSceneDirectedNegativeDistanceTemplateStringProperty,
          singularUnits: meterStringProperty,
          pluralUnits: metersStringProperty,
          getPrimaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? personStringProperty : houseStringProperty,
          getSecondaryPointControllerLabel: isPrimaryNodeSwapped => isPrimaryNodeSwapped ? houseStringProperty : personStringProperty
        },
        distanceShadedNumberLineNodeOptions: { unitsString: metersSymbolStringProperty }
      }
    );

    // image that represents the plane where the person and the house lie
    const sidewalkImage = new Image( sidewalk_png );
    sidewalkImage.scale( model.sidewalkBounds.width / sidewalkImage.width, model.sidewalkBounds.height / sidewalkImage.height );
    sidewalkImage.center = model.sidewalkBounds.center;
    this.addChild( sidewalkImage );

    // fire hydrant that sits at the 0 location of the number line
    // offset and scale empirically determined
    this.addChild( new Image(
      fireHydrant_png,
      {
        centerX: model.sidewalkBounds.center.x,
        bottom: model.sidewalkBounds.center.y - 5,
        scale: 0.15
      }
    ) );

    // Point controllers that are in different parent nodes so that the person is always on top of the house in terms of
    // layering. The mouse area dilation for the personPointControllerImage is for #38.
    // the image scales and dilations are empirically determined
      // TODO: this is an experiment to eliminate fuzziness, see: https://github.com/phetsims/number-line-distance/issues/72
    const controllerScale = NLDQueryParameters.personImage === 'person' ? 0.22 : 0.09;
    const controllerAlignGroup = new AlignGroup();
    const personPointControllerImage = new Node( { children: createPersonImages( controllerScale, controllerAlignGroup ) } );
    personPointControllerImage.mouseArea = personPointControllerImage.localBounds.dilated(
      5 / personPointControllerImage.getScaleVector().x
    );
    const housePointControllerImage = new Image( house_png, { scale: 0.2 } );

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

    // symbols at edges of number line denoting east and west
    const textOffsetFromNumberLine =
      this.numberLineNode.options.displayedRangeInset + this.numberLineNode.options.arrowSize + 4; // empirically determined
    const range = model.numberLine.displayedRangeProperty.value;
    const eastSymbolText = new Text( eastStringProperty, {
      font: DIRECTION_INDICATOR_FONT,
      maxWidth: DIRECTION_INDICATOR_MAX_WIDTH
    } );
    const westSymbolText = new Text( westStringProperty, {
      font: DIRECTION_INDICATOR_FONT,
      maxWidth: DIRECTION_INDICATOR_MAX_WIDTH
    } );

    ManualConstraint.create( this, [ eastSymbolText, westSymbolText, this.numberLineNode ], ( eastProxy, westProxy, numberLineProxy ) => {
      eastProxy.leftCenter = model.numberLine.valueToModelPosition( range.max ).plusXY( textOffsetFromNumberLine, 0 );
      westProxy.rightCenter = model.numberLine.valueToModelPosition( range.min ).plusXY( -textOffsetFromNumberLine, 0 );
    } );
    this.addChild( eastSymbolText );
    this.addChild( westSymbolText );
    eastSymbolText.moveToBack();
    westSymbolText.moveToBack();
  }

}

numberLineDistance.register( 'DistanceSceneView', DistanceSceneView );
export default DistanceSceneView;

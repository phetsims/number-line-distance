// Copyright 2020-2023, University of Colorado Boulder

/**
 * A view that contains elements that are used in all scenes/screens of the sim.
 * This view has all the common controls as well as the common display elements.
 * This is a 'base' view because it is meant to be used as the bottom layer in the scene graph for all scenes/screens.
 * Nothing needs to be disposed from this view because all instances of NLDBaseView are present for the sim's lifetime.
 *
 * @author Saurabh Totey
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import { Shape } from '../../../../kite/js/imports.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import NLCheckboxGroup from '../../../../number-line-common/js/common/view/NLCheckboxGroup.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import required from '../../../../phet-core/js/required.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HBox, ManualConstraint, Node, Path, Rectangle, RichText, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import numberLineDistance from '../../numberLineDistance.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import NLDConstants from '../NLDConstants.js';
import DistanceStatementNode from './DistanceStatementNode.js';

const pointLabelsStringProperty = NumberLineDistanceStrings.pointLabelsStringProperty;
const distanceLabelsStringProperty = NumberLineDistanceStrings.distanceLabelsStringProperty;
const distanceDescriptionStringProperty = NumberLineDistanceStrings.distanceDescriptionStringProperty;
const tickMarksStringProperty = NumberLineDistanceStrings.tickMarksStringProperty;
const absoluteValueStringProperty = NumberLineDistanceStrings.absoluteValueStringProperty;
const directedDistanceStringProperty = NumberLineDistanceStrings.directedDistanceStringProperty;
const distanceStatementStringProperty = NumberLineDistanceStrings.distanceStatementStringProperty;

const DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS = { font: new PhetFont( 16 ), maxWidth: 200 };
const NODE_SWAP_TEXT_OPTIONS = { font: new MathSymbolFont( 30 ), maxWidth: 50 };
const NODE_SWAP_HBOX_SPACING = 15;
const SWAP_ICON_PATH_OPTIONS = { stroke: 'black', lineWidth: 4 };
const ARROW_SIZE = 5;
const ARROW_SHAPE_OPTIONS = {
  tailWidth: 0,
  headHeight: ARROW_SIZE,
  headWidth: ARROW_SIZE
};
const DISTANCE_DESCRIPTION_TEXT_OPTIONS = { font: new PhetFont( 20 ), maxWidth: 515 };
const DISTANCE_STATEMENT_TITLE_TEXT_OPTIONS = { maxWidth: 300, font: new PhetFont( 16 ) };

class NLDBaseView extends Node {

  /**
   * pointControllerRepresentation parameters are used to represent the point controllers on the bottom left of the view:
   * they are used to display x_1 and x_2 or y_1 and y_2 in the area that allows them to be swapped.
   *
   * @param {AbstractNLDBaseModel} model
   * @param {Node} pointControllerRepresentationOne
   * @param {Node} pointControllerRepresentationTwo
   * @param {Object} config - options are not bubbled to Node superconstructor
   */
  constructor( model, pointControllerRepresentationOne, pointControllerRepresentationTwo, config ) {

    config = merge( {
      distanceDescriptionStrings: {

        // {string}
        absoluteDistanceDescriptionTemplate: required(
          config.distanceDescriptionStrings.absoluteDistanceDescriptionTemplate
        ),
        directedPositiveDistanceDescriptionTemplate: required(
          config.distanceDescriptionStrings.directedPositiveDistanceDescriptionTemplate
        ),
        directedNegativeDistanceDescriptionTemplate: required(
          config.distanceDescriptionStrings.directedNegativeDistanceDescriptionTemplate
        ),
        singularUnits: required( config.distanceDescriptionStrings.singularUnits ),
        pluralUnits: required( config.distanceDescriptionStrings.pluralUnits ),

        // {function(boolean, Orientation):string} should give a point controller label (string) when given
        // model.isPrimaryControllerSwapped and the orientation of the number line
        getPrimaryPointControllerLabel: required( config.distanceDescriptionStrings.getPrimaryPointControllerLabel ),
        getSecondaryPointControllerLabel: required( config.distanceDescriptionStrings.getSecondaryPointControllerLabel )
      },
      distanceStatementNodeOptions: { controlsValues: false }
    }, config );

    super();

    // checkboxes that control common model Properties for what should be visible
    // all used spacings and paddings were empirically determined
    const checkboxGroup = new NLCheckboxGroup(
      [
        new NLCheckbox( model.numberLine.showPointLabelsProperty, pointLabelsStringProperty ),
        new NLCheckbox( model.distanceLabelsVisibleProperty, distanceLabelsStringProperty ),
        new NLCheckbox( model.distanceDescriptionVisibleProperty, distanceDescriptionStringProperty ),
        new NLCheckbox( model.numberLine.showTickMarksProperty, tickMarksStringProperty )
      ]
    );

    ManualConstraint.create( this, [ checkboxGroup ], groupProxy => {
      groupProxy.right = NLDConstants.NLD_LAYOUT_BOUNDS.maxX - NLCConstants.SCREEN_VIEW_X_MARGIN;
    } );
    this.addChild( checkboxGroup );

    // checkboxes for how distance should be represented
    const distanceTypeSelector = new VerticalAquaRadioButtonGroup(
      model.distanceRepresentationProperty,
      [
        {
          value: DistanceRepresentation.ABSOLUTE,
          createNode: () => new Text( absoluteValueStringProperty, DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS )
        },
        {
          value: DistanceRepresentation.DIRECTED,
          createNode: () => new Text( directedDistanceStringProperty, DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS )
        }
      ],
      {
        left: 50, // empirically determined
        top: 25,
        spacing: 9
      }
    );
    this.addChild( distanceTypeSelector );

    // box for point controllers
    let pointControllerBoxNode = null;
    model.pointControllerBoxProperty.link( pointControllerBox => {
      pointControllerBoxNode && this.removeChild( pointControllerBoxNode );
      pointControllerBoxNode = new Rectangle( pointControllerBox, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } );
      this.addChild( pointControllerBoxNode );
    } );

    // Add pointControllerRepresentations to rectangles that ensure that the representations take up the same space.
    const largestRepresentationWidth =
      Math.max( pointControllerRepresentationOne.width, pointControllerRepresentationTwo.width );
    const largestRepresentationHeight =
      Math.max( pointControllerRepresentationOne.height, pointControllerRepresentationTwo.height );
    const pointControllerRepresentationBackgroundOne = new Rectangle(
      0,
      0,
      largestRepresentationWidth,
      largestRepresentationHeight
    );
    const pointControllerRepresentationBackgroundTwo = new Rectangle(
      0,
      0,
      largestRepresentationWidth,
      largestRepresentationHeight
    );
    pointControllerRepresentationOne.center = pointControllerRepresentationBackgroundOne.center;
    pointControllerRepresentationTwo.center = pointControllerRepresentationBackgroundTwo.center;
    pointControllerRepresentationBackgroundOne.addChild( pointControllerRepresentationOne );
    pointControllerRepresentationBackgroundTwo.addChild( pointControllerRepresentationTwo );

    // Create controls on the bottom left for which node is considered to be first and second.
    // all values used in nodeOrderDisplay were empirically determined
    const horizontalVisibleProperty = new BooleanProperty( false );
    const verticalVisibleProperty = new BooleanProperty( false );

    const firstNodeEqualToText = new Text( MathSymbols.EQUAL_TO, NODE_SWAP_TEXT_OPTIONS );
    const firstNodeHorizontalText = new RichText( NLDConstants.X_1_STRING,
        merge( { visibleProperty: horizontalVisibleProperty }, NODE_SWAP_TEXT_OPTIONS ) );
    const firstNodeVerticalText = new RichText( NLDConstants.Y_1_STRING,
        merge( { visibleProperty: verticalVisibleProperty }, NODE_SWAP_TEXT_OPTIONS ) );
    const firstNodeTextHBox = new HBox( { children: [ firstNodeHorizontalText, firstNodeVerticalText, firstNodeEqualToText ] } );

    const secondNodeHorizontalText = new RichText( NLDConstants.X_2_STRING,
        merge( { visibleProperty: horizontalVisibleProperty }, NODE_SWAP_TEXT_OPTIONS ) );
    const secondNodeVerticalText = new RichText( NLDConstants.Y_2_STRING,
        merge( { visibleProperty: verticalVisibleProperty }, NODE_SWAP_TEXT_OPTIONS ) );
    const secondNodeEqualToText = new Text( MathSymbols.EQUAL_TO, NODE_SWAP_TEXT_OPTIONS );
    const secondNodeTextHBox = new HBox( { children: [ secondNodeHorizontalText, secondNodeVerticalText, secondNodeEqualToText ] } );

    const firstNodeHBox = new HBox( {
      children: [ firstNodeTextHBox, pointControllerRepresentationBackgroundOne ],
      spacing: NODE_SWAP_HBOX_SPACING
    } );
    const secondNodeHBox = new HBox( {
      children: [ secondNodeTextHBox, pointControllerRepresentationBackgroundTwo ],
      spacing: NODE_SWAP_HBOX_SPACING
    } );
    const nodeOrderDisplay = new VBox( {
      children: [ firstNodeHBox, secondNodeHBox ],
      spacing: ( 40 - firstNodeHBox.height ) / 2
    } );

    // button that swaps the primary point controller and secondary point controller when pressed
    // padding and dilations deterined empirically
    const swapIcon = new SwapIcon();
    const swapPrimaryNodesButton = new RectangularPushButton( {
      content: swapIcon,
      baseColor: 'white',
      touchAreaXDilation: 8,
      touchAreaYDilation: 8,
      listener: () => { model.isPrimaryControllerSwappedProperty.value = !model.isPrimaryControllerSwappedProperty.value; }
    } );

    const pointControllerLegend = new HBox( {
      children: [ nodeOrderDisplay, swapPrimaryNodesButton ],
      bottom: NLDConstants.NLD_LAYOUT_BOUNDS.maxY - 30,
      left: 30,
      spacing: 20
    } );
    this.addChild( pointControllerLegend );

    // Listen for when the primary node should be swapped, and swap the representations.
    model.isPrimaryControllerSwappedProperty.link( isPrimaryControllerSwapped => {
      let firstNodeHBoxChildren;
      let secondNodeHBoxChildren;
      if ( isPrimaryControllerSwapped ) {
        firstNodeHBoxChildren = [ firstNodeTextHBox, pointControllerRepresentationBackgroundTwo ];
        secondNodeHBoxChildren = [ secondNodeTextHBox, pointControllerRepresentationBackgroundOne ];
      }
      else {
        firstNodeHBoxChildren = [ firstNodeTextHBox, pointControllerRepresentationBackgroundOne ];
        secondNodeHBoxChildren = [ secondNodeTextHBox, pointControllerRepresentationBackgroundTwo ];
      }
      // Don't have the nodes handled by layout of multiple containers at once
      firstNodeHBoxChildren.forEach( node => node.detach() );
      secondNodeHBoxChildren.forEach( node => node.detach() );
      firstNodeHBox.children = firstNodeHBoxChildren;
      secondNodeHBox.children = secondNodeHBoxChildren;
    } );

    // Switch the firstNodeText and secondNodeText to use either x or y based on number line orientation.
    model.numberLine.orientationProperty.link( orientation => {
      if ( orientation === Orientation.HORIZONTAL ) {
        horizontalVisibleProperty.value = true;
        verticalVisibleProperty.value = false;
      }
      else {
        horizontalVisibleProperty.value = false;
        verticalVisibleProperty.value = true;
      }
    } );

    // @public {BooleanProperty} - controls whether the distance statement accordion box is opened or closed.
    this.accordionBoxOpenedProperty = new BooleanProperty( true );

    // an accordion box for the distance statement
    // paddings and width were empirically determined
    const distanceStatementAccordionBox = new AccordionBox(
      new DistanceStatementNode( model, config.distanceStatementNodeOptions ),
      merge( NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, {
        titleNode: new Text( distanceStatementStringProperty, DISTANCE_STATEMENT_TITLE_TEXT_OPTIONS ),
        expandedProperty: this.accordionBoxOpenedProperty,
        top: NLDConstants.NLD_LAYOUT_BOUNDS.minY + 5,
        centerX: NLDConstants.NLD_LAYOUT_BOUNDS.centerX,
        contentAlign: 'center',
        minWidth: 340,
        maxWidth: 340
      } )
    );
    this.addChild( distanceStatementAccordionBox );

    // The labels and the unit properties change depending on context. These properties ensure that the pattern string labels are updated
    // appropriately in the map as needed.
    const primaryPointControllerLabelProperty = new DerivedProperty( [ model.isPrimaryControllerSwappedProperty, model.numberLine.orientationProperty ],
      ( isPrimarySwapped, orientation ) => {
        return config.distanceDescriptionStrings.getPrimaryPointControllerLabel( isPrimarySwapped, orientation );
      } );
    const secondaryPointControllerLabelProperty = new DerivedProperty( [ model.isPrimaryControllerSwappedProperty, model.numberLine.orientationProperty ],
      ( isPrimarySwapped, orientation ) => {
        return config.distanceDescriptionStrings.getSecondaryPointControllerLabel( isPrimarySwapped, orientation );
      } );
    const unitsProperty = new DerivedProperty( [ model.distanceProperty ], distance => {
      return ( distance === 1 || distance === -1 ) ?
             config.distanceDescriptionStrings.singularUnits : config.distanceDescriptionStrings.pluralUnits;
    } );
    const patternStringValues = {
      primaryPointControllerLabel: primaryPointControllerLabelProperty,
      secondaryPointControllerLabel: secondaryPointControllerLabelProperty,
      difference: model.distanceProperty,
      units: unitsProperty
    };

    // Update pattern string labels and values based off of the distance representation and whether the
    // distance is positive or negative.
    const distanceDescriptionMaps = {
      primaryPointControllerLabel: labelProperty => labelProperty.value,
      secondaryPointControllerLabel: labelProperty => labelProperty.value,
      units: unitsProperty => unitsProperty.value,
      difference: distance => Math.abs( distance )
    };

    const absoluteDistanceDescriptionPatternStringProperty = new PatternStringProperty( config.distanceDescriptionStrings.absoluteDistanceDescriptionTemplate,
      patternStringValues, {
        maps: distanceDescriptionMaps
      } );
    const absoluteDistanceDescriptionVisibleProperty = new BooleanProperty( false );

    const directedPositiveDistancePatternStringProperty = new PatternStringProperty( config.distanceDescriptionStrings.directedPositiveDistanceDescriptionTemplate,
      patternStringValues, {
        maps: distanceDescriptionMaps
      } );
    const directedPositiveDistanceVisibleProperty = new BooleanProperty( false );

    const directedNegativeDistancePatternStringProperty = new PatternStringProperty( config.distanceDescriptionStrings.directedNegativeDistanceDescriptionTemplate,
      patternStringValues, {
        maps: distanceDescriptionMaps
      } );
    const directedNegativeDistanceVisibleProperty = new BooleanProperty( false );


    // a text description for the distance under the distance statement accordion box
    const distanceDescriptionTextVisibleProperty = new DerivedProperty( [ model.distanceDescriptionVisibleProperty, model.pointValuesProperty ],
      distanceDescriptionVisible => {
        return distanceDescriptionVisible && model.areBothPointControllersControllingOnNumberLine();
      } );
    const distanceDescriptionTextWrapper = new Node( {
      visibleProperty: distanceDescriptionTextVisibleProperty,
      children: [ new RichText( absoluteDistanceDescriptionPatternStringProperty, merge( DISTANCE_DESCRIPTION_TEXT_OPTIONS, {
        visibleProperty: absoluteDistanceDescriptionVisibleProperty
      } ) ),
        new RichText( directedPositiveDistancePatternStringProperty, merge( DISTANCE_DESCRIPTION_TEXT_OPTIONS, {
          visibleProperty: directedPositiveDistanceVisibleProperty
        } ) ),
        new RichText( directedNegativeDistancePatternStringProperty, merge( DISTANCE_DESCRIPTION_TEXT_OPTIONS, {
          visibleProperty: directedNegativeDistanceVisibleProperty
        } ) ) ]
    } );


    Multilink.multilink(
      [
        model.distanceRepresentationProperty,
        model.distanceProperty
      ],
      ( distanceRepresentation, distance ) => {

        // Don't say anything about distance if both point controllers aren't on the number line.
        if ( !model.areBothPointControllersControllingOnNumberLine() ) {
          return;
        }

        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE || distance === 0 ) {
          absoluteDistanceDescriptionVisibleProperty.value = true;
          directedPositiveDistanceVisibleProperty.value = false;
          directedNegativeDistanceVisibleProperty.value = false;
        }
        else if ( distance > 0 ) {
          absoluteDistanceDescriptionVisibleProperty.value = false;
          directedPositiveDistanceVisibleProperty.value = true;
          directedNegativeDistanceVisibleProperty.value = false;
        }
        else if ( distance < 0 ) {
          absoluteDistanceDescriptionVisibleProperty.value = false;
          directedPositiveDistanceVisibleProperty.value = false;
          directedNegativeDistanceVisibleProperty.value = true;
        }
      }
    );

    this.addChild( distanceDescriptionTextWrapper );

    ManualConstraint.create( this, [ distanceDescriptionTextWrapper, distanceStatementAccordionBox ], ( wrapperProxy, accordionProxy ) => {
      wrapperProxy.centerX = accordionProxy.centerX;
      wrapperProxy.top = accordionProxy.bottom + 15; // padding empirically determined
    } );
  }

}

/**
 * A node that has paths that depict a 'swap' icon which is nearly a half-ellipse with arrows at the end.
 * The half-ellipse is on the right with arrows on the left pointing to the left.
 */
class SwapIcon extends Node {

  /**
   * All numbers/values used were determined empirically.
   */
  constructor() {
    super();
    const ellipseAngleInset = Math.PI / 12;
    const arrowXTranslation = 4;
    const arrowYTranslation = 10;
    this.addChild( new Path(
      new Shape().ellipticalArc( 0, 0, 8, 12, 0,
        -Math.PI / 2 + ellipseAngleInset, Math.PI / 2 - ellipseAngleInset ),
      SWAP_ICON_PATH_OPTIONS
    ) );
    this.addChild( new Path(
      new ArrowShape( 0, 0, -ARROW_SIZE, ARROW_SIZE, ARROW_SHAPE_OPTIONS )
        .transformed( Matrix3.translation( arrowXTranslation, arrowYTranslation ) ),
      SWAP_ICON_PATH_OPTIONS
    ) );
    this.addChild( new Path(
      new ArrowShape( 0, 0, -ARROW_SIZE, -ARROW_SIZE, ARROW_SHAPE_OPTIONS )
        .transformed( Matrix3.translation( arrowXTranslation, -arrowYTranslation ) ),
      SWAP_ICON_PATH_OPTIONS
    ) );
  }

}

numberLineDistance.register( 'NLDBaseView', NLDBaseView );
export default NLDBaseView;

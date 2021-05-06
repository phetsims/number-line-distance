// Copyright 2020, University of Colorado Boulder

/**
 * A view that contains elements that are used in all scenes/screens of the sim.
 * This view has all the common controls as well as the common display elements.
 * Is a 'base' view because it is meant to be used as the bottom layer in the scene graph for all scenes/screens.
 *
 * @author Saurabh Totey
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import numberLineDistance from '../../numberLineDistance.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import NLDConstants from '../NLDConstants.js';
import NLCheckbox from '../../../../number-line-common/js/common/view/NLCheckbox.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Shape from '../../../../kite/js/Shape.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DistanceStatementNode from './DistanceStatementNode.js';
import Property from '../../../../axon/js/Property.js';
import Util from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

const pointLabelsString = numberLineDistanceStrings.pointLabels;
const distanceLabelsString = numberLineDistanceStrings.distanceLabels;
const distanceDescriptionString = numberLineDistanceStrings.distanceDescription;
const tickMarksString = numberLineDistanceStrings.tickMarks;
const absoluteValueString = numberLineDistanceStrings.absoluteValue;
const directedDistanceString = numberLineDistanceStrings.directedDistance;
const distanceStatementString = numberLineDistanceStrings.distanceStatement;

const DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  maxWidth: 200
};
const NODE_SWAP_TEXT_OPTIONS = {
  font: new MathSymbolFont( 30 ),
  maxWidth: 50
};
const NODE_SWAP_HBOX_SPACING = 15;
const SWAP_ICON_PATH_OPTIONS = { stroke: 'black', lineWidth: 4 };
const ARROW_SIZE = 5;
const ARROW_SHAPE_OPTIONS = {
  tailWidth: 0,
  headHeight: ARROW_SIZE,
  headWidth: ARROW_SIZE
};
const DISTANCE_DESCRIPTION_TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  maxWidth: 300
};
const DISTANCE_STATEMENT_TITLE_TEXT_OPTIONS = { maxWidth: 300, font: new PhetFont( 16 ) };

class NLDBaseView extends Node {

  // REVIEW - A config object can be used to reduce the number of parameters and address the TODO item below, see
  //          https://github.com/phetsims/phet-info/blob/master/doc/phet-software-design-patterns.md#options-and-config
  /**
   * pointControllerRepresentation params are used to represent the point controllers on the bottom left of the view:
   * they are used to display x_1 and x_2 or y_1 and y_2 in the area that allows them to be swapped.
   *
   * The last 7 parameters are all used to construct a distance description.
   * The last 2 parameters describe the primary and secondary point controllers when given isPrimaryNodeSwapped and the
   *  number line's orientation.
   * TODO: this is a lot of parameters; maybe split this off somehow? Maybe put these as options so that they are labelled?
   *
   *
   * @param {AbstractNLDBaseModel} model
   * @param {Node} pointControllerRepresentationOne
   * @param {Node} pointControllerRepresentationTwo
   * @param {string} absoluteDistanceDescriptionTemplate
   * @param {string} directedPositiveDistanceDescriptionTemplate
   * @param {string} directedNegativeDistanceDescriptionTemplate
   * @param {string} singularUnits
   * @param {string} pluralUnits
   * @param {function(boolean, Orientation):string} getPrimaryPointControllerLabel
   * @param {function(boolean, Orientation):string} getSecondaryPointControllerLabel
   * @param {Object} [options] - are not bubbled to Node superconstructor
   */
  constructor( model, pointControllerRepresentationOne, pointControllerRepresentationTwo,
               absoluteDistanceDescriptionTemplate, directedPositiveDistanceDescriptionTemplate,
               directedNegativeDistanceDescriptionTemplate, singularUnits, pluralUnits,
               getPrimaryPointControllerLabel, getSecondaryPointControllerLabel, options ) {

    options = merge( {
      distanceStatementNodeOptions: { controlsValues: false }
    }, options );

    super();

    // checkboxes that control common model properties for what should be visible
    // all used spacings and paddings were empirically determined
    const checkboxGroup = new VBox( {
      children: [
        new NLCheckbox( pointLabelsString, model.numberLine.showPointLabelsProperty ),
        new NLCheckbox( distanceLabelsString, model.distanceLabelsVisibleProperty ),
        new NLCheckbox( distanceDescriptionString, model.distanceDescriptionVisibleProperty ),
        new NLCheckbox( tickMarksString, model.numberLine.showTickMarksProperty )
      ],
      spacing: 15,
      align: 'left',
      right: NLDConstants.NLD_LAYOUT_BOUNDS.maxX - 35,
      top: NLDConstants.NLD_LAYOUT_BOUNDS.minY + 10
    } );
    this.addChild( checkboxGroup );

    // checkboxes for how distance should be represented
    const distanceTypeSelector = new VerticalAquaRadioButtonGroup(
      model.distanceRepresentationProperty,
      [
        {
          value: DistanceRepresentation.ABSOLUTE,
          node: new Text( absoluteValueString, DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS )
        },
        {
          value: DistanceRepresentation.DIRECTED,
          node: new Text( directedDistanceString, DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS )
        }
      ],
      {
        left: 50, // empirically determined
        top: 25
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

    // controls on the bottom left for which node is considered to be first and second
    // all values used in nodeOrderDisplay were empirically determined
    const firstNodeText = new RichText( `${NLDConstants.X_1_STRING} ${MathSymbols.EQUAL_TO}`, NODE_SWAP_TEXT_OPTIONS );
    const secondNodeText = new RichText( `${NLDConstants.X_2_STRING} ${MathSymbols.EQUAL_TO}`, NODE_SWAP_TEXT_OPTIONS );
    const firstNodeHBox = new HBox( {
      children: [ firstNodeText, pointControllerRepresentationOne ],
      spacing: NODE_SWAP_HBOX_SPACING
    } );
    const secondNodeHBox = new HBox( {
      children: [ secondNodeText, pointControllerRepresentationTwo ],
      spacing: NODE_SWAP_HBOX_SPACING
    } );
    const nodeOrderDisplay = new VBox( {
      children: [ firstNodeHBox, secondNodeHBox ],
      spacing: ( 40 - firstNodeText.height ) / 2,
      bottom: NLDConstants.NLD_LAYOUT_BOUNDS.maxY - 30,
      left: 30
    } );
    this.addChild( nodeOrderDisplay );

    // REVIEW: Let's make SwapIcon a separate class defined in this file.  It'll be easier if we ever reuse it.
    // button that swaps the primary point controller and secondary point controller when pressed
    // all of the numbers used for this button were empirically determined
    const swapIcon = new Node();
    const ellipseAngleInset = Math.PI / 12;
    const arrowXTranslation = 4;
    const arrowYTranslation = 10;
    swapIcon.addChild( new Path(
      new Shape().ellipticalArc( 0, 0, 8, 12, 0,
        -Math.PI / 2 + ellipseAngleInset, Math.PI / 2 - ellipseAngleInset ),
      SWAP_ICON_PATH_OPTIONS
    ) );
    swapIcon.addChild( new Path(
      new ArrowShape( 0, 0, -ARROW_SIZE, ARROW_SIZE, ARROW_SHAPE_OPTIONS )
        .transformed( Matrix3.translation( arrowXTranslation, arrowYTranslation ) ),
      SWAP_ICON_PATH_OPTIONS
    ) );
    swapIcon.addChild( new Path(
      new ArrowShape( 0, 0, -ARROW_SIZE, -ARROW_SIZE, ARROW_SHAPE_OPTIONS )
        .transformed( Matrix3.translation( arrowXTranslation, -arrowYTranslation ) ),
      SWAP_ICON_PATH_OPTIONS
    ) );
    const swapPrimaryNodesButton = new RectangularPushButton( {
      content: swapIcon,
      baseColor: 'white',
      left: nodeOrderDisplay.right + 20, // determined empirically
      centerY: nodeOrderDisplay.centerY,
      listener: () => { model.isPrimaryControllerSwappedProperty.value = !model.isPrimaryControllerSwappedProperty.value; }
    } );
    this.addChild( swapPrimaryNodesButton );

    // listens for when the primary node should be swapped, and swaps the representations
    model.isPrimaryControllerSwappedProperty.link( isPrimaryNodeSwapped => {
      let firstNodeHBoxChildren;
      let secondNodeHBoxChildren;
      if ( isPrimaryNodeSwapped ) {
        firstNodeHBoxChildren = [ firstNodeText, pointControllerRepresentationTwo ];
        secondNodeHBoxChildren = [ secondNodeText, pointControllerRepresentationOne ];
      }
      else {
        firstNodeHBoxChildren = [ firstNodeText, pointControllerRepresentationOne ];
        secondNodeHBoxChildren = [ secondNodeText, pointControllerRepresentationTwo ];
      }
      firstNodeHBox.children = firstNodeHBoxChildren;
      secondNodeHBox.children = secondNodeHBoxChildren;
    } );

    // switches the firstNodeText and secondNodeText to use either x or y based on number line orientation
    model.numberLine.orientationProperty.link( orientation => {
      if ( orientation === Orientation.HORIZONTAL ) {
        firstNodeText.text = `${NLDConstants.X_1_STRING} ${MathSymbols.EQUAL_TO}`;
        secondNodeText.text = `${NLDConstants.X_2_STRING} ${MathSymbols.EQUAL_TO}`;
      }
      else {
        firstNodeText.text = `${NLDConstants.Y_1_STRING} ${MathSymbols.EQUAL_TO}`;
        secondNodeText.text = `${NLDConstants.Y_2_STRING} ${MathSymbols.EQUAL_TO}`;
      }
    } );

    // @public {BooleanProperty} - controls whether the distance statement accordion box is opened or closed
    this.accordionBoxOpenedProperty = new BooleanProperty( true );

    // an accordion box for the distance statement
    // paddings and width were empirically determined
    const distanceStatementAccordionBox = new AccordionBox(
      new DistanceStatementNode( model, options.distanceStatementNodeOptions ),
      merge( NLCConstants.ACCORDION_BOX_COMMON_OPTIONS, {
        titleNode: new Text( distanceStatementString, DISTANCE_STATEMENT_TITLE_TEXT_OPTIONS ),
        expandedProperty: this.accordionBoxOpenedProperty,
        top: NLDConstants.NLD_LAYOUT_BOUNDS.minY + 5,
        centerX: NLDConstants.NLD_LAYOUT_BOUNDS.centerX,
        contentAlign: 'center',
        minWidth: 340,
        maxWidth: 340
      } )
    );
    this.addChild( distanceStatementAccordionBox );

    // a text description for the distance under the distance statement accordion box
    const distanceDescriptionText = new RichText( '', merge( DISTANCE_DESCRIPTION_TEXT_OPTIONS, {
      top: distanceStatementAccordionBox.bottom + 5 // padding empirically determined
    } ) );
    Property.multilink(
      [
        model.distanceRepresentationProperty,
        model.numberLine.orientationProperty,
        model.isPrimaryControllerSwappedProperty,
        model.pointValuesProperty
      ],
      ( distanceRepresentation, orientation, isPrimaryNodeSwapped, pointValues ) => {

        // Can't say anything about distance if both point controllers aren't on the number line
        distanceDescriptionText.text = '';
        distanceDescriptionText.centerX = distanceStatementAccordionBox.centerX;
        if ( !model.areBothPointControllersControllingOnNumberLine() ) {
          return;
        }

        const value0 = pointValues[ 0 ];
        const value1 = pointValues[ 1 ];

        // calculates the difference with the correct sign
        // even though only the absolute value of difference is ever displayed, the sign is still used to
        //  determine which string template to use
        let difference = Util.roundSymmetric( value1 - value0 );
        if ( isPrimaryNodeSwapped ) {
          difference = -difference;
        }

        // Get the strings for the point controllers
        const primaryPointControllerLabel = getPrimaryPointControllerLabel( isPrimaryNodeSwapped, orientation );
        const secondaryPointControllerLabel = getSecondaryPointControllerLabel( isPrimaryNodeSwapped, orientation );

        // Fills in a string template for the distance text based off of the distance representation
        // and whether the distance is positive or negative
        const fillInValues = {
          primaryPointControllerLabel: primaryPointControllerLabel,
          secondaryPointControllerLabel: secondaryPointControllerLabel,
          difference: Math.abs( difference ),
          units: ( difference === 1 || difference === -1 ) ? singularUnits : pluralUnits
        };
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE || difference === 0 ) {
          distanceDescriptionText.text = StringUtils.fillIn( absoluteDistanceDescriptionTemplate, fillInValues );
        }
        else if ( difference > 0 ) {
          distanceDescriptionText.text = StringUtils.fillIn( directedPositiveDistanceDescriptionTemplate, fillInValues );
        }
        else if ( difference < 0 ) {
          distanceDescriptionText.text = StringUtils.fillIn( directedNegativeDistanceDescriptionTemplate, fillInValues );
        }

        distanceDescriptionText.centerX = distanceStatementAccordionBox.centerX;
      }
    );
    model.distanceDescriptionVisibleProperty.linkAttribute( distanceDescriptionText, 'visible' );
    this.addChild( distanceDescriptionText );
  }

}

numberLineDistance.register( 'NLDBaseView', NLDBaseView );
export default NLDBaseView;

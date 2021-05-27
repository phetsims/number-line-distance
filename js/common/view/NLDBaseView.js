// Copyright 2020-2021, University of Colorado Boulder

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
import required from '../../../../phet-core/js/required.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import NLCheckboxGroup from '../../../../number-line-common/js/common/view/NLCheckboxGroup.js';

const pointLabelsString = numberLineDistanceStrings.pointLabels;
const distanceLabelsString = numberLineDistanceStrings.distanceLabels;
const distanceDescriptionString = numberLineDistanceStrings.distanceDescription;
const tickMarksString = numberLineDistanceStrings.tickMarks;
const absoluteValueString = numberLineDistanceStrings.absoluteValue;
const directedDistanceString = numberLineDistanceStrings.directedDistance;
const distanceStatementString = numberLineDistanceStrings.distanceStatement;

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
const DISTANCE_DESCRIPTION_TEXT_OPTIONS = { font: new PhetFont( 16 ), maxWidth: 475 };
const DISTANCE_STATEMENT_TITLE_TEXT_OPTIONS = { maxWidth: 300, font: new PhetFont( 16 ) };
const POINT_NAME_TEXT_OPTIONS = { maxWidth: 50, font: new MathSymbolFont( 20 ) };

class NLDBaseView extends Node {

  /**
   * pointControllerRepresentation params are used to represent the point controllers on the bottom left of the view:
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
        absoluteDistanceDescriptionTemplate: required( config.distanceDescriptionStrings.absoluteDistanceDescriptionTemplate ),
        directedPositiveDistanceDescriptionTemplate: required( config.distanceDescriptionStrings.directedPositiveDistanceDescriptionTemplate ),
        directedNegativeDistanceDescriptionTemplate: required( config.distanceDescriptionStrings.directedNegativeDistanceDescriptionTemplate ),
        singularUnits: required( config.distanceDescriptionStrings.singularUnits ),
        pluralUnits: required( config.distanceDescriptionStrings.pluralUnits ),

        // {function(boolean, Orientation):string} should give a point controller label (string) when given
        //  model.isPrimaryNodeSwapped and the orientation of the number line
        getPrimaryPointControllerLabel: required( config.distanceDescriptionStrings.getPrimaryPointControllerLabel ),
        getSecondaryPointControllerLabel: required( config.distanceDescriptionStrings.getSecondaryPointControllerLabel )
      },
      distanceStatementNodeOptions: { controlsValues: false },
      pointNameLabelOffsetFromHorizontalNumberLine: 30,
      pointNameLabelOffsetFromVerticalNumberLine: 42
    }, config );

    super();

    // checkboxes that control common model properties for what should be visible
    // all used spacings and paddings were empirically determined
    const checkboxGroup = new NLCheckboxGroup(
      [
        new NLCheckbox( pointLabelsString, model.numberLine.showPointLabelsProperty ),
        new NLCheckbox( distanceLabelsString, model.distanceLabelsVisibleProperty ),
        new NLCheckbox( distanceDescriptionString, model.distanceDescriptionVisibleProperty ),
        new NLCheckbox( tickMarksString, model.numberLine.showTickMarksProperty )
      ]
    );
    checkboxGroup.right = NLDConstants.NLD_LAYOUT_BOUNDS.maxX - NLCConstants.SCREEN_VIEW_X_MARGIN;
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

    // button that swaps the primary point controller and secondary point controller when pressed
    const swapIcon = new SwapIcon();
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
      new DistanceStatementNode( model, config.distanceStatementNodeOptions ),
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
        const primaryPointControllerLabel = config.distanceDescriptionStrings.getPrimaryPointControllerLabel( isPrimaryNodeSwapped, orientation );
        const secondaryPointControllerLabel = config.distanceDescriptionStrings.getSecondaryPointControllerLabel( isPrimaryNodeSwapped, orientation );

        // Fills in a string template for the distance text based off of the distance representation
        // and whether the distance is positive or negative
        const fillInValues = {
          primaryPointControllerLabel: primaryPointControllerLabel,
          secondaryPointControllerLabel: secondaryPointControllerLabel,
          difference: Math.abs( difference ),
          units: ( difference === 1 || difference === -1 ) ? config.distanceDescriptionStrings.singularUnits : config.distanceDescriptionStrings.pluralUnits
        };
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE || difference === 0 ) {
          distanceDescriptionText.text = StringUtils.fillIn( config.distanceDescriptionStrings.absoluteDistanceDescriptionTemplate, fillInValues );
        }
        else if ( difference > 0 ) {
          distanceDescriptionText.text = StringUtils.fillIn( config.distanceDescriptionStrings.directedPositiveDistanceDescriptionTemplate, fillInValues );
        }
        else if ( difference < 0 ) {
          distanceDescriptionText.text = StringUtils.fillIn( config.distanceDescriptionStrings.directedNegativeDistanceDescriptionTemplate, fillInValues );
        }

        distanceDescriptionText.centerX = distanceStatementAccordionBox.centerX;
      }
    );
    model.distanceDescriptionVisibleProperty.linkAttribute( distanceDescriptionText, 'visible' );
    this.addChild( distanceDescriptionText );

    // text labels for the number line points that label them as x1, x2, y1, or y2
    const pointNameText0 = new RichText( '', POINT_NAME_TEXT_OPTIONS );
    const pointNameText1 = new RichText( '', POINT_NAME_TEXT_OPTIONS );
    this.addChild( pointNameText0 );
    this.addChild( pointNameText1 );
    Property.multilink(
      [
        model.pointValuesProperty,
        model.numberLine.orientationProperty,
        model.isPrimaryControllerSwappedProperty,
        model.numberLine.displayedRangeProperty
      ],
      ( pointValues, orientation, isPrimaryNodeSwapped ) => {

        // gets which strings to use based on the number line orientation and then orders them based on isPrimaryNodeSwapped
        const labelStrings = orientation === Orientation.VERTICAL ?
          [ NLDConstants.Y_1_STRING, NLDConstants.Y_2_STRING ] : [ NLDConstants.X_1_STRING, NLDConstants.X_2_STRING ];
        if ( isPrimaryNodeSwapped ) {
          const temp = labelStrings[ 0 ];
          labelStrings[ 0 ] = labelStrings[ 1 ];
          labelStrings[ 1 ] = temp;
        }

        // sets the texts and updates their visibilities
        pointNameText0.text = labelStrings[ 0 ];
        pointNameText1.text = labelStrings[ 1 ];
        pointNameText0.visible = pointValues[ 0 ] !== null;
        pointNameText1.visible = pointValues[ 1 ] !== null;

        // puts the texts in the correct positions
        if ( orientation === Orientation.HORIZONTAL ) {
          pointNameText0.centerTop = model.numberLine.valueToModelPosition(
            pointValues[ 0 ] ? pointValues[ 0 ] : 0
          ).plus( new Vector2( 0, config.pointNameLabelOffsetFromHorizontalNumberLine ) );
          pointNameText1.centerTop = model.numberLine.valueToModelPosition(
            pointValues[ 1 ] ? pointValues[ 1 ] : 1
          ).plus( new Vector2( 0, config.pointNameLabelOffsetFromHorizontalNumberLine ) );
        }
        else {
          pointNameText0.leftCenter = model.numberLine.valueToModelPosition(
            pointValues[ 0 ] ? pointValues[ 0 ] : 0
          ).plus( new Vector2( config.pointNameLabelOffsetFromVerticalNumberLine, 0 ) );
          pointNameText1.leftCenter = model.numberLine.valueToModelPosition(
            pointValues[ 1 ] ? pointValues[ 1 ] : 1
          ).plus( new Vector2( config.pointNameLabelOffsetFromVerticalNumberLine, 0 ) );
        }
      }
    );
  }

}

/**
 * A node that has paths that depict a 'swap' icon
 *  which is nearly a half-ellipse with arrows at the end.
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

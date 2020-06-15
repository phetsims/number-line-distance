// Copyright 2020, University of Colorado Boulder

/**
 * A view that contains elements that are used in all scenes/screens of the sim
 * Has controls as well as display elements
 * Is a 'base' view because it is meant to be used as the bottom layer for all scenes/screens
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

const pointLabelsString = numberLineDistanceStrings.pointLabels;
const distanceLabelsString = numberLineDistanceStrings.distanceLabels;
const distanceDescriptionString = numberLineDistanceStrings.distanceDescription;
const tickMarksString = numberLineDistanceStrings.tickMarks;
const absoluteValueString = numberLineDistanceStrings.absoluteValue;
const directedDistanceString = numberLineDistanceStrings.directedDistance;
const x1String = numberLineDistanceStrings.x1;
const x2String = numberLineDistanceStrings.x2;
const y1String = numberLineDistanceStrings.y1;
const y2String = numberLineDistanceStrings.y2;

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

class NLDBaseView extends Node {

  /**
   * pointControllerRepresentation params are used to represent the point controllers on the bottom left of the view
   * Is what is used to display x_1 and x_2 or y_1 and y_2 and allows them to be switched
   *
   * @param {NLDBaseModel} model
   * @param {Node} pointControllerRepresentationOne
   * @param {Node} pointControllerRepresentationTwo
   * @param {Property<String>} distanceDescriptionProperty
   * @param {Node} distanceStatementNode
   */
  constructor( model, pointControllerRepresentationOne, pointControllerRepresentationTwo, distanceDescriptionProperty, distanceStatementNode ) {
    super();

    // checkboxes that control common model properties for what should be visible
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
        left: 50,
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
    // TODO: these don't look good when the strings are longer
    const firstNodeText = new RichText( `${x1String} ${MathSymbols.EQUAL_TO}`, NODE_SWAP_TEXT_OPTIONS );
    const secondNodeText = new RichText( `${x2String} ${MathSymbols.EQUAL_TO}`, NODE_SWAP_TEXT_OPTIONS );
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
      bottom: NLDConstants.NLD_LAYOUT_BOUNDS.maxY - 30,
      left: 30
    } );
    this.addChild( nodeOrderDisplay );

    // button that swaps the primary point controller and secondary point controller when pressed
    const swapIcon = new Node();
    const ellipseAngleInset = Math.PI / 12;
    const arrowXTranslation = 4;
    const arrowYTranslation = 10;
    swapIcon.addChild( new Path(
      new Shape().ellipticalArc( 0, 0, 8, 12, 0, -Math.PI / 2 + ellipseAngleInset, Math.PI / 2 - ellipseAngleInset ),
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
      left: nodeOrderDisplay.right + 20,
      centerY: nodeOrderDisplay.centerY,
      listener: () => { model.isPrimaryNodeSwappedProperty.value = !model.isPrimaryNodeSwappedProperty.value; }
    } );
    this.addChild( swapPrimaryNodesButton );

    // listens for when the primary node should be swapped, and swaps the representations
    model.isPrimaryNodeSwappedProperty.link( isPrimaryNodeSwapped => {
      let firstNodeHBoxChildren;
      let secondNodeHBoxChildren;
      if ( isPrimaryNodeSwapped ) {
        firstNodeHBoxChildren = [ firstNodeText, pointControllerRepresentationTwo ];
        secondNodeHBoxChildren = [ secondNodeText, pointControllerRepresentationOne ];
      } else {
        firstNodeHBoxChildren = [ firstNodeText, pointControllerRepresentationOne ];
        secondNodeHBoxChildren = [ secondNodeText, pointControllerRepresentationTwo ];
      }
      firstNodeHBox.children = firstNodeHBoxChildren;
      secondNodeHBox.children = secondNodeHBoxChildren;
    } );

    // switches the firstNodeText and secondNodeText to use either x or y based on number line orientation
    model.numberLine.orientationProperty.link( orientation => {
      if (orientation === Orientation.HORIZONTAL) {
        firstNodeText.text = `${x1String} ${MathSymbols.EQUAL_TO}`;
        secondNodeText.text = `${x2String} ${MathSymbols.EQUAL_TO}`;
      } else {
        firstNodeText.text = `${y1String} ${MathSymbols.EQUAL_TO}`;
        secondNodeText.text = `${y2String} ${MathSymbols.EQUAL_TO}`;
      }
    } );

    // an accordion box for the distance statement
    //TODO: make this open on reset
    //TODO: look at NLOConstants ACCORDION_BOX_COMMON_OPTIONS
    const distanceStatementAccordionBox = new AccordionBox( distanceStatementNode, {
      top: NLDConstants.NLD_LAYOUT_BOUNDS.minY + 5,
      centerX: NLDConstants.NLD_LAYOUT_BOUNDS.centerX,
      fill: 'white',
      cornerRadius: 5,
      contentAlign: 'center',
      minWidth: 340,
      maxWidth: 340,
      buttonXMargin: 8,
      buttonYMargin: 6,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 15,
        touchAreaYDilation: 15,
        mouseAreaXDilation: 5,
        mouseAreaYDilation: 5
      },
      showTitleWhenExpanded: false
    } );
    this.addChild( distanceStatementAccordionBox );

    // a text description for the distance under the distance statement accordion box
    const distanceDescriptionText = new RichText( '', merge( DISTANCE_DESCRIPTION_TEXT_OPTIONS, {
      top: distanceStatementAccordionBox.bottom + 5
    } ) );
    distanceDescriptionProperty.link( distanceDescription => {
      distanceDescriptionText.text = distanceDescription;
      distanceDescriptionText.centerX = distanceStatementAccordionBox.centerX;
    } );
    model.distanceDescriptionVisibleProperty.linkAttribute( distanceDescriptionText, 'visible' );
    this.addChild( distanceDescriptionText );
  }

}

numberLineDistance.register( 'NLDBaseView', NLDBaseView );
export default NLDBaseView;

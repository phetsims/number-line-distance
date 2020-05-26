// Copyright 2020, University of Colorado Boulder

/**
 * A view that contains elements that are used in all scenes/screens of the sim
 * Has controls as well as display elements
 * Is meant to be at the bottom layer
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

const pointLabelsString = numberLineDistanceStrings.pointLabels;
const distanceLabelsString = numberLineDistanceStrings.distanceLabels;
const distanceDescriptionString = numberLineDistanceStrings.distanceDescription;
const tickMarksString = numberLineDistanceStrings.tickMarks;
const absoluteValueString = numberLineDistanceStrings.absoluteValue;
const directedDistanceString = numberLineDistanceStrings.directedDistance;
const x1EqualsString = numberLineDistanceStrings.x1Equals;
const x2EqualsString = numberLineDistanceStrings.x2Equals;
const y1EqualsString = numberLineDistanceStrings.y1Equals;
const y2EqualsString = numberLineDistanceStrings.y2Equals;

const DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  maxWidth: 200
};
const NODE_SWAP_TEXT_OPTIONS = {
  font: new MathSymbolFont( 30 ),
  maxWidth: 100
};
const DISTANCE_DESCRIPTION_TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  maxWidth: 300
};

class NLDCommonElementsView extends Node {

  /**
   * pointControllerRepresentation params are used to represent the point controllers on the bottom left of the view
   * Is what is used to display x_1 and x_2 or y_1 and y_2 and allows them to be switched
   *
   * @param {NLDModel} model
   * @param {Node} pointControllerRepresentationOne
   * @param {Node} pointControllerRepresentationTwo
   * @param {Property<String>} distanceDescriptionProperty
   */
  constructor( model, pointControllerRepresentationOne, pointControllerRepresentationTwo, distanceDescriptionProperty ) {
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
    const firstNodeText = new RichText( x1EqualsString, NODE_SWAP_TEXT_OPTIONS );
    const secondNodeText = new RichText( x2EqualsString, NODE_SWAP_TEXT_OPTIONS );
    const firstNodeHBox = new HBox( { children: [ firstNodeText, pointControllerRepresentationOne ] } );
    const secondNodeHBox = new HBox( { children: [ secondNodeText, pointControllerRepresentationTwo ] } );
    const nodeOrderDisplay = new VBox( {
      children: [ firstNodeHBox, secondNodeHBox ],
      bottom: NLDConstants.NLD_LAYOUT_BOUNDS.maxY - 30,
      left: 30
    } );
    this.addChild( nodeOrderDisplay );

    // button that swaps the primary point controller and secondary point controller when pressed
    //TODO: get a better swap icon
    const swapIconControlWidth = 25;
    const swapIconControlHeight = nodeOrderDisplay.height - 50;
    const swapIconShape = new Shape()
      .moveTo( 0, 0 )
      .cubicCurveTo( swapIconControlWidth, 0, swapIconControlWidth, swapIconControlHeight, 0, swapIconControlHeight );
    const swapPrimaryNodesButton = new RectangularPushButton( {
      content: new Path( swapIconShape, { stroke: 'black' } ),
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
        firstNodeText.text = x1EqualsString;
        secondNodeText.text = x2EqualsString;
      } else {
        firstNodeText.text = y1EqualsString;
        secondNodeText.text = y2EqualsString;
      }
    } );

    // an accordion box for the distance statement
    //TODO: make this open on reset
    //TODO: content being Rectangle is temporary: maybe allow owner to pass content in through options
    const distanceStatementAccordionBox = new AccordionBox( new Rectangle( 0, 0, 340, 35 ), {
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
      }
    } );
    this.addChild( distanceStatementAccordionBox );

    // a description for the distance
    const distanceDescriptionText = new Text( '', merge( DISTANCE_DESCRIPTION_TEXT_OPTIONS, {
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

numberLineDistance.register( 'NLDCommonElementsView', NLDCommonElementsView );
export default NLDCommonElementsView;

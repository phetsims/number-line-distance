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

const pointLabelsString = numberLineDistanceStrings.pointLabels;
const distanceLabelsString = numberLineDistanceStrings.distanceLabels;
const distanceDescriptionString = numberLineDistanceStrings.distanceDescription;
const tickMarksString = numberLineDistanceStrings.tickMarks;
const absoluteValueString = numberLineDistanceStrings.absoluteValue;
const directedDistanceString = numberLineDistanceStrings.directedDistance;

const DISTANCE_TYPE_SELECTOR_TEXT_OPTIONS = {
  font: new PhetFont( 16 ),
  maxWidth: 200
};

class NLDCommonElementsView extends Node {

  /**
   * pointControllerRepresentation params are used to represent the point controllers on the bottom left of the view
   * Is what is used to display x_1 and x_2 or y_1 and y_2 and allows them to be switched
   *
   * @param {NLDModel} model
   * @param {Node} pointControllerRepresentationOne
   * @param {Node} pointControllerRepresentationTwo
   */
  constructor( model, pointControllerRepresentationOne, pointControllerRepresentationTwo ) {
    super();

    // checkboxes that control common model properties for what should be visible
    const checkboxGroup = new VBox( {
      children: [
        new NLCheckbox( pointLabelsString, model.pointLabelsVisibleProperty ),
        new NLCheckbox( distanceLabelsString, model.distanceLabelsVisibleProperty ),
        new NLCheckbox( distanceDescriptionString, model.distanceDescriptionVisibleProperty ),
        new NLCheckbox( tickMarksString, model.tickMarksVisibleProperty )
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
      pointControllerBoxNode && this.removeChild(pointControllerBoxNode);
      pointControllerBoxNode = new Rectangle( pointControllerBox, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } );
      this.addChild( pointControllerBoxNode );
    } );

    // controls on the bottom left for which node is considered to be first and second
    const firstNodeText = new Text( 'TOOD: x_1' );
    const secondNodeText = new Text( 'TODO: x_2' );
    const firstNodeHBox = new HBox( { children: [ firstNodeText, pointControllerRepresentationOne ] } );
    const secondNodeHBox = new HBox( { children: [ secondNodeText, pointControllerRepresentationTwo ] } );
    this.addChild( new VBox( {
      children: [ firstNodeHBox, secondNodeHBox ],
      bottom: NLDConstants.NLD_LAYOUT_BOUNDS.maxY - 20
    } ) );

    //TODO: add a button to switch the first node and the second node (presumably change a model property, and have a listener for that property change to actually change them)

    // switches the firstNodeText and secondNodeText to use either x or y based on number line orientation
    model.numberLine.orientationProperty.link( orientation => {
      //TODO: modify firstNodeText and secondNodeText
    } );
  }

}

numberLineDistance.register( 'NLDCommonElementsView', NLDCommonElementsView );
export default NLDCommonElementsView;

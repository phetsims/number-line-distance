// Copyright 2020, University of Colorado Boulder

/**
 * A view that contains controls that are used in all scenes/screens of the sim
 *
 * @author Saurabh Totey
 */

import Node from '../../../../scenery/js/nodes/Node.js';
import numberLineDistance from '../../numberLineDistance.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NLCConstants from '../../../../number-line-common/js/common/NLCConstants.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';

const pointLabelsString = numberLineDistanceStrings.pointLabels;
const distanceLabelsString = numberLineDistanceStrings.distanceLabels;
const distanceDescriptionString = numberLineDistanceStrings.distanceDescription;
const tickMarksString = numberLineDistanceStrings.tickMarks;
const absoluteValueString = numberLineDistanceStrings.absoluteValue;
const directedDistanceString = numberLineDistanceStrings.directedDistance;

class ControlsView extends Node {

  /**
   * @param {NLDModel} model
   * @param {Bounds2} layoutBounds
   */
  constructor( model, layoutBounds ) {
    super();

    const checkboxes = [
      new Checkbox(
        new Text( pointLabelsString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.pointLabelsVisibleProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( distanceLabelsString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.distanceLabelsVisibleProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( distanceDescriptionString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.distanceDescriptionVisibleProperty,
        NLCConstants.CHECKBOX_OPTIONS
      ),
      new Checkbox(
        new Text( tickMarksString, NLCConstants.CHECKBOX_TEXT_OPTIONS ),
        model.tickMarksVisibleProperty,
        NLCConstants.CHECKBOX_OPTIONS
      )
    ];
    checkboxes.forEach( checkbox => { checkbox.touchArea = checkbox.localBounds.dilated( NLCConstants.CHECKBOX_DILATION ); } );

    // @protected {VBox} - node containing the checkboxes that control common model properties
    this.checkboxGroup = new VBox( {
      children: checkboxes,
      spacing: 15,
      align: 'left',
      right: layoutBounds.maxX - 35,
      top: layoutBounds.minY + 10
    } );
    this.addChild( this.checkboxGroup );

    const distanceTypeSelector = new VerticalAquaRadioButtonGroup(
      model.distanceRepresentationProperty,
      [
        {
          value: DistanceRepresentation.ABSOLUTE,
          node: new Text( absoluteValueString, NLCConstants.CHECKBOX_TEXT_OPTIONS )
        },
        {
          value: DistanceRepresentation.DIRECTED,
          node: new Text( directedDistanceString, NLCConstants.CHECKBOX_TEXT_OPTIONS )
        }
      ],
      {
        left: 50,
        top: 25
      }
    );
    this.addChild( distanceTypeSelector );

  }

}

numberLineDistance.register( 'ControlsView', ControlsView );
export default ControlsView;

// Copyright 2020, University of Colorado Boulder

/**
 * A view that contains controls that are used in all scenes/screens of the sim
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

class ControlsView extends Node {

  /**
   * @param {NLDModel} model
   */
  constructor( model ) {
    super();

    // @protected {VBox} - node containing the checkboxes that control common model properties
    this.checkboxGroup = new VBox( {
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
    this.addChild( this.checkboxGroup );

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

  }

}

numberLineDistance.register( 'ControlsView', ControlsView );
export default ControlsView;

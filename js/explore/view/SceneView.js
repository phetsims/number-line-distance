// Copyright 2020, University of Colorado Boulder

/**
 * base class for scene views in the "Explore" screen
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

const pointLabelsString = numberLineDistanceStrings.pointLabels;
const distanceLabelsString = numberLineDistanceStrings.distanceLabels;
const distanceDescriptionString = numberLineDistanceStrings.distanceDescription;
const tickMarksString = numberLineDistanceStrings.tickMarks;

class SceneView extends Node {

  /**
   * @param {SceneModel} model
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

  }

}

numberLineDistance.register( 'SceneView', SceneView );
export default SceneView;

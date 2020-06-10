// Copyright 2020, University of Colorado Boulder

/**
 * A distance statement that not only shows the distance between point controllers, but can actually control their value
 * TODO: figure out how this should handle a point that is outside of the range
 * TODO: this allows points to have the same value when they shouldn't: look at piggy bank scene in NLI
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';

class ControllingDistanceStatement extends Node {

  /**
   * @param {NLDBaseModel} model
   */
  constructor( model ) {
    super();

    // creates value properties that correspond to a point controller's value if it is on the number line and -101 otherwise
    // if the value becomes -101, the number picker should be replaced by an alternative node
    const makePointControllerValueProperty = pointController => {
      const valueProperty = new NumberProperty( -101, { reentrant: true } );
      pointController.positionProperty.link( position => {
        if ( pointController.isControllingNumberLinePoint() && model.numberLine.hasPoint( pointController.numberLinePoints[ 0 ] ) ) {
          valueProperty.value = Utils.roundSymmetric( model.numberLine.modelPositionToValue( position ) );
        }
        else {
          valueProperty.value = -101;
        }
      } );
      valueProperty.link( value => {
        if ( pointController.isControllingNumberLinePoint() && model.numberLine.hasPoint( pointController.numberLinePoints[ 0 ] ) ) {
          pointController.numberLinePoints[ 0 ].proposeValue( value );
        }
      } );
      return valueProperty;
    };

    const valueProperty0 = makePointControllerValueProperty( model.pointControllers[ 0 ] );
    const valueProperty1 = makePointControllerValueProperty( model.pointControllers[ 1 ] );

    //TODO: colors
    const numberPicker0 = new NumberPicker( valueProperty0, model.numberLine.displayedRangeProperty );
    const numberPicker1 = new NumberPicker( valueProperty1, model.numberLine.displayedRangeProperty );

    const minusSignText = new Text( MathSymbols.MINUS );

    //TODO: make this look nice
    this.addChild( new HBox( {
      children: [ numberPicker0, minusSignText, numberPicker1 ]
    } ) );

    //TODO: change the hbox children and replace a number picker with a text if a point is not on the number line

    //TODO: hook this up with model properties like isPrimaryNodeSwapped and orientationProperty
  }

}

numberLineDistance.register( 'ControllingDistanceStatement', ControllingDistanceStatement );
export default ControllingDistanceStatement;

// Copyright 2020, University of Colorado Boulder

/**
 * A distance statement that not only shows the distance between point controllers, but can actually control their value
 * TODO: figure out how this should handle a point that is outside of the range (it doesn't work correctly right now)
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
import Property from '../../../../axon/js/Property.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import merge from '../../../../phet-core/js/merge.js';

const x1String = numberLineDistanceStrings.x1;
const x2String = numberLineDistanceStrings.x2;
const y1String = numberLineDistanceStrings.y1;
const y2String = numberLineDistanceStrings.y2;

const TEXT_OPTIONS = { font: new MathSymbolFont( 25 ), maxWidth: 50 };

class ControllingDistanceStatement extends Node {

  /**
   * @param {NLDBaseModel} model
   */
  constructor( model ) {
    super();

    // creates value properties that correspond to a point controller's value if it is on the number line and -101 otherwise
    // if the value becomes -101, the number picker should be replaced by an alternative node
    // the -101 is necessary because number pickers require a number property even though point controllers don't always have a value
    // TODO: see if there is a better workaround for this
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

    const numberPicker0 = new NumberPicker( valueProperty0, model.numberLine.displayedRangeProperty, {
      color: model.pointControllers[ 0 ].color
    } );
    const numberPicker1 = new NumberPicker( valueProperty1, model.numberLine.displayedRangeProperty, {
      color: model.pointControllers[ 1 ].color
    } );

    // The nodes that will be showed instead of the number pickers if the number pickers shouldn't be shown
    const numberPickerAltNode0 = new Rectangle( numberPicker0.localBounds );
    const numberPickerAltNode1 = new Rectangle( numberPicker1.localBounds );
    const numberPickerAltText0 = new RichText( x1String, merge( TEXT_OPTIONS, { center: numberPickerAltNode0.center } ) );
    const numberPickerAltText1 = new RichText( x2String, merge( TEXT_OPTIONS, { center: numberPickerAltNode1.center } ) );
    numberPickerAltNode0.addChild( numberPickerAltText0 );
    numberPickerAltNode1.addChild( numberPickerAltText1 );

    const minusSignText = new Text( MathSymbols.MINUS, TEXT_OPTIONS );

    const hBox = new HBox( { children: [ numberPicker1, minusSignText, numberPicker0 ], spacing: 5 } );
    this.addChild( hBox );

    Property.multilink(
      [ valueProperty0, valueProperty1, model.distanceRepresentationProperty, model.isPrimaryNodeSwappedProperty, model.numberLine.orientationProperty ],
      ( value0, value1, distanceRepresentation, isPrimaryNodeSwapped, orientation ) => {

        // Change the alt text based off of number line orientation
        if ( orientation === Orientation.HORIZONTAL ) {
          numberPickerAltText0.text = x1String;
          numberPickerAltText1.text = x2String;
        } else {
          numberPickerAltText0.text = y1String;
          numberPickerAltText1.text = y2String;
        }

        // Choose the children for the distance statement: will be number pickers if points are on the number line
        let firstChild = numberPicker1;
        let secondChild = numberPicker0;
        let firstChildValue = valueProperty1.value;
        let secondChildValue = valueProperty0.value;
        if ( isPrimaryNodeSwapped ) {
          firstChild = numberPicker0;
          firstChildValue = valueProperty0.value;
          secondChild = numberPicker1;
          secondChildValue = valueProperty1.value;
        }
        if ( firstChildValue === -101 ) {
          firstChild = numberPickerAltNode1;
        }
        if ( secondChildValue === -101 ) {
          secondChild = numberPickerAltNode0;
        }

        //TODO: equals statement as a part of the hbox

        //TODO: absolute value marks if distanceRepresentation is ABSOLUTE

        hBox.children = [ firstChild, minusSignText, secondChild ];

      }
    );
  }

}

numberLineDistance.register( 'ControllingDistanceStatement', ControllingDistanceStatement );
export default ControllingDistanceStatement;

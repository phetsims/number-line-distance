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
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import AbsoluteValueLine from '../../../../number-line-common/js/common/view/AbsoluteValueLine.js';

const x1String = numberLineDistanceStrings.x1;
const x2String = numberLineDistanceStrings.x2;
const y1String = numberLineDistanceStrings.y1;
const y2String = numberLineDistanceStrings.y2;

const TEXT_OPTIONS = { font: new MathSymbolFont( 25 ), maxWidth: 50 };
const INVALID_VALUE = -101;
const INVALID_DISTANCE_STRING = '?';

class ControllingDistanceStatement extends Node {

  /**
   * @param {NLDBaseModel} model
   */
  constructor( model ) {
    super();

    // creates value properties that correspond to a point controller's value if it is on the number line and INVALID_VALUE otherwise
    // if the value becomes INVALID_VALUE, the number picker should be replaced by an alternative node
    // the INVALID_VALUE is necessary because number pickers require a number property even though point controllers don't always have a value
    const makePointControllerValueProperty = pointController => {
      const valueProperty = new NumberProperty( INVALID_VALUE, { reentrant: true } );
      pointController.positionProperty.link( position => {
        if ( pointController.isControllingNumberLinePoint() && model.numberLine.hasPoint( pointController.numberLinePoints[ 0 ] ) ) {
          valueProperty.value = Utils.roundSymmetric( model.numberLine.modelPositionToValue( position ) );
        }
        else {
          valueProperty.value = INVALID_VALUE;
        }
      } );
      valueProperty.link( value => {
        assert && assert(
          value === INVALID_VALUE ||
            pointController.isControllingNumberLinePoint() && model.numberLine.hasPoint( pointController.numberLinePoints[ 0 ] ),
          'value property should not be set to anything except invalid value if the point controller is not on the number line'
        );
        if ( value !== INVALID_VALUE ) {
          pointController.numberLinePoints[ 0 ].proposeValue( value );
        }
      } );
      return valueProperty;
    };
    const valueProperty0 = makePointControllerValueProperty( model.pointControllers[ 0 ] );
    const valueProperty1 = makePointControllerValueProperty( model.pointControllers[ 1 ] );

    // TODO: perhaps pass in our own up and down functions to correctly handle when the point is outside the displayedRange
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
    const equalsSignText = new Text( MathSymbols.EQUAL_TO, TEXT_OPTIONS );

    // A text that displays the distance between the two point controllers (or '?' if invalid distance)
    const distanceText = new Text( INVALID_DISTANCE_STRING, merge( TEXT_OPTIONS, { font: new PhetFont( 25 ) } ) );

    // Absolute value marks
    const leftAbsoluteValueMark = new AbsoluteValueLine( numberPicker1 );
    const rightAbsoluteValueMark = new AbsoluteValueLine( numberPicker0 );

    // Layout boxes for this node's actual content
    const firstChildHBox = new HBox( { children: [ numberPicker1 ], spacing: 2 } );
    const secondChildHBox = new HBox( { children: [ numberPicker0 ], spacing: 2 } );
    this.addChild( new HBox( {
      children: [ firstChildHBox, minusSignText, secondChildHBox, equalsSignText, distanceText ],
      spacing: 5
    } ) );

    Property.multilink(
      [ valueProperty0, valueProperty1, model.distanceRepresentationProperty, model.isPrimaryNodeSwappedProperty, model.numberLine.orientationProperty ],
      ( value0, value1, distanceRepresentation, isPrimaryNodeSwapped, orientation ) => {

        firstChildHBox.removeAllChildren();
        secondChildHBox.removeAllChildren();

        // Change the alt text based off of number line orientation
        if ( orientation === Orientation.HORIZONTAL ) {
          numberPickerAltText0.text = x1String;
          numberPickerAltText1.text = x2String;
        } else {
          numberPickerAltText0.text = y1String;
          numberPickerAltText1.text = y2String;
        }

        // Chooses the ordering for children for the distance statement
        let firstChild = numberPicker1;
        let secondChild = numberPicker0;
        let firstChildValue = valueProperty1.value;
        let secondChildValue = valueProperty0.value;
        let distance = Utils.roundSymmetric( firstChildValue - secondChildValue );
        if ( isPrimaryNodeSwapped ) {
          firstChild = numberPicker0;
          firstChildValue = valueProperty0.value;
          secondChild = numberPicker1;
          secondChildValue = valueProperty1.value;
          distance = -distance;
        }

        // Adds absolute value marks and makes the distance positive if the distance representation is absolute
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          distance = Math.abs( distance );
          firstChildHBox.addChild( leftAbsoluteValueMark );
          secondChildHBox.addChild( rightAbsoluteValueMark );
        }

        // Replaces number pickers with alternatives if their value is invalid
        if ( firstChildValue === INVALID_VALUE ) {
          firstChild = numberPickerAltNode1;
          distance = INVALID_DISTANCE_STRING;
        }
        if ( secondChildValue === INVALID_VALUE ) {
          secondChild = numberPickerAltNode0;
          distance = INVALID_DISTANCE_STRING;
        }

        distanceText.text = `${distance}`;
        firstChildHBox.addChild( firstChild );
        secondChildHBox.children = [ secondChild ].concat( secondChildHBox.children );

      }
    );
  }

}

numberLineDistance.register( 'ControllingDistanceStatement', ControllingDistanceStatement );
export default ControllingDistanceStatement;

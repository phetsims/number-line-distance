// Copyright 2020-2021, University of Colorado Boulder

/**
 * A generic distance statement as a scenery Node. Can either be set to be able to control point controller values
 * (using number pickers) or just show values (using texts). Doesn't need to unlink properties because all instances of
 * DistanceStatementNode are present for the lifetime of the sim.
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import AbsoluteValueLine from '../../../../number-line-common/js/common/view/AbsoluteValueLine.js';
import Property from '../../../../axon/js/Property.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Utils from '../../../../dot/js/Utils.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NLDConstants from '../NLDConstants.js';

const MATH_TEXT_OPTIONS = { font: new MathSymbolFont( 25 ), maxWidth: 40 };
const NORMAL_TEXT_OPTIONS = { font: new PhetFont( 25 ), maxWidth: 55 };
// A value that is beyond the bounds of the number lines because the number pickers' properties always require a number
const INVALID_VALUE = -101;
const INVALID_DISTANCE_STRING = '?';
// A bounding object that is supposed to always be larger than a potential point controller representation
const REPRESENTATION_BOUNDS = new Bounds2( 0, 0, 65, 65 );

class DistanceStatementNode extends Node {

  /**
   * @param {AbstractNLDBaseModel} model,
   * @param {Object} [options] - do not get bubbled up to Node
   */
  constructor( model, options ) {
    options = merge( {

      // {boolean} - changes whether this statement uses number pickers or texts
      //  this affects whether this can change a point controller's value or not
      controlsValues: false
    }, options );

    super();

    // a list of size 2 that contains nodes that 'represent' a point controller's value
    // will either be number pickers or texts depending on options.controlsValues
    let valueRepresentations;

    // Creates value properties for each number line point
    // The property corresponds to the point's value if it has any
    // Otherwise, the property is INVALID_VALUE (which is still a number for the number property)
    // The value property will update when the point controller's value changes, but the point's value
    //  will not update when the value property changes unless options.controlsValues is true
    // The INVALID_VALUE hack is required because the number pickers require the value property to always have a value
    // The Utils.roundSymmetric is necessary because there is a very difficult-to-produce situation in which the point
    //  controller in the temperature or elevation scene is placed right on the edge of the bounds and so the value
    //  is just a long decimal number.
    const valueProperties = [
      new NumberProperty( INVALID_VALUE, { reentrant: true } ),
      new NumberProperty( INVALID_VALUE, { reentrant: true } )
    ];
    model.pointValuesProperty.link( pointValues => {
      valueProperties[ 0 ].value = pointValues[ 0 ] !== null ? Utils.roundSymmetric( pointValues[ 0 ] ) : INVALID_VALUE;
      valueProperties[ 1 ].value = pointValues[ 1 ] !== null ? Utils.roundSymmetric( pointValues[ 1 ] ) : INVALID_VALUE;
    } );

    // There are necessarily 2 point controllers (that is enforced by AbsractNLDBaseModel), so ensure
    // that we have the correct number of corresponding value properties.
    assert && assert(
      valueProperties.length === 2,
      'Mapping point values to value properties should result in exactly 2 value properties'
    );

    if ( options.controlsValues ) {

      // makes changing the value properties affect the point controllers' values
      model.pointControllers.forEach( ( pointController, i ) => {
        valueProperties[ i ].link( value => {
          if ( value !== INVALID_VALUE && pointController.isControllingNumberLinePoint()
               && model.numberLine.hasPoint( pointController.numberLinePoints.get( 0 ) ) ) {
            pointController.numberLinePoints.get( 0 ).valueProperty.value = value;
          }
        } );
      } );

      // range property for number pickers; picks a range that contains all generic number line ranges
      const numberPickerRangeProperty = new Property(
        NLDConstants.GENERIC_NUMBER_LINE_RANGES.reduce( ( largestNumberLineRange, currentNumberLineRange ) => {
          const newLargestNumberLineRange = largestNumberLineRange.copy();
          if ( currentNumberLineRange.min < newLargestNumberLineRange.min ) {
            newLargestNumberLineRange.min = currentNumberLineRange.min;
          }
          if ( currentNumberLineRange.max > newLargestNumberLineRange.max ) {
            newLargestNumberLineRange.max = currentNumberLineRange.max;
          }
          return newLargestNumberLineRange;
        } )
      );

      valueRepresentations = model.pointControllers.map( ( pointController, i ) =>
        new NumberPicker( valueProperties[ i ], numberPickerRangeProperty, {
          color: pointController.color
        } )
      );

    }
    else {

      const textNodes = [
        new Text( `${INVALID_VALUE}`, NORMAL_TEXT_OPTIONS ),
        new Text( `${INVALID_VALUE}`, NORMAL_TEXT_OPTIONS )
      ];

      // Each Text is added within a dilated rectangle in order to ensure that the text is always centered in its space.
      // Whenever the text of the node changes, the node is re-centered within this rectangle.
      valueRepresentations = textNodes.map( textNode => {
        const textHolder = new Rectangle( textNode.localBounds.dilatedXY( 5, 10 ) ); // empirically determined
        textHolder.addChild( textNode );
        return textHolder;
      } );

      valueProperties.forEach( ( valueProperty, i ) => {
        Property.multilink(
          [ valueProperty, model.isPrimaryControllerSwappedProperty ],
          ( value, isPrimaryNodeSwapped ) => {
            const isSecondDisplayedValue = i === 1 && isPrimaryNodeSwapped || i === 0 && !isPrimaryNodeSwapped;
            textNodes[ i ].text = ( value < 0 && isSecondDisplayedValue ) ? `(${value})` : `${value}`;
            textNodes[ i ].text = textNodes[ i ].text.replace( '-', MathSymbols.MINUS );
            textNodes[ i ].center = valueRepresentations[ i ].rectBounds.center;
          }
        );
      } );

    }

    assert && assert(
      valueRepresentations.length === 2,
      'DistanceStatementNode requires there to be 2 value representations.'
    );

    // Background nodes that are parents to the value representations which ensure constant spacing within the node.
    // TODO: this code assumes that REPRESENTATION_BOUNDS is always larger than any of the possible children, but
    //  that isn't actually guaranteed: I'm not quite sure how to iterate through all possible children sizes and ensure
    //  that REPRESENTATION_BOUNDS is larger
    const backgroundNodes = [
      new Rectangle( REPRESENTATION_BOUNDS ),
      new Rectangle( REPRESENTATION_BOUNDS )
    ];

    // These nodes that will be shown instead of the value representations if the point controllers aren't on the number line.
    const alternativeTexts = [
      new RichText( NLDConstants.X_1_STRING, MATH_TEXT_OPTIONS ),
      new RichText( NLDConstants.X_2_STRING, MATH_TEXT_OPTIONS )
    ];

    const minusSignText = new Text( MathSymbols.MINUS, MATH_TEXT_OPTIONS );
    const equalsSignText = new Text( MathSymbols.EQUAL_TO, MATH_TEXT_OPTIONS );

    // A text that displays the distance between the two point controllers (or '?' if invalid distance)
    const distanceText = new Text( INVALID_DISTANCE_STRING, NORMAL_TEXT_OPTIONS );

    // Absolute value marks
    const leftAbsoluteValueMark = new AbsoluteValueLine( backgroundNodes[ 0 ] );
    const rightAbsoluteValueMark = new AbsoluteValueLine( backgroundNodes[ 1 ] );

    // Layout boxes for this node's actual content
    // HBoxes are for putting absolute values alongside valueRepresentations
    const leftTermHBox = new HBox( {
      children: [ leftAbsoluteValueMark, backgroundNodes[ 0 ] ],
      excludeInvisibleChildrenFromBounds: false
    } );
    const rightTermHBox = new HBox( {
      children: [ backgroundNodes[ 1 ], rightAbsoluteValueMark ],
      excludeInvisibleChildrenFromBounds: false
    } );
    this.addChild( new HBox( {
      children: [ leftTermHBox, minusSignText, rightTermHBox, equalsSignText, distanceText ],
      spacing: 5
    } ) );

    // This multilink listens for changes in any relevant properties and updates the distance statement accordingly.
    Property.multilink(
      valueProperties.concat( [
        model.distanceRepresentationProperty,
        model.isPrimaryControllerSwappedProperty,
        model.numberLine.orientationProperty
      ] ),
      ( value0, value1, distanceRepresentation, isPrimaryNodeSwapped, orientation ) => {

        // Change the alt text based off of number line orientation
        if ( orientation === Orientation.HORIZONTAL ) {
          alternativeTexts[ 0 ].text = NLDConstants.X_1_STRING;
          alternativeTexts[ 1 ].text = NLDConstants.X_2_STRING;
        }
        else {
          alternativeTexts[ 0 ].text = NLDConstants.Y_1_STRING;
          alternativeTexts[ 1 ].text = NLDConstants.Y_2_STRING;
        }

        // Chooses the ordering for children for the distance statement
        let leftTermNode = valueRepresentations[ 1 ];
        let rightTermNode = valueRepresentations[ 0 ];
        let leftTermValue = value1;
        let rightTermValue = value0;
        let distance = Utils.roundSymmetric( leftTermValue - rightTermValue );
        if ( isPrimaryNodeSwapped ) {
          leftTermNode = valueRepresentations[ 0 ];
          leftTermValue = value0;
          rightTermNode = valueRepresentations[ 1 ];
          rightTermValue = value1;
          distance = -distance;
        }

        // Adds absolute value marks and makes the distance positive if the distance representation is absolute
        leftAbsoluteValueMark.visible = false;
        rightAbsoluteValueMark.visible = false;
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          distance = Math.abs( distance );
          leftAbsoluteValueMark.visible = true;
          rightAbsoluteValueMark.visible = true;
        }

        // Replaces value representations with alternatives if their value is invalid
        if ( leftTermValue === INVALID_VALUE ) {
          leftTermNode = alternativeTexts[ 1 ];
          distance = INVALID_DISTANCE_STRING;
        }
        if ( rightTermValue === INVALID_VALUE ) {
          rightTermNode = alternativeTexts[ 0 ];
          distance = INVALID_DISTANCE_STRING;
        }

        // Adds children to background nodes
        backgroundNodes[ 0 ].children = [ leftTermNode ];
        backgroundNodes[ 1 ].children = [ rightTermNode ];
        leftTermNode.center = REPRESENTATION_BOUNDS.center;
        rightTermNode.center = REPRESENTATION_BOUNDS.center;

        distanceText.text = `${distance}`.replace( '-', MathSymbols.MINUS );
      }
    );
  }
}

numberLineDistance.register( 'DistanceStatementNode', DistanceStatementNode );
export default DistanceStatementNode;

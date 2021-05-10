// Copyright 2020, University of Colorado Boulder

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

    // REVIEW: As noted below, I'd recommend an assertion for 2 point controllers here, then not including the size in
    //         the comments or in further assertions.
    // a list of size 2 that contains nodes that 'represent' a point controller's value
    // will either be number pickers or texts depending on options.controlsValues
    let valueRepresentations;

    // Creates value properties for each point controller
    // The property corresponds to the point controller's value if it is on the number line
    // Otherwise, the property is INVALID_VALUE (which is still a number for the number property)
    // The value property will update when the point controller's value changes, but the point controller's value
    //  will not update when the value property changes unless options.controlsValues is true
    // The INVALID_VALUE hack is required because the number pickers require the value property to always have a value
    const valueProperties = model.pointControllers.map( pointController => {
      const valueProperty = new NumberProperty( INVALID_VALUE, { reentrant: true } );
      pointController.positionProperty.link( () => {
        if ( pointController.isControllingNumberLinePoint()
             && model.numberLine.hasPoint( pointController.numberLinePoints.get( 0 ) ) ) {
          valueProperty.value = pointController.numberLinePoints[ 0 ].valueProperty.value;
        }
        else {
          valueProperty.value = INVALID_VALUE;
        }
      } );
      return valueProperty;
    } );

    // REVIEW: Rather than this assertion, it probably makes more sense to check that there are exactly 2 point controllers.
    assert && assert(
      valueProperties.length === 2,
      'Mapping point controllers to value properties should result in only 2 value properties'
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

      // range property for number pickers; is the largest number line range always
      // REVIEW: It's a little risky to assume that index 2 is always the biggest, would recommend using .reduce to extract the biggest range.
      const numberPickerRangeProperty = new Property( NLDConstants.GENERIC_NUMBER_LINE_RANGES[ 2 ] );

      // REVIEW: This could be done as a forEach over valueProperties to reduce code duplication (a little)
      valueRepresentations = [
        new NumberPicker( valueProperties[ 0 ], numberPickerRangeProperty, {
          color: model.pointControllers[ 0 ].color
        } ),
        new NumberPicker( valueProperties[ 1 ], numberPickerRangeProperty, {
          color: model.pointControllers[ 1 ].color
        } )
      ];

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

        distanceText.text = `${distance}`;
      }
    );
  }
}

numberLineDistance.register( 'DistanceStatementNode', DistanceStatementNode );
export default DistanceStatementNode;

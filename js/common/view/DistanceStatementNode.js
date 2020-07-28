// Copyright 2020, University of Colorado Boulder

/**
 * A generic distance statement as a node
 * Can either be set to be able to control point controller values (using number pickers) or just show values (using texts)
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
const INVALID_VALUE = -101;
const INVALID_DISTANCE_STRING = '?';
const REPRESENTATION_BOUNDS = new Bounds2( 0, 0, 65, 65 ); //TODO: this looks a little ugly because the equals sign doesn't have this spacing

class DistanceStatementNode extends Node {

  /**
   * @param {NLDBaseModel} model,
   * @param {Object} [options]
   */
  constructor( model, options ) {
    options = merge( {
      // {boolean} - changes whether this statement uses number pickers or texts (whether this can change a point controller's value)
      controlsValues: false
    }, options );

    super();

    let valueRepresentations;

    // Creates value properties for each point controller
    // The property corresponds to the point controller's value if it is on the number line
    // Otherwise, the property is INVALID_VALUE (which is still a number for the number property)
    // Value property updates on point controller value change, but point controller values do not update on value property change
    //  unless options.controlsValues is true
    const valueProperties = model.pointControllers.map( pointController => {
      const valueProperty = new NumberProperty( INVALID_VALUE, { reentrant: true } );
      pointController.positionProperty.link( position => {
        if ( pointController.isControllingNumberLinePoint() && model.numberLine.hasPoint( pointController.numberLinePoints.get( 0 ) ) ) {
          valueProperty.value = Utils.roundSymmetric( model.numberLine.modelPositionToValue( position ) );
        }
        else {
          valueProperty.value = INVALID_VALUE;
        }
      } );
      return valueProperty;
    } );

    assert && assert( valueProperties.length === 2, 'Mapping point controllers to value properties should result in only 2 value properties' );

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

      // property for number pickers; is the largest number line range always
      const numberPickerRangeProperty = new Property( NLDConstants.GENERIC_NUMBER_LINE_RANGES[ 2 ] );

      valueRepresentations = [
        new NumberPicker( valueProperties[ 0 ], numberPickerRangeProperty, {
          color: model.pointControllers[ 0 ].color
        } ),
        new NumberPicker( valueProperties[ 1 ], numberPickerRangeProperty, {
          color: model.pointControllers[ 1 ].color
        } )
      ];

      //TODO: handle number pickers allowing duplicate values between point controllers

    } else {

      const textNodes = [
        new Text( `${INVALID_VALUE}`, NORMAL_TEXT_OPTIONS ),
        new Text( `${INVALID_VALUE}`, NORMAL_TEXT_OPTIONS )
      ];

      const textBackgroundOptions = { stroke: 'black', cornerXRadius: 5, cornerYRadius: 5 };

      valueRepresentations = textNodes.map( textNode => {
        const textHolder = new Rectangle( textNode.localBounds.dilatedXY( 5, 10 ), textBackgroundOptions );
        textHolder.addChild( textNode );
        return textHolder;
      } );

      valueProperties.forEach( ( valueProperty, i ) => {
        valueProperty.link( value => {
          textNodes[ i ].text = `${value}`;
          textNodes[ i ].center = valueRepresentations[ i ].rectBounds.center;
        } );
      } );

    }

    // Background nodes to parent the value representations to ensure constant spacing regardless of children
    // assumes that REPRESENTATION_BOUNDS is always larger than any of the possible children
    const backgroundNodes = [
      new Rectangle( REPRESENTATION_BOUNDS ),
      new Rectangle( REPRESENTATION_BOUNDS )
    ];

    // The nodes that will be shown instead of the value representations if the point controllers aren't on the number line
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
    // Children HBoxes are for putting absolute values alongside valueRepresentations
    const firstChildHBox = new HBox( {
      children: [ leftAbsoluteValueMark, backgroundNodes[ 0 ] ],
      excludeInvisibleChildrenFromBounds: false
    } );
    const secondChildHBox = new HBox( {
      children: [ backgroundNodes[ 1 ], rightAbsoluteValueMark ],
      excludeInvisibleChildrenFromBounds: false
    } );
    this.addChild( new HBox( {
      children: [ firstChildHBox, minusSignText, secondChildHBox, equalsSignText, distanceText ],
      spacing: 5
    } ) );

    Property.multilink(
      valueProperties.concat( [ model.distanceRepresentationProperty, model.isPrimaryNodeSwappedProperty, model.numberLine.orientationProperty ] ),
      ( value0, value1, distanceRepresentation, isPrimaryNodeSwapped, orientation ) => {

        // Change the alt text based off of number line orientation
        if ( orientation === Orientation.HORIZONTAL ) {
          alternativeTexts[ 0 ].text = NLDConstants.X_1_STRING;
          alternativeTexts[ 1 ].text = NLDConstants.X_2_STRING;
        } else {
          alternativeTexts[ 0 ].text = NLDConstants.Y_1_STRING;
          alternativeTexts[ 1 ].text = NLDConstants.Y_2_STRING;
        }

        // Chooses the ordering for children for the distance statement
        let firstChild = valueRepresentations[ 1 ];
        let secondChild = valueRepresentations[ 0 ];
        let firstChildValue = value1;
        let secondChildValue = value0;
        let distance = Utils.roundSymmetric( firstChildValue - secondChildValue );
        if ( isPrimaryNodeSwapped ) {
          firstChild = valueRepresentations[ 0 ];
          firstChildValue = value0;
          secondChild = valueRepresentations[ 1 ];
          secondChildValue = value1;
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
        if ( firstChildValue === INVALID_VALUE ) {
          firstChild = alternativeTexts[ 1 ];
          distance = INVALID_DISTANCE_STRING;
        }
        if ( secondChildValue === INVALID_VALUE ) {
          secondChild = alternativeTexts[ 0 ];
          distance = INVALID_DISTANCE_STRING;
        }

        // Adds children to background nodes
        backgroundNodes[ 0 ].children = [ firstChild ];
        backgroundNodes[ 1 ].children = [ secondChild ];
        firstChild.center = REPRESENTATION_BOUNDS.center;
        secondChild.center = REPRESENTATION_BOUNDS.center;

        distanceText.text = `${distance}`;

      }
    );

  }

}

numberLineDistance.register( 'DistanceStatementNode', DistanceStatementNode );
export default DistanceStatementNode;

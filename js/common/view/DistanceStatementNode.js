// Copyright 2020, University of Colorado Boulder

/**
 * A generic distance statement as a node
 * Can either be set to be able to control point controller values (using number pickers) or just show values (using texts)
 * TODO: figure out how this should handle controlling a point that is outside of the range
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
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

const x1String = numberLineDistanceStrings.x1;
const x2String = numberLineDistanceStrings.x2;
const y1String = numberLineDistanceStrings.y1;
const y2String = numberLineDistanceStrings.y2;

const TEXT_OPTIONS = { font: new MathSymbolFont( 25 ), maxWidth: 50 };
const INVALID_VALUE = -101;
const INVALID_DISTANCE_STRING = '?';

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
    let valueProperties;
    if ( options.controlsValues ) {

      // creates value properties that correspond to a point controller's value if it is on the number line and INVALID_VALUE otherwise
      // if the value becomes INVALID_VALUE, the number picker should be replaced by an alternative node
      // the INVALID_VALUE is necessary because number pickers require a number property even though point controllers don't always have a value
      const makePointControllerValueProperty = pointController => {
        const valueProperty = new NumberProperty( INVALID_VALUE, { reentrant: true } );
        pointController.positionProperty.link( position => {
          if ( pointController.isControllingNumberLinePoint() && model.numberLine.hasPoint( pointController.numberLinePoints.get( 0 ) ) ) {
            valueProperty.value = Utils.roundSymmetric( model.numberLine.modelPositionToValue( position ) );
          }
          else {
            valueProperty.value = INVALID_VALUE;
          }
        } );
        valueProperty.link( value => {
          if ( value !== INVALID_VALUE && pointController.isControllingNumberLinePoint()
            && model.numberLine.hasPoint( pointController.numberLinePoints.get( 0 ) ) ) {
            pointController.numberLinePoints.get( 0 ).proposeValue( value );
          }
        } );
        return valueProperty;
      };
      valueProperties = model.pointControllers.map( makePointControllerValueProperty );

      assert && assert( valueProperties.length === 2, 'Mapping point controllers to value properties should result in only 2 value properties' );

      // functions that create up and down functions for a value property given the other value property
      // the other value property is needed to make sure the function doesn't give a value that the other value property has
      // ensures that value properties are always distinct
      // TODO: this isn't how the piggy bank scene in NLI handles this, look into whether this should be changed to be consistent
      const createUpFunction = oppositeValueProperty =>
        value => {
          const newValue = Math.max( value + 1, model.numberLine.displayedRangeProperty.value.min );
          return ( newValue === oppositeValueProperty.value ) ? newValue + 1 : newValue;
        };
      const createDownFunction = oppositeValueProperty =>
        value => {
          const newValue = Math.min( value - 1, model.numberLine.displayedRangeProperty.value.max );
          return ( newValue === oppositeValueProperty.value ) ? newValue - 1 : newValue;
        };

      const numberPicker0 = new NumberPicker( valueProperties[ 0 ], model.numberLine.displayedRangeProperty, {
        color: model.pointControllers[ 0 ].color,
        upFunction: createUpFunction( valueProperties[ 1 ] ),
        downFunction: createDownFunction( valueProperties[ 1 ] )
      } );
      const numberPicker1 = new NumberPicker( valueProperties[ 1 ], model.numberLine.displayedRangeProperty, {
        color: model.pointControllers[ 1 ].color,
        upFunction: createUpFunction( valueProperties[ 0 ] ),
        downFunction: createDownFunction( valueProperties[ 0 ] )
      } );
      valueRepresentations = [ numberPicker0, numberPicker1 ];

    } else {

      //TODO:
      valueProperties = [ new NumberProperty( INVALID_VALUE ), new NumberProperty( INVALID_VALUE ) ];
      valueRepresentations = [ new Rectangle( 0, 0, 1, 1 ), new Rectangle( 0, 0, 1, 1 ) ];

    }

    // The nodes that will be shown instead of the value representations if the point controllers aren't on the number line
    // TODO: use BackgroundNode on a altNodeContent or something and add everything to that
    const alternativeNodes = [
      new Rectangle( valueRepresentations[ 0 ].localBounds ),
      new Rectangle( valueRepresentations[ 1 ].localBounds )
    ];
    const alternativeTexts = [
      new RichText( x1String, merge( { center: alternativeNodes[ 0 ].center }, TEXT_OPTIONS ) ),
      new RichText( x2String, merge( { center: alternativeNodes[ 1 ].center }, TEXT_OPTIONS ) )
    ];
    alternativeNodes[ 0 ].addChild( alternativeTexts[ 0 ] );
    alternativeNodes[ 1 ].addChild( alternativeTexts[ 1 ] );

    const minusSignText = new Text( MathSymbols.MINUS, TEXT_OPTIONS );
    const equalsSignText = new Text( MathSymbols.EQUAL_TO, TEXT_OPTIONS );

    // A text that displays the distance between the two point controllers (or '?' if invalid distance)
    const distanceText = new Text( INVALID_DISTANCE_STRING, merge( { font: new PhetFont( 25 ) }, TEXT_OPTIONS ) );

    // Absolute value marks
    const leftAbsoluteValueMark = new AbsoluteValueLine( valueRepresentations[ 1 ] );
    const rightAbsoluteValueMark = new AbsoluteValueLine( valueRepresentations[ 0 ] );

    // Layout boxes for this node's actual content
    const firstChildHBox = new HBox( { children: [ valueRepresentations[ 1 ] ], spacing: 2 } );
    const secondChildHBox = new HBox( { children: [ valueRepresentations[ 0 ] ], spacing: 2 } );
    this.addChild( new HBox( {
      children: [ firstChildHBox, minusSignText, secondChildHBox, equalsSignText, distanceText ],
      spacing: 5
    } ) );

    Property.multilink(
      valueProperties.concat( [ model.distanceRepresentationProperty, model.isPrimaryNodeSwappedProperty, model.numberLine.orientationProperty ] ),
      ( value0, value1, distanceRepresentation, isPrimaryNodeSwapped, orientation ) => {

        firstChildHBox.removeAllChildren();
        secondChildHBox.removeAllChildren();

        // Change the alt text based off of number line orientation
        if ( orientation === Orientation.HORIZONTAL ) {
          alternativeTexts[ 0 ].text = x1String;
          alternativeTexts[ 1 ].text = x2String;
        } else {
          alternativeTexts[ 0 ].text = y1String;
          alternativeTexts[ 1 ].text = y2String;
        }

        // Chooses the ordering for children for the distance statement
        let firstChild = valueRepresentations[ 1 ];
        let secondChild = valueRepresentations[ 0 ];
        let firstChildValue = valueProperties[ 1 ].value;
        let secondChildValue = valueProperties[ 0 ].value;
        let distance = Utils.roundSymmetric( firstChildValue - secondChildValue );
        if ( isPrimaryNodeSwapped ) {
          firstChild = valueRepresentations[ 0 ];
          firstChildValue = valueProperties[ 0 ].value;
          secondChild = valueRepresentations[ 1 ];
          secondChildValue = valueProperties[ 1 ].value;
          distance = -distance;
        }

        // Adds absolute value marks and makes the distance positive if the distance representation is absolute
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          distance = Math.abs( distance );
          firstChildHBox.addChild( leftAbsoluteValueMark );
          secondChildHBox.addChild( rightAbsoluteValueMark );
        }

        // Replaces value representations with alternatives if their value is invalid
        if ( firstChildValue === INVALID_VALUE ) {
          firstChild = alternativeNodes[ 1 ];
          distance = INVALID_DISTANCE_STRING;
        }
        if ( secondChildValue === INVALID_VALUE ) {
          secondChild = alternativeNodes[ 0 ];
          distance = INVALID_DISTANCE_STRING;
        }

        distanceText.text = `${distance}`;
        firstChildHBox.addChild( firstChild );
        secondChildHBox.children = [ secondChild ].concat( secondChildHBox.children );

      }
    );

  }

}

numberLineDistance.register( 'DistanceStatementNode', DistanceStatementNode );
export default DistanceStatementNode;

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
import Bounds2 from '../../../../dot/js/Bounds2.js';

const x1String = numberLineDistanceStrings.x1;
const x2String = numberLineDistanceStrings.x2;
const y1String = numberLineDistanceStrings.y1;
const y2String = numberLineDistanceStrings.y2;

const MATH_TEXT_OPTIONS = { font: new MathSymbolFont( 25 ), maxWidth: 40 };
const NORMAL_TEXT_OPTIONS = { font: new PhetFont( 25 ), maxWidth: 40 };
const INVALID_VALUE = -101;
const INVALID_DISTANCE_STRING = '?';
const REPRESENTATION_BOUNDS = new Bounds2( 0, 0, 45, 55 ); //TODO: this looks a little ugly because the equals sign doesn't have this spacing

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
            pointController.numberLinePoints.get( 0 ).proposeValue( value );
          }
        } );
      } );

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

      valueRepresentations = [
        new NumberPicker( valueProperties[ 0 ], model.numberLine.displayedRangeProperty, {
          color: model.pointControllers[ 0 ].color,
          upFunction: createUpFunction( valueProperties[ 1 ] ),
          downFunction: createDownFunction( valueProperties[ 1 ] )
        } ),
        new NumberPicker( valueProperties[ 1 ], model.numberLine.displayedRangeProperty, {
          color: model.pointControllers[ 1 ].color,
          upFunction: createUpFunction( valueProperties[ 0 ] ),
          downFunction: createDownFunction( valueProperties[ 0 ] )
        } )
      ];

    } else {

      valueRepresentations = [
        new Text( `${INVALID_VALUE}`, NORMAL_TEXT_OPTIONS ),
        new Text( `${INVALID_VALUE}`, NORMAL_TEXT_OPTIONS )
      ];

      valueProperties.forEach( ( valueProperty, i ) => {
        valueProperty.link( value => {
          valueRepresentations[ i ].text = `${value}`;
        } );
      } );

    }

    // TODO: consider use of BackgroundNode
    // Background nodes to parent the value representations to ensure constant spacing regardless of children
    // assumes that REPRESENTATION_BOUNDS is always larger than any of the possible children
    const backgroundNodes = [
      new Rectangle( REPRESENTATION_BOUNDS ),
      new Rectangle( REPRESENTATION_BOUNDS )
    ];

    // The nodes that will be shown instead of the value representations if the point controllers aren't on the number line
    const alternativeTexts = [ new RichText( x1String, MATH_TEXT_OPTIONS ), new RichText( x2String, MATH_TEXT_OPTIONS ) ];

    const minusSignText = new Text( MathSymbols.MINUS, MATH_TEXT_OPTIONS );
    const equalsSignText = new Text( MathSymbols.EQUAL_TO, MATH_TEXT_OPTIONS );

    // A text that displays the distance between the two point controllers (or '?' if invalid distance)
    const distanceText = new Text( INVALID_DISTANCE_STRING, NORMAL_TEXT_OPTIONS );

    // Absolute value marks
    const leftAbsoluteValueMark = new AbsoluteValueLine( backgroundNodes[ 0 ] );
    const rightAbsoluteValueMark = new AbsoluteValueLine( backgroundNodes[ 1 ] );

    // Layout boxes for this node's actual content
    // Children HBoxes are for putting absolute values alongside valueRepresentations
    const firstChildHBox = new HBox( { children: [ backgroundNodes[ 0 ] ], spacing: 2 } );
    const secondChildHBox = new HBox( { children: [ backgroundNodes[ 1 ] ], spacing: 2 } );
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
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          distance = Math.abs( distance );
          firstChildHBox.addChild( leftAbsoluteValueMark );
          secondChildHBox.addChild( rightAbsoluteValueMark );
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
        firstChildHBox.addChild( backgroundNodes[ 0 ] );
        secondChildHBox.children = [ backgroundNodes[ 1 ] ].concat( secondChildHBox.children );

      }
    );

  }

}

numberLineDistance.register( 'DistanceStatementNode', DistanceStatementNode );
export default DistanceStatementNode;

// Copyright 2020-2025, University of Colorado Boulder

/**
 * A generic distance statement as a scenery Node. Can either be set to be able to control point controller values
 * (using number pickers) or just show values (using texts). All minus symbols use the MathSymbols.MINUS symbol (even if
 * it is a unary minus) so that all the minus symbols are consistent (see #27). Doesn't need to unlink Properties
 * because all instances of DistanceStatementNode are present for the lifetime of the sim.
 *
 * @author Saurabh Totey
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import AbsoluteValueLine from '../../../../number-line-common/js/common/view/AbsoluteValueLine.js';
import merge from '../../../../phet-core/js/merge.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import FlowBox from '../../../../scenery/js/layout/nodes/FlowBox.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VStrut from '../../../../scenery/js/nodes/VStrut.js';
import NumberPicker from '../../../../sun/js/NumberPicker.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import numberLineDistance from '../../numberLineDistance.js';
import NLDConstants from '../NLDConstants.js';

// constants
const MATH_TEXT_OPTIONS = { font: new MathSymbolFont( 25 ), maxWidth: 40 };
const NORMAL_TEXT_OPTIONS = { font: new PhetFont( 25 ), maxWidth: 55 };
const TERM_LABEL_TEXT_OPTIONS = { font: new MathSymbolFont( 15 ), maxWidth: 25 };

// A value that is beyond the bounds of the number lines because the number pickers' Properties always require a number
const INVALID_VALUE = -101;
const INVALID_DISTANCE_STRING = '?';

// A bounding object that is supposed to always be larger than a potential point controller representation
const REPRESENTATION_BOUNDS = new Bounds2( 0, 0, 65, 55 );

class DistanceStatementNode extends Node {

  /**
   * @param {AbstractNLDBaseModel} [model],
   * @param {Object} [options] - do not get bubbled up to Node
   */
  constructor( model, options ) {
    options = merge( {

      // {boolean} - changes whether this statement uses number pickers or texts.
      // This affects whether this can change a point controller's value or not.
      controlsValues: false
    }, options );

    super();

    // A list of size 2 that contains nodes that 'represent' a point controller's value;
    // will either be number pickers or texts depending on options.controlsValues.
    let valueRepresentations;

    // Create valueProperties for each number line point. The Property corresponds to the point's value if it has any.
    // Otherwise, the Property is INVALID_VALUE (which is still a number for the NumberProperty). The valueProperty
    // will update when the point controller's value changes, but the point's value will not update when the valueProperty
    // changes unless options.controlsValues is true. The INVALID_VALUE hack is required because the number pickers
    // require the valueProperty to always have a numeric value.
    const valueProperties = [
      new NumberProperty( INVALID_VALUE, { reentrant: true } ),
      new NumberProperty( INVALID_VALUE, { reentrant: true } )
    ];
    model.pointValuesProperty.link( pointValues => {
      valueProperties[ 0 ].value = pointValues[ 0 ] !== null ? pointValues[ 0 ] : INVALID_VALUE;
      valueProperties[ 1 ].value = pointValues[ 1 ] !== null ? pointValues[ 1 ] : INVALID_VALUE;
    } );

    // There are necessarily 2 point controllers (that is enforced by AbsractNLDBaseModel), so ensure
    // that we have the correct number of corresponding value Properties.
    assert && assert(
      valueProperties.length === 2,
      'Mapping point values to value Properties should result in exactly 2 value Properties'
    );

    if ( options.controlsValues ) {

      // Make changing the value Properties affect the point controllers' values.
      model.pointControllers.forEach( ( pointController, i ) => {
        valueProperties[ i ].link( value => {
          if ( value !== INVALID_VALUE && pointController.isControllingNumberLinePoint()
               && model.numberLine.hasPoint( pointController.numberLinePoints.get( 0 ) ) ) {
            pointController.numberLinePoints.get( 0 ).valueProperty.value = value;
          }
        } );
      } );

      // Range Property for number pickers; picks a range that contains all generic number line ranges.
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
        } ),
        {
          valueType: Range
        }
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
        Multilink.multilink(
          [ valueProperty, model.isPrimaryControllerSwappedProperty ],
          ( value, isPrimaryNodeSwapped ) => {
            const isSecondDisplayedValue = i === 1 && isPrimaryNodeSwapped || i === 0 && !isPrimaryNodeSwapped;
            textNodes[ i ].string = ( value < 0 && isSecondDisplayedValue ) ? `(${value})` : `${value}`;
            textNodes[ i ].string = textNodes[ i ].string.replace( '-', MathSymbols.MINUS );
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
    // This code assumes that REPRESENTATION_BOUNDS is always larger than any of the possible children.
    const backgroundNodes = [
      new Rectangle( REPRESENTATION_BOUNDS ),
      new Rectangle( REPRESENTATION_BOUNDS )
    ];

    // The text needs to be visible at startup to properly instantiate the Gridbox layout.
    const horizontalTextVisibleProperty = new BooleanProperty( model.numberLine.orientationProperty.value === Orientation.HORIZONTAL );
    const verticalTextVisibleProperty = new BooleanProperty( model.numberLine.orientationProperty.value === Orientation.VERTICAL );

    // These nodes that will be shown instead of the value representations if the point controllers aren't on the number line.
    const alternativeTexts = {
      horizontal: [
        new RichText( NLDConstants.X_1_STRING, merge( MATH_TEXT_OPTIONS, { visibleProperty: horizontalTextVisibleProperty } ) ),
        new RichText( NLDConstants.X_2_STRING, merge( MATH_TEXT_OPTIONS, { visibleProperty: horizontalTextVisibleProperty } ) )
      ],
      vertical: [
        new RichText( NLDConstants.Y_1_STRING, merge( MATH_TEXT_OPTIONS, { visibleProperty: verticalTextVisibleProperty } ) ),
        new RichText( NLDConstants.Y_2_STRING, merge( MATH_TEXT_OPTIONS, { visibleProperty: verticalTextVisibleProperty } ) )
      ]
    };

    const minusSignText = new Text( MathSymbols.MINUS, merge( { layoutOptions: { xMargin: 5 } }, NORMAL_TEXT_OPTIONS ) );
    const equalsSignText = new Text( MathSymbols.EQUAL_TO, merge( { layoutOptions: { xMargin: 5 } }, NORMAL_TEXT_OPTIONS ) );

    // A text that displays the distance between the two point controllers (or '?' if invalid distance).
    const distanceText = new Text( INVALID_DISTANCE_STRING, merge( { layoutOptions: { xMargin: 7 } }, NORMAL_TEXT_OPTIONS ) );

    // absolute value marks - are shorter than the background nodes they are supposed to wrap for #40 by an empirically
    // determined amount.
    const absoluteValueMarkHeightIndicator = new VStrut( backgroundNodes[ 0 ].height - 10 );
    const leftAbsoluteValueMark = new AbsoluteValueLine( absoluteValueMarkHeightIndicator );
    const rightAbsoluteValueMark = new AbsoluteValueLine( absoluteValueMarkHeightIndicator );

    // HBoxes are for putting absolute values alongside valueRepresentations.
    const leftTermHBox = new HBox( {
      children: [ leftAbsoluteValueMark, backgroundNodes[ 0 ] ],
      excludeInvisibleChildrenFromBounds: false
    } );
    const rightTermHBox = new HBox( {
      children: [ backgroundNodes[ 1 ], rightAbsoluteValueMark ],
      excludeInvisibleChildrenFromBounds: false
    } );

    // labels that go above the numerical terms when they have valid values
    const leftTermHorizontalLabel = new RichText( NLDConstants.X_2_STRING, merge( {
      visibleProperty: horizontalTextVisibleProperty
    }, TERM_LABEL_TEXT_OPTIONS ) );
    const leftTermVerticalLabel = new RichText( NLDConstants.Y_2_STRING, merge( {
      visibleProperty: verticalTextVisibleProperty
    }, TERM_LABEL_TEXT_OPTIONS ) );
    const rightTermHorizontalLabel = new RichText( NLDConstants.X_1_STRING, merge( {
      visibleProperty: horizontalTextVisibleProperty
    }, TERM_LABEL_TEXT_OPTIONS ) );
    const rightTermVerticalLabel = new RichText( NLDConstants.Y_1_STRING, merge( {
      visibleProperty: verticalTextVisibleProperty
    }, TERM_LABEL_TEXT_OPTIONS ) );

    const leftTermLabelNode = new FlowBox( {
      children: [ leftTermHorizontalLabel, leftTermVerticalLabel ],
      visibleProperty: new DerivedProperty( [ model.pointValuesProperty, model.isPrimaryControllerSwappedProperty ],
        ( pointValues, swapped ) => {
          return swapped ? pointValues[ 0 ] !== null : pointValues[ 1 ] !== null;
        } )
    } );

    const rightTermLabelNode = new FlowBox( {
      children: [ rightTermHorizontalLabel, rightTermVerticalLabel ],
      visibleProperty: new DerivedProperty( [ model.pointValuesProperty, model.isPrimaryControllerSwappedProperty ],
        ( pointValues, swapped ) => {
          return swapped ? pointValues[ 1 ] !== null : pointValues[ 0 ] !== null;
        } )
    } );

    // In order to place the term labels exactly above the appropriate terms, we need to create another HBox above the
    // HBox that houses all the distance statement terms and we need to ensure that the spacings match. The only term that
    // changes size is the distance term because the other terms are housed in parent nodes that ensure a constant width.
    const distanceTextHStrutStandin = new Node( { children: [ new HStrut( distanceText.width ) ] } );
    distanceText.boundsProperty.link( () => {
      distanceTextHStrutStandin.children = [ new HStrut( distanceText.width ) ];
    } );

    this.addChild( new GridBox( {
      spacing: 0,
      resize: false,
      rows: [ [ leftTermLabelNode, new Node(), rightTermLabelNode ],
        [ leftTermHBox, minusSignText, rightTermHBox, equalsSignText, distanceText ]
      ],
      excludeInvisibleChildrenFromBounds: false
    } ) );

    // This multilink listens for changes in any relevant Properties and updates the distance statement accordingly.
    Multilink.multilink(
      [
        valueProperties[ 0 ],
        valueProperties[ 1 ],
        model.distanceRepresentationProperty,
        model.isPrimaryControllerSwappedProperty,
        model.numberLine.orientationProperty
      ],
      ( value0, value1, distanceRepresentation, isPrimaryNodeSwapped, orientation ) => {

        // Change the alt text based off of number line orientation.
        if ( orientation === Orientation.HORIZONTAL ) {
          horizontalTextVisibleProperty.value = true;
          verticalTextVisibleProperty.value = false;
        }
        else {
          horizontalTextVisibleProperty.value = false;
          verticalTextVisibleProperty.value = true;
        }

        // Choose the ordering for children for the distance statement.
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

        // Add absolute value marks and makes the distance positive if the distance representation is absolute.
        leftAbsoluteValueMark.visible = false;
        rightAbsoluteValueMark.visible = false;
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE ) {
          distance = Math.abs( distance );
          leftAbsoluteValueMark.visible = true;
          rightAbsoluteValueMark.visible = true;
        }

        // Replace value representations with alternatives if their value is invalid.
        if ( leftTermValue === INVALID_VALUE ) {
          leftTermNode = model.numberLine.orientationProperty.value === Orientation.HORIZONTAL ?
                         alternativeTexts.horizontal[ 1 ] : alternativeTexts.vertical[ 1 ];
          distance = INVALID_DISTANCE_STRING;
        }
        if ( rightTermValue === INVALID_VALUE ) {
          rightTermNode = model.numberLine.orientationProperty.value === Orientation.HORIZONTAL ?
                          alternativeTexts.horizontal[ 0 ] : alternativeTexts.vertical[ 0 ];
          distance = INVALID_DISTANCE_STRING;
        }

        // Add distance statement terms to the background nodes and ensure they are centered.
        backgroundNodes[ 0 ].children = [ leftTermNode ];
        backgroundNodes[ 1 ].children = [ rightTermNode ];
        leftTermNode.center = REPRESENTATION_BOUNDS.center;
        rightTermNode.center = REPRESENTATION_BOUNDS.center;

        distanceText.string = `${distance}`.replace( '-', MathSymbols.MINUS );
      }
    );
  }
}

numberLineDistance.register( 'DistanceStatementNode', DistanceStatementNode );
export default DistanceStatementNode;
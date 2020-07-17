// Copyright 2020, University of Colorado Boulder

/**
 * View of the 'Generic' screen for the Number Line Distance simulation
 *
 * @author Saurabh Totey
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import numberLineDistance from '../../numberLineDistance.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NLDConstants from '../../common/NLDConstants.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import genericmockup from '../../../images/genericmockup_png.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import NumberLineOrientationSelector from '../../../../number-line-common/js/common/view/NumberLineOrientationSelector.js';
import NumberLineRangeSelector from '../../../../number-line-common/js/common/view/NumberLineRangeSelector.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import Util from '../../../../dot/js/Utils.js';
import MathSymbolFont from '../../../../scenery-phet/js/MathSymbolFont.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import PointsOffScaleCondition from '../../../../number-line-common/js/common/view/PointsOffScaleCondition.js';

const x1String = numberLineDistanceStrings.x1;
const x2String = numberLineDistanceStrings.x2;
const y1String = numberLineDistanceStrings.y1;
const y2String = numberLineDistanceStrings.y2;
const genericAbsoluteDistanceTemplateString = numberLineDistanceStrings.genericAbsoluteDistanceTemplate;
const genericDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.genericDirectedPositiveDistanceTemplate;
const genericDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.genericDirectedNegativeDistanceTemplate;

const CIRCLE_REPRESENTATION_RADIUS = 5;

class NLDGenericScreenView extends ScreenView {

  /**
   * @param {NLDGenericModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( {
      tandem: tandem
    } );

    // TODO - mockup - temporary, for design and layout
    const mockup = new Image( genericmockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // a property that returns a string that describes the distance between both the point controllers
    const distanceDescriptionProperty = new DerivedProperty(
      [
        model.distanceRepresentationProperty,
        model.numberLine.orientationProperty,
        model.isPrimaryNodeSwappedProperty,
        model.pointControllers[ 0 ].positionProperty,
        model.pointControllers[ 1 ].positionProperty
      ],
      ( distanceRepresentation, orientation, isPrimaryNodeSwapped, position0, position1 ) => {

        // Can't say anything about distance if both point controllers aren't on the number line
        if ( !model.areBothPointControllersControllingOnNumberLine() ) {
          return '';
        }

        const value0 = model.numberLine.modelPositionToValue( position0 );
        const value1 = model.numberLine.modelPositionToValue( position1 );

        // Get the strings for the point controllers based off of orientation
        let primaryXY = x1String;
        let secondaryXY = x2String;
        if ( orientation === Orientation.VERTICAL ) {
          primaryXY = y1String;
          secondaryXY = y2String;
        }

        let difference = Util.roundSymmetric( value1 - value0 );
        if ( isPrimaryNodeSwapped ) {
          difference = -difference;
        }

        // Fills in a string template for the distance text based off of the distance representation
        // and whether the distance is positive or negative
        const fillInValues = {
          primaryXY: MathSymbolFont.getRichTextMarkup( primaryXY ),
          secondaryXY: MathSymbolFont.getRichTextMarkup( secondaryXY ),
          difference: Math.abs( difference )
        };
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE && difference !== 0 ) {
          return StringUtils.fillIn( genericAbsoluteDistanceTemplateString, fillInValues );
        }
        if ( difference > 0 ) {
          return StringUtils.fillIn( genericDirectedPositiveDistanceTemplateString, fillInValues );
        } else if ( difference < 0 ) {
          return StringUtils.fillIn( genericDirectedNegativeDistanceTemplateString, fillInValues );
        }

        // Reaching here means that the difference was 0, so there is nothing to say
        return '';

      }
    );

    // the point controllers are represented as circles on the bottom left corner of the screen
    const firstControllerRepresentation = new Circle( CIRCLE_REPRESENTATION_RADIUS, { fill: 'magenta' } );
    const secondControllerRepresentation = new Circle( CIRCLE_REPRESENTATION_RADIUS, { fill: 'blue' } );

    const baseView = new NLDBaseView(
      model,
      firstControllerRepresentation,
      secondControllerRepresentation,
      distanceDescriptionProperty,
      { distanceStatementNodeOptions: { controlsValues: true } }
    );
    this.addChild( baseView );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        baseView.accordionBoxOpenedProperty.reset();
      },
      right: this.layoutBounds.maxX - NLDConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLDConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // adds orientation selectors for the number line
    const orientationSelector = new NumberLineOrientationSelector( model.numberLine.orientationProperty, {
      bottom: NLDConstants.NLD_LAYOUT_BOUNDS.maxY - 50,
      right: resetAllButton.left - 50
    } );
    this.addChild( orientationSelector );

    // adds range selectors for the number line
    this.addChild( new NumberLineRangeSelector(
      model.numberLine.displayedRangeProperty,
      NLDConstants.GENERIC_NUMBER_LINE_RANGES,
      this,
      {
        bottom: orientationSelector.top - 15,
        left: orientationSelector.left
      }
    ) );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: model.pointControllers.map( pointController => new PointControllerNode( pointController ) )
    } );
    this.addChild( pointControllerNodeLayer );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { pointsOffScaleCondition: PointsOffScaleCondition.SOME } );
    this.addChild( numberLineNode );
  }

}

numberLineDistance.register( 'NLDGenericScreenView', NLDGenericScreenView );
export default NLDGenericScreenView;

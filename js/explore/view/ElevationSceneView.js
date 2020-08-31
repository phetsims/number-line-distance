// Copyright 2020, University of Colorado Boulder

/**
 * 'Elevation' scene view for the explore screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import explorescene3mockup from '../../../images/explorescene3mockup_png.js';
import NLDConstants from '../../common/NLDConstants.js';
import NLDBaseView from '../../common/view/NLDBaseView.js';
import PointControllerNode from '../../../../number-line-common/js/common/view/PointControllerNode.js';
import DistanceShadedNumberLineNode from '../../common/view/DistanceShadedNumberLineNode.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import numberLineDistanceStrings from '../../numberLineDistanceStrings.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Util from '../../../../dot/js/Utils.js';
import DistanceRepresentation from '../../common/model/DistanceRepresentation.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';

const fishString = numberLineDistanceStrings.fish;
const birdString = numberLineDistanceStrings.bird;
const elevationSceneAbsoluteDistanceTemplateString = numberLineDistanceStrings.elevationSceneAbsoluteDistanceTemplate;
const elevationSceneDirectedPositiveDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedPositiveDistanceTemplate;
const elevationSceneDirectedNegativeDistanceTemplateString = numberLineDistanceStrings.elevationSceneDirectedNegativeDistanceTemplate;
const metersString = numberLineDistanceStrings.symbol.meters;

class ElevationSceneView extends Node {

  /**
   * @param {ElevationSceneModel} model
   */
  constructor( model ) {
    super();

    //TODO: temporary mockup
    const mockup = new Image( explorescene3mockup, {
      center: NLDConstants.NLD_LAYOUT_BOUNDS.center,
      minWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
      maxWidth: NLDConstants.NLD_LAYOUT_BOUNDS.width,
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
        let primaryY = birdString;
        let secondaryY = fishString;

        let difference = Util.roundSymmetric( value1 - value0 );
        if ( isPrimaryNodeSwapped ) {
          difference = -difference;
          primaryY = fishString;
          secondaryY = birdString;
        }

        // Fills in a string template for the distance text based off of the distance representation
        // and whether the distance is positive or negative
        const fillInValues = {
          primaryY: primaryY,
          secondaryY: secondaryY,
          difference: Math.abs( difference )
        };
        if ( distanceRepresentation === DistanceRepresentation.ABSOLUTE && difference !== 0 ) {
          return StringUtils.fillIn( elevationSceneAbsoluteDistanceTemplateString, fillInValues );
        }
        if ( difference > 0 ) {
          return StringUtils.fillIn( elevationSceneDirectedPositiveDistanceTemplateString, fillInValues );
        }
        else if ( difference < 0 ) {
          return StringUtils.fillIn( elevationSceneDirectedNegativeDistanceTemplateString, fillInValues );
        }

        // Reaching here means that the difference was 0, so there is nothing to say
        return '';

      }
    );

    this.addChild( new NLDBaseView( model, new Node(), new Node(), distanceDescriptionProperty ) );

    //TODO: temporary rectangle
    this.addChild( new Rectangle( model.elevationAreaBounds, { stroke: 'black' } ) );

    // point controllers
    const pointControllerNodeLayer = new Node( {
      children: model.pointControllers.map( pointController => new PointControllerNode( pointController, { connectorLine: false } ) )
    } );
    this.addChild( pointControllerNodeLayer );

    // number line
    const numberLineNode = new DistanceShadedNumberLineNode( model, { unitsString: metersString } );
    this.addChild( numberLineNode );
  }

}

numberLineDistance.register( 'ElevationSceneView', ElevationSceneView );
export default ElevationSceneView;

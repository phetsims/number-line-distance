// Copyright 2020, University of Colorado Boulder

/**
 * Model for the 'Temperature' scene
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import NLDConstants from '../../common/NLDConstants.js';
import Range from '../../../../dot/js/Range.js';
import AreaSceneModel from './AreaSceneModel.js';
import TemperaturePointController from './TemperaturePointController.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TemperatureToColorMapper from '../../../../number-line-common/js/explore/model/TemperatureToColorMapper.js';

// constants
const TEMPERATURE_POINT_CONTROLLER_BOX_SCALE = 0.4;

class TemperatureSceneModel extends AreaSceneModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // values empirically determined
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( 0, -75 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 250,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 160,
      initialDisplayedRange: TemperatureSceneModel.TEMPERATURE_RANGE,
      labelsInitiallyVisible: true,
      tickMarksInitiallyVisible: true,
      preventOverlap: false
    } );

    // y-values determined empirically
    const temperatureAreaBounds = new Bounds2(
      numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.min ).x, 334,
      numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.max ).x, 434
    );
    const isPositionInBounds = position => temperatureAreaBounds.containsPoint( position );

    const temperatureToColorMapper = new TemperatureToColorMapper( TemperatureSceneModel.TEMPERATURE_RANGE );
    const mapTemperatureToColor = value => temperatureToColorMapper.mapTemperatureToColor( value );

    super(
      numberLine,
      new TemperaturePointController(
        isPositionInBounds,
        mapTemperatureToColor,
        {
          numberLines: [ numberLine ],
          scaleInBox: TEMPERATURE_POINT_CONTROLLER_BOX_SCALE,
          color: '#693cc2'
        }
      ),
      new TemperaturePointController(
        isPositionInBounds,
        mapTemperatureToColor,
        {
          numberLines: [ numberLine ],
          scaleInBox: TEMPERATURE_POINT_CONTROLLER_BOX_SCALE,
          color: '#52c23c'
        }
      ),
      tandem,
      { positionInBoxOffset: new Vector2( 0, 20 ) } // empirically determined
    );

    // @public (readonly) the bounds where point controllers can be
    this.temperatureAreaBounds = temperatureAreaBounds;

    // @public (readonly)
    this.temperatureToColorMapper = temperatureToColorMapper;
  }

}

TemperatureSceneModel.TEMPERATURE_RANGE = new Range( -50, 50 );

numberLineDistance.register( 'TemperatureSceneModel', TemperatureSceneModel );
export default TemperatureSceneModel;

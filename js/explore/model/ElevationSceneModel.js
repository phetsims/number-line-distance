// Copyright 2020, University of Colorado Boulder

/**
 * Model for the 'Elevation' scene
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import NLDConstants from '../../common/NLDConstants.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Range from '../../../../dot/js/Range.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ExplorePointController from './ExplorePointController.js';
import SceneModel from './SceneModel.js';

class ElevationSceneModel extends SceneModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( -275, 0 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 100,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 275,
      initialOrientation: Orientation.VERTICAL,
      initialDisplayedRange: new Range( -20, 20 ),
      labelsInitiallyVisible: true,
      tickMarksInitiallyVisible: true
    } );

    const elevationAreaBounds = new Bounds2(
      300, numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.max ).y,
      750, numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.min ).y
    );
    const isPositionInBounds = position => elevationAreaBounds.containsPoint( position );

    super(
      numberLine,
      new ExplorePointController( isPositionInBounds, {
        numberLines: [ numberLine ],
        color: 'black'
      } ),
      new ExplorePointController( isPositionInBounds, {
        numberLines: [ numberLine ],
        color: '#446ab7'
      } ),
      tandem
    );

    // @public (readonly) the bounds where point controllers can be
    this.elevationAreaBounds = elevationAreaBounds;
  }

}

numberLineDistance.register( 'ElevationSceneModel', ElevationSceneModel );
export default ElevationSceneModel;

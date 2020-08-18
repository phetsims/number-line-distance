// Copyright 2020, University of Colorado Boulder

/**
 * Model for the 'Elevation' scene
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import NLDBaseModel from '../../common/model/NLDBaseModel.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import NLDConstants from '../../common/NLDConstants.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import Range from '../../../../dot/js/Range.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';
import ExplorePointController from './ExplorePointController.js';

class ElevationSceneModel extends NLDBaseModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( -275, 0 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 100,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 275,
      initialOrientation: Orientation.VERTICAL,
      initialDisplayedRange: new Range( -20, 20 )
    } );

    // TODO: get real bounds
    const elevationAreaBounds = new Bounds2(
      350, numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.max ).y,
      750, numberLine.valueToModelPosition( numberLine.displayedRangeProperty.value.min ).y
    );
    const isPositionOverBounds = position => elevationAreaBounds.containsPoint( position );

    super( tandem, numberLine, [
      new ExplorePointController( isPositionOverBounds, {
        numberLines: [ numberLine ],
        lockToNumberLine: LockToNumberLine.NEVER,
        color: 'black'
      } ),
      new ExplorePointController( isPositionOverBounds, {
        numberLines: [ numberLine ],
        lockToNumberLine: LockToNumberLine.NEVER,
        color: '#446ab7'
      } )
    ] );

    // @public (readonly) the bounds where point controllers can be
    this.elevationAreaBounds = elevationAreaBounds;

    // Handles attaching and detaching number line points to the point controllers whenever they enter or leave the bounds
    // TODO: consider moving this block of code into NLDExploreModel
    this.pointControllers.forEach( pointController => {
      pointController.positionProperty.link( position => {
        if ( isPositionOverBounds( position ) && !pointController.isControllingNumberLinePoint() && pointController.isDraggingProperty.value ) {
          const numberLinePoint = new NumberLinePoint( numberLine, {
            controller: pointController,
            initialValue: numberLine.modelPositionToValue( position ),
            initialColor: pointController.color
          } );
          numberLine.addPoint( numberLinePoint );
          pointController.associateWithNumberLinePoint( numberLinePoint );
        } else if ( !isPositionOverBounds( position ) && pointController.isControllingNumberLinePoint() ) {
          pointController.removePointsFromNumberLines();
          pointController.clearNumberLinePoints();
        }
      } );
    } );
  }

  /**
   * Resets this specific scene
   * @public
   */
  reset() {
    super.reset();
    //TODO:
  }

}

numberLineDistance.register( 'ElevationSceneModel', ElevationSceneModel );
export default ElevationSceneModel;

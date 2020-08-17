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
import PointController from '../../../../number-line-common/js/common/model/PointController.js';
import Range from '../../../../dot/js/Range.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NumberLinePoint from '../../../../number-line-common/js/common/model/NumberLinePoint.js';

class ElevationSceneModel extends NLDBaseModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( -275, 0 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 100,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 250,
      initialOrientation: Orientation.VERTICAL,
      initialDisplayedRange: new Range( -20, 20 )
    } );
    super( tandem, numberLine, [
      new PointController( {
        numberLines: [ numberLine ],
        lockToNumberLine: LockToNumberLine.NEVER
      } ),
      new PointController( {
        numberLines: [ numberLine ],
        lockToNumberLine: LockToNumberLine.NEVER
      } )
    ] );

    // @public (readonly) the bounds where point controllers can be TODO: get real bounds
    this.elevationAreaBounds = new Bounds2( 400, 100, 800, 500 );

    this.pointControllers.forEach( pointController => {
      pointController.positionProperty.link( position => {
        if ( this.elevationAreaBounds.containsPoint( position ) && !pointController.isControllingNumberLinePoint() && pointController.isDraggingProperty.value ) {
          const numberLinePoint = new NumberLinePoint(
            numberLine,
            { controller: pointController, initialValue: numberLine.modelPositionToValue( position ) }
          );
          numberLine.addPoint( numberLinePoint );
          pointController.associateWithNumberLinePoint( numberLinePoint );
        } else if ( !this.elevationAreaBounds.containsPoint( position ) && pointController.isControllingNumberLinePoint() ) {
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

// Copyright 2020, University of Colorado Boulder

/**
 * Model for the 'Temperature' scene
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import NLDBaseModel from '../../common/model/NLDBaseModel.js';
import SpatializedNumberLine from '../../../../number-line-common/js/common/model/SpatializedNumberLine.js';
import NLDConstants from '../../common/NLDConstants.js';
import PointController from '../../../../number-line-common/js/common/model/PointController.js';
import Range from '../../../../dot/js/Range.js';
import LockToNumberLine from '../../../../number-line-common/js/common/model/LockToNumberLine.js';

class TemperatureSceneModel extends NLDBaseModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    //TODO:
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( 0, -75 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 100,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 160,
      initialDisplayedRange: new Range( -50, 50 )
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
    //TODO:
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

numberLineDistance.register( 'TemperatureSceneModel', TemperatureSceneModel );
export default TemperatureSceneModel;

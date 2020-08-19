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
import SceneModel from './SceneModel.js';
import ExplorePointController from './ExplorePointController.js';

class TemperatureSceneModel extends SceneModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    //TODO:
    const numberLine = new SpatializedNumberLine( NLDConstants.NLD_LAYOUT_BOUNDS.center.plusXY( 0, -75 ), {
      widthInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.width - 250,
      heightInModelSpace: NLDConstants.NLD_LAYOUT_BOUNDS.height - 160,
      initialDisplayedRange: new Range( -50, 50 )
    } );

    //TODO:
    super( tandem, numberLine, [
      new ExplorePointController( () => false, {
        numberLines: [ numberLine ]
      } ),
      new ExplorePointController( () => false, {
        numberLines: [ numberLine ]
      } )
    ] );
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

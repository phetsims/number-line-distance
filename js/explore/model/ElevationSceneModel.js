// Copyright 2020, University of Colorado Boulder

/**
 * Model for the 'Elevation' scene
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import NLDModel from '../../common/model/NLDModel.js';

class ElevationSceneModel extends NLDModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    super( tandem );
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

numberLineDistance.register( 'ElevationSceneModel', ElevationSceneModel );
export default ElevationSceneModel;

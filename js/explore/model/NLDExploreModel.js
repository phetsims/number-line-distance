// Copyright 2020, University of Colorado Boulder

/**
 * Main model for the 'Explore' screen. This model holds all the scene models.
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import NLDScene from './NLDScene.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import DistanceSceneModel from './DistanceSceneModel.js';
import ElevationSceneModel from './ElevationSceneModel.js';
import TemperatureSceneModel from './TemperatureSceneModel.js';

class NLDExploreModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    // @public {Property.<NLDScene>} the currently selected scene for the explore screen
    this.selectedSceneProperty = new EnumerationProperty( NLDScene, NLDScene.DISTANCE );

    // @public {DistanceSceneModel} the instance for the model of the 'Distance' scene
    this.distanceSceneModel = new DistanceSceneModel( tandem );

    // @public {DistanceSceneModel} the instance for the model of the 'Temperature' scene
    this.temperatureSceneModel = new TemperatureSceneModel( tandem );

    // @public {DistanceSceneModel} the instance for the model of the 'Elevation' scene
    this.elevationSceneModel = new ElevationSceneModel( tandem );

  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.selectedSceneProperty.reset();
    this.distanceSceneModel.reset();
    this.temperatureSceneModel.reset();
    this.elevationSceneModel.reset();
  }

}

numberLineDistance.register( 'NLDExploreModel', NLDExploreModel );
export default NLDExploreModel;

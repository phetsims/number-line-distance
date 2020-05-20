// Copyright 2020, University of Colorado Boulder

/**
 * base class for all scene models in the "Explore" screen
 *
 * @author Saurabh Totey
 */

import numberLineDistance from '../../numberLineDistance.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

class SceneModel {

  constructor() {

    // @public {Property<Boolean>}
    this.pointLabelsVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.distanceLabelsVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.distanceDescriptionVisibleProperty = new BooleanProperty( false );

    // @public {Property<Boolean>}
    this.tickMarksVisibleProperty = new BooleanProperty( false );

  }

}

numberLineDistance.register( 'SceneModel', SceneModel );
export default SceneModel;

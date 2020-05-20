// Copyright 2020, University of Colorado Boulder

/**
 * View of the 'Explore' screen for the Number Line Distance simulation
 *
 * @author Saurabh Totey
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import numberLineDistance from '../../numberLineDistance.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NLDConstants from '../../common/NLDConstants.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import DistanceSceneView from './DistanceSceneView.js';
import TemperatureSceneView from './TemperatureSceneView.js';
import ElevationSceneView from './ElevationSceneView.js';
import NLDScene from '../model/NLDScene.js';

class NLDExploreScreenView extends ScreenView {

  /**
   * TODO:
   * @param {NLDExploreModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( {
      tandem: tandem
    } );

    // the layer where the controls go
    const controlsLayer = new Node();
    this.addChild( controlsLayer );

    // adds scene views as children
    const distanceSceneView = new DistanceSceneView( model.distanceSceneModel );
    this.addChild( distanceSceneView );
    const temperatureSceneView = new TemperatureSceneView( model.temperatureSceneModel );
    this.addChild( temperatureSceneView );
    const elevationSceneView = new ElevationSceneView( model.elevationSceneModel );
    this.addChild( elevationSceneView );

    // links each specific scene view's visibility with whether it is selected in the model
    model.selectedSceneProperty.link( selectedScene => {
      distanceSceneView.visible = selectedScene === NLDScene.DISTANCE;
      temperatureSceneView.visible = selectedScene === NLDScene.TEMPERATURE;
      elevationSceneView.visible = selectedScene === NLDScene.ELEVATION;
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - NLDConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLDConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    controlsLayer.addChild( resetAllButton );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

  /**
   * Steps the view.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    //TODO
  }

}

numberLineDistance.register( 'NLDExploreScreenView', NLDExploreScreenView );
export default NLDExploreScreenView;

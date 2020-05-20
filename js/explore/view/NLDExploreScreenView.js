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
import RadioButtonGroup from '../../../../sun/js/buttons/RadioButtonGroup.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';

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

    // map the scene selection icons to their enum values (used in the radio button group) TODO:
    const sceneSelectionButtonsContent = NLDScene.VALUES.map(
      value => ( { value: value, node: new Rectangle( 0, 0, 38, 38 ) } )
    );

    // create scene selector radio buttons
    const sceneSelectorRadioButtonGroup = new RadioButtonGroup(
      model.selectedSceneProperty,
      sceneSelectionButtonsContent,
      {
        buttonContentXMargin: 5,
        buttonContentYMargin: 5,
        touchAreaXDilation: 3,
        touchAreaYDilation: 3,
        right: this.layoutBounds.maxX - 35,
        bottom: this.layoutBounds.maxY - 107,
        baseColor: 'white',
        selectedLineWidth: 2,
        deselectedLineWidth: .5,
        deselectedButtonOpacity: 0.25,
        orientation: 'horizontal',
        spacing: 7
      }
    );
    controlsLayer.addChild( sceneSelectorRadioButtonGroup );

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

    this.addChild( controlsLayer );
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

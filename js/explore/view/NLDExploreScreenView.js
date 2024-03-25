// Copyright 2020-2024, University of Colorado Boulder

/**
 * View of the 'Explore' screen for the Number Line Distance simulation
 *
 * @author Saurabh Totey
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import birdInAir_png from '../../../../number-line-common/images/birdInAir_png.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import { Image } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import house_png from '../../../images/house_png.js';
import NLDConstants from '../../common/NLDConstants.js';
import numberLineDistance from '../../numberLineDistance.js';
import DistanceSceneView from './DistanceSceneView.js';
import ElevationSceneView from './ElevationSceneView.js';
import TemperatureSceneView from './TemperatureSceneView.js';

const ICON_SIZE = new Dimension2( 38, 38 );

class NLDExploreScreenView extends ScreenView {

  /**
   * @param {NLDExploreModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( {
      tandem: tandem
    } );

    // Add scene views as children.
    const distanceSceneView = new DistanceSceneView( model.distanceSceneModel );
    this.addChild( distanceSceneView );
    const temperatureSceneView = new TemperatureSceneView( model.temperatureSceneModel );
    this.addChild( temperatureSceneView );
    const elevationSceneView = new ElevationSceneView( model.elevationSceneModel );
    this.addChild( elevationSceneView );

    // Link each specific scene view's visibility with whether it is selected in the model.
    const sceneViews = [ distanceSceneView, temperatureSceneView, elevationSceneView ];
    model.selectedSceneModelProperty.link( selectedSceneModel => {
      sceneViews.forEach( sceneView => { sceneView.visible = sceneView.model === selectedSceneModel; } );
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        distanceSceneView.reset();
        temperatureSceneView.reset();
        elevationSceneView.reset();
      },
      right: this.layoutBounds.maxX - NLDConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLDConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // Map the scene selection icons to their enum values (used in the radio button group).
    const sceneRadioButtonGroupItems = [
      {
        value: distanceSceneView.model,
        createNode: () => new Image( house_png, { maxWidth: ICON_SIZE.width, maxHeight: ICON_SIZE.height } )
      },
      {
        value: temperatureSceneView.model,
        createNode: () => new ThermometerNode( new NumberProperty( 0.5 ), 0, 1, {
          scale: 0.25
        } )
      },
      {
        value: elevationSceneView.model,
        createNode: () => new Image( birdInAir_png, { maxWidth: ICON_SIZE.width, maxHeight: ICON_SIZE.height } )
      }
    ];

    // Create radio buttons for selecting a scene.
    const sceneRadioButtonGroup = new RectangularRadioButtonGroup(
      model.selectedSceneModelProperty,
      sceneRadioButtonGroupItems,
      {
        orientation: 'horizontal',
        spacing: 7,
        touchAreaXDilation: 3,
        touchAreaYDilation: 3,
        radioButtonOptions: {
          xMargin: 5,
          yMargin: 5,
          baseColor: 'white',
          buttonAppearanceStrategyOptions: {
            selectedLineWidth: 2,
            deselectedLineWidth: 0.5,
            deselectedButtonOpacity: 0.25
          }
        },
        center: resetAllButton.centerTop.plus( NLDConstants.BOTTOM_BOX_BOUNDS.rightCenter ).dividedScalar( 2 )
      }
    );
    this.addChild( sceneRadioButtonGroup );
  }

}

numberLineDistance.register( 'NLDExploreScreenView', NLDExploreScreenView );
export default NLDExploreScreenView;
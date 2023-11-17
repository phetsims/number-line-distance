// Copyright 2020-2023, University of Colorado Boulder

/**
 * the 'Explore' screen in the Number Line: Distance simulation
 *
 * @author Saurabh Totey
 */

import Screen from '../../../joist/js/Screen.js';
import ExploreScreenIcon from '../../../number-line-common/js/explore/view/ExploreScreenIcon.js';
import NLDColors from '../common/NLDColors.js';
import ExplorerImages from '../common/view/ExplorerImages.js';
import numberLineDistance from '../numberLineDistance.js';
import NumberLineDistanceStrings from '../NumberLineDistanceStrings.js';
import NLDExploreModel from './model/NLDExploreModel.js';
import NLDExploreScreenView from './view/NLDExploreScreenView.js';

class NLDExploreScreen extends Screen {

  /**
   * @param { PreferencesModel } preferencesModel
   * @param {Tandem} tandem
   * @public
   */
  constructor( preferencesModel, tandem ) {
    const options = {
      name: NumberLineDistanceStrings.screen.exploreStringProperty,
      backgroundColorProperty: NLDColors.exploreScreenBackgroundColorProperty,
      homeScreenIcon: new ExploreScreenIcon( ExplorerImages.EXPLORER_CHARACTER_SETS, preferencesModel.localizationModel.regionAndCulturePortrayalProperty, 'home' ),
      navigationBarIcon: new ExploreScreenIcon( ExplorerImages.EXPLORER_CHARACTER_SETS, preferencesModel.localizationModel.regionAndCulturePortrayalProperty, 'nav' ),
      tandem: tandem
    };

    super(
      () => new NLDExploreModel( preferencesModel, tandem.createTandem( 'model' ) ),
      model => new NLDExploreScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }

}

numberLineDistance.register( 'NLDExploreScreen', NLDExploreScreen );
export default NLDExploreScreen;

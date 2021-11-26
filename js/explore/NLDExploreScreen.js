// Copyright 2020-2021, University of Colorado Boulder

/**
 * the 'Explore' screen in the Number Line: Distance simulation
 *
 * @author Saurabh Totey
 */

import Screen from '../../../joist/js/Screen.js';
import numberLineDistanceStrings from '../numberLineDistanceStrings.js';
import numberLineDistance from '../numberLineDistance.js';
import NLDExploreModel from './model/NLDExploreModel.js';
import NLDExploreScreenView from './view/NLDExploreScreenView.js';
import exploreHomeIcon from '../../images/explore-home-icon_png.js';
import exploreNavbarIcon from '../../images/explore-navbar-icon_png.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import NLDColors from '../common/NLDColors.js';

const screenExploreString = numberLineDistanceStrings.screen.explore;

class NLDExploreScreen extends Screen {

  /**
   * @param {Tandem} tandem
   * @public
   */
  constructor( tandem ) {
    const options = {
      name: screenExploreString,
      backgroundColorProperty: NLDColors.exploreScreenBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( exploreHomeIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( exploreNavbarIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new NLDExploreModel( tandem.createTandem( 'model' ) ),
      model => new NLDExploreScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }

}

numberLineDistance.register( 'NLDExploreScreen', NLDExploreScreen );
export default NLDExploreScreen;

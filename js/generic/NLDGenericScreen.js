// Copyright 2020-2021, University of Colorado Boulder

/**
 * the 'Generic' screen in the Number Line: Distance simulation
 *
 * @author Saurabh Totey
 */

import Screen from '../../../joist/js/Screen.js';
import numberLineDistanceStrings from '../numberLineDistanceStrings.js';
import numberLineDistance from '../numberLineDistance.js';
import NLDGenericModel from './model/NLDGenericModel.js';
import NLDGenericScreenView from './view/NLDGenericScreenView.js';
import genericHomeIcon from '../../images/generic-home-icon_png.js';
import genericNavbarIcon from '../../images/generic-navbar-icon_png.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import NLDColorProfile from '../common/NLDColorProfile.js';

const screenGenericString = numberLineDistanceStrings.screen.generic;

class NLDGenericScreen extends Screen {

  /**
   * @param {Tandem} tandem
   * @public
   */
  constructor( tandem ) {
    const options = {
      name: screenGenericString,
      backgroundColorProperty: NLDColorProfile.genericScreenBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( genericHomeIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( genericNavbarIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new NLDGenericModel( tandem.createTandem( 'model' ) ),
      model => new NLDGenericScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }

}

numberLineDistance.register( 'NLDGenericScreen', NLDGenericScreen );
export default NLDGenericScreen;

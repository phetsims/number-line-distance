// Copyright 2020, University of Colorado Boulder

/**
 * the 'Generic' screen in the Number Line: Distance simulation
 *
 * @author Saurabh Totey
 */

import Screen from '../../../joist/js/Screen.js';
import numberLineDistanceStrings from '../numberLineDistanceStrings.js';
import Property from '../../../axon/js/Property.js';
import numberLineDistance from '../numberLineDistance.js';
import NLDGenericModel from './model/NLDGenericModel.js';
import NLDGenericScreenView from './view/NLDGenericScreenView.js';

const screenGenericString = numberLineDistanceStrings.screen.generic;

class NLDGenericScreen extends Screen {

  /**
   * @param {Tandem} tandem
   * @public
   */
  constructor( tandem ) {
    const options = {
      name: screenGenericString,
      backgroundColorProperty: new Property( 'rgb( 245, 255, 254 )' ),
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

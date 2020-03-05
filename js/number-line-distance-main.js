// Copyright 2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author John Blanco
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import numberLineDistanceStrings from './number-line-distance-strings.js';
import NumberLineDistanceScreen from './number-line-distance/NumberLineDistanceScreen.js';

const numberLineDistanceTitleString = numberLineDistanceStrings[ 'number-line-distance' ].title;

const simOptions = {
  credits: {
    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    leadDesign: '',
    softwareDevelopment: '',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  }
};

// launch the sim - beware that scenery Image nodes created outside of SimLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
SimLauncher.launch( () => {
  const sim = new Sim( numberLineDistanceTitleString, [
    new NumberLineDistanceScreen( Tandem.ROOT.createTandem( 'numberLineDistanceScreen' ) )
  ], simOptions );
  sim.start();
} );
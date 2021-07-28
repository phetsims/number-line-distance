// Copyright 2021, University of Colorado Boulder

/**
 * The color profile for this sim.
 *
 * @author Saurabh Totey
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import numberLineDistance from '../numberLineDistance.js';

const NLDColors = {
  genericScreenBackgroundColorProperty: new ProfileColorProperty( 'genericBackground', {
    default: 'rgb( 245, 255, 254 )'
  } ),
  exploreScreenBackgroundColorProperty: new ProfileColorProperty( 'exploreBackground', {
    default: 'rgb( 254, 247, 233 )'
  } )
};

numberLineDistance.register( 'NLDColors', NLDColors );
export default NLDColors;

// Copyright 2023, University of Colorado Boulder

/**
 * The ExplorerPortrayal defines what is needed for each portrayal in Number Line Distance.
 *
 * @author Luisa Vargas
 *
 */

import RegionAndCulturePortrayal from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import numberLineDistance from '../../../numberLineDistance.js';

export default class ExplorerPortrayal extends RegionAndCulturePortrayal {
  
  /**
   * @param {RegionAndCulture} regionAndCulture
   * @param standing { HTMLImageElement }
   * @param offset { number }
   * @param screenHomeIcon { HTMLImageElement }
   * @param screenNavIcon { HTMLImageElement }
   */
  constructor( regionAndCulture, standing, offset, screenHomeIcon, screenNavIcon ) {

    super( regionAndCulture, {} );

    this.standing = standing;
    this.screenHomeIcon = screenHomeIcon;
    this.screenNavIcon = screenNavIcon;
    this.offset = offset;
  }
}

numberLineDistance.register( 'ExplorerPortrayal', ExplorerPortrayal );
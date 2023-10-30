// Copyright 2023, University of Colorado Boulder

/**
 * The ExplorerCharacterSet defines what is needed for each character set in Number Line Distance.
 *
 * @author Luisa Vargas
 *
 */

import RegionAndCulturePortrayal from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import numberLineDistance from '../../numberLineDistance.js';

export default class ExplorerCharacterSet extends RegionAndCulturePortrayal {
  /**
   *
   * @param label { LocalizedStringProperty }
   * @param headshotIcon { Image }
   * @param standing { HTMLImageElement }
   * @param screenHomeIcon { HTMLImageElement }
   * @param screenNavIcon { HTMLImageElement }
   */
  constructor( label, headshotIcon,
               standing, screenHomeIcon, screenNavIcon ) {

    // TODO: Add query parameter for selecting character set. See https://github.com/phetsims/number-line-distance/issues/74.
    super( headshotIcon, label, {} );

    this.standing = standing;
    this.screenHomeIcon = screenHomeIcon;
    this.screenNavIcon = screenNavIcon;
  }
}

numberLineDistance.register( 'ExplorerCharacterSet', ExplorerCharacterSet );
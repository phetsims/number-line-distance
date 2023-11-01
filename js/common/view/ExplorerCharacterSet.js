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
   * @param queryParameterValue { string }
   */
  constructor( label, headshotIcon,
               standing, screenHomeIcon, screenNavIcon,
               queryParameterValue ) {

    super( headshotIcon, label, queryParameterValue, {} );

    this.standing = standing;
    this.screenHomeIcon = screenHomeIcon;
    this.screenNavIcon = screenNavIcon;
  }
}

numberLineDistance.register( 'ExplorerCharacterSet', ExplorerCharacterSet );
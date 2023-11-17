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
   * @param standing { HTMLImageElement }
   * @param offset { number }
   * @param screenHomeIcon { HTMLImageElement }
   * @param screenNavIcon { HTMLImageElement }
   * @param queryParameterValue { string }
   */
  constructor( label,
               standing, offset, screenHomeIcon, screenNavIcon,
               queryParameterValue ) {

    super( label, queryParameterValue, {} );

    this.standing = standing;
    this.screenHomeIcon = screenHomeIcon;
    this.screenNavIcon = screenNavIcon;
    this.offset = offset;
  }
}

numberLineDistance.register( 'ExplorerCharacterSet', ExplorerCharacterSet );
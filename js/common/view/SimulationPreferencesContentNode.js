// Copyright 2023, University of Colorado Boulder
/**
 * SimulationPreferencesContentNode renders the simulationspecific preferences controls.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import PreferencesControl from '../../../../joist/js/preferences/PreferencesControl.js';
import PreferencesDialog from '../../../../joist/js/preferences/PreferencesDialog.js';
import PreferencesDialogConstants from '../../../../joist/js/preferences/PreferencesDialogConstants.js';
import PreferencesPanelContentNode from '../../../../joist/js/preferences/PreferencesPanelContentNode.js';
import { RichText, Text } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import numberLineDistance from '../../numberLineDistance.js';
import NumberLineDistanceStrings from '../../NumberLineDistanceStrings.js';
import NLDPreferences from '../model/NLDPreferences.js';

export default class SimulationPreferencesContentNode extends PreferencesPanelContentNode {

  constructor( ) {

    const terminologyControl = new PreferencesControl( {
      controlNode: new VerticalAquaRadioButtonGroup( NLDPreferences.terminologyProperty,
        [ {
          createNode: () => new Text( NumberLineDistanceStrings.directedDistanceStringProperty,
            { font: PreferencesDialog.CONTENT_FONT } ),
          value: 'directedDistance'
        },
          {
            createNode: () => new Text( NumberLineDistanceStrings.displacementStringProperty, {
              font: PreferencesDialog.CONTENT_FONT
            } ),
            value: 'displacement'
          }
        ] ),
      labelNode: new Text( NumberLineDistanceStrings.terminologyStringProperty, PreferencesDialogConstants.CONTROL_LABEL_OPTIONS ),
      labelSpacing: 30,
      descriptionNode: new RichText( NumberLineDistanceStrings.terminologyControlDescriptionStringProperty, PreferencesDialogConstants.CONTROL_DESCRIPTION_OPTIONS ),
      ySpacing: 5
    } );
    super(
      {
        fill: 'white',
        content: [ terminologyControl ]
      }
    );
  }
}

numberLineDistance.register( 'SimulationPreferencesContentNode', SimulationPreferencesContentNode );
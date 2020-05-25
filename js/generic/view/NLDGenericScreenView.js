// Copyright 2020, University of Colorado Boulder

/**
 * View of the 'Generic' screen for the Number Line Distance simulation
 *
 * @author Saurabh Totey
 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import numberLineDistance from '../../numberLineDistance.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import NLDConstants from '../../common/NLDConstants.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import genericmockup from '../../../images/genericmockup_png.js';
import NLDCommonElementsView from '../../common/view/NLDCommonElementsView.js';
import SpatializedNumberLineNode from '../../../../number-line-common/js/common/view/SpatializedNumberLineNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import NumberLineOrientationSelector from '../../../../number-line-common/js/common/view/NumberLineOrientationSelector.js';
import NumberLineRangeSelector from '../../../../number-line-common/js/common/view/NumberLineRangeSelector.js';

class NLDGenericScreenView extends ScreenView {

  /**
   * @param {NLDGenericModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {
    super( {
      tandem: tandem
    } );

    // TODO - mockup - temporary, for design and layout
    const mockup = new Image( genericmockup, {
      center: this.layoutBounds.center,
      minWidth: this.layoutBounds.width,
      maxWidth: this.layoutBounds.width,
      opacity: window.phet.mockupOpacityProperty.value
    } );
    this.addChild( mockup );
    window.phet.mockupOpacityProperty.linkAttribute( mockup, 'opacity' );

    // reset all button
    const resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        model.reset();
        this.reset();
      },
      right: this.layoutBounds.maxX - NLDConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - NLDConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // adds sim controls that show on every screen/scene
    this.addChild( new NLDCommonElementsView( model, new Node(), new Node(), new StringProperty( 'TODO:' ) ) );

    // adds orientation selectors for the number line
    const orientationSelector = new NumberLineOrientationSelector( model.numberLine.orientationProperty, {
      bottom: NLDConstants.NLD_LAYOUT_BOUNDS.maxY - 50,
      right: resetAllButton.left - 50
    } );
    this.addChild( orientationSelector );

    // adds range selectors for the number line
    this.addChild( new NumberLineRangeSelector(
      model.numberLine.displayedRangeProperty,
      NLDConstants.GENERIC_NUMBER_LINE_RANGES,
      this,
      {
        bottom: orientationSelector.top - 15,
        left: orientationSelector.left
      }
    ) );

    // number line
    const numberLineNode = new SpatializedNumberLineNode( model.numberLine );
    this.addChild( numberLineNode );
  }

  /**
   * Resets the view.
   * @public
   */
  reset() {
    //TODO
  }

}

numberLineDistance.register( 'NLDGenericScreenView', NLDGenericScreenView );
export default NLDGenericScreenView;

/* global wpseoReplaceVarsL10n, YoastSEO */
(function() {
	'use strict';

	/**
	 * variable replacement plugin for wordpress.
	 */
	var YoastReplaceVarPlugin = function() {
		this.replaceVars = wpseoReplaceVarsL10n.replace_vars;

		YoastSEO.app.registerPlugin( 'replaceVariablePlugin', { status: 'ready' } );

		this.registerModifications();
	};

	/**
	 * Registers the modifications for the plugin.
	 */
	YoastReplaceVarPlugin.prototype.registerModifications = function() {
		var callback = this.replaceVariablesPlugin.bind( this );

		YoastSEO.app.registerModification( 'content', callback, 'replaceVariablePlugin', 10 );
		YoastSEO.app.registerModification( 'title', callback, 'replaceVariablePlugin', 10 );
		YoastSEO.app.registerModification( 'snippet_title', callback, 'replaceVariablePlugin', 10 );
		YoastSEO.app.registerModification( 'snippet_meta', callback, 'replaceVariablePlugin', 10 );

		//modifications applied on the getData from the scrapers to use templates
		YoastSEO.app.registerModification( 'data_page_title', callback, 'replaceVariablePlugin', 10);
		YoastSEO.app.registerModification( 'data_meta_desc', callback, 'replaceVariablePlugin', 10);
	};

	/**
	 * runs the different replacements on the data-string
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.replaceVariablesPlugin = function( data ) {
		if( typeof data !== 'undefined' ) {
			data = this.titleReplace( data );
			data = this.defaultReplace( data );
			data = this.parentReplace( data );
			data = this.doubleSepReplace( data );
			data = this.excerptReplace( data );
		}
		return data;
	};

	/**
	 * Replaces %%title%% with the title
	 * @param {String} data
	 * @returns {string}
	 */
	YoastReplaceVarPlugin.prototype.titleReplace = function( data ) {
		var title = YoastSEO.app.rawData.title;

		data = data.replace( /%%title%%/g, title );

		return data;
	};

	/**
	 * Replaces %%parent_title%% with the selected value from selectbox (if available on page).
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.parentReplace = function( data ) {
		var parentId = document.getElementById( 'parent_id' );

		if ( parentId !== null && typeof parentId.options !== 'undefined' && parentId.options[ parentId.selectedIndex ].text !== wpseoReplaceVarsL10n.no_parent_text ) {
			data = data.replace( /%%parent_title%%/, parentId.options[ parentId.selectedIndex ].text );
		}
		return data;
	};

	/**
	 * removes double seperators and replaces them with a single seperator
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.doubleSepReplace = function( data ) {
		var escaped_seperator = YoastSEO.app.stringHelper.addEscapeChars( this.replaceVars.sep );
		var pattern = new RegExp( escaped_seperator + ' ' + escaped_seperator, 'g' );
		data = data.replace( pattern, this.replaceVars.sep );
		return data;
	};

	/**
	 * replaces the excerpts strings with strings for the excerpts, if not empty.
	 *
	 * @param {String} data
	 * @returns {String}
	 */
	YoastReplaceVarPlugin.prototype.excerptReplace = function( data ) {
		if ( typeof YoastSEO.app.rawData.excerpt !== 'undefined' ) {
			data = data.replace( /%%excerpt_only%%/g, YoastSEO.app.rawData.excerpt );
			data = data.replace( /%%excerpt%%/g, YoastSEO.app.rawData.excerpt );
		}
		return data;
	};

	/**
	 * replaces default variables with the values stored in the wpseoMetaboxL10n object.
	 *
	 * @param {String} textString
	 * @return {String}
	 */
	YoastReplaceVarPlugin.prototype.defaultReplace = function( textString ) {

		textString = textString.replace( /%%focuskw%%/g, YoastSEO.app.stringHelper.stripAllTags( YoastSEO.app.rawData.keyword ) );

		jQuery.each( this.replaceVars, function( original, replacement ) {
			textString = textString.replace( '%%' + original + '%%', replacement );
		} );

		return textString;

	};

	window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
}());

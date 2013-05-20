(function() {
	if (window.top === window) {
		// getEmValue() taken from Respond.js
		// https://github.com/scottjehl/Respond
		function getEmValue() {
			var doc = window.document,
				docElem = doc.documentElement,
				ret,
				div = doc.createElement('div'),
				body = doc.body,
				fakeUsed = false;

			div.style.cssText = "position:absolute;font-size:1em;width:1em";

			if( !body ){
				body = fakeUsed = doc.createElement( "body" );
				body.style.background = "none";
			}

			body.appendChild( div );

			docElem.insertBefore( body, docElem.firstChild );

			ret = div.offsetWidth;

			if( fakeUsed ){
				docElem.removeChild( body );
			}
			else {
				body.removeChild( div );
			}

			ret = parseFloat(ret);

			return ret;
		}
		
		// getMediaQueries() taken from mediaQuery Bookmarklet
		// https://github.com/sparkbox/mediaQueryBookmarklet
		// bits pulled from Respond.js
		function getMediaQueries() {
			var sheetList = document.styleSheets,
				ruleList,
				rule,
				i, j,
				mediaQueries = [],
				minWidth, maxWidth;

			for (i = sheetList.length - 1; i >= 0; --i) {
				try {
					ruleList = sheetList[ i ].cssRules;
					if (ruleList) {
						for (j = 0; j < ruleList.length; ++j) {
							if (ruleList[j].type == CSSRule.MEDIA_RULE) {
								rule = ruleList[j].media.mediaText;
								if (!(media = (rule.match(/(only\s+)?([a-zA-Z]+)\s?/) && RegExp.$2))) {
									media = 'all';
								}
								media = media.toLowerCase();
								if (media == 'screen' || media == 'all') {
									minWidth = (rule.match(/\(min\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/) && parseFloat(RegExp.$1) + (RegExp.$2|| "" )) || null;
									maxWidth = (rule.match(/\(max\-width:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/) && parseFloat(RegExp.$1) + (RegExp.$2|| "" )) || null;
									mediaQueries.push({
										min: minWidth,
										max: maxWidth
									});
								}
							}
						}
					}
				} catch(e) {}
			}
			return mediaQueries;
		}

		safari.self.tab.dispatchMessage('emSize', getEmValue());
		safari.self.tab.dispatchMessage('updateButtons', getMediaQueries());
		
		function respondToMessage(theMessageEvent) {
			if(theMessageEvent.name === 'update') {
				safari.self.tab.dispatchMessage('emSize', getEmValue());
				safari.self.tab.dispatchMessage('updateButtons', getMediaQueries());
			}
		}
		safari.self.addEventListener('message', respondToMessage, false);
	}
})();
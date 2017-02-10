chrome.browserAction.onClicked.addListener(function(tab) {
	var loadScripts = function () {
		chrome.tabs.insertCSS(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/codemirror.css"});
		chrome.tabs.insertCSS(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/MagiCSS-codemirror.css"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/codemirror.js"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/mode/css.js"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/addons/display/placeholder.js"});

		// chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/addons/hint/show-hint.js"});
		// chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/addons/hint/javascript-hint.js"});
		// chrome.tabs.insertCSS(null, {file: "MagiCSS-latest/PTE-latest/libraries/codemirror/addons/hint/show-hint.css"});

		chrome.tabs.insertCSS(null, {file: "MagiCSS-latest/PTE-latest/libraries/jquery-ui-1.8.21-lightness.custom.full.css"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/jquery-1.7.2.min.js"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/jquery-ui-1.8.20.min.js"});

		chrome.tabs.insertCSS(null, {file: "MagiCSS-latest/PTE-latest/libraries/tooltipster/tooltipster.css"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/tooltipster/jquery.tooltipster.js"});

		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/cssbeautify/cssbeautify.js"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/libraries/yui-cssmin/cssmin.js"});

		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/PTE-latest.min.js"});
		// chrome.tabs.executeScript(null, {file: "MagiCSS-latest/PTE-latest/PTE-latest.js"});

		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/less.min.js"});

		chrome.tabs.insertCSS(null, {file: "MagiCSS-latest/styles.css"});
		// chrome.tabs.executeScript(null, {file: "MagiCSS-latest/MagiCSS-latest.min.js"});
		chrome.tabs.executeScript(null, {file: "MagiCSS-latest/MagiCSS-latest.js"});
	};

	var url = tab.url;

	if (url === 'chrome://extensions/') {
		alert('MagiLess - Live Less Editor does not operate on Chrome extensions and some other native tabs.\n\nYou can run it on web pages.');
		return;
	}

	chrome.permissions.request(
		{
			origins: [url]
		},
		function (granted) {
			if (granted) {
				loadScripts();
			} else {
				if (url.indexOf('file:///') === 0) {
					alert('To run MagiLess - Live Less Editor on:\n        ' + url + '\n\nYou need to grant permissions by going to:\n        chrome://extensions');
				} else {
					alert('We could not run:\n        MagiLess - Live Less Editor\n\nIt requires your permission to run on:\n        ' + url);
				}
			}
		}
	);
});

(function() {
  var delayFunctionUntilTestFunction = function(config) {
    var fnSuccess = config.fnSuccess;
    var fnTest = config.fnTest;
    var fnFirstFailure = config.fnFirstFailure;
    var fnEachFailure = config.fnEachFailure;
    var fnFailure = config.fnFailure;
    var tryLimit = typeof config.tryLimit === "undefined" ? 120 : config.tryLimit;
    config["tryLimit-Running-Cycle-Number"] = typeof config["tryLimit-Running-Cycle-Number"] === "undefined" ? 0 : config["tryLimit-Running-Cycle-Number"] + 1;
    var tryLimitRunningCycleNumber = config["tryLimit-Running-Cycle-Number"];
    var waitFor = config.waitFor || 750;
    if (fnTest()) {
      var retValue = fnSuccess();
      if (retValue === false) {
        return false
      } else {
        return true
      }
    } else {
      if (tryLimitRunningCycleNumber === 0 && typeof fnFirstFailure === "function") {
        fnFirstFailure()
      }
      if (typeof fnEachFailure === "function") {
        fnEachFailure()
      }
      if (tryLimitRunningCycleNumber < (tryLimit - 1)) {
        window.setTimeout((function() {
          delayFunctionUntilTestFunction(config)
        }), waitFor)
      } else {
        if (typeof fnFailure === "function") {
          fnFailure()
        }
      }
      return false
    }
  };
  var addStyleTag = function(config) {
    var id = config.id;
    if (id) {
      var removeExistingStyleTag = config.removeExistingStyleTagWithSameId;
      if (removeExistingStyleTag === true) {
        if (window.jQuery) {
          jQuery("style#" + id).remove()
        }
      }
    }
    var overwriteExistingStyleTag = config.overwriteExistingStyleTagWithSameId;
    var styleNode;
    if (overwriteExistingStyleTag && id) {
      styleNode = document.getElementById(id)
    }
    if (styleNode) {} else {
      styleNode = document.createElement("style");
      styleNode.type = "text/css";
      if (id) {
        styleNode.id = id
      }
    }
    var lessText = config.cssText;
		less.render(lessText).then(function(output) {
			var cssText = output.css;
      // output.css = string of css
      // output.map = string of sourcemap
      // output.imports = array of string filenames of the imports referenced

			if (!!(window.attachEvent && !window.opera)) {
				styleNode.styleSheet.cssText = cssText;
			} else {
				styleNode.innerHTML = "";
				styleNode.appendChild(document.createTextNode(cssText))
			}
			var parentTag = "body";
			if (config.parentTag && config.parentTag.toLowerCase() === "head") {
				parentTag = "head"
			}
			document.getElementsByTagName(parentTag)[0].appendChild(styleNode);
			var disabled = config.disabled;
			if (disabled) {
				styleNode.disabled = true
			} else {
				styleNode.disabled = false
			}
    },
    function(error) {
			console.error(error);
    });
  };
  var StyleTag = function(config) {
    this.cssText = config.cssText;
    this.id = config.id;
    this.parentTag = config.parentTag;
    this.overwriteExistingStyleTagWithSameId = config.overwriteExistingStyleTagWithSameId;
    this.removeExistingStyleTagWithSameId = config.removeExistingStyleTagWithSameId;
    var element;
    var proto = StyleTag.prototype;
    if (typeof proto.firstExecution == "undefined") {
      proto.firstExecution = true;
      proto.applyTag = function() {
        addStyleTag({
          cssText: this.cssText,
          id: this.id,
          parentTag: this.parentTag,
          overwriteExistingStyleTagWithSameId: this.overwriteExistingStyleTagWithSameId,
          removeExistingStyleTagWithSameId: this.removeExistingStyleTagWithSameId,
          disabled: this.disabled
        })
      };
      proto.disable = function() {}
    } else {
      proto.firstExecution = false
    }
  };
  var addScriptTagInRuntime = function(config) {
    var scriptEl = document.createElement("script");
    scriptEl.src = (config.src || config) + (config.freshCopy === false ? "" : ("?" + Math.random()));
    var parentTag = "body";
    if (config.parentTag && config.parentTag.toLowerCase() === "head") {
      parentTag = "head"
    }
    document.getElementsByTagName(parentTag)[0].appendChild(scriptEl)
  };
  (function() {
    delayFunctionUntilTestFunction({
      tryLimit: 100,
      waitFor: 500,
      fnTest: function() {
        if (typeof window.PlainTextEditor === "function" && window.PlainTextEditor.usable) {
          return true
        }
        return false
      },
      fnFirstFailure: function() {},
      fnFailure: function() {},
      fnSuccess: function() {
        var id = "MagiCSS-bookmarklet";
        var newStyleTagId = id + "-html-id";
        var newStyleTag = new StyleTag({
          id: newStyleTagId,
          parentTag: "body",
          overwriteExistingStyleTagWithSameId: true
        });
        var fnApplyTextAsCSS = function(pteOb) {
          newStyleTag.cssText = pteOb.getTextValue();
          newStyleTag.applyTag()
        };
        var fnDisableEnableCSS = function(doWhat) {
          if (doWhat === "disable") {
            newStyleTag.disabled = true
          } else {
            newStyleTag.disabled = false
          }
          newStyleTag.applyTag()
        };
        var options = {
          id: id,
          title: '<span style="font-weight:normal;">Magi</span><span style="font-weight:bold; color:#fff;">LESS</span>',
          tooltip: "Live LESS editor",
          placeholder: (function() {
            return (Math.round((+new Date()) / (15000)) % 2) === 0 ? "Write your CSS code here..." : "Shortcut to launch: Ctrl/Cmd + M"
          }()),
          syntaxHighlighting: {
            enabled: true,
            language: "css",
            useIcon: true
          },
          useClearIcon: false,
          bgColor: "90,90,90,0.7",
          resizable: true,
          footer: function($, pteOb) {
            var $footerItems = $("<div></div>");
            var $disableCSS = $('<div><label style="color:#ffffff; font-size:11px; display:inline;"><input type="checkbox" style="margin:0px 8px 0px 0px; vertical-align:middle;" />Disable CSS</label></div>');
            $footerItems.append($disableCSS);
            var $checkbox = $disableCSS.find("input");
            $checkbox.on("click", function(evt) {
              if ($(this).is(":checked")) {
                fnDisableEnableCSS("disable");
                pteOb.indicateEnabledDisabled("disabled")
              } else {
                fnDisableEnableCSS("enable");
                pteOb.indicateEnabledDisabled("enabled")
              }
            });
            return $footerItems
          },
          events: {
            launched: function(pteOb) {
              var $ = pteOb.$;
              addStyleTag({
                cssText: ("html" + "{" + "display: " + ($("html").css("display") || "block") + "} \n " + "html > body" + "{" + "display: " + ($("body").css("display") || "block") + "}"),
                parentTag: "body"
              });
              addStyleTag({
                cssText: ("#" + id + "," + "html>body #" + id + "{" + "display: block;" + "}"),
                parentTag: "body"
              });
              window.setTimeout(function() {
                fnApplyTextAsCSS(pteOb)
              }, 750);
              addStyleTag({
                cssText: ("#" + id + " .cancelDragHandle" + "{" + "cursor: default;" + "}"),
                parentTag: "body"
              })
            },
            reInitialized: function(pteOb, cfg) {
              var duration = cfg.animDuration,
                targetWidth = cfg.targetWidth,
                targetHeight = cfg.targetHeight;
              $("#MagiCSS-bookmarklet .CodeMirror").animate({
                "width": targetWidth,
                "height": targetHeight
              }, duration, function() {})
            },
            beforehide: function(pteOb) {
              if (pteOb.styleHighlightingSelector) {
                pteOb.styleHighlightingSelector.cssText = "";
                pteOb.styleHighlightingSelector.applyTag()
              }
            },
            afterhide: function(pteOb) {},
            delayedcursormove: function(pteOb) {
              var alertNote = pteOb.getAlertNote();
              var cssClass = processSplitText(pteOb.splitTextByCursor(), alertNote);
              if (!cssClass) {
                alertNote.hide()
              }
              if (!pteOb.styleHighlightingSelector) {
                pteOb.styleHighlightingSelector = new StyleTag({
                  id: "magicss-higlight-by-selector",
                  parentTag: "body",
                  overwriteExistingStyleTagWithSameId: true
                })
              }
              if (cssClass) {
                pteOb.styleHighlightingSelector.cssText = cssClass + "{outline: 1px dashed red !important;}"
              } else {
                pteOb.styleHighlightingSelector.cssText = ""
              }
              pteOb.styleHighlightingSelector.applyTag()
            },
            keyup: function(pteOb) {},
            delayedtextchange: function(pteOb) {
              fnApplyTextAsCSS(pteOb)
            },
            clear: function(pteOb) {
              fnApplyTextAsCSS(pteOb)
            }
          }
        };
        var processSplitText = function(splitText, alertNote) {
          var strBeforeCursor = splitText.strBeforeCursor,
            strAfterCursor = splitText.strAfterCursor;
          if ((strBeforeCursor.substr(-1) === "/" && strAfterCursor.substr(0, 1) === "*") || (strBeforeCursor.substr(-1) === "*" && strAfterCursor.substr(0, 1) === "/")) {
            return ""
          }
          var i;
          var atSelector = true;
          for (i = strBeforeCursor.length; i >= 0; i--) {
            if (strBeforeCursor.charAt(i - 1) === "{" || (strBeforeCursor.charAt(i - 1) === "*" && strBeforeCursor.charAt(i - 2) === "/")) {
              atSelector = false;
              break
            } else {
              if (strBeforeCursor.charAt(i - 1) === "," || strBeforeCursor.charAt(i - 1) === "}" || strBeforeCursor.charAt(i - 1) === "/") {
                atSelector = true;
                break
              }
            }
          }
          if (atSelector) {} else {
            return ""
          }
          var j;
          for (j = 0; j <= strAfterCursor.length; j++) {
            var charJ = strAfterCursor.charAt(j - 1);
            var charJNext = strAfterCursor.charAt(j);
            if (charJ === "," || charJ === "{" || charJ === "}" || (charJ === "*" && charJNext === "/") || (charJ === "/" && charJNext === "*")) {
              break
            }
          }
          var cssClass = strBeforeCursor.substring(i) + strAfterCursor.substring(0, j - 1);
          cssClass = jQuery.trim(cssClass);
          if (cssClass) {
            var count;
            try {
              count = $(cssClass).length
            } catch (e) {
              return ""
            }
            var trunc = function(str, limit) {
              if (str.length > limit) {
                var separator = " ... ";
                str = str.substr(0, limit / 2) + separator + str.substr(separator.length + str.length - limit / 2)
              }
              return str
            };
            if (count) {
              alertNote(trunc(cssClass, 100) + '&nbsp; &nbsp;<span style="font-weight:normal;">(' + count + " match" + ((count === 1) ? "" : "es") + ")</span>", 2500)
            } else {
              alertNote(trunc(cssClass, 100) + '&nbsp; &nbsp;<span style="font-weight:normal;">(No matches)</span>', 2500)
            }
          }
          return cssClass
        };
        var pte = new window.PlainTextEditor(options);
        pte.create()
      }
    })
  }())
}());
// ==UserScript==
// @name         自動同意並跳過廣告
// @namespace    hollen9.bahamut.animation
// @version      0.1
// @description  自動同意並跳過廣告──執行本腳本後，收看動畫瘋影片將無須手動點選「我同意」。並且，廣告在 30 秒後會自動跳過。
// @author       hollen9
// @match        http://ani.gamer.com.tw/animeVideo.php?*
// @updateURL    https://raw.githubusercontent.com/hollen9/AutoSkip-for-BahaAni/master/autoskip4bahaani.js
// @grant        GM_updatingEnabled
// ==/UserScript==

(function() {
    'use strict';
    // https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
    ;(function ($, window) {

        var intervals = {};
        var removeListener = function(selector) {

            if (intervals[selector]) {

                window.clearInterval(intervals[selector]);
                intervals[selector] = null;
            }
        };
        var found = 'waitUntilExists.found';

        $.fn.waitUntilExists = function(handler, shouldRunHandlerOnce, isChild) {

            var selector = this.selector;
            var $this = $(selector);
            var $elements = $this.not(function() { return $(this).data(found); });

            if (handler === 'remove') {

                // Hijack and remove interval immediately if the code requests
                removeListener(selector);
            }
            else {

                // Run the handler on all found elements and mark as found
                $elements.each(handler).data(found, true);

                if (shouldRunHandlerOnce && $this.length) {

                    // Element was found, implying the handler already ran for all 
                    // matched elements
                    removeListener(selector);
                }
                else if (!isChild) {

                    // If this is a recurring search or if the target has not yet been 
                    // found, create an interval to continue searching for the target
                    intervals[selector] = window.setInterval(function () {

                        $this.waitUntilExists(handler, shouldRunHandlerOnce, true);
                    }, 500);
                }
            }

            return $this;
        };

    }(jQuery, window));
    var parseAds_interval;
    function clickPlay() {
        $('.vjs-big-play-button').click();
    }
    function clickAgree(){
        $('.choose a')[0].click();
        console.log("已跳過！");
    }
    function clickSkipAds(){
        console.log("發現跳廣告按鈕！");
        //var text = $('.vast-skip-button').text();
        //console.log(text);
        parseAds_interval = setInterval(invHandler_parseAdsWaitTime,1000);
    }
    function invHandler_parseAdsWaitTime(){
        /*var sec = 30;
        sec = parseInt($('.vast-skip-button').text().substring(3,5));
        if (sec === 0) {
            clearInterval(parseAds_interval);
            $('.vast-skip-button').click();
        }*/
        var text = $('.vast-skip-button').text();
        if (text === "點此跳過廣告") {
            clearInterval(parseAds_interval);
            $('.vast-skip-button').click();
        }
    }
    //Start
    $('.vjs-big-play-button').waitUntilExists(clickPlay);
    $('.choose a').waitUntilExists(clickAgree);
    $('.vast-skip-button').waitUntilExists(clickSkipAds);
})();

//-------------------------------------------------------------------------------------
// Advanced Scroll Progress Tracker
//-------------------------------------------------------------------------------------
// Created          2016-08-10
// Changed          2016-08-16
// Authors          David Whitworth | David@Whitworth.de
// Contributors     Rene Mansveld | R.Mansveld@Spider-IT.de
//-------------------------------------------------------------------------------------
// Version 1.0
//-------------------------------------------------------------------------------------
// 2016-08-10       Created
// 2016-08-11 DW    added automated Stops for each article within the tracked area;
//                  added article headlines to the stops of vertical Trackers
// 2016-08-12 DW    now builds the html structure from within the script;
//                  added configurable options;
//                  added titles (if set to 'true') to the horizontal tracker;
//                  added the finalStop option to create an additional stop at the very
//                  end of the progress tracker(s);
//                  stops are now created for each .trackThis instead of article
// 2016-08-13 DW    added the (configurable) title of the additional final stop;
//                  added the automatic override of horTitlesOffset and
//                  horOnlyActiveTitle for small screens;
//                  added the option to hide trackers on large screens
// 2016-08-15 DW    changed the way the tracker works in terms of the scroll
//                  position (bottom of viewport instead of top);
//                  added the option to revert this behavior to top of viewport;
//                  forced skipHeadlines on small screens if horTitles is true
// 2016-08-16 DW    added options to automatically generate the trackers;
//                  added positioning options for the trackers;
//                  set the default value for verTracker to false;
//                  added the class "smallDevice" to all relevant elements when the
//                  viewport width is <= mobileThreshold;
//                  enabled the user to rename section titles on the trackers by
//                  defining a data-name attribute for the headlines - if no data-name
//                  is defined, the text of the headline will be used as before
// 2016-08-16 RM    created a routine that checks if h3 tags have class
//                  "trackThis" and automatically generates the necessary
//                  structure around them if true
//-------------------------------------------------------------------------------------
// Version 1.1
//-------------------------------------------------------------------------------------
// 2016-08-17 DW    added an option to track all headlines instead of h3 only;
//                  added the option to place the horizontal tracker inside an existing
//                  header tag on the site
//-------------------------------------------------------------------------------------
// Copyright © 2016
//-------------------------------------------------------------------------------------
// Ideas for later:
//-------------------------------------------------------------------------------------
// [ ] Predefine several styles for the trackers (for example "beam", "bar" etc.)
// [ ] Add option to ONLY track area within viewport (i.e. past sections turn inactive again)
//-------------------------------------------------------------------------------------

$.fn.progressTracker = function(options) {
    // DEFINE DEFAULT OPTIONS //
    var settings = $.extend({
        mobileThreshold: 1024,          // sets the viewport width below which a device is considered 'small screen' for the rest of the options
        horTracker: true,               // displays a HORIZONTAL scroll progress tracker
        horInHeader: false,             // creates the HORIZONTAL tracker within an existing header if true
                                        // ---> naturally, you need to have a header in your markup for this to work; if this is active, then horPosition will be ignored
        horPosition: 'top',             // creates the HORIZONTAL tracker at the top of the page if set to 'top', at the bottom if set to 'bottom'
        horMobile: true,                // displays the HORIZONTAL tracker also on small screen devices if true
        horMobileOnly: false,           // hides the HORIZONTAL tracker on large screens if true
                                        // ---> useful if you want to use the VERTICAL tracker for large devices and the HORIZONTAL tracker for small screen; overrides 'horMobile: false'
        verTracker: false,              // displays a VERTICAL scroll progress tracker
        verPosition: 'left',            // creates the VERTICAL tracker on the left side of the page if set to 'left', at the right side if set to 'right'
        verMobile: false,               // displays the VERTICAL tracker also on small screen devices if true
        verMobileOnly: false,           // hides the VERTICAL tracker on large screens if true;
                                        // ---> the counterpart for horMobileOnly; only here for completeness, I don't see a reason to actually use this ;)
        horStops: true,                 // adds stops for each section to the HORIZONTAL tracker if true
        verStops: true,                 // adds stops for each section to the VERTICAL tracker if true
        horNumbering: true,             // adds numbers to the stops of the HORIZONTAL TRACKER if true
                                        // ---> only makes sense if horStops is true
        verNumbering: false,            // adds numbers to the stops of the VERTICAL TRACKER if true
                                        // ---> only makes sense if verStops is true
        horTitles: false,               // adds the headline (h3) of each section to the HORIZONTAL tracker if true
        horTitlesOffset: 'bottom',      // moves the titles of the horizontal tracker off the progress bar if set to 'top' or 'bottom' (they overlay the bar if false)
                                        // ---> only makes sense if horTitles is true; this is automatically set to 'bottom' on small screen devices(!) if set to false
        horOnlyActiveTitle: true,       // displays only the headline of the currently active section in order to deal with space limitations if true
                                        // ---> only makes sense if horTitles is true; this is automatically forced on small screen devices(!)
        verTitles: true,                // adds the headline (h3) of each section to the VERTICAL tracker if true
        trackAllHeadlines: false,       // if set to true, all headlines (h1, h2, h3 etc.) will be converted to tracker titles (if horTitles/verTitles is also true), if set to false only h3-headlines will be tracked
        addFinalStop: false,            // adds a final stop to the very end of the progress tracker(s) if true
                                        // ---> only makes sense if horStops and/or verStops is true; works with horNumbering/verNumbering
        finalStopTitle: '',             // adds a title to the final stop at the end of the progress tracker(s) if not ''
                                        // ---> only makes sense if addFinalStop and horTitles/verTitles are true; works without addFinalStop only on the HORIZONTAL tracker and only if horOnlyActiveTitle is true
        hovering: true,                 // adds a hover effect to the stops if true
                                        // ---> only makes sense if horStops/verStops and/or horTitles/verTitles is true
        linking: true,                  // clicking on a stop animates the page to that section if true
                                        // ---> only makes sense if horStops/verStops and/or horTitles/verTitles is true
        skipHeadlines: false,           // clicking on a stop will scroll to right after the headline if true
                                        // ---> only makes sense if horStops/verStops and/or horTitles/verTitles and linking is true; this setting is automatically applied on small screen devices if horTitles is set to true
        scrollSpeed: 800,               // sets the duration of the scrolling animation in milliseconds; set to 0 to scroll w/o animation
                                        // ---> only makes sense if horStops/verStops and/or horTitles/verTitles and linking is true
        trackViewport: true             // if true the tracker(s) show the scroll position based on the BOTTOM of the viewport, if false the TOP of the viewport serves as the basis
                                        // ---> if the tracked area or even it's last section isn't as high (or higher) as the viewport, then the tracker(s) won't reach 100% if this is set to false
    }, options);
    // DEFINE DEFAULT OPTIONS end //
    
    var linkingScrollTop,
        head,
        trackedArea,
        horizontalTracker,
        getScrollProgressMax,
        getScrollProgressValue,
        trackerSize,
        headlineMargin;
    
    // CALCULATE 'MAX' AND CURRENT 'VALUE' FOR THE PROGRESS-TAG //
    getScrollProgressMax = function() {
        return trackedArea.outerHeight() + headlineMargin;
    };
    if (settings.trackViewport) {
        trackerSize = $(window).scrollTop() + $(window).height();
        getScrollProgressValue = function() {
            return $(window).scrollTop() + $(window).height() - trackedArea.offset().top;
        };
    } else {
        trackerSize = $(window).scrollTop();
        getScrollProgressValue = function() {
            return $(window).scrollTop() - trackedArea.offset().top + head;
        };
    }
    // CALCULATE 'MAX' AND CURRENT 'VALUE' FOR THE PROGRESS-TAG end //
    
    $(document).ready(function () {
        if (settings.trackAllHeadlines) {
            $('h1, h2, h3, h4, h5, h6').addClass('ptSectionTitle');
        } else {
            $('h3').addClass('ptSectionTitle');
        }
        
        // CONVERT DOCUMENT IF HEADLINE HAS CLASS 'trackThis' //
        if ($('.ptSectionTitle.trackThis').length) {
            var i = 0;
            $('.ptSectionTitle.trackThis').each(function() {
                i ++;
                $(this).removeClass('trackThis').wrap('<div id="Section' + i + '" class="trackThis"></div>');
                var nextBreak = false;
                while (!nextBreak) {
                    if ($('#Section' + i).next().length) {
                        if ($('#Section' + i).next()[0] != $('#Section' + i).siblings('.ptSectionTitle.trackThis')[0]) {
                            $('#Section' + i).append($('#Section' + i).next());
                        }
                        else {
                            nextBreak = true;
                        }
                    }
                    else {
                        nextBreak = true;
                    }
                }
            });
        }
        // CONVERT DOCUMENT IF HEADLINE HAS CLASS 'trackThis' end //

        if ($('#TrackScrollProgress').length) {
            trackedArea = $('#TrackScrollProgress');
        } else {
            trackedArea = $(document);
        }
        headlineMargin = (trackedArea.find('.trackThis').children('.ptSectionTitle:first').outerHeight(true) - trackedArea.find('.trackThis').children('.ptSectionTitle:first').outerHeight()) / 2;
        
        // GENERATE TRACKER HTML STRUCTURE //
        if (settings.horTracker) {
            // GENERATE HORIZONTAL TRACKER IN HEADER //
            if (settings.horInHeader && $('header').length) {
                if (settings.horInHeader == 'bottom') {
                    $('header').append('<div class="horizontalScrollProgress"></div>');
                } else {
                    $('header').prepend('<div class="horizontalScrollProgress"></div>');
                }
                if (settings.horMobileOnly) {
                    $('.horizontalScrollProgress').addClass('mobileOnly');
                }
            } else {
                $('body').append('<div class="horizontalScrollProgress fixed"></div>');
            }
            // GENERATE HORIZONTAL TRACKER IN HEADER end //
            
            if ('max' in document.createElement('progress')) {
                // generate html5 progress-tag if it is supported by the browser
                $('.horizontalScrollProgress').append('<progress class="scrollProgress"></progress>');
                horizontalTracker = $('.scrollProgress');
            } else {
                // generate fallback solution for older browsers where the progress-tag is NOT supported
                $('.horizontalScrollProgress').append('<div class="scrollProgressContainer centerAll"><span class="scrollProgressBar"></span></div>');
                horizontalTracker = $('.scrollProgressContainer');
            }
            if (settings.horPosition == 'bottom' && !settings.horInHeader) {
                $('.horizontalScrollProgress').addClass('bottom');
                $('body').css('padding-bottom', $('.horizontalScrollProgress').height());
            } else {
                if (!settings.horInHeader) {
                    $('body').css('padding-top', $('.horizontalScrollProgress').height());
                }
            }

            head = $('.horizontalScrollProgress').height();
        } else {
            head = 0;
        }
        
        if (settings.horTracker) {
            $('.scrollProgress').addClass('centerAll').attr('value', '0');
            if (settings.horTitles) {
                $('<div class="scrollStopTitles centerAll"></div>').insertAfter(horizontalTracker);
            } else {
                horizontalTracker.addClass('untitled');
            }
            if (settings.horStops) {
                $('<div class="scrollStopContainer centerAll"></div>').insertAfter(horizontalTracker);
                $('.scrollStopTitles').append('<div class="stopTitle onlyActive" style="font-weight: bold;"></div>');
            }
            if (settings.addFinalStop) {
                $('.scrollStopContainer').append('<div class="finalStopCircle"></div>');
                if (!settings.horOnlyActiveTitle) {
                    $('.scrollStopTitles').append('<div class="finalStopTitle">' + settings.finalStopTitle + '</div>');
                }
            }
            if (!settings.horMobile) {
                horizontalTracker.addClass('desktopOnly');
                $('.scrollStopContainer').addClass('desktopOnly');
                $('.scrollStopTitles').addClass('desktopOnly');
            }
            if (settings.horMobileOnly) {
                horizontalTracker.removeClass('desktopOnly').addClass('mobileOnly');
                $('.scrollStopContainer').removeClass('desktopOnly').addClass('mobileOnly');
                $('.scrollStopTitles').removeClass('desktopOnly').addClass('mobileOnly');
            }
       }
        if (settings.verTracker) {
            $('body').append('<div class="verticalScrollProgress"><div class="verticalScrollProgressContainer"><div class="verticalScrollProgressBar"></div></div></div>');
            if (settings.verPosition == 'right') {
                $('.verticalScrollProgress').addClass('right');
            }

            var verticalTracker = $('.verticalScrollProgress');
            if (!settings.verMobile) {
                verticalTracker.addClass('desktopOnly');
            }
            if (settings.verMobileOnly) {
                verticalTracker.removeClass('desktopOnly').addClass('mobileOnly');
            }
            if (settings.verStops) {
                verticalTracker.append('<div class="vertScrollStopContainer"></div>');
            }
            if (settings.verTitles) {
                verticalTracker.append('<div class="vertScrollStopTitles"></div>');
            } else {
                verticalTracker.addClass('untitled');
            }
            if (settings.addFinalStop) {
                $('.vertScrollStopContainer').append('<div class="finalStopCircle"></div>');
                $('.vertScrollStopTitles').append('<div class="finalStopTitle">' + settings.finalStopTitle + '</div>');
            }
        }
        // GENERATE TRACKER HTML STRUCTURE end //
        
        // HORIZONTAL PROGRESS TRACKER //
        if ('max' in document.createElement('progress')) {
            // <progress> tag is supported
            var scrollProgress = $('.scrollProgress');
                scrollProgress.attr('max', getScrollProgressMax());
            $(document).scroll(function () {
                if (settings.trackViewport) {
                    trackerSize = $(window).scrollTop() + $(window).height();
                } else {
                    trackerSize = $(window).scrollTop();
                }
                if (trackedArea >= trackedArea.offset().top - head) {
                    $(window).resize();
                    scrollProgress.attr('value', getScrollProgressValue());
                } else {
                    scrollProgress.attr('value', '0');
                }
            });
            $(window).resize(function () {
                scrollProgress.attr('max', getScrollProgressMax()).attr('value', getScrollProgressValue());
            });
        } else {
            // <progress> tag is not supported (older browsers)
            var scrollProgress = $('#ScrollProgressBar'),
                scrollProgressMax = getScrollProgressMax(),
                scrollProgressValue, scrollProgressWidth,
                getScrollProgressWidth = function() {
                scrollProgressValue = getScrollProgressValue();
                scrollProgressWidth = (scrollProgressValue/scrollProgressMax) * 100;
                if (scrollProgressWidth > 100) {
                    scrollProgressWidth = 100;
                }
                scrollProgressWidth = scrollProgressWidth + '%';
                return scrollProgressWidth;
            },
            setScrollProgressWidth = function() {
                scrollProgress.css('width', getScrollProgressWidth());
            };
            $(document).scroll(function() {
                if (settings.trackViewport) {
                    trackerSize = $(window).scrollTop() + $(window).height();
                } else {
                    trackerSize = $(window).scrollTop();
                }
                if (trackerSize >= trackedArea.offset().top - head) {
                    $(window).resize();
                    scrollProgress.css('width', getScrollProgressWidth());
                } else {
                    scrollProgress.css('width', '0%');
                }
            });
            $(window).resize(function () {
                setScrollProgressWidth();
            });
        }
        // HORIZONTAL PROGRESS TRACKER end //
        
        // VERTICAL SCROLL PROGRESS TRACKER //
        var verticalScrollProgress = $('.verticalScrollProgressBar'),
            scrollProgressMax = getScrollProgressMax(),
            scrollProgressValue, scrollProgressHeight,
            getScrollProgressHeight = function() {
                scrollProgressValue = getScrollProgressValue();
                scrollProgressHeight = (scrollProgressValue/scrollProgressMax) * 100;
                if (scrollProgressHeight > 100) {
                    scrollProgressHeight = 100;
                }
                scrollProgressHeight = scrollProgressHeight + '%';
                return scrollProgressHeight;
            },
            setScrollProgressHeight = function() {
                verticalScrollProgress.css('height', getScrollProgressHeight());
            };
        $(document).scroll(function() {
            if (settings.trackViewport) {
                trackerSize = $(window).scrollTop() + $(window).height();
            } else {
                trackerSize = $(window).scrollTop();
            }
            if (trackerSize >= trackedArea.offset().top - head) {
                $(window).resize();
                setScrollProgressHeight();
            } else {
                verticalScrollProgress.css('height', '0%');
            }
            if ($(window).width() <= settings.mobileThreshold) {
                if (settings.horTitles) {
                    $('.scrollStopTitles').children('.onlyActive').addClass('ellipsis');
                }
                if (!settings.horOnlyActiveTitle) {
                    $('.scrollStopTitles').children('.stopTitle, .finalStopTitle').css('display', 'none');
                    $('.scrollStopTitles').children('.onlyActive').css('display', 'block');
                }
            } else {
                $('.scrollStopTitles').children('.stopTitle, .onlyActive').removeClass('ellipsis');
                if (settings.horOnlyActiveTitle) {
                    $('.scrollStopTitles').children('.stopTitle, .finalStopTitle').css('display', 'none');
                    $('.scrollStopTitles').children('.onlyActive').css('display', 'block');
                } else {
                    $('.scrollStopTitles').children('.stopTitle, .finalStopTitle').css('display', 'block');
                    $('.scrollStopTitles').children('.onlyActive').css('display', 'none');
                }
            }
        });
        $(window).resize(function () {
            scrollProgressMax = getScrollProgressMax();
            setScrollProgressHeight();
            moveScrollStops();
            
            // FAKE RESPONSIVE WEBDESIGN ("SMALL SCREENS") //
            if ($(window).width() <= settings.mobileThreshold) {
                $('.horizontalScrollProgress, .scrollProgress, .scrollProgressContainer, .scrollStopContainer, .scrollStopTitles, .verticalScrollProgress').addClass('smallDevice');
                if (!settings.horOnlyActiveTitle) {
                    $('.scrollStopTitles').children('.stopTitle, .finalStopTitle').css('display', 'none');
                    $('.scrollStopTitles').children('.onlyActive').css('display', 'block');
                    if (!settings.horTitlesOffset) {
                        $('.scrollStopTitles').children('.onlyActive').css('margin-top', '38px').css('margin-left', '8px');
                    }
                }
            } else {
                $('.horizontalScrollProgress, .scrollProgress, .scrollProgressContainer, .scrollStopContainer, .scrollStopTitles, .verticalScrollProgress').removeClass('smallDevice');
                if (settings.horOnlyActiveTitle) {
                    $('.scrollStopTitles').children('.stopTitle, .finalStopTitle').css('display', 'none');
                    $('.scrollStopTitles').children('.onlyActive').css('display', 'block');
                } else {
                    $('.scrollStopTitles').children('.stopTitle, .finalStopTitle').css('display', 'block');
                    $('.scrollStopTitles').children('.onlyActive').css('display', 'none');
                }
            }
            // FAKE RESPONSIVE WEBDESIGN ("SMALL SCREENS") end //
        });
        // VERTICAL SCROLL PROGRESS TRACKER end //

        setScrollStops();
        // CREATE SCROLLSTOPS AND TITLES //
        function setScrollStops() {
            trackedArea.find('.trackThis').each(function(index) {
                var sectionHeadline = $(this).children('.ptSectionTitle'),
                    ptSectionTitle,
                    sectionId = index + 1,
                    scrollHorStops = $('.scrollStopContainer'),
                    scrollVerStops = $('.vertScrollStopContainer'),
                    scrollStopTitles = $('.scrollStopTitles'),
                    scrollVerStopTitles = $('.vertScrollStopTitles');
                    if (sectionHeadline.attr('data-name')) {
                        ptSectionTitle = sectionHeadline.attr('data-name');
                    } else {
                        ptSectionTitle = sectionHeadline.text();
                    }
                
                $(this).attr('id', 'Section' + sectionId);
                $(this).children('.ptSectionTitle').attr({ id: 'SectionHeadline' + sectionId});
                
                scrollHorStops.append('<div class="stopCircle stop' + sectionId + '" data-index="' + sectionId + '"></div>');
                scrollVerStops.append('<div class="stopCircle stop' + sectionId + '" data-index="' + sectionId + '"></div>');
                scrollStopTitles.append('<div class="stopTitle stop' + sectionId + '" data-index="' + sectionId + '">' + ptSectionTitle + '</div>');
                scrollVerStopTitles.append('<div class="stopTitle stop' + sectionId + '" data-index="' + sectionId + '">' + ptSectionTitle + '</div>');
                
                
                if (settings.horNumbering) {
                    scrollHorStops.children('.stopCircle.stop' + sectionId).append(sectionId);
                    if (settings.addFinalStop) {
                        var numStops = scrollHorStops.children('.stopCircle').length + 1;
                        scrollHorStops.children('.finalStopCircle').text(numStops);
                    }
                }
                if (settings.verNumbering) {
                    scrollVerStops.children('.stopCircle.stop' + sectionId).append(sectionId);
                    if (settings.addFinalStop) {
                        var numStops = scrollVerStops.children('.stopCircle').length + 1;
                        scrollVerStops.children('.finalStopCircle').text(numStops);
                    }
                }
            });
            $(window).resize();
        }
        // CREATE SCROLLSTOPS AND TITLES end //
        
        // LINKING MODE FUNCTIONALITY //
        if (settings.linking) {
            $('.stopCircle, .stopTitle').click(function () {
                if (settings.skipHeadlines) {
                    linkingScrollTop = $('#SectionHeadline' + $(this).attr('data-index')).offset().top + $('#SectionHeadline' + $(this).attr('data-index')).height();
                } else if ($(window).width() <= settings.mobileThreshold && settings.horTitles) {
                    linkingScrollTop = $('#SectionHeadline' + $(this).attr('data-index')).offset().top + $('#SectionHeadline' + $(this).attr('data-index')).height();
                } else {
                    linkingScrollTop = $('#SectionHeadline' + $(this).attr('data-index')).offset().top + 1;
                }

                $('html, body').animate( {
                    scrollTop: linkingScrollTop - head
                }, settings.scrollSpeed);
            });
            $('.finalStopCircle, .finalStopTitle').click(function () {
                $('html, body').animate( {
                    scrollTop: trackedArea.offset().top + trackedArea.outerHeight() - ($(window).height() / 2)
                }, settings.scrollSpeed);
            });
        }
        // LINKING MODE FUNCTIONALITY end //
        
        // HOVER-EFFECT //
        if (settings.hovering) {
            var itemIndex;
            $('.scrollStopContainer .stopCircle, .scrollStopTitles .stopTitle').hover(function() {
                itemIndex = $(this).attr('data-index');
                $('.stopCircle, .stopTitle').removeClass('hover');
                $('.scrollStopContainer .stop' + itemIndex + ', .scrollStopTitles .stop' + itemIndex).addClass('hover');
            }, function() {
                $('.stopCircle, .stopTitle').removeClass('hover');
            });
            $('.vertScrollStopContainer .stopCircle, .vertScrollStopTitles .stopTitle').hover(function() {
                itemIndex = $(this).attr('data-index');
                $('.stopCircle, .stopTitle').removeClass('hover');
                $('.vertScrollStopContainer .stop' + itemIndex + ', .vertScrollStopTitles .stop' + itemIndex).addClass('hover');
            }, function() {
                $('.stopCircle, .stopTitle').removeClass('hover');
            });
            $('.scrollStopContainer .finalStopCircle, .scrollStopTitles .finalStopTitle').hover(function() {
                $('.scrollStopContainer .finalStopCircle, .scrollStopTitles .finalStopTitle').addClass('hover');
            }, function() {
                $('.finalStopCircle, .finalStopTitle').removeClass('hover');
            });
            $('.vertScrollStopContainer .finalStopCircle, .vertScrollStopTitles .finalStopTitle').hover(function() {
                $('.vertScrollStopContainer .finalStopCircle, .vertScrollStopTitles .finalStopTitle').addClass('hover');
            }, function() {
                $('.finalStopCircle, .finalStopTitle').removeClass('hover');
            });
        }
        // HOVER-EFFECT end //
        $(document).scroll();
    });
    // POSITION SCROLL STOPS AND TITLES //
    function moveScrollStops() {
        trackedArea.find('.trackThis').each(function(index) {
            var section = $(this),
                sectionHeadline = section.children('.ptSectionTitle'),
                ptSectionTitle = sectionHeadline.text(),
                sectionTopSubtract = trackedArea.offset().top,
                sectionTop = section.offset().top - sectionTopSubtract,
                sectionId = index + 1,
                sectionStop = (sectionTop/getScrollProgressMax()) * 100,
                scrollHorStops = $('.scrollStopContainer'),
                scrollVerStops = $('.vertScrollStopContainer'),
                scrollStopTitles = $('.scrollStopTitles'),
                scrollVerStopTitles = $('.vertScrollStopTitles');
            
            if (sectionStop > 100) {
                sectionStop = 100;
            }
            
            scrollHorStops.children('.stop' + sectionId).css('left', sectionStop + '%');
            scrollVerStops.children('.stop' + sectionId).css('top', sectionStop + '%');
            scrollStopTitles.children('.stop' + sectionId).css('left', sectionStop + '%');
            scrollStopTitles.children('.stopTitle.onlyActive').css('left', '-8px').addClass('reached');
            scrollVerStopTitles.children('.stop' + sectionId).css('top', sectionStop + '%');
            
            if ($(window).scrollTop() <= trackedArea.find('.trackThis:first').offset().top - sectionTopSubtract + trackedArea.find('.trackThis:first').children('.ptSectionTitle').outerHeight() + headlineMargin/2) {
                scrollStopTitles.children('.stopTitle.onlyActive').text('');
            }
            if ($(window).scrollTop() >= sectionTop + sectionHeadline.outerHeight() + headlineMargin) {
                scrollStopTitles.children('.stopTitle.onlyActive').text(ptSectionTitle);
                var viewportBottom = $(window).scrollTop() + $(window).height();
                if (settings.finalStopTitle != '') {
                    if ($(window).width() <= settings.mobileThreshold) {
                        if (($(window).scrollTop() + $(window).height()) >= (trackedArea.offset().top + trackedArea.height() + (headlineMargin * 2)) || ($(window).scrollTop() + $(window).height()) >= $(document).outerHeight()) {
                            scrollStopTitles.children('.stopTitle.onlyActive').text(settings.finalStopTitle);
                        }
                    } else {
                        if (($(window).scrollTop() + $(window).height()) >= $(document).outerHeight()) {
                            scrollStopTitles.children('.stopTitle.onlyActive').text(settings.finalStopTitle);
                        }
                    }
                }
            }
            
            if (settings.horOnlyActiveTitle) {
                scrollStopTitles.children('.stop' + sectionId).css('display', 'none');
                scrollStopTitles.children('.stopTitle.onlyActive').css('display', 'block');
            } else {
                scrollStopTitles.children('.stop' + sectionId).css('display', 'block');
                scrollStopTitles.children('.stopTitle.onlyActive').css('display', 'none');
            }

            if (settings.horTitlesOffset == 'top') {
                scrollStopTitles.children('.stopTitle').css('margin-left', '8px');
            } else if (settings.horTitlesOffset == 'bottom') {
                scrollStopTitles.children('.stopTitle').css('margin-top', '38px').css('margin-left', '8px');
                scrollStopTitles.children('.finalStopTitle').css('margin-top', '38px');
            } else {
                scrollStopTitles.children('.stopTitle').css('margin-top', '18px').css('margin-left', '25px');
                scrollStopTitles.children('.finalStopTitle').css('margin-top', '18px').css('margin-right', '16px');
            }
            
            if (getScrollProgressValue() >= sectionTop) {
                $('.stop' + sectionId).addClass('reached');
            } else {
                $('.stop' + sectionId).removeClass('reached');
            }
            if (getScrollProgressValue() >= getScrollProgressMax()) {
                $('.finalStopCircle, .finalStopTitle').addClass('reached');
            } else {
                $('.finalStopCircle, .finalStopTitle').removeClass('reached');
            }
        });
    }
    // POSITION SCROLL STOPS AND TITLES end //
};

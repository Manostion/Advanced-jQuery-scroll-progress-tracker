//----------------------------------------------------------------------------------------------------------------------
// Advanced Scroll Progress Tracker
//----------------------------------------------------------------------------------------------------------------------
// Created          2016-08-10
// Changed          2018-04-19
// Authors          David Whitworth | David@Whitworth.de
// Contributors     Rene Mansveld | R.Mansveld@Spider-IT.de
//----------------------------------------------------------------------------------------------------------------------
// Version 1.0
//----------------------------------------------------------------------------------------------------------------------
// 2016-08-10       Created
// 2016-08-11 DW    added automated Stops for each article within the tracked area;
//                  added article headlines to the stops of vertical Trackers
// 2016-08-12 DW    now builds the html structure from within the script;
//                  added configurable options;
//                  added titles (if set to true) to the horizontal tracker;
//                  added the "finalStop" option to create an additional stop at the very end of the progress trackers;
//                  stops are now created for each ".trackThis" instead of article
// 2016-08-13 DW    added the (configurable) title of the additional final stop;
//                  added the automatic override of "horTitlesOffset" and "horOnlyActiveTitle" for small screens;
//                  added the option to hide trackers on large screens
// 2016-08-15 DW    changed the way the tracker works in terms of the scroll position (bottom of viewport instead of
//                  top);
//                  added the option to revert this behavior to top of viewport;
//                  forced "skipHeadlines" on small screens if "horTitles" is true
// 2016-08-16 DW    added options to automatically generate the trackers;
//                  added positioning options for the trackers;
//                  set the default value for "verTracker" to false;
//                  added the class "smallDevice" to all relevant elements when the viewport width is <=
//                  "mobileThreshold";
//                  enabled the user to rename section titles on the trackers by defining a data-name attribute for the
//                  headlines - if no data-name is defined, the text of the headline will be used as before
// 2016-08-16 RM    created a routine that checks if h3 tags have class "trackThis" and automatically generates the
//                  necessary structure around them if true
//----------------------------------------------------------------------------------------------------------------------
// Version 1.1
//----------------------------------------------------------------------------------------------------------------------
// 2016-08-17 DW    added an option to track all headlines instead of h3 only and adjusted RM's routine accordingly;
//                  added the option to place the horizontal tracker inside an existing header element on the site;
//                  cleaned up the script (changed the order of the options and categorized them)
// 2016-08-19 DW    adds the according class if a "horStyle"/"verStyle" is set;
//                  fixed the values for "linking", "horOnlyActiveTitles" / "skipHeadlines";
//                  fixed the title for "horOnlyActiveTitle" not showing up when "horStops" is set to false - it is now
//                  bound to "horTitles" as it should be;
//                  increased the default value for "mobileThreshold", so that the vertical tracker always fits next to
//                  the content
// 2016-08-20 DW    moves the vertical tracker 50px closer to the content as soon as there is enough space;
//                  edited comments to further clean up the script;
//                  revised all the calculations to eliminate redundancy and bugs
// 2016-08-22 DW    changed the names of all classes and ids to prevent possible conflicts with other plugins
//----------------------------------------------------------------------------------------------------------------------
// Version 1.2
//----------------------------------------------------------------------------------------------------------------------
// 2016-08-23 DW    adjusted the "trackAllHeadlines" option to only track the headlines within the tracked area (i.e.
//                  either #TrackScrollProgress or body);
//                  changed the way tracker titles are generated to "only first";
//                  adjusted the positioning of the vertical tracker in relation to the "mobileThreshold" and the
//                  viewport width;
//                  added the "trackViewportOnly" option and it's programming;
//                  added the options "horColor"/"verColor";
// 2016-09-02 DW    removed the horizontal tracker's container where it's not needed;
//                  moved the different color schemes to extra files;
//                  changed the way "horTitlesOffset" works - margin-top of the titles is now dynamically calculated to
//                  maximize customizability;
//                  fixed the calculation for the head-variable so that it takes into account possible changes the user
//                  makes to the height/position of the horizontal tracker;
//                  created a fail-safe for the width of ".spt-centerAll" so that the vertical tracker doesn't
//                  accidentally intersect the content
// 2016-09-08 DW    fixed the calculations of the head variable and redid the whole linking functionality
//----------------------------------------------------------------------------------------------------------------------
// Version 1.3
//----------------------------------------------------------------------------------------------------------------------
// 2018-02-14 DW    cleaned up the script's comment section as well as some of it's functions;
//                  added several new options (without actual functionality): "horEqualSpacing", "verEqualSpacing",
//                  "horSplitSections"
// 2018-04-17 DW    changed the default values for "horTitles" and "skipHeadlines" (now true)
// 2018-04-18 DW    implemented the basic layout for "horSplitSections"
// 2018-04-19 DW    added the "horSide" option to support alternate placement of the "horSplitSections" tracker;
//                  cleaned up the whole section of the code that is used for generating the layout of the horizontal
//                  tracker(s), so that all cross-dependencies between regular horizontal trackers and/or Split Section
//                  horizontal trackers work as intended while at the same time readability gets maintained;
//                  added the actual functionality for each progress bar for "horSplitSections";
//                  added new option "horSide" to give users the ability to position the "horSplitSections" tracker;
// 2018-04-20 DW    turned the comments for each of the script's settings into actual JSDoc documentation comments;
//                  added the functionality of "horSplitSections" + "trackViewportOnly"
//                  ToDo: implement section titles in the "horSplitSections" tracker -> account for title settings!
//----------------------------------------------------------------------------------------------------------------------
// Copyright (c) 2016 - 2018
//----------------------------------------------------------------------------------------------------------------------

$.fn.progressTracker = function(options) {
    // Default Options -->
    let settings = $.extend({
        // HORIZONTAL tracker -->
        /***
         * Displays a **horizontal** scroll progress tracker
         *  
         * default: ***true***
         */
        horTracker: true,
        /**
         * Creates the **horizontal** tracker within an existing <header> if true
         * --> naturally, you need to have a header in your markup for this to work
         * --> if this is active, then horPosition will be ignored
         *  
         * default: ***false***
         */
        horInHeader: false,
        /**
         * Creates the **horizontal** tracker at the top of the page if set to 'top' and at the bottom if set to 'bottom'
         *  
         * default: ***'top'***
         */
        horPosition: 'top',
        /**
         * Makes the **horizontal** tracker span the full width of the viewport if set to false
         *  
         * default: ***true***
         */
        horCenter: true,
        /**
         * Sets the style of the **horizontal** tracker
         * --> possible options are:
         *       • 'beam'
         *       • 'fill'
         *  
         * default: ***'fill'***
         */
        horStyle: 'fill',
        /**
         * Sets the color of the default gradient for the **horizontal** tracker
         * --> possible options are:
         *       • 'red'
         *       • 'blue'
         *       • 'green'
         *       • 'orange'
         *  
         * default: ***'red'***
         */
        horColor: 'red',
        /**
         * Displays the **horizontal** tracker also on small screen devices if true
         *  
         * default: ***true***
         */
        horMobile: true,
        /**
         * Hides the **horizontal** tracker on large screens if true
         * --> this can be useful if you want to use the **vertical** tracker for large screen devices and the **horizontal** tracker for mobile devices
         * --> overrides 'horMobile: false'
         *  
         * default: ***false***
         */
        horMobileOnly: false,
        /**
         * Adds bullets for each section to the **horizontal** tracker if true
         *  
         * default: ***true***
         */
        horStops: true,
        /**
         * Adds numbers to the bullets of the **horizontal** tracker if true
         * --> this is ignored unless horStops is also true
         *  
         * default: ***true***
         */
        horNumbering: true,
        /**
         * Makes the gaps between all of the bullets equal on the **horizontal** tracker if true
         * --> this is ignored unless horStops is also true
         *  
         * default: ***false***
         */
        horEqualSpacing: false,
        /**
         * Creates individual trackers for each tracked section (instead of one tracker for the whole tracked content)
         * --> this is recommended to be used with 'horTitles: true' and 'horOnlyActiveTitle: false'
         * --> this is always set to 'false' on small devices
         *  
         * default: ***false***
         */
        horSplitSections: true,
        /**
         * Positions the **horizontal** tracker on either the left or the right side of the content
         * --> this **ONLY** affects horizontal trackers with the 'horSplitSections' layout and will be ignored by the regular layout. It is thus superfluous if 'horSplitSections' isn't used
         *  
         * default: ***'left'***
         */
        horSide: 'left',
        /**
         * Adds the first headline (h3 by default) of each section to the **horizontal** tracker if true
         *  
         * default: ***true***
         */
        horTitles: true,
        /**
         * Moves the titles of the **horizontal** tracker off the progress bar if set to 'top' or 'bottom' (they overlay the bar if false)
         * --> this is ignored unless horTitles is also true
         * --> on mobile devices only 'top' or 'bottom' are possible for this. false will automatically be set to 'bottom' on small screen devices
         * --> possible options are:
         *       • 'top'
         *       • 'bottom'
         *       • false
         *  
         * default: ***'bottom'***
         */
        horTitlesOffset: 'bottom',
        /**
         * If this is set to true the **horizontal** tracker will only display the headline of the currently active section (i.e. the section the user is currently reading) in order to deal with space limitations
         * --> this is ignored unless horTitles is also true
         * --> this setting is automatically forced on small screen devices (mobileThreshold) if horTitles is true
         *  
         * default: ***true***
         */
        horOnlyActiveTitle: true,
        // <-- HORIZONTAL tracker

        // VERTICAL tracker -->
        /***
         * Displays a **vertical** scroll progress tracker
         *  
         * default: ***false***
         */
        verTracker: false,
        /**
         * Creates the **vertical** tracker left of your content if set to 'left' and right of it if set to 'right'
         *  
         * default: ***'left'***
         */
        verPosition: 'left',
        /**
         * Sets the style of the **vertical** tracker
         * --> possible options are:
         *       • 'beam'
         *       • 'fill'
         *  
         * default: ***'beam'***
         */
        verStyle: 'beam',
        /**
         * Sets the color of the default gradient for the **vertical** tracker
         * --> possible options are:
         *       • 'red'
         *       • 'blue'
         *       • 'green'
         *       • 'orange'
         *  
         * default: ***'red'***
         */
        verColor: 'red',
        /**
         * Displays the **vertical** tracker also on small screen devices if true
         *  
         * default: ***false***
         */
        verMobile: false,
        /**
         * Hides the **vertical** tracker on large screens if true
         * --> this is the counterpart for horMobileOnly and only here for completeness sake. I don't see a reason to actually use this ;)
         *  
         * default: ***false***
         */
        verMobileOnly: false,
        /**
         * Adds bullets for each section to the **vertical** tracker if true
         *  
         * default: ***true***
         */
        verStops: true,
        /**
         * Adds numbers to the bullets of the **vertical** tracker if true
         * --> this is ignored unless verStops is also true
         *  
         * default: ***false***
         */
        verNumbering: false,
        /**
         * Makes the gaps between all of the bullets equal on the **vertical** tracker if true
         * --> this is ignored unless verStops is also true
         *  
         * default: ***false***
         */
        verEqualSpacing: false,
        /**
         * Adds the first headline (h3 by default) of each section to the **horizontal** tracker if true
         *  
         * default: ***true***
         */
        verTitles: true,
        // <-- VERTICAL tracker

        // General -->
        /**
         * This setting controls at which viewport width a device/screen is considered a "small screen" by this plugin's options
         *  
         * default: ***1300***
         */
        mobileThreshold: 1300,
        /**
         * If this is true any type of headline will be viable to serve as the section's title, instead of just h3-headlines. Of course this doesn't change the fact that only the first headline within a section will be used
         *  
         * default: ***false***
         */
        trackAllHeadlines: false,
        /**
         * This adds a final bullet to the very end of any active progress trackers if true
         * --> for this setting to take effect, at least one of horStops or verStops must be true as well
         * --> this setting is compatible with horNumbering/verNumbering, i.e. the final bullet will also be numbered correctly
         *  
         * default: ***false***
         */
        addFinalStop: false,
        /**
         * Any string assigned to this will serve as the title for the additional/final bullet of the addFinalStop setting
         * --> this is ignored unless either horTitles or verTitles are also true
         * --> this is ignored on the **vertical** tracker and on the **horizontal** tracker without horOnlyActiveTitle unless addFinalStop is also true
         *  
         * default: ***''*** *(empty string)*
         */
        finalStopTitle: '',
        /**
         * Adds a hover effect to the bullets and titles if true
         * --> this is ignored unless at least one of horStops, verStops, horTitles or verTitles is also true
         *  
         * default: ***true***
         */
        hovering: true,
        /**
         * This setting makes the trackers interactive, meaning that the page scrolls to the beginning of the corresponding section when the user clicks on a bullet or title
         * --> this is ignored unless at least one of horStops, verStops, horTitles or verTitles is also true
         *  
         * default: ***true***
         */
        linking: true,
        /**
         * With this setting active the page will scroll past the section's headline and to the top of the rest of the section when the user clicks on a linked bullet or title
         * --> this is ignored unless at least one of horStops, verStops, horTitles or verTitles AND linking are also true
         * --> this setting is automatically forced on small screen devices (mobileThreshold) if horTitles is true
         *  
         * default: ***true***
         */
        skipHeadlines: true,
        /**
         * This setting controls the animation duration (in milliseconds) for the page scrolling that occurs when the user clicks on a linked bullet or title
         * --> for immediate jumping to the sections without any animation, set this to 0
         * --> this is ignored unless at least one of horStops, verStops, horTitles or verTitles AND linking are also true
         *  
         * default: ***800***
         */
        scrollSpeed: 800,
        /**
         * With this setting set to true, the trackers' progress bars as well as the 'active' state for the bullets and titles will be based on the **bottom** of the screen, effectively representing how much is already visible at the current scroll progress
         * --> set this to false to instead track scroll content based on the **top** of the user's screen
         * --> with this set to false there is always a chance that the trackers cannot reach 100%
         * --> this happens whenever the tracked area or even the last section within it aren't at least as high as the viewport and there is now footer below it to compensate that
         *  
         * default: ***true***
         */
        trackViewport: true,
        /**
         * This setting effectively turns the trackers into something similar to a scrollbar, as it represents the height of your viewport as well as the scroll progress
         * --> activating this also removes the 'active' state from any bullets and titles that leave the viewport area
         * --> this is ignored by the horSplitSection tracker
         *  
         * default: ***false***
         */
        trackViewportOnly: false
        // <-- General
    },  options);
    // <-- Default options

    let currentVersion = "1.3a",
        copyrightYear = "2016-2018",
        linkingScrollTop,
        head,
        trackedArea,
        horizontalTracker,
        getScrollProgressMax,
        getScrollProgressValue,
        trackerSize,
        headlineMargin,
        horizontalCenter, horizontalTop, horizontalBottom,
        horizontalTitlesHeight;

    // Calculate 'max' and current 'value' for the progress-tag -->
    getScrollProgressMax = function() {
        return trackedArea.outerHeight();
    };
    if (settings.trackViewport || settings.trackViewportOnly) {
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
    // <-- Calculate 'max' and current 'value' for the progress-tag

    $(document).ready(function () {
        horizontalCenter = $('.spt-horizontalScrollProgress').outerHeight(true) - $('.spt-horizontalScrollProgress').height() + $('.spt-horizontalScrollProgress').children(':first-child').height() / 2;
        horizontalTop = horizontalCenter - $('.spt-horizontalScrollProgress').children(':first-child').height() / 2;
        horizontalBottom = horizontalCenter + $('.spt-horizontalScrollProgress').children(':first-child').height() / 2;
        horizontalTitlesHeight = parseFloat($('.spt-scrollStopTitles').css('line-height'));

        if (parseFloat($('.spt-centerAll').css('max-width')) > (settings.mobileThreshold - 400)) {
            $('.spt-centerAll').css('max-width', settings.mobileThreshold - 400 + 'px');
        }

        // Convert document if headline has class 'spt-trackThis' -->
        if ($('.spt-sectionTitle.spt-trackThis').length) {
            let i = 0;
            $('.spt-sectionTitle.spt-trackThis').each(function() {
                i ++;
                $(this).removeClass('spt-trackThis').wrap('<div id="Section' + i + '" class="spt-trackThis"></div>');
                let nextBreak = false;
                while (!nextBreak) {
                    if ($('#Section' + i).next().length) {
                        if ($('#Section' + i).next()[0] !== $('#Section' + i).siblings('.spt-sectionTitle.spt-trackThis')[0]) {
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
        // <-- Convert document if headline has class 'spt-trackThis'

        if ($('#TrackScrollProgress').length) {
            trackedArea = $('#TrackScrollProgress');
        } else {
            trackedArea = $(document);
        }
        if (settings.trackAllHeadlines) {
            trackedArea.find('h1, h2, h3, h4, h5, h6').addClass('spt-sectionTitle');
        } else {
            trackedArea.find('h3').addClass('spt-sectionTitle');
        }

        headlineMargin = (trackedArea.find('.spt-trackThis').children('.spt-sectionTitle:first').outerHeight(true) - trackedArea.find('.spt-trackThis').children('.spt-sectionTitle:first').outerHeight()) / 2;

        // include color-stylesheets if needed -->
        if (settings.horColor === 'blue' || settings.verColor === 'blue') {
            $('head').append('<link href="css/themes/spt-blue.min.css" rel="stylesheet" />');
        }
        if (settings.horColor === 'green' || settings.verColor === 'green') {
            $('head').append('<link href="css/themes/spt-green.min.css" rel="stylesheet" />');
        }
        if (settings.horColor === 'orange' || settings.verColor === 'orange') {
            $('head').append('<link href="css/themes/spt-orange.min.css" rel="stylesheet" />');
        }
        if (settings.horColor === 'custom' || settings.verColor === 'custom') {
            $('head').append('<link href="css/themes/spt-custom.css" rel="stylesheet" />');
        }
        // <-- include color-stylesheets if needed

        // Generate tracker html structure -->
        if (settings.horTracker) {
            // HORIZONTAL tracker -->
            if (settings.horMobile || settings.horMobileOnly || !settings.horSplitSections) {
                // Regular layout -->
                if (settings.horInHeader && $('header').length) {
                    // Generate HORIZONTAL tracker IN HEADER -->
                    if (settings.horInHeader === 'bottom') {
                        $('header').append('<div class="spt-horizontalScrollProgress"></div>');
                    } else {
                        $('header').prepend('<div class="spt-horizontalScrollProgress"></div>');
                    }
                    if (settings.horMobileOnly) {
                        $('.spt-horizontalScrollProgress').addClass('spt-mobileOnly');
                    }
                    head = $('header').outerHeight();
                    // <-- Generate HORIZONTAL tracker IN HEADER
                } else {
                    // Generate HORIZONTAL tracker at the end of the site's BODY -->
                    $('body').append('<div class="spt-horizontalScrollProgress spt-fixed"></div>');
                    if (settings.horPosition === 'bottom') {
                        head = 0;
                    } else {
                        head = $('.spt-horizontalScrollProgress').outerHeight();
                    }
                    // <-- Generate HORIZONTAL tracker at the end of the site's BODY
                }

                if (!settings.trackViewportOnly && 'max' in document.createElement('progress')) {
                    // Generate html5 progress-tag if it is supported by the browser -->
                    $('.spt-horizontalScrollProgress').append('<progress class="spt-scrollProgress"></progress>');
                    horizontalTracker = $('.spt-scrollProgress');
                } else {
                    // Generate fallback solution for older browsers where the progress-tag is NOT supported -->
                    $('.spt-horizontalScrollProgress').append('<div class="spt-scrollProgressContainer"><span class="spt-scrollProgressBar"></span></div>');
                    horizontalTracker = $('.spt-scrollProgressContainer');
                }
                if (settings.horPosition === 'bottom' && !settings.horInHeader) {
                    $('.spt-horizontalScrollProgress').addClass('spt-bottom');
                    $('body').css('padding-bottom', $('.spt-horizontalScrollProgress').height());
                } else {
                    if (!settings.horInHeader) {
                        $('body').css('padding-top', $('.spt-horizontalScrollProgress').height());
                    }
                }
                if ($('.spt-scrollProgress').length) {
                    $('.spt-scrollProgress').attr('value', '0');
                }
                if (settings.horTitles) {
                    $('<div class="spt-scrollStopTitles"></div>').insertAfter(horizontalTracker);
                    $('.spt-scrollStopTitles').append('<div class="spt-stopTitle spt-onlyActive" style="font-weight: bold;"></div>');
                } else {
                    horizontalTracker.addClass('spt-untitled');
                }
                if (settings.horStops) {
                    $('<div class="spt-scrollStopContainer"></div>').insertAfter(horizontalTracker);
                }
                if (settings.addFinalStop) {
                    $('.spt-scrollStopContainer').append('<div class="spt-finalStopCircle" title="' + settings.finalStopTitle + '"></div>');
                    if (!settings.horOnlyActiveTitle) {
                        $('.spt-scrollStopTitles').append('<div class="spt-finalStopTitle">' + settings.finalStopTitle + '</div>');
                    }
                }
                if (!settings.horMobile) {
                    $('.spt-horizontalScrollProgress').addClass('spt-desktopOnly');
                }
                if (settings.horMobileOnly) {
                    $('.spt-horizontalScrollProgress').removeClass('spt-desktopOnly').addClass('spt-mobileOnly');
                }
                if (settings.horStyle === 'fill') {
                    $('.spt-horizontalScrollProgress').addClass('spt-styleFill');
                }

                if (settings.horCenter) {
                    horizontalTracker.addClass('spt-centerAll');
                    $('.spt-scrollStopTitles').addClass('spt-centerAll');
                    $('.spt-scrollStopContainer').addClass('spt-centerAll');

                }
                // <-- Regular layout
            }
            if (settings.horSplitSections && !settings.horMobileOnly) {
                // Split Sections -->
                $('.spt-horizontalScrollProgress').addClass('spt-mobileOnly');
                $('body').append('<div class="spt-splitSections spt-desktopOnly"></div>');
                let i = 0;
                $('.spt-trackThis').each(function() {
                    i ++;
                    $('.spt-splitSections').append('<div class="spt-sectionProgress" id="SectionProgress' + i + '"><div class="spt-sectionProgressBar"></div></div>');
                });
                // <-- Split Sections
            }

            if (settings.horColor === 'blue') {
                $('.spt-horizontalScrollProgress, .spt-splitSections').addClass('spt-blue');
            } else if (settings.horColor === 'green') {
                $('.spt-horizontalScrollProgress, .spt-splitSections').addClass('spt-green');
            } else if (settings.horColor === 'orange') {
                $('.spt-horizontalScrollProgress, .spt-splitSections').addClass('spt-orange');
            } else if (settings.horColor === 'custom') {
                $('.spt-horizontalScrollProgress, .spt-splitSections').addClass('spt-custom');
            }
            // <-- HORIZONTAL tracker
        }

        if (settings.verTracker) {
            // VERTICAL tracker -->
            $('body').append('<div class="spt-verticalScrollProgress"><div class="spt-verticalScrollProgressContainer"><div class="spt-verticalScrollProgressBar"></div></div></div>');
            if (settings.verPosition === 'right') {
                $('.spt-verticalScrollProgress').addClass('spt-verRight');
            }

            let verticalTracker = $('.spt-verticalScrollProgress');
            if (!settings.verMobile) {
                verticalTracker.addClass('spt-desktopOnly');
            }
            if (settings.verMobileOnly) {
                verticalTracker.removeClass('spt-desktopOnly').addClass('spt-mobileOnly');
            }
            if (settings.verStops) {
                verticalTracker.append('<div class="spt-verScrollStopContainer"></div>');
            }
            if (settings.verTitles) {
                verticalTracker.append('<div class="spt-verScrollStopTitles"></div>');
            } else {
                verticalTracker.addClass('spt-untitled');
            }
            if (settings.addFinalStop) {
                $('.spt-verScrollStopContainer').append('<div class="spt-finalStopCircle"></div>');
                $('.spt-verScrollStopTitles').append('<div class="spt-finalStopTitle">' + settings.finalStopTitle + '</div>');
            }
            if (settings.verStyle === 'fill') {
                $('.spt-verticalScrollProgress').addClass('spt-styleFill');
            }

            if (settings.verColor === 'blue') {
                $('.spt-verticalScrollProgress').addClass('spt-blue');
            } else if (settings.verColor === 'green') {
                $('.spt-verticalScrollProgress').addClass('spt-green');
            } else if (settings.verColor === 'orange') {
                $('.spt-verticalScrollProgress').addClass('spt-orange');
            } else if (settings.verColor === 'custom') {
                $('.spt-verticalScrollProgress').addClass('spt-custom');
            }
            // <-- VERTICAL tracker
        }
        // <-- generate tracker html structure

        // HORIZONTAL tracker functionality -->
        if ($('.spt-scrollProgress').length) {
            // <progress> tag is supported and regular layout is used -->
            let scrollProgress = $('.spt-scrollProgress');
            scrollProgress.attr('max', getScrollProgressMax());
            $(document).scroll(function () {
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
            // <progress> tag is not supported (older browsers) and/or Split Sections layout is used -->
            let scrollProgress = $('.spt-scrollProgressBar'),
                scrollProgressMax = getScrollProgressMax(),
                scrollProgressValue, scrollProgressWidth, scrollProgressLeft,
                getScrollProgressWidth = function() {
                    scrollProgressValue = getScrollProgressValue();
                    if (!settings.trackViewportOnly) {
                        scrollProgressWidth = (scrollProgressValue/scrollProgressMax) * 100;
                    } else {
                        scrollProgressWidth = ((trackerSize)/scrollProgressMax) * 100;
                    }
                    if (scrollProgressWidth > 100) {
                        scrollProgressWidth = 100;
                    } else if (scrollProgressWidth < 0) {
                        scrollProgressWidth = 0;
                    }
                    scrollProgressWidth = scrollProgressWidth + '%';
                    return scrollProgressWidth;
                },
                setScrollProgressWidth = function() {
                    scrollProgress.css('width', getScrollProgressWidth());
                },
                getScrollProgressLeft = function() {
                    scrollProgressLeft = (($(window).scrollTop() - head)/scrollProgressMax) * 100;
                    if (scrollProgressLeft > 100) {
                        scrollProgressLeft = 100;
                    }
                    scrollProgressLeft = scrollProgressLeft + '%';
                    return scrollProgressLeft;
                },
                setScrollProgressLeft = function() {
                    scrollProgress.css('left', getScrollProgressLeft());
                };

            $(document).scroll(function() {
                if (trackerSize >= trackedArea.offset().top - head) {
                    $(window).resize();
                    scrollProgress.css('width', getScrollProgressWidth());
                } else {
                    scrollProgress.css('width', '0');
                }
            });
            $(window).resize(function () {
                setScrollProgressWidth();
                if (settings.trackViewportOnly) {
                    setScrollProgressLeft();
                }
            });
        }
        // <-- HORIZONTAL tracker functionality

        // VERTICAL tracker functionality -->
        let verticalScrollProgress = $('.spt-verticalScrollProgressBar'),
            scrollProgressMax = getScrollProgressMax(),
            scrollProgressValue, scrollProgressHeight, scrollProgressTop,
            getScrollProgressHeight = function() {
                scrollProgressValue = getScrollProgressValue();
                if (!settings.trackViewportOnly) {
                    scrollProgressHeight = (scrollProgressValue/scrollProgressMax) * 100;
                } else {
                    scrollProgressHeight = ($(window).height()/scrollProgressMax) * 100;
                }
                if (scrollProgressHeight > 100) {
                    scrollProgressHeight = 100;
                }
                scrollProgressHeight = scrollProgressHeight + '%';
                return scrollProgressHeight;
            },
            setScrollProgressHeight = function() {
                verticalScrollProgress.css('height', getScrollProgressHeight());
            },
            getScrollProgressTop = function() {
                scrollProgressTop = (($(window).scrollTop() - head)/scrollProgressMax) * 100;
                if (scrollProgressTop > 100) {
                    scrollProgressTop = 100;
                }
                scrollProgressTop = scrollProgressTop + '%';
                return scrollProgressTop;
            },
            setScrollProgressTop = function() {
                verticalScrollProgress.css('top', getScrollProgressTop());
            };

        $(document).scroll(function() {
            if (trackerSize >= trackedArea.offset().top - head) {
                $(window).resize();
            } else {
                verticalScrollProgress.css('height', '0%');
            }
            if ($(window).width() <= settings.mobileThreshold) {
                if (settings.horTitles) {
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').addClass('spt-ellipsis');
                }
                if (!settings.horOnlyActiveTitle) {
                    $('.spt-scrollStopTitles').children('.spt-stopTitle, .spt-finalStopTitle').css('display', 'none');
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').css('display', 'block');
                }
            } else {
                $('.spt-scrollStopTitles').children('.spt-stopTitle, .spt-onlyActive').removeClass('spt-ellipsis');
                if (settings.horOnlyActiveTitle) {
                    $('.spt-scrollStopTitles').children('.spt-stopTitle, .spt-finalStopTitle').css('display', 'none');
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').css('display', 'block');
                } else {
                    $('.spt-scrollStopTitles').children('.spt-stopTitle, .spt-finalStopTitle').css('display', 'block');
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').css('display', 'none');
                }
            }
            updateElements();
        });
        $(window).resize(function () {
            horizontalCenter = $('.spt-horizontalScrollProgress').outerHeight(true) - $('.spt-horizontalScrollProgress').height() + $('.spt-horizontalScrollProgress').children(':first-child').height() / 2;
            horizontalTop = horizontalCenter - $('.spt-horizontalScrollProgress').children(':first-child').height() / 2;
            horizontalBottom = horizontalCenter + $('.spt-horizontalScrollProgress').children(':first-child').height() / 2;
            $('.spt-scrollStopTitles').append('<div class="spt-placeholder">&nbsp;</div>');
            horizontalTitlesHeight = parseFloat($('.spt-placeholder').height());
            $('.spt-placeholder').remove();

            scrollProgressMax = getScrollProgressMax();
            setScrollProgressHeight();
            if (settings.trackViewportOnly) {
                setScrollProgressTop();
            }
            // Fake responsive webdesign ("small screens") -->
            if ($(window).width() <= settings.mobileThreshold) {
                // is mobile
                $('.spt-horizontalScrollProgress, .spt-scrollProgress, .spt-scrollProgressContainer, .spt-scrollStopContainer, .spt-scrollStopTitles, .spt-verticalScrollProgress, .spt-splitSections').addClass('spt-smallDevice');
                if (!settings.horOnlyActiveTitle) {
                    $('.spt-scrollStopTitles').children('.spt-stopTitle, .spt-finalStopTitle').css('display', 'none');
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').css('display', 'block');
                }
                if (!settings.horTitlesOffset) {
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').css('margin-top', horizontalBottom + 5 + 'px').css('margin-left', '8px');
                }
                if (settings.horTracker && settings.horMobile || settings.horTracker && settings.horMobileOnly) {
                    head = $('.spt-horizontalScrollProgress').outerHeight();
                } else {
                    head = 0;
                }
            } else {
                // is not mobile
                $('.spt-horizontalScrollProgress, .spt-scrollProgress, .spt-scrollProgressContainer, .spt-scrollStopContainer, .spt-scrollStopTitles, .spt-verticalScrollProgress, .spt-splitSections').removeClass('spt-smallDevice');
                if (settings.horOnlyActiveTitle) {
                    $('.spt-scrollStopTitles').children('.spt-stopTitle, .spt-finalStopTitle').css('display', 'none');
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').css('display', 'block');
                } else {
                    $('.spt-scrollStopTitles').children('.spt-stopTitle, .spt-finalStopTitle').css('display', 'block');
                    $('.spt-scrollStopTitles').children('.spt-onlyActive').css('display', 'none');
                }
                if (settings.horTracker && !settings.horMobileOnly) {
                    head = $('.spt-horizontalScrollProgress').outerHeight();
                } else {
                    head = 0;
                }
            }
            if ($(window).width() >= (settings.mobileThreshold + 100)) {
                $('.spt-verticalScrollProgress').css('width', 180 + ($(window).width() - settings.mobileThreshold) / 2 - 50 + 'px');
                $('.spt-verScrollStopTitles').css('width', 170 + ($(window).width() - settings.mobileThreshold) / 2 - 50 + 'px');
            } else {
                $('.spt-verticalScrollProgress').css('width', '180px');
                $('.spt-verScrollStopTitles').css('width', '170px');
            }
            // <-- Fake responsive webdesign ("small screens")
            updateElements();
        });
        // <-- VERTICAL tracker

        setScrollStops();
        // Create bullets and titles -->
        function setScrollStops() {
            trackedArea.find('.spt-trackThis').each(function(index) {
                let sectionHeadline = $(this).children('.spt-sectionTitle:first'),
                    sectionTitle,
                    sectionId = index + 1,
                    scrollHorStops = $('.spt-scrollStopContainer'),
                    scrollVerStops = $('.spt-verScrollStopContainer'),
                    scrollStopTitles = $('.spt-scrollStopTitles'),
                    scrollVerStopTitles = $('.spt-verScrollStopTitles');

                if (sectionHeadline.attr('data-name')) {
                    sectionTitle = sectionHeadline.attr('data-name');
                } else {
                    sectionTitle = sectionHeadline.text();
                }

                $(this).attr('id', 'Section' + sectionId);
                $(this).children('.spt-sectionTitle:first').attr({ id: 'SectionHeadline' + sectionId});

                scrollHorStops.append('<div class="spt-stopCircle spt-stop' + sectionId + '" data-index="' + sectionId + '" title="' + sectionHeadline.text() + '"></div>');
                scrollVerStops.append('<div class="spt-stopCircle spt-stop' + sectionId + '" data-index="' + sectionId + '"></div>');
                scrollStopTitles.append('<div class="spt-stopTitle spt-stop' + sectionId + '" data-index="' + sectionId + '">' + sectionTitle + '</div>');
                scrollVerStopTitles.append('<div class="spt-stopTitle spt-stop' + sectionId + '" data-index="' + sectionId + '">' + sectionTitle + '</div>');


                if (settings.horNumbering) {
                    scrollHorStops.children('.spt-stopCircle.spt-stop' + sectionId).append(sectionId);
                    if (settings.addFinalStop) {
                        let numStops = scrollHorStops.children('.spt-stopCircle').length + 1;
                        scrollHorStops.children('.spt-finalStopCircle').text(numStops);
                    }
                }
                if (settings.verNumbering) {
                    scrollVerStops.children('.spt-stopCircle.spt-stop' + sectionId).append(sectionId);
                    if (settings.addFinalStop) {
                        let numStops = scrollVerStops.children('.spt-stopCircle').length + 1;
                        scrollVerStops.children('.spt-finalStopCircle').text(numStops);
                    }
                }
            });
            $('.spt-scrollStopContainer').append($('.spt-scrollStopContainer > .spt-finalStopCircle'));
            $(window).resize();
        }
        // <-- Create bullets and titles

        // Linking mode functionality -->
        if (settings.linking) {
            $('.spt-stopCircle, .spt-stopTitle').click(function () {
                if ($('#SectionHeadline' + $(this).attr('data-index')).length) {
                    if (settings.skipHeadlines || $(window).width() <= settings.mobileThreshold && settings.horTitles) {
                        linkingScrollTop = $('#SectionHeadline' + $(this).attr('data-index')).offset().top + $('#SectionHeadline' + $(this).attr('data-index')).height() - head + 1;
                    } else {
                        linkingScrollTop = $('#SectionHeadline' + $(this).attr('data-index')).offset().top - parseFloat($('#SectionHeadline' + $(this).attr('data-index')).css('margin-top')) - head + 1;
                    }
                } else {
                    linkingScrollTop = $('#Section' + $(this).attr('data-index')).offset().top - head - 2;
                }

                $('html, body').animate( {
                    scrollTop: linkingScrollTop
                }, settings.scrollSpeed);
            });
            $('.spt-finalStopCircle, .spt-finalStopTitle').click(function () {
                if (trackedArea.children(':last-child').children(':first-child').is('.spt-sectionTitle')) {
                    if (settings.skipHeadlines || $(window).width() <= settings.mobileThreshold && settings.horTitles) {
                        linkingScrollTop = trackedArea.children(':last-child').children(':first-child').offset().top + trackedArea.children(':last-child').children(':first-child').height() - head + 1;
                    } else {
                        linkingScrollTop = trackedArea.children(':last-child').children(':first-child').offset().top - parseFloat(trackedArea.children(':last-child').children(':first-child').css('margin-top')) - head + 1;
                    }
                } else {
                    linkingScrollTop = trackedArea.children(':last-child').offset().top - head - 2;
                }

                $('html, body').animate( {
                    scrollTop: linkingScrollTop
                }, settings.scrollSpeed);
            });
        }
        // <-- Linking mode functionality

        // Hover-effect -->
        if (settings.hovering) {
            let itemIndex;
            $('.spt-scrollStopContainer .spt-stopCircle, .spt-scrollStopTitles .spt-stopTitle').hover(function() {
                itemIndex = $(this).attr('data-index');
                $('.spt-stopCircle, .spt-stopTitle').removeClass('spt-hover');
                $('.spt-scrollStopContainer .spt-stop' + itemIndex + ', .spt-scrollStopTitles .spt-stop' + itemIndex).addClass('spt-hover');
            }, function() {
                $('.spt-stopCircle, .spt-stopTitle').removeClass('spt-hover');
            });
            $('.spt-verScrollStopContainer .spt-stopCircle, .spt-verScrollStopTitles .spt-stopTitle').hover(function() {
                itemIndex = $(this).attr('data-index');
                $('.spt-stopCircle, .spt-stopTitle').removeClass('spt-hover');
                $('.spt-verScrollStopContainer .spt-stop' + itemIndex + ', .spt-verScrollStopTitles .spt-stop' + itemIndex).addClass('spt-hover');
            }, function() {
                $('.spt-stopCircle, .spt-stopTitle').removeClass('spt-hover');
            });
            $('.spt-scrollStopContainer .spt-finalStopCircle, .spt-scrollStopTitles .spt-finalStopTitle').hover(function() {
                $('.spt-scrollStopContainer .spt-finalStopCircle, .spt-scrollStopTitles .spt-finalStopTitle').addClass('spt-hover');
            }, function() {
                $('.spt-finalStopCircle, .spt-finalStopTitle').removeClass('spt-hover');
            });
            $('.spt-verScrollStopContainer .spt-finalStopCircle, .spt-verScrollStopTitles .spt-finalStopTitle').hover(function() {
                $('.spt-verScrollStopContainer .spt-finalStopCircle, .spt-verScrollStopTitles .spt-finalStopTitle').addClass('spt-hover');
            }, function() {
                $('.spt-finalStopCircle, .spt-finalStopTitle').removeClass('spt-hover');
            });
        }
        // <-- Hover-effect
        $(document).scroll();
        console.log('Advanced jQuery Scroll Progress Tracker v' + currentVersion + '\n(c) ' + copyrightYear + ' David Whitworth (david@whitworth.de)');
    });
    // Position scroll stops and titles -->
    function updateElements() {
        trackedArea.find('.spt-trackThis').each(function(index) {
            let section = $(this),
                sectionHeadline = section.children('.spt-sectionTitle:first'),
                sectionTitle = sectionHeadline.text(),
                sectionTopSubtract = trackedArea.offset().top,
                sectionRelativeTop = section.offset().top - sectionTopSubtract,
                sectionId = index + 1,
                sectionStop = (sectionRelativeTop / getScrollProgressMax()) * 100,
                scrollHorStops = $('.spt-scrollStopContainer'),
                scrollVerStops = $('.spt-verScrollStopContainer'),
                scrollStopTitles = $('.spt-scrollStopTitles'),
                scrollVerStopTitles = $('.spt-verScrollStopTitles'),
                sectionProgressWidth, sectionProgressLeft;

            if (sectionStop > 100) {
                sectionStop = 100;
            }

            // Split Sections functionality -->
            if (settings.trackViewport || settings.trackViewportOnly) {
                trackerSize = $(window).scrollTop() + $(window).height();
            } else {
                trackerSize = $(window).scrollTop();
            }

            let bar = $('#SectionProgress' + sectionId + ' .spt-sectionProgressBar');

            if (!settings.trackViewportOnly) {
                // Split Sections regular behavior -->
                sectionProgressWidth = (trackerSize - section.offset().top) / section.height() * 100;
                if (sectionProgressWidth > 100) {
                    sectionProgressWidth = 100;
                }
                // <-- Split Sections regular behavior
            } else {
                // Split Sections + trackViewportOnly -->
                sectionProgressWidth = $(window).height() / section.height() * 100;
                sectionProgressLeft = (trackerSize - section.offset().top) / section.height() * 100 - sectionProgressWidth;

                if (sectionProgressLeft > 100) {
                    bar.css('left', '100%');
                } else {
                    bar.css('left', sectionProgressLeft + '%');
                    if (sectionId === 1 && sectionProgressLeft < 0) {
                        bar.css('left', '0');
                    }
                }
                // <-- Split Sections + trackViewportOnly
            }
            bar.css('width', sectionProgressWidth + '%');
            // <-- Split Sections functionality

            scrollHorStops.children('.spt-stop' + sectionId).css('left', sectionStop + '%');
            scrollVerStops.children('.spt-stop' + sectionId).css('top', sectionStop + '%');
            scrollStopTitles.children('.spt-stop' + sectionId).css('left', sectionStop + '%');
            scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').addClass('spt-reached');
            if (settings.horStyle === 'beam') {
                scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').css('left', '-8px');
            } else {
                scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').css('left', '0');
            }
            scrollVerStopTitles.children('.spt-stop' + sectionId).css('top', sectionStop + '%');

            if ($(window).scrollTop() <= trackedArea.find('.spt-trackThis:first').offset().top + trackedArea.find('.spt-trackThis:first').children('.spt-sectionTitle:first').outerHeight() - head) {
                scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').text('');
            }
            if ($(window).scrollTop() >= section.offset().top + section.children('.spt-sectionTitle:first').outerHeight() - head) {
                scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').text(sectionTitle);
                if (settings.finalStopTitle !== '') {
                    if ($(window).width() <= settings.mobileThreshold) {
                        if (($(window).scrollTop() + $(window).height()) >= (trackedArea.offset().top + trackedArea.height() + (headlineMargin * 2)) ||
                            ($(window).scrollTop() + $(window).height()) >= trackedArea.outerHeight()) {
                            scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').text(settings.finalStopTitle);
                        }
                    } else {
                        if (($(window).scrollTop() + $(window).height()) >= trackedArea.outerHeight()) {
                            scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').text(settings.finalStopTitle);
                        }
                    }
                }
            }

            if (settings.horOnlyActiveTitle) {
                scrollStopTitles.children('.spt-stop' + sectionId).css('display', 'none');
                scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').css('display', 'block');
            } else {
                scrollStopTitles.children('.spt-stop' + sectionId).css('display', 'block');
                scrollStopTitles.children('.spt-stopTitle.spt-onlyActive').css('display', 'none');
            }

            if (settings.horTitlesOffset === 'top') {
                scrollStopTitles.children('.spt-stopTitle').css('margin-top', horizontalTop - horizontalTitlesHeight - 5 + 'px').css('margin-left', '8px');
            } else if (settings.horTitlesOffset === 'bottom') {
                scrollStopTitles.children('.spt-stopTitle').css('margin-top', horizontalBottom + 5 + 'px').css('margin-left', '8px');
                scrollStopTitles.children('.spt-finalStopTitle').css('margin-top', horizontalBottom + 5 + 'px');
            } else {
                scrollStopTitles.children('.spt-stopTitle').css('margin-top', horizontalCenter - horizontalTitlesHeight / 2 - 2 + 'px').css('margin-left', '25px');
                scrollStopTitles.children('.spt-finalStopTitle').css('margin-top', horizontalCenter - horizontalTitlesHeight / 2 - 2 + 'px').css('margin-right', '16px');
            }
            if (settings.horStyle === 'fill') {
                scrollStopTitles.children('.spt-onlyActive').css('margin-top', '0');
            }

            if (getScrollProgressValue() >= sectionRelativeTop) {
                $('.spt-stop' + sectionId).addClass('spt-reached');
            } else {
                $('.spt-stop' + sectionId).removeClass('spt-reached');
            }
            if (getScrollProgressValue() >= getScrollProgressMax()) {
                $('.spt-finalStopCircle, .spt-finalStopTitle').addClass('spt-reached');
            } else {
                $('.spt-finalStopCircle, .spt-finalStopTitle').removeClass('spt-reached');
            }
            if (settings.trackViewportOnly) {
                if (getScrollProgressValue() - $(window).outerHeight() >= sectionRelativeTop + section.outerHeight()) {
                    $('.spt-stop' + sectionId).removeClass('spt-reached');
                }
            }
        });
    }
    // <-- Position scroll stops and titles
};

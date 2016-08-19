# Advanced jQuery Scroll Progress Tracker v1.1.2

Dynamic Scroll Progress Tracker plugin for jQuery

(c) 2016 David Whitworth (david@whitworth.de)

Released under the GNU General Public License (GPL)

### Description

A relatively lightweight (~22KB) jQuery plugin that creates either a horizontal or a vertical (or both) scroll progress indicator based on your content. It is highly customizable and has a built-in linking function, so it can be used as an interactive table of contents.

Using the various options it is also possible to display one tracker (for example vertical) on large screens and another (horizontal in this case) on small screens. On top of that it is very easy to control the position, behaviour and appearance of each tracker individually.

### Setup

1. Copy the files from the css and js directories to your corresponding asset directories.
2. Include the advanced-progress-tracker.css or advanced-progress-tracker.min.css in the `head`
3. Include jQuery (if you haven't already) followed by advanced-progress-tracker.js or advanced-progress-tracker.min.js in the `head`
4. Initialize the plugin below the included scripts, like so:
   
    <script type='text/javascript'>
        $('body').progressTracker();
    </script>

Or with custom options...

    <script type='text/javascript'>
        $('body').progressTracker({
            horNumbering: false,
            horTitles: true,
            horMobileOnly: true,
            verTracker: true,
        });
    </script>

### Live-Demo

You can find a more detailed introduction that uses the script here:

http://whitworth.de/ProgressTracker/ReadMe.html

### Update history

**Version 1.1.2**
##### Fixes:

- Adjusted the default value for mobileThreshold and the max-width of .centerAll to prevent collisions with the vertical tracker
- Repositions the vertical tracker as soon as the available space allows it

**Version 1.1.1**
##### Fixes:

- Fixed a positioning bug for the vertical tracker

**Version 1.1**
##### Fixes:

- Fixed the combination of horOnlyActiveTitles and horStops: false
- Fixed the behavior of horOnlyActiveTitles, linking and skipHeadlines

##### New features:

- Added title-attribute to the bullets of the *horizontal* tracker
- Added option **horInHeader**
- Added option **horCenter**
- Added options and styles for **horStyle** and **verStyle**
- Added option **trackAllHeadlines**

### Credits

I'd like to thank Rene Mansveld (r.mansveld@spider-it.de) for providing me with the "headline only markup"-solution.

### Questions & Feedback

If you have any questions, notice any bugs, have issues getting the plugin to work, have an idea for a cool feature to be added, or would like to leave any other kind of feedback, feel free to contact me under David@Whitworth.de

Also, please, feel free to send me links to websites where you used this! =)
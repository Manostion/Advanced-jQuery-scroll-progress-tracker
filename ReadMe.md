# Advanced jQuery Scroll Progress Tracker v1.0

Dynamic Scroll Progress Tracker plugin for jQuery

© 2016 David Whitworth (david@whitworth.de)

Released under the GNU General Public License (GPL)

### Description

A relatively lightweight (~19KB) jQuery plugin that creates either a horizontal or a vertical (or both) scroll progress indicator based on your content. It is highly customizable and has a built-in linking function, so it can be used as an interactive table of contents.

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

### Credits

I'd like to thank René Mansveld for providing me with the "headline only markup"-solution.

### Questions & Feedback

If you have any questions, notice any bugs, have issues getting the plugin to work, have an idea for a cool feature to be added, or would like to leave any other kind of feedback, feel free to contact me under David@Whitworth.de

Also, please, feel free to send me links to websites where you used this! =)
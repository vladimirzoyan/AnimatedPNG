/*
AnimatedPNG - A Javascript library for animated PNG images 
Copyright (C) 2007-2008 Steve Jones (steve@squaregoldfish.co.uk)
Version 1.01
Web: http://www.squaregoldfish.co.uk/software/animatedpng
Email: animatedpng@squaregoldfish.co.uk

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details:
http://www.gnu.org/licenses/gpl.txt
*/


// Global variable for holding animated images
animatedPNGs = new Array();

// Constructor for an Animated PNG. This takes only the essential
// parameters for the animation; other options may be specified
// using other functions.
//    imageName - The name of this animation
//    firstImage - The filename of the first image
//    imageCount - The number of frames in the animation
//    delay - The default delay between frames
function AnimatedPNG(imageName, firstImage, imageCount, delay)
    {
    /** Fixed variables **/
    // Loop animation type - 1234512345
    this.ANIM_TYPE_LOOP = 0;

    // Bounce animation type - 123454321
    this.ANIM_TYPE_BOUNCE = 1;

    /** Instance Variables **/

    // The name of this animation object
    this.animName = imageName;

    // The array of images for this animation
    this.images = new Array();
    
    // The frame-specific delays
    this.delays = new Array();
    
    // The amount of padding required in image numbers
    this.padCount = 0;
    
    // The number of the first image in the sequence
    this.firstImageNumber = 0;
    
    // The number of the last image in the sequence
    this.lastImageNumber = 0;

    // The animation type
    this.animationType = this.ANIM_TYPE_LOOP;

    // The number of the image currently being displayed
    this.currentImage = 0;
    
    // The amount added to the current image to get the next frame.
    // Forward = +1, backwards (for bounce) = -1
    this.imageStep = 1;

    // Indicates whether or not the animation repeats
    this.repeat = true;
    
    // Indicates whether or not the animation is currently active
    this.animationRunning = false;
    
    // Indicates whether or not the animation has been displayed
    // on the page
    this.animationDrawn = false;

    /** FUNCTIONS **/
    
    // Draw the animation after it has been set up
    // Setting delayStart to true will prevent the animation from starting -
    // it can be started manually by calling startAnimation
    this.draw = function(delayStart)
        {
        // Draw the first image html, then call doDraw to continue
        var html = new Array();
        html[html.length] = '<img id="' + this.animName + '" src=""';
        if (this.altText)
        html[html.length] = ' alt="' + this.altText + '"';
        if (this.titleText)
        html[html.length] = ' title="' + this.titleText + '"';

        html[html.length] = '/>';
        document.write(html.join(''));
        document.getElementById(this.animName).src = this.images[this.firstImageNumber].src;
        
        if (!delayStart)
            {
            setTimeout('animatedPNGs[\'' + this.animName + '\'].drawFrame(true)', this.delays[this.firstImageNumber]);
            this.animationRunning = true;
            }

        this.drawn = true;
        }

    // Set the animation type to either loop (12345) or bounce (123454321).
    // The function uses the fixed parameters ANIM_TYPE_LOOP and ANIM_TYPE_BOUNCE
    // If the passed value is unrecognised, falls back to loop type.
    this.setAnimType = function(type)
        {
        if (type == this.ANIM_TYPE_LOOP)
            this.animationType = this.ANIM_TYPE_LOOP;
        else if (type == this.ANIM_TYPE_BOUNCE)
            this.animationType = this.ANIM_TYPE_BOUNCE;
        else
            {
            console.log("Unrecognised animation type %s - falling back to loop type", type)
            this.animationType = this.ANIM_TYPE_LOOP;
            }
        }
        
    // Set the delay for a specific frame in the animation.
    //   frame - The frame number
    //   delay - The delay in milliseconds
    //
    // If the frame number does not correspond to a frame in the animation,
    // this will have no effect.
    this.setFrameDelay = function(frame, delay)
        {
        this.delays[frame] = delay;
        }
        
    // Indicate whether or not the animation should repeat.
    //   repeat - Flag to indicate whether or not the animation should repeat.
    this.setRepeat = function(repeat)
        {
        this.repeat = repeat;
        }
        
    // Starts or resumes the animation if it is not running.
    this.startAnimation = function()
        {
        if (!this.animationRunning)
            {
            this.animationRunning = true;
            this.drawFrame(true);
            }
        }
        
    // Stops the animation at the current frame.
    this.stopAnimation = function()
        {
        this.animationRunning = false;
        }
        
    // Draws a single frame of the animation.
    // This is an internal function, and should not
    // be called directly.
    this.drawFrame = function(force)
        {
        var drawImage = true;
        this.currentImage = this.currentImage + this.imageStep;

        // Exactly what we do depends on the animation type
        drawImage = true;
        
        // If we're before the first frame, we must be in bounce mode
        if (this.currentImage < this.firstImageNumber)
            {
            if (force || this.repeat)
                {
                // Set the frame to the second image (we don't want to repeat the first image)
                this.currentImage = this.firstImageNumber + 1;

                // Update the step direction to start going frowards again
                this.imageStep = 1;
                }
            else
                {
                drawImage = false;
                this.stopAnimation();
                }
            }

        
        // If we're past the last frame, decide what to do based on the animation type
        if (this.currentImage > this.lastImageNumber)
            {
            // If we're in bounce mode, start going back through the frames
            if (this.animationType == this.ANIM_TYPE_BOUNCE)
                {
                this.currentImage = this.lastImageNumber - 1;
                this.imageStep = -1;
                }
            else
                {
                // We're in loop mode. If we're repeating start again, else stop
                if (force || this.repeat)
                    this.currentImage = this.firstImageNumber;
                else
                    {
                    drawImage = false;
                    this.stopAnimation();
                    }
                }
            }

            
        // If we're going to draw the frame....
        if (drawImage)
            {
            // Draw the frame in the HTML documemt
            document.getElementById(this.animName).src = this.images[this.currentImage].src;
            
            // Calculate the delay before drawing the next frame
            if (this.delays[this.currentImage])
                delay = this.delays[this.currentImage];
            
            // Draw the next frame after the calculated delay
            if (this.animationRunning)
                setTimeout('animatedPNGs[\'' + this.animName + '\'].drawFrame(false)', delay);
            }
        }
    
    
    
    /** CONSTRUCTOR **/
    
    var head = null;
    var numbers = '';

    // Check that the suffix for the image is .png
    var suffix = firstImage.substring(firstImage.length - 4, firstImage.length);
    if (suffix.search(/\.png/i) != 0 && suffix.search(/\.jpg/i) != 0)
        throw 'Invalid suffix for first image in animated PNG ' + imageName + ' - must be .png or .jpg';

    // Extract the number from the filename
    var finishedNumbers = false;
    var curIndex = firstImage.length - 5;
    for (; curIndex >= 0 && !finishedNumbers; curIndex--)
        {
        if (/[0-9]/.test(firstImage.charAt(curIndex)))
            {
            numbers = firstImage.charAt(curIndex) + numbers;
            if (firstImage.charAt(curIndex) == '0')
                this.padCount++;
            }
        else
            finishedNumbers = true;
        }

    // Extract the number of the first image from the filename
    numbers = parseInt(numbers);
    this.firstImageNumber = numbers;
    this.currentImage = numbers;
    head = firstImage.substring(0, curIndex + 2);
        
    // Build the array of images
    for (var i = numbers; i < imageCount + numbers; i++)
        {
        this.images[i] = new Image;
        this.images[i].src = head + pad(i, this.padCount) + suffix;
        this.lastImageNumber = i;
        this.delays[i] = delay;
        }
        
    // Add ourselves to the list of known animated PNGs
    animatedPNGs[imageName] = this;
    }
    
// Zero-pads a number to a specified length
//   number - The number to be padded
//   padCount - The length of the padded number
function pad(number, padCount)
    {
    var result = '' + number;
    while (result.length < padCount + 1)
        result = '0' + result;
    
    return result;
    }

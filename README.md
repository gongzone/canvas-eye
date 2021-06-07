# CanvasEye
Creating Interactive Eyes with HTML5 Canvas and Vanilla Javascript

![canvasEyes](https://user-images.githubusercontent.com/84328632/120916982-b61c8700-c6e7-11eb-8908-b38a9ea15c4f.jpg)

## 1. Non-Interactive Animation
 * __Parts of eyes__<br>
    -Just drawing each part of eyes considering resizing of canvas
 
 * __Moving TearWave__<br>
    -Making each wavepoints oscillate by using sine function, And connecting center dots of wavepoints in a curved form
    
 * __TearDrop__<br>
   -Generating tears that fall down at a given time. when they hit the floor(bottom of window), Random-colored particles pop up and disappear

## 2. Interactive Animation
  * __Click on eyes__<br>
     -When clicking the eye, it will be closed or open depending on the current state. And if the eye is shutting down or fully closed, Stop the teardrop animation. In the opposite case, Get the animation back on. 
 
  * __Mouse over eyes__<br>
    -When mouse pointer over the eye, activate hover effects as shown below:<br><br>
     &nbsp; 1.  Shining effect around the eye (_brightening & darkening periodically_)  
     &nbsp; 2.  The sizes of pupil & iris are getting bigger and smaller smoothly  
     &nbsp; &nbsp; &nbsp; (_when mouse pointer leave the target range, return to the original sizes also smoothly_)

function drawAll()
/*
  Purpose: This is the main drawing loop.
  Inputs: None, but it is affected by what the other functions are doing
  Returns: None, but it calls itself to cycle to the next frame
*/
{
    // Set up the frame
    ball.move();
    ball.bounce();
    paddle.move();

    // Draw the new frame
    context.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();

    // Loop the animation to the next frame.
    window.requestAnimationFrame(drawAll);
}

// Set up the canvas and context objects
context = setUpContext();

// Create instance of Line object
ball = new Ball(canvas.width / 2, canvas.height / 2, 10, context);
console.log(ball);
paddle = new Paddle();
console.log(paddle);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);

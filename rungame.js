function drawAll()
{
    ball.move();
    ball.bounce();
    paddle.move();

    context.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();

    window.requestAnimationFrame(drawAll);
}

context = setUpContext();

ball = new Ball(canvas.width / 2, canvas.height / 2, 10, context);
console.log(ball);
paddle = new Paddle(canvas.width / 20, canvas.height / 100);
console.log(paddle);

window.requestAnimationFrame(drawAll);

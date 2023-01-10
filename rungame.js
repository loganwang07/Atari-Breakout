death_count = 0;

function drawAll()
{
    ball.move();
    ball.bounce(paddle.center, paddle.width, paddle.height);
    paddle.move();

    context.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();

    window.requestAnimationFrame(drawAll);

    if (ball.center[1] - ball.radius > canvas.height) {
        ball = new Ball(canvas.width / 2, canvas.height / 2, 10, context);
        ball.draw();
        sleep(3);
        death_count += 1;
        console.log(death_count);
    }
    if (death_count >= 3) {
        return 0; // TO-DO: ADD DEATH SCREEN
    }
}

async function sleep(sec) {
    await sleep(sec * 1000);
  }

context = setUpContext();

ball = new Ball(canvas.width / 2, canvas.height / 2, 10, context);
console.log(ball);
paddle = new Paddle(canvas.width / 20, canvas.height / 150);
console.log(paddle);

window.requestAnimationFrame(drawAll);

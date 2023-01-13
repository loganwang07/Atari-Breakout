const brick_spacing = 5;
const bricks_per_row = 8;
const bricks_per_column = 8;
death_count = 0;

function drawAll()
{
    ball.move();
    ball.bounce(paddle);
    paddle.move();
    for (let i = 0; i < bricks.length; i++) {
        broken = bricks[i].break(ball)
        if (broken != "none") {
            bricks.splice(i, 1);
            if (broken == "top" && ball.vel[1] > 0) {ball.vel[1] *= -1;}
            else if (broken == "bottom" && ball.vel[1] < 0) {ball.vel[1] *= -1;}
            else if (broken == "left" && ball.vel[0] > 0) {ball.vel[0] *= -1;}
            else if (broken == "right" && ball.vel[0] < 0) {ball.vel[0] *= -1;}
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    paddle.draw();
    for (let i = 0; i < bricks.length; i++) {
        bricks[i].draw();
    }

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

ball = new Ball(canvas.width / 2, canvas.height / 2, 10);
paddle = new Paddle(canvas.width / 15, canvas.height / 150);

const bricks = [];
for (let i = 1; i <= bricks_per_row; i++) {
    for (let j = 1; j <= bricks_per_column; j++) {
        brick = new Brick(i * canvas.width / (bricks_per_row + 1), j * canvas.height / (bricks_per_column * 2 + 2), canvas.width / (bricks_per_row + 1) - brick_spacing, canvas.height / (bricks_per_column * 2 + 2) - brick_spacing);
        bricks.push(brick);
    }
}

window.requestAnimationFrame(drawAll);

const brick_spacing = 3;
const bricks_per_row = 10;
const bricks_per_column = 10;

death_count = 0;
score = 0;

function draw_all()
{
    ball.move();
    ball.bounce(paddle);
    paddle.move();
    for (let i = 0; i < bricks.length; i++) {
        broken = bricks[i].break(ball)
        if (broken != "none") {
            ball.accelerate();
            bricks.splice(i, 1);
            score += 10;
            console.log(score);
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

    window.requestAnimationFrame(draw_all);

    if (ball.center[1] - ball.radius > canvas.height) {
        ball.color = "white";
        ball.draw();
        ball = new Ball(canvas.width / 2, 3 * canvas.height / 4, 10);
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

context = set_up_context();

ball = new Ball(canvas.width / 2, 3 * canvas.height / 4, 10);
paddle = new Paddle(canvas.width / 10, canvas.height / 150);

var bricks = [];
for (let i = 1; i <= bricks_per_row; i++) {
    for (let j = 1; j <= bricks_per_column; j++) {
        brick = new Brick((i - 0.5) * canvas.width / bricks_per_row, canvas.height / 12 + (j - 0.5) * canvas.height / (bricks_per_column * 2.4), canvas.width / bricks_per_row - brick_spacing, canvas.height / (bricks_per_column * 2.4) - brick_spacing);
        bricks.push(brick);
    }
}

window.requestAnimationFrame(draw_all);

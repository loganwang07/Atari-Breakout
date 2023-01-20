const brick_spacing = 5;
const bricks_per_row = 10;
const bricks_per_column = 10;
const ball_speed_effects = 1.15; // minimum 1, controls how much effect each brick gives to the game, higher is more
const paddle_speed_effects = 1.2; // minimum 1, controls how much effect each brick gives to the game, higher is more
const paddle_length_effects = 1.15; // minimum 1, controls how much effect each brick gives to the game, higher is more

var balls = [];
var death_count = 0;
var score = 0;
var end = false;

function draw_all()
{   

    just_died = false;

    if (end != true) {
        context.font = "25px Helvetica";
        context.textAlign = "center";
        context.fillText("Balls: " + death_count, canvas.width / 20, canvas.height / 20);
        context.fillText("Score: " + score, 19 * canvas.width / 20, canvas.height / 20);
    }

    for (let i = 0; i < balls.length; i++) {
        balls[i].move();
        balls[i].bounce(paddle, end);
    }
    paddle.move();

    for (let i = 0; i < bricks.length; i++) {
        for (let j = 0; j < balls.length; j++) {
            if (bricks[i] != undefined) {
                broken = bricks[i].break(balls[j]);
                if (broken != "none") {
                    if (bricks[i].color == brick_colors[0]) {balls[j].vel[0] *= ball_speed_effects; balls[j].vel[1] *= ball_speed_effects; balls[j].color = brick_colors[0];}
                    else if (bricks[i].color == brick_colors[1]) {paddle_speed *= paddle_speed_effects; balls[j].color = brick_colors[1];}
                    else if (bricks[i].color == brick_colors[2]) {paddle.width /= paddle_length_effects; balls[j].color = brick_colors[2];}
                    else if (bricks[i].color == brick_colors[3]) {balls[j].vel[0] /= ball_speed_effects; balls[j].vel[1] /= ball_speed_effects; balls[j].color = brick_colors[3];}
                    else if (bricks[i].color == brick_colors[4]) {paddle_speed /= paddle_speed_effects; balls[j].color = brick_colors[4];}
                    else if (bricks[i].color == brick_colors[5]) {paddle.width *= paddle_length_effects; balls[j].color = brick_colors[5];}
                    else if (bricks[i].color == brick_colors[6]) {balls.push(new Ball(canvas.width / 2, 3 * canvas.height / 4, 10)); balls[j].color = brick_colors[6];}
                    paddle.color = "black";
                    bricks[i].color = "white";
                    bricks[i].draw();
                    bricks.splice(i, 1);
                    score += 10;
                    if (broken == "top" && balls[j].vel[1] > 0) {balls[j].vel[1] *= -1;}
                    else if (broken == "bottom" && balls[j].vel[1] < 0) {balls[j].vel[1] *= -1;}
                    else if (broken == "left" && balls[j].vel[0] > 0) {balls[j].vel[0] *= -1;}
                    else if (broken == "right" && balls[j].vel[0] < 0) {balls[j].vel[0] *= -1;}
                    if (bricks.length == 0) {victory_sound.play();}
                }
            }
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
    }
    paddle.draw();
    for (let i = 0; i < bricks.length; i++) {
        bricks[i].draw();
    }
    
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].center[1] - balls[i].radius > canvas.height && end == false) {
            if (balls.length == 1) {
                death_sound.play();
                paddle_speed = 8;
                paddle.width = canvas.width / 10;
                paddle.draw();
                balls[0] = new Ball(canvas.width / 2, 3 * canvas.height / 4, 10);
                balls[0].draw();
                just_died = true;
                setTimeout(() => {death_count += 1; window.requestAnimationFrame(draw_all);}, 1000);
            } else {
                balls.splice(i, 1);
            }
        }
    }

    if (just_died != true) {
        window.requestAnimationFrame(draw_all);
    }

    if (bricks.length == 0) {
        end = true;
        for (let i = 0; i < balls.length; i++) {
            balls[i].color = "black";
        }
        context.font = "50px Helvetica";
        context.textAlign = "center";
        context.fillText("Congratulations, you won!", canvas.width / 2, canvas.height / 5);
        context.fillText("Your score was " + score + ".", canvas.width / 2, 2 * canvas.height / 5);
        if (death_count == 1) {context.fillText("You died " + death_count + " time.", canvas.width / 2, 3 * canvas.height / 5);}
        else {context.fillText("You died " + death_count + " times.", canvas.width / 2, 3 * canvas.height / 5);}
        context.fillText("Reload the page to try again!", canvas.width / 2, 4 * canvas.height / 5);
    }

}

context = set_up_context();

balls.push(new Ball(canvas.width / 2, 3 * canvas.height / 4, 10));
paddle = new Paddle(canvas.width / 10, canvas.height / 150);

var bricks = [];
for (let i = 1; i <= bricks_per_row; i++) {
    for (let j = 1; j <= bricks_per_column; j++) {
        brick = new Brick((i - 0.5) * canvas.width / bricks_per_row, canvas.height / 12 + (j - 0.5) * canvas.height / (bricks_per_column * 2.4), canvas.width / bricks_per_row - brick_spacing, canvas.height / (bricks_per_column * 2.4) - brick_spacing);
        bricks.push(brick);
    }
}

window.requestAnimationFrame(draw_all);

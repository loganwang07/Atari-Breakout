const min_start_angle = 25; // 0-45, ensures the ball does not have too steep/shallow a trajectory
const min_game_angle = 20; // 0-45, ensures the ball does not develop too steep/shallow a trajectory
const speed_divisor = 300; // controls the speed of the ball, higher is slower
const randomizer = 1; // controls the random speed increase/decrease after each bounce, suggested less than 10
const speed_changer = 1/32; // controls how much the ball speeds up/slows down after each bounce, suggested less than 1/10
var paddle_speed = 8; // controls the starting speed of the paddle, suggested 8
const brick_colors = ["red", "orange", "yellow", "green", "blue", "purple", "brown"]; // different colors the bricks can be, keep list length 7
const brick_effects = ["increase ball speed", "increase paddle speed", "decrease paddle legnth", "decrease ball speed", "decrease paddle speed", "increase paddle length", "add a ball to play"];
// 1st/4rd entries increase/decrease ball speed, 2nd/5th entries increase/decrease paddle speed, 3rd/6th entries decrease/increase paddle length
// 7th entry is multiball

const bounce_sound = new sound("bounce.mp3");
const death_sound = new sound("death.mp3");
const victory_sound = new sound("victory.mp3");

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

class Brick {

  constructor(x, y, width, height) {
    this.center = [x, y];
    this.width = width;
    this.height = height;
    this.color = brick_colors[Math.floor(Math.random() * brick_colors.length)];
  }

  break(ball) {
    if (ball.center[0] + ball.radius > this.center[0] - this.width / 2 && ball.center[0] - ball.radius < this.center[0] + this.width / 2 && ball.center[1] - ball.radius < this.center[1] + this.height / 2 && ball.center[1] > this.center[1] + this.height / 2 && ball.vel[1] < 0) {
      bounce_sound.play();
      return "bottom";
    } else if (ball.center[0] + ball.radius > this.center[0] - this.width / 2 && ball.center[0] - ball.radius < this.center[0] + this.width / 2 && ball.center[1] + ball.radius > this.center[1] - this.height / 2 && ball.center[1] < this.center[1] - this.height / 2 && ball.vel[1] > 0) {
      bounce_sound.play();
      return "top";
    } else if (ball.center[1] + ball.radius > this.center[1] - this.height / 2 && ball.center[1] - ball.radius < this.center[1] + this.height / 2 && ball.center[0] + ball.radius > this.center[0] - this.width / 2 && ball.center[0] < this.center[0] - this.width / 2 && ball.vel[0] > 0) {
      bounce_sound.play();
      return "left";
    } else if (ball.center[1] + ball.radius > this.center[1] - this.height / 2 && ball.center[1] - ball.radius < this.center[1] + this.height / 2 && ball.center[0] - ball.radius < this.center[0] + this.width / 2 && ball.center[0] > this.center[0] + this.width / 2 && ball.vel[0] < 0) {
      bounce_sound.play();
      return "right";
    } else {
      return "none";
    }
  }

  draw() {
    context.beginPath();
    context.strokeStyle = "white";
    context.fillStyle = this.color;
    context.rect(this.center[0] - this.width / 2, this.center[1] - this.height / 2, this.width, this.height);
    context.fill();
    context.stroke();
  }

}

class Ball {

  constructor(x, y, radius) {
    this.center = [x, y];
    this.radius = radius;
    do {
      var initial_speed = Math.max(canvas.width, canvas.height) / speed_divisor;
      var y_vel = -1 * Math.random() * initial_speed;
      var x_vel = Math.sqrt(initial_speed * initial_speed - y_vel * y_vel);
      if (Math.random() < 0.5) {x_vel *= -1;}
      this.vel = [x_vel, y_vel];
    }
    while (Math.atan(Math.abs(y_vel) / Math.abs(x_vel)) * 180 / Math.PI < min_start_angle || Math.atan(Math.abs(y_vel) / Math.abs(x_vel)) * 180 / Math.PI > 90 - min_start_angle);
    this.color = "#000000";
    this.width = 3;
  }

  move() {
    this.center[0] += this.vel[0];
    this.center[1] += this.vel[1];
  }

  bounce(paddle, end) {
    if (this.center[0] + this.radius > canvas.width) {
      this.center[0] = canvas.width - this.radius;
      this.nudge();
      if (this.vel[0] > 0) {this.vel[0] *= -1; bounce_sound.play();}
    }
    if (this.center[0] - this.radius < 0) {
      this.center[0] = this.radius;
      this.nudge();
      if (this.vel[0] < 0) {this.vel[0] *= -1; bounce_sound.play();}
    }
    if (this.center[1] - this.radius < 0) {
      this.center[1] = this.radius;
      this.nudge();
      if (this.vel[1] < 0) {this.vel[1] *= -1; bounce_sound.play();}
    }
    if (end) {
      if (this.center[1] + this.radius > canvas.height) {
        this.center[1] = canvas.height - this.radius;
        this.nudge();
        if (this.vel[1] > 0) {this.vel[1] *= -1; bounce_sound.play();}
      }
    } else if (this.center[1] + this.radius > paddle.center[1] - paddle.height / 2 && this.center[0] > paddle.center[0] - paddle.width / 2 && this.center[0] < paddle.center[0] + paddle.width / 2) {
      this.center[1] = paddle.center[1] - paddle.height / 2 - this.radius;
      this.accelerate();
      if (this.vel[1] > 0) {this.vel[1] *= -1; bounce_sound.play();}
    }
  }

  nudge() {
    if (Math.atan(Math.abs(this.vel[1]) / Math.abs(this.vel[0])) * 180 / Math.PI < min_game_angle) {
      this.vel[0] += (-0.5 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] += (0.5 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else if (Math.atan(Math.abs(this.vel[1]) / Math.abs(this.vel[0])) * 180 / Math.PI > 90 - min_game_angle) {
      this.vel[0] += (0.5 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] += (-0.5 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else {
      this.vel[0] += randomizer * (Math.random() / 2 - 0.25);
      this.vel[1] += randomizer * (Math.random() / 2 - 0.25);
    }
  }

  accelerate() {
    if (Math.atan(Math.abs(this.vel[1]) / Math.abs(this.vel[0])) * 180 / Math.PI < min_game_angle) {
      this.vel[0] += (-0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] += (0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else if (Math.atan(Math.abs(this.vel[1]) / Math.abs(this.vel[0])) * 180 / Math.PI > 90 - min_game_angle) {
      this.vel[0] += (0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] += (-0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else {
      this.vel[0] += (speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] += (speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[1]) / this.vel[1]);
    }
  }

  decelerate() {
    if (Math.atan(Math.abs(this.vel[1]) / Math.abs(this.vel[0])) * 180 / Math.PI < min_game_angle) {
      this.vel[0] -= (0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] -= (-0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else if (Math.atan(Math.abs(this.vel[1]) / Math.abs(this.vel[0])) * 180 / Math.PI > 90 - min_game_angle) {
      this.vel[0] -= (-0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] -= (0.5 + speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else {
      this.vel[0] -= (speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] -= (speed_changer + randomizer * (Math.random() * speed_changer * 2 - speed_changer)) * (Math.abs(this.vel[1]) / this.vel[1]);
    }
  }

  draw() {
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.lineWidth = this.width;
    context.beginPath();
    context.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI, false);
    context.fill();
    context.stroke();
  }
}

new_vel = 0;
class Paddle {

  constructor(width, height) {
    this.center = [canvas.width / 2, canvas.height - height / 2];
    this.width = width;
    this.height = height;
    this.color = "000000";
    this.vel = 0;
    this.base_speed = paddle_speed;
  }

  key_down(e) {
    if (e.keyCode === 37) {
      new_vel = -1 * paddle_speed;
    }
    else if (e.keyCode === 39) {
      new_vel = paddle_speed;
    }
  }

  key_up(e) {
    if (e.keyCode === 37 || e.keyCode === 39) {
      this.vel = 0;
      new_vel = this.vel;
    }
  }

  move() {
    canvas.addEventListener("keydown", this.key_down);
    canvas.addEventListener("keyup", this.key_up);
    this.vel = new_vel
    this.center[0] += this.vel;
    if (this.center[0] - this.width / 2 > canvas.width) {
      this.center[0] = -1 * this.width / 2;
    } else if (this.center[0] + this.width / 2 < 0) {
      this.center[0] = canvas.width + this.width / 2;
    }
  }

  draw() {
    context.beginPath();
    context.strokeStyle = this.color;
    context.fillStyle = this.color;
    context.rect(this.center[0] - this.width / 2, this.center[1] - this.height / 2, this.width, this.height);
    context.fill();
    context.stroke();
  }
}

function set_up_context() {

  canvas = document.getElementById("mainCanvas");

  canvas.width = window.innerWidth - 22;
  canvas.height = window.innerHeight - 22;
  canvas.style.border = "1px solid black";

  context = canvas.getContext("2d");
  return context;
}

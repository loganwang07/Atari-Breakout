const min_start_angle = 25 // 0-45
const min_game_angle = 25 // 0-45
const speed_divisor = 250 // higher is slower
const randomizer = 0 // suggested less than 10

class Ball {

  constructor(x, y, radius) {
    this.center = [x, y];
    this.radius = radius;
    do {
      var initial_speed = Math.max(canvas.width, canvas.height) / speed_divisor;
      var y_vel = Math.random() * 2 * initial_speed - initial_speed;
      var x_vel = Math.sqrt(initial_speed * initial_speed - y_vel * y_vel);
      this.vel = [x_vel, y_vel];
    }
    while (Math.atan(Math.abs(y_vel) / Math.abs(x_vel)) * 180 / Math.PI < min_start_angle || Math.atan(Math.abs(y_vel) / Math.abs(x_vel)) * 180 / Math.PI > 90 - min_start_angle);
    this.color = "#000000";
    this.width = 3;
  }

  get x() {
    return this.center[0];
  }

  set x(newX) {
    this.center[0] = newX;
  }

  get y() {return this.center[0];}
  set y(newX) {this.center[0] = newX;}

  move() {
    this.center[0] += this.vel[0];
    this.center[1] += this.vel[1];
  }

  bounce(paddle_center, paddle_width) {
    if (this.center[0] + this.radius > canvas.width) {
      this.center[0] = canvas.width - this.radius;
      this.nudge();
      if (this.vel[0] > 0) {this.vel[0] *= -1;}
      console.log(ball);
    }
    if (this.center[0] - this.radius < 0) {
      this.center[0] = this.radius;
      this.nudge();
      if (this.vel[0] < 0) {this.vel[0] *= -1;}
      console.log(ball);
    }
    if (this.center[1] + this.radius > canvas.height && this.center[0] > paddle_center - paddle_width / 2 && this.center < paddle_center + paddle_width / 2) {
      this.center[1] = canvas.height - this.radius;
      this.accelerate();
      if (this.vel[1] > 0) {this.vel[1] *= -1;}
      console.log(ball);
    }
    if (this.center[1] - this.radius < 0) {
      this.center[1] = this.radius;
      this.accelerate();
      if (this.vel[1] < 0) {this.vel[1] *= -1;}
      console.log(ball);
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
      this.vel[0] += (-0.25 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] += (0.75 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else if (Math.atan(Math.abs(this.vel[1]) / Math.abs(this.vel[0])) * 180 / Math.PI > 90 - min_game_angle) {
      this.vel[0] += (0.75 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[0]) / this.vel[0]);
      this.vel[1] += (-0.25 + randomizer * (Math.random() / 2 - 0.25)) * (Math.abs(this.vel[1]) / this.vel[1]);
    } else {
      this.vel[0] += 0.25 + randomizer * (Math.random() / 2 - 0.25);
      this.vel[1] += 0.25 + randomizer * (Math.random() / 2 - 0.25);
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

newVel = 0;

class Paddle {

  constructor(width, height) {
    this.center = [canvas.width / 2, height * 2];
    this.width = width;
    this.height = height;
    this.color = "000000";
    this.vel = 0;
  }

  key_down(e) {
    if (e.keyCode === 37) {
      this.vel = -5;
      newVel = this.vel;
    }
    else if (e.keyCode === 39) {
      this.vel = 5;
      newVel = this.vel;
    }
  }

  key_up(e) {
    if (e.keyCode === 37 || e.keyCode === 39) {
      this.vel = 0;
      newVel = this.vel;
    }
  }

  move() {
    canvas.addEventListener("keydown", this.key_down);
    canvas.addEventListener("keyup", this.key_up);
    this.vel = newVel
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
    context.rect(this.center[0] - this.width / 2, canvas.height - this.center[1] + this.height / 2, this.width, this.height);
    context.fill();
    context.stroke();
  }
}

function setUpContext() {
  // Get width/height of the browser window
  console.log("Window is %d by %d", window.innerWidth, window.innerHeight);

  // Get the canvas, set the width and height from the window
  canvas = document.getElementById("mainCanvas");
  // canvas.addEventListener("keydown", testing)

  // I found that - 20 worked well for me, YMMV
  canvas.width = window.innerWidth - 22;
  canvas.height = window.innerHeight - 22;
  canvas.style.border = "1px solid black";

  // Set up the context for the animation
  context = canvas.getContext("2d");
  return context;
}

function testing(e) {
  if (e.which === 37) {
    paddle.vel[0] = -3;
  }
  else if (e.which === 39) {
    paddle.vel[1] = 3;
  }
}
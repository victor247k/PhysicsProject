  class CanvasAnimation {
      constructor(canvas, startStopButton) {
          this.canvas = canvas;
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerWidth * 9 / 16;
          this.ctx = canvas.getContext("2d");
          this.isAnimating = false;
          this.animationFrame = null;
          this.startStopButton = startStopButton

          this.offset = {
              x: canvas.width / 10,
              y: canvas.height / 1.2
          };

          this.ctx.translate(this.offset.x, this.offset.y);

          this.drawAxis();
          this.startStopButton.addEventListener("click", () => this.toggleAnimation());
      }

      drawAxis() {
          this.ctx.beginPath();
          this.ctx.moveTo(-this.offset.x, 0);
          this.ctx.lineTo(this.canvas.width - this.offset.x, 0);
          this.ctx.moveTo(0, -this.offset.y);
          this.ctx.lineTo(0, this.canvas.height - this.offset.y);
          this.ctx.setLineDash([4, 2]);
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = 'gray';
          this.ctx.stroke();
          this.ctx.setLineDash([]);
      }

      drawFrame() {
          // Clear the canvas
          this.ctx.clearRect(-this.offset.x, -this.offset.y, this.canvas.width, this.canvas.height);

          // Perform your animation drawing here

          if (this.isAnimating) {
              this.animationFrame = requestAnimationFrame(() => this.drawFrame());
          }
      }

      toggleAnimation() {
              this.isAnimating = !this.isAnimating;

              if (this.isAnimating) {
                  this.startStopButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                  this.drawFrame();
              } else {
                  this.startStopButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
                  cancelAnimationFrame(this.animationFrame);
              }
          }
          // Example drawText function
      drawText(text, loc, color = 'white') {
          this.ctx.fillStyle = color;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.font = "bold 12px Ubuntu";
          this.ctx.fillText(text, loc.x, -loc.y);
      }

      // Example drawPoint function
      drawPoint(loc, diameter = 20, color = 'black') {
          this.ctx.fillStyle = color;
          this.ctx.beginPath();
          this.ctx.arc(loc.x, -loc.y, diameter / 2, 0, Math.PI * 2);
          this.ctx.fill();
      }
  }

  // Usage
  const canvas1 = new CanvasAnimation(document.getElementById("firstC"), document.getElementById("first_pause"));
  const canvas2 = new CanvasAnimation(document.getElementById("secondC"), document.getElementById("second_pause"));
  const canvas3 = new CanvasAnimation(document.getElementById("thirdC"), document.getElementById("third_pause"));

  // Example usage for canvas 1
  const A = { x: 100, y: 100 };
  canvas1.drawPoint(A);
  canvas1.drawText("A", A);

  // Example usage for canvas 2
  const B = { x: 200, y: 100 };
  canvas2.drawPoint(B);
  canvas2.drawText("B", B);

  // Example usage for canvas 3
  const C = { x: 100, y: 0 };
  canvas3.drawPoint(C);
  canvas3.drawText("C", C);
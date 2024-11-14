import React, { useEffect, useRef } from 'react';

const HeartRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasW = (canvas.width = window.innerWidth);
    const canvasH = (canvas.height = window.innerHeight);
    const canvasWHalf = canvasW / 2;
    const canvasHHalf = canvasH / 2;
    const xoff = canvasWHalf - 306;
    const yoff = 50;
    const bg = '00061a';
    let id = 0;
    const raindrops = [];
    const minSize = 1;
    const maxSize = 4;
    const minSpeed = 5;
    const maxSpeed = 20;
    const minHue = 0;
    const maxHue = 360;
    const maxAmount = 50;

    function random(min, max) {
      if (arguments.length < 2) {
        max = min;
        min = 0;
      }
      return Math.floor(Math.random() * (max - min) + min);
    }

    function hexToRGB(hex, opacity) {
      let rgb = '';
      hex.match(/.{2}/g).forEach(n => {
        rgb += parseInt(n, 16) + ',';
      });
      return `rgba(${rgb}${opacity})`;
    }

    function draw() {
      ctx.fillStyle = hexToRGB(bg, '0.1');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvasWHalf, 0);
      ctx.lineTo(304 + xoff, 97 + yoff);
      ctx.bezierCurveTo(282 + xoff, -5 + yoff, 80 + xoff, -6 + yoff, 76 + xoff, 165 + yoff);
      ctx.bezierCurveTo(74 + xoff, 251 + yoff, 184 + xoff, 300 + yoff, 304 + xoff, 447 + yoff);
      ctx.lineTo(canvasWHalf, canvasH);
      ctx.lineTo(0, canvasH);

      ctx.moveTo(canvasW, 0);
      ctx.lineTo(canvasWHalf, 0);
      ctx.lineTo(304 + xoff, 97 + yoff);
      ctx.bezierCurveTo(326 + xoff, 5 + yoff, 528 + xoff, 6 + yoff, 532 + xoff, 165 + yoff);
      ctx.bezierCurveTo(534 + xoff, 251 + yoff, 424 + xoff, 300 + yoff, 304 + xoff, 447 + yoff);
      ctx.lineTo(canvasWHalf, canvasH);
      ctx.lineTo(canvasW, canvasH);
      ctx.closePath();
      ctx.fill();

      for (let i = 1; i < id; i++) {
        raindrops[i].fall();
      }
    }

    class Raindrop {
      constructor() {
        id++;
        this.y = random(-canvasH);
        this.x = random(canvasW);
        this.size = random(minSize, maxSize);
        this.speed = random(minSpeed, maxSpeed);
        this.color = `hsl(${random(minHue, maxHue)},100%,55%)`;
        this.origColor = this.color;
        this.id = id;
        raindrops[id] = this;
      }

      fall() {
        this.y += this.speed;
        if (this.y >= canvasH) {
          this.y = random(-canvasH);
          this.x = random(canvasW);
        }
        ctx.save();
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(0.5, this.color);
        gradient.addColorStop(1, hexToRGB(bg, 0));
        ctx.rect(this.x, this.y, this.size, maxSpeed);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }

    function init() {
      ctx.fillStyle = `#${bg}`;
      ctx.fillRect(0, 0, canvasW, canvasH);
      for (let i = 0; i < maxAmount; i++) {
        new Raindrop();
      }
    }

    function animate() {
      draw();
      window.requestAnimationFrame(animate);
    }

    init();
    animate();

    function mouseTrail(x, y) {
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.arc(x, y, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    window.addEventListener('mousemove', cursor => {
      mouseTrail(cursor.x, cursor.y);
    });

  }, []);

  return <canvas ref={canvasRef} />;
};

export default HeartRain;

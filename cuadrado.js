
class Cuadrado {
  constructor(x, y) {

    this.x = x;
    this.y = y;
    this.hue = 0;
    this.sat = 0;
    this.bri = 100;
  }

  dibujar() {
    colorMode(HSB);

    let hueStartLeft = this.hue;
    let hueEndLeft = this.hue + 80;

    let hueStartRight = this.hue + 80;
    let hueEndRight = this.hue;

    let middleX = this.x + this.t / 2;

    for (let i = this.x; i < this.x + this.t; i += 8) {
      let pos = map(i, this.x, this.x + this.t, 0, 1);
      let lerpedHue;

      if (i < middleX) {
        lerpedHue = lerp(hueStartLeft, hueEndLeft, pos);
      } else {
        lerpedHue = lerp(hueStartRight, hueEndRight, pos);
      }

      let lerpedColor;

      if(this.hue == 108) {
        lerpedColor = color(this.hue, this.sat, this.bri);
      }else {
        lerpedColor = color(lerpedHue, this.sat, this.bri);
      }

      
     stroke(lerpedColor);
      strokeWeight(3);
      line(i - this.t / 2, this.y - this.t / 2, i - this.t / 2, this.y + this.t / 2);
    }
  }

  setTamanio(valor_t) {
    this.t = valor_t;
  }

  setColor(valor_h, valor_s, valor_b) {


    this.hue = map(valor_h, 0, 1, 0, 360);

    if(valor_h == 108){
      this.hue = valor_h; 
    }

    this.sat = valor_s;
    this.bri = valor_b;
  }
}
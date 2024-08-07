class Cube extends cgIShape {
  constructor(a) {
    super(), this.makeCube(a);
  }
  makeCube(a) {
    a < 1 && (a = 1);
    var s = -0.5,
      d = -0.5,
      i = 1 / a,
      t = 0;
    for (t = 0; t < a; t++) {
      var h,
        r = t * i;
      for (h = 0; h < a; h++) {
        var n = h * i;
        this.addTriangle(
          s + n,
          d + r,
          0.5,
          s + n + i,
          d + r,
          0.5,
          s + n + i,
          d + r + i,
          0.5
        ),
          this.adduv(n, r, n + i, r, n + i, r + i),
          this.addTriangle(
            s + n + i,
            d + r + i,
            0.5,
            s + n,
            d + r + i,
            0.5,
            s + n,
            d + r,
            0.5
          ),
          this.adduv(n + i, r + i, n, r + i, n, r),
          this.addTriangle(
            s + n,
            d + r,
            -0.5,
            s + n + i,
            d + r + i,
            -0.5,
            s + n + i,
            d + r,
            -0.5
          ),
          this.adduv(n, r, n + i, r + i, n + i, r),
          this.addTriangle(
            s + n,
            d + r,
            -0.5,
            s + n,
            d + r + i,
            -0.5,
            s + n + i,
            d + r + i,
            -0.5
          ),
          this.adduv(n, r, n, r + i, n + i, r + i),
          this.addTriangle(
            -0.5,
            d + r,
            s + n,
            -0.5,
            d + r,
            s + n + i,
            -0.5,
            d + r + i,
            s + n + i
          ),
          this.adduv(n, r, n + i, r, n + i, r + i),
          this.addTriangle(
            -0.5,
            d + r + i,
            s + n + i,
            -0.5,
            d + r + i,
            s + n,
            -0.5,
            d + r,
            s + n
          ),
          this.adduv(n + i, r + i, n, r + i, n, r),
          this.addTriangle(
            0.5,
            d + r,
            s + n + i,
            0.5,
            d + r,
            s + n,
            0.5,
            d + r + i,
            s + n
          ),
          this.adduv(n + i, r, n, r, n, r + i),
          this.addTriangle(
            0.5,
            d + r + i,
            s + n,
            0.5,
            d + r + i,
            s + n + i,
            0.5,
            d + r,
            s + n + i
          ),
          this.adduv(n, r + i, n + i, r + i, n + i, r),
          this.addTriangle(
            s + n,
            0.5,
            d + r + i,
            s + n + i,
            0.5,
            d + r + i,
            s + n,
            0.5,
            d + r
          ),
          this.adduv(n, r + i, n + i, r + i, n, r),
          this.addTriangle(
            s + n,
            0.5,
            d + r,
            s + n + i,
            0.5,
            d + r + i,
            s + n + i,
            0.5,
            d + r
          ),
          this.adduv(n, r, n + i, r + i, n + i, r),
          this.addTriangle(
            s + n,
            -0.5,
            d + r,
            s + n + i,
            -0.5,
            d + r + i,
            s + n,
            -0.5,
            d + r + i
          ),
          this.adduv(n, r, n + i, r + i, n, r + i),
          this.addTriangle(
            s + n,
            -0.5,
            d + r,
            s + n + i,
            -0.5,
            d + r,
            s + n + i,
            -0.5,
            d + r + i
          ),
          this.adduv(n, r, n + i, r, n + i, r + i);
      }
    }
  }
}
class Cylinder extends cgIShape {
  constructor(a, s) {
    super(), this.makeCylinder(a, s);
  }
  makeCylinder(a, s) {
    var d = -0.5;
    a < 3 && (a = 3), s < 1 && (s = 1);
    var i,
      t,
      h = 360 / a,
      r = 1 / s,
      n = 0;
    let e, o, l, M;
    for (i = 0; i < a; i++)
      (e = 0.5 * Math.cos(radians(n))),
        (o = 0.5 * Math.sin(radians(n))),
        (l = 0.5 * Math.cos(radians(n + h))),
        (M = 0.5 * Math.sin(radians(n + h))),
        this.addTriangle(e, d, o, 0, d, 0, l, d, M),
        this.addTriangle(l, 0.5, M, 0, 0.5, 0, e, 0.5, o),
        (n += h);
    for (i = 0; i < s; i++) {
      var c = i * r;
      for (n = 0, t = 0; t < a; t++)
        (e = 0.5 * Math.cos(radians(n))),
          (o = 0.5 * Math.sin(radians(n))),
          (l = 0.5 * Math.cos(radians(n + h))),
          (M = 0.5 * Math.sin(radians(n + h))),
          this.addTriangle(e, d + c, o, l, d + c, M, l, d + c + r, M),
          this.addTriangle(e, d + c, o, l, d + c + r, M, e, d + c + r, o),
          (n += h);
    }
  }
}
class Cone extends cgIShape {
  constructor(a, s) {
    super(), this.makeCone(a, s);
  }
  makeCone(a, s) {
    let d = -0.5;
    a < 3 && (a = 3), s < 1 && (s = 1);
    let i = 360 / a,
      t = 1 / s;
    var h, r;
    for (h = 0; h < s; h++) {
      let s = h * t,
        n = h,
        e = 0;
      for (r = 0; r < a; r++) {
        let a = 0.5 * Math.cos(radians(e)),
          h = 0.5 * Math.sin(radians(e)),
          r = 0.5 * Math.cos(radians(e + i)),
          o = 0.5 * Math.sin(radians(e + i));
        this.addTriangle(a, d, h, 0, d, 0, r, d, o);
        let l = 0.5 * (1 - n * t),
          M = l * Math.cos(radians(e)),
          c = l * Math.sin(radians(e)),
          g = l * Math.cos(radians(e + i)),
          u = l * Math.sin(radians(e + i)),
          v = 0.5 * (1 - (n + 1) * t),
          T = v * Math.cos(radians(e)),
          m = v * Math.sin(radians(e)),
          f = v * Math.cos(radians(e + i)),
          p = v * Math.sin(radians(e + i));
        (l = v),
          this.addTriangle(g, d + s, u, T, d + s + t, m, M, d + s, c),
          this.addTriangle(g, d + s, u, f, d + s + t, p, T, d + s + t, m),
          (e += i);
      }
    }
  }
}
class Sphere extends cgIShape {
  constructor(a, s) {
    super(), this.makeSphere(a, s);
  }
  makeSphere(a, s) {
    let d, i, t, h, r, n, e, o, l, M, c, g, u, v, T;
    a < 3 && (a = 3), s < 3 && (s = 3);
    let m = 6.28 / a,
      f = 3.14 / s,
      p = 1 / a,
      C = 1 / s,
      k = f,
      S = 0,
      x = 0,
      I = 1,
      N = 0,
      b = 0,
      y = Math.sin(f),
      j = Math.cos(f),
      q = 0.5,
      w = 0.5 * j;
    var z, A;
    for (N = 1, A = 0; A < a; A++) {
      b = 0;
      let a = Math.sin(S),
        s = Math.cos(S),
        f = Math.sin(S + m);
      (d = 0),
        (i = 0.5),
        (t = 0),
        (M = 0),
        (c = 0),
        (h = Math.cos(S + m) * y * 0.5),
        (r = w),
        (n = f * y * 0.5),
        (g = N - p),
        (u = b + C),
        (e = s * y * 0.5),
        (o = w),
        (l = a * y * 0.5),
        (v = N),
        (T = b + C),
        this.addTriangle(d, i, t, e, o, l, h, r, n),
        this.addNormal(d, i, t, e, o, l, h, r, n),
        this.adduv(M, c, v, T, g, u),
        (S += m),
        (N -= p);
    }
    for (b = C, z = 1; z < s; z++) {
      for (
        x = Math.sin(k),
          I = Math.cos(k),
          y = Math.sin(k + f),
          q = 0.5 * I,
          w = 0.5 * (j = Math.cos(k + f)),
          S = 0,
          N = 1,
          A = 0;
        A <= a;
        A++
      ) {
        let a = Math.sin(S),
          s = Math.cos(S),
          f = Math.sin(S + m),
          k = Math.cos(S + m);
        (d = s * x * 0.5),
          (i = q),
          (t = a * x * 0.5),
          (M = N),
          (c = b),
          (h = k * x * 0.5),
          (r = q),
          (n = f * x * 0.5),
          (g = N - p),
          (u = b),
          (e = s * y * 0.5),
          (o = w),
          (l = a * y * 0.5),
          (v = N),
          (T = b + C),
          this.addTriangle(e, o, l, h, r, n, d, i, t),
          this.addNormal(e, o, l, h, r, n, d, i, t),
          this.adduv(v, T, g, u, M, c),
          (d = k * x * 0.5),
          (i = q),
          (t = f * x * 0.5),
          (M = N - p),
          (c = b),
          (h = k * y * 0.5),
          (r = w),
          (n = f * y * 0.5),
          (g = N - p),
          (u = b + C),
          (e = s * y * 0.5),
          (o = w),
          (l = a * y * 0.5),
          (v = N),
          (T = b + C),
          this.addTriangle(d, i, t, e, o, l, h, r, n),
          this.addNormal(d, i, t, e, o, l, h, r, n),
          this.adduv(M, c, v, T, g, u),
          (S += m),
          (N -= p);
      }
      (k += f), (b += C);
    }
    for (
      N = 1,
        b = 1,
        S = 0,
        x = Math.sin(k),
        y = 0,
        j = -1,
        q = 0.5 * (I = Math.cos(k)),
        w = -0.5,
        A = 0;
      A < a;
      A++
    ) {
      let a = Math.sin(S),
        s = Math.cos(S),
        f = Math.sin(S + m);
      (d = s * x * 0.5),
        (i = w),
        (t = a * x * 0.5),
        (M = N),
        (c = b),
        (h = Math.cos(S + m) * x * 0.5),
        (r = w),
        (n = f * x * 0.5),
        (g = N - p),
        (u = b),
        (e = 0),
        (o = -0.5),
        (l = 0),
        (v = 1),
        (T = 1),
        this.addTriangle(d, i, t, e, o, l, h, r, n),
        this.addNormal(d, i, t, e, o, l, h, r, n),
        this.adduv(M, c, v, T, g, u),
        (S += m),
        (N -= p);
    }
  }
}
// core/input.js — extraído del build v2.5 (nombres minificados conservados; ver docs/MODULOS.md)

class Nr {
  constructor(t) {
    ((this.canvas = t),
      (this.keys = new Set()),
      (this.edge = new Set()),
      (this.mdx = 0),
      (this.mdy = 0),
      (this.buttons = 0),
      (this.locked = !1),
      (this.enabled = !0),
      (this.handlers = new Map()),
      addEventListener("keydown", (e) => {
        e.target.closest?.("input,textarea,select") ||
          (this.keys.has(e.code) || this.edge.add(e.code),
          this.keys.add(e.code),
          ["Space", "Tab", "F3"].includes(e.code) && e.preventDefault(),
          this.handlers.get(e.code)?.(e));
      }),
      addEventListener("keyup", (e) => this.keys.delete(e.code)),
      addEventListener("blur", () => {
        (this.keys.clear(), (this.buttons = 0));
      }),
      addEventListener("mousemove", (e) => {
        this.locked && ((this.mdx += e.movementX), (this.mdy += e.movementY));
      }),
      t.addEventListener("mousedown", (e) => {
        this.locked &&
          ((this.buttons |= 1 << e.button), this.onMouse?.(e.button, !0));
      }),
      addEventListener("mouseup", (e) => {
        ((this.buttons &= ~(1 << e.button)), this.onMouse?.(e.button, !1));
      }),
      addEventListener("contextmenu", (e) => e.preventDefault()),
      document.addEventListener("pointerlockchange", () => {
        ((this.locked = document.pointerLockElement === t),
          this.onLock?.(this.locked));
      }));
  }
  lock() {
    this.canvas
      .requestPointerLock?.({ unadjustedMovement: !0 })
      ?.catch?.(() => this.canvas.requestPointerLock());
  }
  on(t, e) {
    this.handlers.set(t, e);
  }
  down(t) {
    return this.enabled && this.keys.has(t);
  }
  pressed(t) {
    return this.enabled && this.edge.has(t);
  }
  mouse(t) {
    return this.enabled && (this.buttons & (1 << t)) !== 0;
  }
  consumeMouse(t) {
    return ((t[0] = this.mdx), (t[1] = this.mdy), (this.mdx = this.mdy = 0), t);
  }
  endFrame() {
    this.edge.clear();
  }
}
const rn = [
  "input",
  "jugador",
  "armas",
  "bots/IA",
  "física",
  "balística",
  "partículas",
  "mundo/luces",
  "render submit",
];

export { Nr, rn };

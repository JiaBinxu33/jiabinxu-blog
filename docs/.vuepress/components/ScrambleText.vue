<template>
  <span ref="textEl" class="scramble-text"></span>
</template>

<script>
// 一个小巧的文字打乱效果类
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

export default {
  name: "ScrambleText",
  props: {
    text: {
      type: String,
      required: true,
    },
    phrases: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fx: null,
    };
  },
  mounted() {
    this.fx = new TextScramble(this.$refs.textEl);
    if (this.phrases.length > 0) {
      let counter = 0;
      const next = () => {
        this.fx.setText(this.phrases[counter]).then(() => {
          setTimeout(next, 2000); // 切换间隔
        });
        counter = (counter + 1) % this.phrases.length;
      };
      next();
    } else {
      this.fx.setText(this.text);
    }
  },
};
</script>

<style>
/* 给打乱过程中的随机字符一点样式 */
.scramble-text .dud {
  opacity: 0.4;
}
</style>

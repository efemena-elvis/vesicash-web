<template>
  <div>
    <canvas ref="canvas" :width="size" :height="size"></canvas>
  </div>
</template>

<script>
export default {
  name: "ProgressArc",

  props: {
    circumference: {
      type: Number,
      default: 0,
    },

    size: {
      type: Number,
      default: 55,
    },

    strokeColor: {
      type: String,
      default: "#3AB75D",
    },
  },
  methods: {
    drawArc() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const context = canvas.getContext("2d");

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const radius = Math.min(centerX, centerY) - 5;

      const startAngle = -Math.PI / 2;

      const endAngle = startAngle + (this.circumference / 360) * (2 * Math.PI);

      context.lineWidth = 3;

      context.strokeStyle = this.strokeColor;

      context.beginPath();
      context.arc(centerX, centerY, radius, startAngle, endAngle);
      context.stroke();
    },
  },

  watch: {
    circumference: {
      handler() {
        this.drawArc();
      },
    },
  },

  mounted() {
    this.drawArc();
  },
};
</script>

/**
 * @fileoverview Task mixin
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */

export default {
  data() {
    return {
      defs: '',
      mousePos: {
        x: 0,
        y: 0,
        movementX: 0,
        movementY: 0,
        lastX: 0,
        lastY: 0,
        positiveX: 0,
        positiveY: 0,
        currentX: 0,
        currentY: 0
      }
    };
  },
  computed: {
    /**
     * Get view box
     *
     * @returns {string}
     */
    getViewBox() {
      const task = this.task;
      return `0 0 ${task.width} ${task.height}`;
    },

    /**
     * Get group transform
     *
     * @returns {string}
     */
    getGroupTransform() {
      return `translate(${this.task.x} ${this.task.y})`;
    },

    /**
     * Should we display expander?
     *
     * @returns {boolean}
     */
    displayExpander() {
      const expander = this.root.state.options.chart.expander;
      return expander.display || (expander.displayIfTaskListHidden && !this.root.state.options.taskList.display);
    }
  },
  methods: {
    /**
     * Emit event
     *
     * @param {string} eventName
     * @param {Event} event
     */
    emitEvent(eventName, event) {
      if (this[eventName]) {
        this[eventName](event);
      }

      if (!this.root.state.options.scroll.scrolling) {
        this.root.$emit(`chart-${this.task.type}-${eventName}`, {event, data: this.task});
      }
    },
    touchstart(ev) {
      this.mousedown(ev);
    },
    mousedown(ev) {
      console.log(ev);
      if (typeof ev.touches !== 'undefined') {
        this.mousePos.x = this.mousePos.lastX = ev.touches[0].screenX;
        this.mousePos.y = this.mousePos.lastY = ev.touches[0].screenY;
        this.mousePos.movementX = 0;
        this.mousePos.movementY = 0;
        this.mousePos.currentX = this.task.x;
        this.mousePos.currentY = this.task.y;
      }
      this.root.state.options.scroll.scrolling = false;

      //if(ev.layerX)
      //const isStart = ev.offsetX < 20;
      //const isEnd = (this.task.width - ev.offsetX) < 20;

      //console.log(this.task.width, ev.offsetX);
      //console.log(isStart, isEnd);

      this.task.isScrolling = true;
    },
    mouseup(ev) {
      this.task.isScrolling = false;
      this.task.start = this.root.pixelOffsetXToTime(this.task.x);
    },
    touchend(ev) {
      this.mouseup(ev);
    },
    mouseout(ev) {
      //this.mouseup(ev);
    },
    mousemove(ev) {
      if (!this.task.isScrolling || !this.root.isMoveble(this.task)) {
        return;
      }
      this.root.state.options.scroll.scrolling = false;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      const touch = typeof ev.touches !== 'undefined';
      let movementX, movementY;
      if (touch) {
        const screenX = ev.touches[0].screenX;
        const screenY = ev.touches[0].screenY;
        movementX = this.mousePos.x - screenX;
        movementY = this.mousePos.y - screenY;
        this.mousePos.lastX = screenX;
        this.mousePos.lastY = screenY;
      } else {
        movementX = ev.movementX;
        movementY = ev.movementY;
      }
      //const horizontal = this.$refs.chartScrollContainerHorizontal;
      //const vertical = this.$refs.chartScrollContainerVertical;
      let x = 0,
        y = 0;
      if (touch) {
        x = this.mousePos.currentX - movementX;// * this.root.state.options.scroll.dragXMoveMultiplier;
      } else {
        x = this.task.x + movementX;// * this.root.state.options.scroll.dragXMoveMultiplier;
      }

      this.task.x = x;
      //console.log(this.root.pixelOffsetXToTime(this.task.x));
    },
    touchmove(ev) {
      this.mousemove(ev);
    }
  },
  mounted() {
    document.addEventListener('mouseup', this.mouseup.bind(this));
    document.addEventListener('mousemove', this.mousemove.bind(this));
    document.addEventListener('touchmove', this.mousemove.bind(this));
    document.addEventListener('touchend', this.mouseup.bind(this));
  }
};

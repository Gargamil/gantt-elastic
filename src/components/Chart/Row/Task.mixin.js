/**
 * @fileoverview Task mixin
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
import {console} from "vuedraggable/src/util/helper";

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
        currentY: 0,
        offsetX: 0
      },
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


      //this.root.$emit(`chart-${this.task.type}-${eventName}`, {event, data: this.task});
      if (!this.root.state.options.movingTask) {
        this.root.$emit(`chart-${this.task.type}-${eventName}`, {event, data: this.task});
      }
    },
    touchstart(ev) {
      //return;
      this.mousedown(ev);
    },
    mousedown(ev) {
      //return;
      if (typeof ev.touches !== 'undefined') {
        this.mousePos.x = this.mousePos.lastX = ev.touches[0].screenX;
        this.mousePos.y = this.mousePos.lastY = ev.touches[0].screenY;
        this.mousePos.movementX = 0;
        this.mousePos.movementY = 0;
        this.mousePos.currentX = this.task.x;
        this.mousePos.currentY = this.task.y;
      }

      if (!this.root.isMoveble(this.task)) {
        return;
      }

      this.root.state.options.scroll.scrolling = false;
      this.root.state.options.movingTask = true;
      this.task.isScrolling = true;
      this.offsetX = ev.layerX - this.task.x;
      this.root.state.options.movingData.offset = ev.layerX - this.task.x;
      /*if (+ev.target.dataset.resize) {
        this.task.isResize = true;
      } else {
        this.task.isScrolling = true;
      }*/

    },
    mouseup(ev) {
      //return;
      if (!this.root.state.options.movingTask || !this.task.isScrolling) {
        return;
      }

      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();

      this.root.state.options.movingTask = false;
      this.root.state.options.scroll.scrolling = false;
      this.root.state.options.movingData.offset = 0;

      this.task.isScrolling = false;
      this.task.isResize = false;
      const oldTime = new Date(this.task.start);

      const pixelToCaclulateTime = this.task.fullDay ? this.task.x + (this.task.width / 2) : this.task.x;
      const time = Math.round((this.root.pixelOffsetXToTime(pixelToCaclulateTime)));
      const newTime = new Date(time);

      if (!this.task.changedX) {
        return; // no change
      }

      this.task.start = newTime;

      if (this.task.fullDay) {
        this.task.start.setHours(0, 0, 0, 0);
        this.task.end = new Date(this.task.start);
        this.task.end.setHours(23, 59, 59, 59);
      } else {
        this.task.end = new Date(+this.task.start + this.task.duration);
      }

      this.task.end = this.task.end.toISOString()
      const newx = this.root.timeToPixelOffsetX(this.task.start);
      this.task.start = newTime.toISOString()

      if (this.task.changedX) {
        this.task.x = newx;
        this.task.changedX = true;
        this.root.$emit(`task-changed-start`, this.task);
      } else {
        this.task.changedX = false;
      }
    },
    touchend(ev) {
      //this.mouseup(ev);
    },
    mouseout(ev) {

      if (
        (!this.task.isScrolling && !this.task.isResize) ||
        !this.root.isMoveble(this.task) ||
        !this.root.state.options.movingTask
      ) {
        return;
      }

      this.root.state.options.scroll.scrolling = false;

      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();

      this.offsetX = this.root.state.options.movingData.offset;//ev.layerX - this.task.x;
    },
    mousemove(ev) {
      if (
        (!this.task.isScrolling) ||
        !this.root.isMoveble(this.task) ||
        !this.root.state.options.movingTask
      ) {
        return;
      }

      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();

      this.offsetX = this.root.state.options.movingData.offset;
      const newx = ev.layerX - (this.offsetX | 0);

      if (Math.abs(newx - this.task.x) >= 1) {
        this.task.x = newx;
        this.task.changedX = true;
      }

      //console.log(`taskx: ${this.task.x}, offsetx: ${this.offsetX}`)
      //console.log(ev);
      return ev;
      //ev.preventDefault();
      //ev.stopImmediatePropagation();
      //ev.stopPropagation();
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

      //console.log(movementX);
      //console.log(this.mousePos)
      const horizontal = this.$refs.chartScrollContainerHorizontal;

      let x = 0,
        y = 0;
      if (touch) {
        x = this.mousePos.currentX - movementX;// * this.root.state.options.scroll.dragXMoveMultiplier;
      } else {
        x = this.task.x + movementX;
      }

      if (this.task.isResize) {
        this.task.duration += parseInt((movementX) * (this.root.state.options.times.timePerPixel) - this.root.style['grid-line-vertical']['stroke-width']);
      } else {
        this.task.x = x;
      }
    },
    touchmove(ev) {
      //return;
      this.mousemove(ev);
    }
  },
  created() {
    document.addEventListener('mouseup', this.mouseup.bind(this));
    document.addEventListener('mousemove', this.mousemove.bind(this));
    document.addEventListener('touchmove', this.mousemove.bind(this));
    document.addEventListener('touchend', this.mouseup.bind(this));
  }
};

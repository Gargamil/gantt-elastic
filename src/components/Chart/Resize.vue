<!--
/**
 * @fileoverview Text component
 * @license MIT
 * @author Rafal Pospiech <neuronet.io@gmail.com>
 * @package GanttElastic
 */
-->
<template>
  <svg
    @mousedown="$emit('mousedown',$event)"
    @mousemove="$emit('mousemove',$event);"
    @mouseup="$emit('mouseup',$event);"
    @mouseover="$emit('mouseover',$event)"
    class="resize-container"
    :x="start?task.x: (task.x+task.width-getWidth)"
    :y="task.y"

  >
    <circle
      data-resize="1"
      :data-isdirectionstart="start?1:0"
      style="cursor: ew-resize;" cx="6" :cy="getHeight/2" r="6" stroke="black" stroke-width="0.2" fill="white"/>
  </svg>
</template>

<style>


.resize-container {
  opacity: 0;
}

.resize-container:hover {
  opacity: 1;
  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
}

.gantt-schedule-timeline-calendar__chart-timeline-items-row-item-resizer {
  touch-action: none;
  width: 20px;
  height: 100%;
  background: rgba(255, 255, 255, 0);
  cursor: ew-resize;
  flex-shrink: 0;
  will-change: visibility;

  -webkit-box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);
  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);


}
</style>

<script>
export default {
  name: 'ChartResizeTask',
  inject: ['root'],
  props: ['task', 'start'],
  data() {
    return {};
  },
  computed: {
    /**
     * Get width
     *
     * @returns {number}
     */
    getWidth() {
      return 10;
    },

    /**
     * Get height
     *
     * @returns {number}
     */
    getHeight() {
      return this.task.height;
    },

    /**
     * Get content style
     *
     * @returns {object}
     */
    contentStyle() {
      return {height: '100%', 'line-height': this.getHeight + 'px'};
    },

    /**
     * Should we render text as html?
     *
     * @returns {boolean}
     */
    html() {
      const cols = this.root.state.options.taskList.columns;
      for (let i = 0, len = cols.length; i < len; i++) {
        const col = cols[i];
        if (col.value === 'label' && typeof col.html !== 'undefined' && col.html) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>

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
    class=""
    :x="task.x+task.width-getWidth"
    :y="task.y"
    :width="getWidth"
    :height="getHeight"
  >
    <foreignObject x="0" y="0" width="100%" :height="getHeight">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        :style="{height:'100%'}"
      >
        <div data-resize="1" ref="resizer"
             class="gantt-schedule-timeline-calendar__chart-timeline-items-row-item-resizer"
             style="visibility: visible;"></div>
      </div>

    </foreignObject>
  </svg>
</template>

<style>
  .gantt-schedule-timeline-calendar__chart-timeline-items-row-item-resizer {
    touch-action: none;
    width: 20px;
    height: 100%;
    background: rgba(255, 255, 255, 0);
    cursor: ew-resize;
    flex-shrink: 0;
    will-change: visibility;
  }
</style>

<script>
  export default {
    name: 'ChartResizeTask',
    inject: ['root'],
    props: ['task', ''],
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
        return 20;
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

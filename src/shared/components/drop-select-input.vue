<template>
  <div class="drop-select-input w-100 h-auto">
    <!-- SELECT INPUT  -->
    <div
      class="select-input form-control"
      ref="selectInput"
      @click="toggleView"
      v-on-clickaway="determineTargetArea"
      :class="option_select ? 'active-select-input' : null"
    >
      <!-- SELECTIONS -->
      <div class="multi-selections-wrapper" v-if="validSelection">
        <div
          class="selection-tag"
          v-for="(option, index) in getMultiSelectedOptions"
          :key="option.id + index"
          @click.stop
        >
          <div class="tertiary-2-text">{{ option.name }}</div>
          <div
            class="icon icon-close"
            @click.stop="makeMultiSelection(option.id)"
          ></div>
        </div>
      </div>

      <div class="selections" v-else-if="selected_value">
        <div class="select-text grey-900 tertiary-2-text text-capitalize">
          <span v-html="selected_value"></span>
        </div>
      </div>

      <!-- PLACEHOLDER TEXT -->
      <div class="placeholder-text" v-else>{{ placeholder }}</div>

      <!-- DROPDOWN BUTTON -->
      <div class="icon icon-caret-fill-down grey-500"></div>
    </div>

    <!-- BOTTOM OPTIONS -->
    <div
      class="drop-option-wrapper w-100 mgt-7 smooth-animation"
      v-if="option_select"
    >
      <div class="inner-wrapper rounded-8">
        <!-- SEARCH BAR -->
        <div class="search-bar mgb-4 mgt-10" v-if="allow_search">
          <input
            type="text"
            class="form-control ignore"
            placeholder="Search"
            v-model="search_value"
            @input="$emit('searchItem', search_value)"
          />
          <div class="icon icon-search grey-600 index-999"></div>
        </div>

        <!-- OPTIONS -->
        <template v-if="options.length && !multi">
          <div class="option-scroll-wrapper">
            <div
              class="option-row"
              v-for="(option, index) in options"
              :key="index"
              @click="makeSelection(index)"
            >
              <div
                class="inner-lining wt-100"
                :class="index + 1 === options.length && 'no-bottom-border'"
              >
                <span v-html="option.name"></span>
              </div>
            </div>
          </div>
        </template>

        <!-- OPTIONS -->
        <template v-else-if="getInputOptions.length && multi">
          <div class="option-scroll-wrapper">
            <div
              class="option-row"
              v-for="(option, index) in getInputOptions"
              :key="index"
              @click.stop="makeMultiSelection(option.id)"
            >
              <div
                class="inner-lining wt-100"
                :class="index + 1 === options.length && 'no-bottom-border'"
              >
                <input
                  type="checkbox"
                  class="mgr-10"
                  :checked="option.selected"
                />
                <span v-html="option.name"></span>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="no-options text-center">No options available</div>
        </template>
      </div>

      <div class="mgb-4 invisible">Hidden state</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropSelectInput",

  props: {
    options: {
      type: Array,
      default: () => [
        {
          id: 1,
          name: "Option 1",
        },
      ],
    },

    multi_options: {
      type: Array,
      default: () => [
        {
          id: 1,
          name: "Option 1",
        },
      ],
    },

    multi: {
      type: Boolean,
      default: false,
    },

    pre_select: {
      type: Object,
      default: () => {},
    },
    placeholder: {
      type: String,
      default: "Select One",
    },
    allow_search: {
      type: Boolean,
      default: false,
    },
    clear_selection: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    getInputOptions() {
      return this.allow_search
        ? [...this.input_options].filter((option) =>
            option.name
              ?.toLowerCase()
              ?.includes(this.search_value?.toLowerCase())
          )
        : [...this.input_options];
    },

    getMultiSelectedOptions() {
      return [...this.input_options]?.filter((option) => option.selected);
    },

    validSelection() {
      return [...this.input_options]?.some((option) => option.selected);
    },
  },

  data() {
    return {
      option_select: false,
      selected_value: null,
      search_value: null,
      input_options: [],
    };
  },

  filters: {
    getSelection(value, options) {
      if (typeof value === "number")
        return options?.find((option) => option?.id === value)?.name ?? value;
      else return value;
    },
  },

  watch: {
    multi_options: {
      handler(options) {
        this.input_options = [...options];
      },
      immediate: true,
    },

    clear_selection: {
      handler(value) {
        if (value) this.selected_value = null;
      },
    },

    pre_select: {
      handler(value = {}) {
        if (value !== null) {
          if (Object.keys(value).length)
            this.selected_value = value?.name || value?.id;
          else this.selected_value = null;
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    toggleView() {
      this.option_select = !this.option_select;
    },

    forceClose() {
      this.option_select = false;
    },

    determineTargetArea($event) {
      if (!$event.target.classList.contains("ignore")) this.forceClose();
    },

    makeSelection(index) {
      this.selected_value = this.options[index].name;
      this.$emit("selectedOption", this.options[index].id);
      this.$emit("optionSelected", this.options[index]);
      this.forceClose();
    },

    makeMultiSelection(id) {
      this.input_options = this.input_options?.map((option) => {
        if (option.id === id) option.selected = !option.selected;
        return option;
      });

      this.$emit("multiSelected", this.input_options);
    },
  },
};
</script>

<style lang="scss" scoped>
.drop-select-input {
  position: relative;

  .select-input {
    @include transition(0.3s);
    cursor: pointer;
    height: auto;
    max-height: auto;

    .placeholder-text {
      @include generate-font-type("tertiary-2");
      color: getColor("grey-300");
    }

    .multi-selections-wrapper {
      @include flex-row-start-nowrap;
      gap: 0 toRem(15);
      max-width: calc(100% - 20px);
      padding-right: toRem(30);
      overflow-x: auto;
      &::-webkit-scrollbar {
        height: 0;
      }

      .selection-tag {
        @include flex-row-start-nowrap;
        border-radius: toRem(20);
        background: getColor("neutral-10");
        padding: 6px 12px 6px 16px;
        border: 1px solid getColor("grey-300");
        transition: all ease-in-out 0.25s;

        &:hover {
          background: getColor("grey-10");
          border: 0.02px solid getColor("grey-200");
        }

        .icon {
          @include draw-shape(22);
          @include flex-column-center;
          border-radius: 50%;
          background: transparent;
          margin-left: toRem(20);
          font-weight: 600;
          color: getColor("grey-500");
          transition: background ease-in-out 0.25s;
          &:hover {
            background: getColor("red-50");
          }
        }
      }
    }

    .selections {
      padding: toRem(2.625) 0;
      @include flex-row-start-wrap;

      .select-text {
        @include font-height(14, 15);
        text-align: left;
      }
    }

    .icon-caret-fill-down {
      @include center-placement("y-axis");
      font-size: toRem(24);
      margin-top: toRem(1);
      right: toRem(8);
    }
  }

  .active-select-input {
    box-shadow: none;
    border-color: getColor("green-500");
    background: getColor("neutral-10");
  }
}
</style>

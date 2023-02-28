<template>
  <div>
    <div class="select-box">
      <el-select v-model="currentYear" size="small" style="width: 120px; margin-right: 10px" @change="handleChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>

      <el-select v-model="currentMonth" size="small" style="width: 120px;" @change="handleChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <el-calendar v-model="currentDate">
      <template #dateCell="{ date, data }">
        <div class="date-content">
          <span class="text">{{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(value) {
      const day = value.split('-')[2] // 11, 02
      return day.startsWith('0') ? day.slice(1) : day
    }
  },
  props: {
    startDate: {
      type: Date,
      default: () => {
        return new Date()
      }
    }
  },
  data() {
    return {
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null
    }
  },
  computed: {
    yearList() {
      return Array.from(new Array(11), (item, i) => i + this.currentYear - 5)
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear() // 当前年份
    this.currentMonth = this.startDate.getMonth() + 1 // 当前月份
    this.handleChange()
  },
  methods: {
    handleChange() {
      this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-01`)
    },
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}
</style>

<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-calendar-day {
  height: auto;
}

::v-deep .el-calendar-table__row td::v-deep .el-calendar-table tr td:first-child,
::v-deep .el-calendar-table__row td.prev {
  border: none;
}

.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}

.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}

.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;

}

::v-deep .el-calendar-table td.is-selected .text {
  background: #409eff;
  color: #fff;
  border-radius: 50%;
}

::v-deep .el-calendar__header {
  display: none
}
</style>

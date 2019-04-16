export default function (seriesItem, marks) {
  Object.keys(marks).forEach((key) => {
    if (marks[key]) seriesItem[key] = marks[key]
  })
} //把有值的属性（不是null,false,空字符串,undefined）

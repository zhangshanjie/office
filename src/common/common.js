// 公共文件是common
export default {
    // 列表选中下载 excelData导出的数据,tHeader字段名称,filterVal字段
      downloadExcel(excelData,tHeader,filterVal,name) { 
          console.log(excelData)
        require.ensure([], () => {
          let { export_json_to_excel } = require("../excel/Export2Excel");
          let data = excelData.map(v => filterVal.map(j => v[j]));
          // 这是表格的名称。合同列表+当前日期，dateFormatStr是一个方法，格式化了日期
          let excelName=name;
          export_json_to_excel(tHeader, data, excelName); // 导出的表格名称，根据需要自己命名
        });
      }
    }
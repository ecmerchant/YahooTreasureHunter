// create table for ASIN

var maxRownum = 9600;
var mydata = [];
var colOption = [];
var cheaders = ["出品","アマゾン","ヤフオク","販売価格","見込利益","仕入価格","モノレート","商品URL","商品タイトル","ASIN","中古最安値","新品最安値","型番","販売手数料[%]","⇒","検索URL","検索キー","最高落札価格","平均落札価格",""];

for(var q = 0; q < 20; q++){
  cheaders.push("候補" + String(q+1));
  cheaders.push("URL" + String(q+1));
  cheaders.push("画像" + String(q+1));
  cheaders.push("商品名" + String(q+1));
  cheaders.push("ヤフオクID" + String(q+1));
  cheaders.push("現在価格" + String(q+1));
  cheaders.push("即決価格" + String(q+1));
  cheaders.push("入札件数" + String(q+1));
  cheaders.push("残り時間" + String(q+1));
  cheaders.push("商品状態" + String(q+1));
  cheaders.push("出品者" + String(q+1));
}

var maxColnum = cheaders.length;
var colWidth = [];
var col2 = [];

for(var i = 0; i < maxRownum; i++){
  mydata[i] = [];
  for(var j = 0; j < maxColnum; j++){
    mydata[i][j] = "";
    if(j == 0 || ((j > 11) && ((j-9) % 11 == 0))){
      mydata[i][j] = false;
    }
  }
  mydata[i][14] = "⇒";
}

for(var i = 0; i < maxColnum; i++){
  colOption[i] = {className: 'htCenter htMiddle'};
  colWidth[i] = 55;
  col2[i] = 55;
  if(i == 0 || ((i > 11) && ((i-9) % 11 == 0))){
    colOption[i] = {type: 'checkbox', className: 'htCenter htMiddle'};
    colWidth[i] = 30;
    col2[i] = 30;
  }

  if(i == 1 || i == 2 || i == 6 || i == 7 || i == 15 || ((i > 11) && ((i-21) % 11 == 0) || ((i-21) % 11 == 1)) ){
    colOption[i] = {renderer: 'html', className: 'htCenter htMiddle'};
    if((i > 11) && ((i-21) % 11 == 1)){
      colWidth[i] = 80;
      col2[i] = 80;
    }


  }

}
colWidth[1] = 80;
colWidth[2] = 80;
colWidth[14] = 20;
colWidth[19] = 5;

col2[1] = 80;
col2[2] = 80;
col2[14] = 20;
col2[19] = 5;

col2[6] = 1;
col2[7] = 1;
col2[8] = 1;
col2[9] = 1;
col2[12] = 1;
col2[13] = 1;
col2[14] = 1;
col2[15] = 1;
col2[16] = 1;

var container = document.getElementById('result');
var handsontable = new Handsontable(container, {
  /* オプション */
  width: 1160,
  height: 320,
  contextMenu: true,
  data: mydata,
  wordWrap: false,
  rowHeaders: true,
  colHeaders: cheaders,
  maxCols: maxColnum,
  maxRows: maxRownum,
  columnSorting: true,
  sortIndicator: true,
  fixedColumnsLeft: 7,
  manualColumnResize: true,
  autoColumnSize: false,
  colWidths: colWidth,
  rowHeights:70,
  className: "htMiddle",
  columns: colOption
});

$("#hide").click(function () {
  if(document.getElementById("hide").innerText == "非表示"){
    document.getElementById("hide").innerText = "表示";
    document.getElementById("hide").className = "btn btn-warning";
    handsontable.updateSettings({
      colWidths:col2,
      fixedColumnsLeft: 20
    });
    handsontable.render();
  }else{
    document.getElementById("hide").innerText = "非表示";
    document.getElementById("hide").className = "btn btn-primary";
    handsontable.updateSettings({
      colWidths:colWidth,
      fixedColumnsLeft: 7
    });
    handsontable.render();
  }
});

$("#submit_url").click(function () {
  Handsontable.hooks.destroy(handsontable);

  Handsontable.hooks.add('afterSelectionEnd', function() {
    var data = handsontable.getValue();
    var res = [];
    res[0] = [];
    res[0][0] = data;
    selected_handsontable.loadData(res);
    selected_handsontable.render();
  }, handsontable);

  if(document.getElementById("submit_url").innerText == "アマゾン取得"){
    alert("アマゾンの情報取得を開始します");
    var url = document.getElementById("input_url").value;
    var pgnum = 1;
    var cnum = 0;
    document.getElementById("submit_url").innerText = "中断";
    document.getElementById("submit_url").className = "btn btn-warning";
    document.getElementById("progress").value = "continue";
    repajax(url,pgnum,cnum);
  }else{
    document.getElementById("submit_url").innerText = "アマゾン取得";
    document.getElementById("submit_url").className = "btn btn-primary";
    document.getElementById("progress").value = "cancel";
  }
});

function repajax(url,pgnum,cnum){

  var maxnum = document.getElementById("maxnumber").value
  var itype = document.getElementById("input_type").value
  if(maxnum == ""){
    maxnum = 9600;
  }
  maxnum = Number(maxnum);

  var tempData_asin1 = handsontable_asin.getData();
  var tempData_asin2 = handsontable_ng_asin.getData();
  tempData_asin1 = Array.prototype.concat.apply([],tempData_asin1);
  tempData_asin2 = Array.prototype.concat.apply([],tempData_asin2);
  if(itype == "2"){
    maxnum = Number(tempData_asin1.length);
  }

  var judge = gon.trial;

  if(judge){
    alert("試用アカウントのため20件までの取得に制限されます");
    maxnum = 20;
  }

  var body = [];
  body[0] = url;
  body[1] = pgnum;
  body[2] = maxnum;
  body[3] = cnum;
  body[4] = itype;
  body[5] = tempData_asin1;
  body[6] = tempData_asin2;

  body = JSON.stringify(body);

  myData = {data: body};

  if(document.getElementById("progress").value == "cancel"){
    alert("中断します")
    return;
  }

  $.ajax({
    url: "/items/search",
    type: "POST",
    data: myData,
    dataType: 'json',
    success: function (resData) {
      if(resData == ""){
        alert("終了しました");
        document.getElementById("submit_url").innerText = "アマゾン取得";
        document.getElementById("submit_url").className = "btn btn-primary";
        return;
      }
      var org_data = handsontable.getData();
      for(var i = 0; i < org_data.length; i++){
        if(org_data[i][9] == ""){
          org_data.length = i;
          break;
        }
      }

      var ddnum = org_data.length;

      Array.prototype.push.apply(org_data, resData);
      if(org_data.length >= maxnum){
        org_data.length = maxnum;
        handsontable.loadData(org_data);
        alert("終了しました");
        document.getElementById("submit_url").innerText = "アマゾン取得";
        document.getElementById("submit_url").className = "btn btn-primary";
        return;
      }else{
        handsontable.loadData(org_data);
        pgnum++;
        sleep(500,repajax(url,pgnum,cnum));
      }

    },
    error: function (resData) {
      alert("終了");
      document.getElementById("submit_url").innerText = "アマゾン取得";
      document.getElementById("submit_url").className = "btn btn-primary";
      return false;
    }
  });
}


$("#connet_yahoo").click(function () {
  Handsontable.hooks.destroy(handsontable);
  Handsontable.hooks.add('afterSelectionEnd', function() {
    var data = handsontable.getValue();
    var res = [];
    res[0] = [];
    res[0][0] = data;
    selected_handsontable.loadData(res);
    selected_handsontable.render();
  }, handsontable);

  if(document.getElementById("connet_yahoo").innerText == "ヤフオク取得"){
    alert("ヤフオクから情報を取得します");
    document.getElementById("connet_yahoo").innerText = "中断";
    document.getElementById("connet_yahoo").className = "btn btn-warning";
    document.getElementById("progress").value = "continue";
    var rownum = 0;
    ConnectYahoo(rownum);
  }else{
    document.getElementById("connet_yahoo").innerText = "ヤフオク取得";
    document.getElementById("connet_yahoo").className = "btn btn-primary";
    document.getElementById("progress").value = "cancel";
  }
});


function ConnectYahoo(rownum){

  var sr = rownum;
  var orgData = handsontable.getData();
  var qtype = document.getElementById("qtype").value;
  var query = {title: orgData[rownum][8], mpn: orgData[rownum][12], qtype: qtype};

  var myData = {data: query};

  if(document.getElementById("progress").value == "cancel"){
    alert("中断します");
    Handsontable.hooks.add('afterChange', function() {
      console.log(arguments);
      var res = arguments[0][0];

      var row = res[0];
      var col = res[1];
      var bf = res[2];
      var af = res[3];
      if(((col > 11) && ((col - 9) % 11 == 0))){
        if(af == true){
          var na = [];
          var sp = 0;
          var pf = 0;
          var by = 0;

          var d = handsontable.getDataAtRow(row);
          var cp = d[col + 5];
          var bp = d[col + 6];
          var f = d[13]/100;
          sp = d[10];


          if(bp != 0){
            by = bp;
          }else{
            by = cp;
          }
          pf = Math.round(sp * (1-f) - by);
          na[0] = [];
          na[0][0] = row;
          na[0][1] = 3;
          na[0][2] = sp;
          na[1] = [];
          na[1][0] = row;
          na[1][1] = 4;
          na[1][2] = pf;
          na[2] = [];
          na[2][0] = row;
          na[2][1] = 5;
          na[2][2] = by;
          na[3] = [];
          na[3][0] = row;
          na[3][1] = 2;
          na[3][2] = d[col+2];

          var q = 0;
          for(var p = 0; p < 20; p++){
            if((20 + p*11) != col){
              na[q+4] = [];
              na[q+4][0] = row;
              na[q+4][1] = 20 + p*11;
              na[q+4][2] = false;
              q++;
            }
          }
          handsontable.setDataAtCell(na);
        }else{
          var na = [];
          na[0] = [];
          na[0][0] = row;
          na[0][1] = 3;
          na[0][2] = "";
          na[1] = [];
          na[1][0] = row;
          na[1][1] = 4;
          na[1][2] = "";
          na[2] = [];
          na[2][0] = row;
          na[2][1] = 5;
          na[2][2] = "";
          na[3] = [];
          na[3][0] = row;
          na[3][1] = 2;
          na[3][2] = "";
          var q = 0;
          for(var p = 0; p < 20; p++){
            if((20 + p*11) != col){
              na[q+4] = [];
              na[q+4][0] = row;
              na[q+4][1] = 20 + p*11;
              na[q+4][2] = false;
              q++;
            }
          }
          handsontable.setDataAtCell(na);
        }
      }
      handsontable.render();
    }, handsontable);
    return;
  }

  $.ajax({
    url: "/items/connect",
    type: "POST",
    data: myData,
    dataType: 'json',
    success: function (resData) {

      var nData = [];
      var rData = handsontable.getData();
      var usedprice = Number(rData[rownum][10]);
      var newprice = Number(rData[rownum][11]);

      var amafee = rData[rownum][13];
      var sprice = usedprice - 10;
      var bp = resData[10];　//仕入価格は即決価格を優先
      if(bp == 0){
        bp = resData[9];
      }
      var profit = Math.round(sprice * (100 - amafee) / 100) - bp;
      nData[0] = [rownum,3,resData[0]];
      for(var j = 1; j < resData.length; j++){
        nData[j] = [rownum,14+j,resData[j]];
      }
      //販売不可商品の条件：販売価格がマイナス、仕入価格が0、アマゾンの中古価格＞新品価格、
      if(sprice < 0 || bp == 0 || usedprice > newprice ){
        sprice = 0;
        profit = 0;
      }
      /*
      nData[j] = [rownum,3,String(sprice)];
      nData[j+1] = [rownum,4,String(profit)];
      nData[j+2] = [rownum,5,String(bp)];
      */
      handsontable.setDataAtCell(nData);

      sr++;
      var lp = handsontable.getData().length;

      if(sr < lp){
        sleep(500,ConnectYahoo(sr));
      }else{
        alert("終了しました");
        document.getElementById("connet_yahoo").innerText = "ヤフオク取得";
        document.getElementById("connet_yahoo").className = "btn btn-primary";
        document.getElementById("progress").value = "cancel";

        ////
        Handsontable.hooks.add('afterChange', function() {

          var res = arguments[0][0];

          var row = res[0];
          var col = res[1];
          var bf = res[2];
          var af = res[3];
          if(((col > 11) && ((col - 9) % 11 == 0))){
            if(af == true){
              var na = [];
              var sp = 0;
              var pf = 0;
              var by = 0;

              var d = handsontable.getDataAtRow(row);
              var cp = d[col + 5];
              var bp = d[col + 6];
              var f = d[13]/100;
              sp = d[10];

              if(bp != 0){
                by = bp;
              }else{
                by = cp;
              }

              pf = Math.round(sp * (1-f) - by);
              na[0] = [];
              na[0][0] = row;
              na[0][1] = 3;
              na[0][2] = sp;
              na[1] = [];
              na[1][0] = row;
              na[1][1] = 4;
              na[1][2] = pf;
              na[2] = [];
              na[2][0] = row;
              na[2][1] = 5;
              na[2][2] = by;
              na[3] = [];
              na[3][0] = row;
              na[3][1] = 2;
              na[3][2] = d[col+2];
              console.log(d[col+2]);

              var q = 0;
              for(var p = 0; p < 20; p++){
                if((20 + p*11) != col){
                  na[q+4] = [];
                  na[q+4][0] = row;
                  na[q+4][1] = 20 + p*11;
                  na[q+4][2] = false;
                  q++;
                }
              }
              handsontable.setDataAtCell(na);
            }else{
              var na = [];
              na[0] = [];
              na[0][0] = row;
              na[0][1] = 3;
              na[0][2] = "";
              na[1] = [];
              na[1][0] = row;
              na[1][1] = 4;
              na[1][2] = "";
              na[2] = [];
              na[2][0] = row;
              na[2][1] = 5;
              na[2][2] = "";
              na[3] = [];
              na[3][0] = row;
              na[3][1] = 2;
              na[3][2] = "";
              var q = 0;
              for(var p = 0; p < 20; p++){
                if((20 + p*11) != col){
                  na[q+4] = [];
                  na[q+4][0] = row;
                  na[q+4][1] = 20 + p*11;
                  na[q+4][2] = false;
                  q++;
                }
              }
              handsontable.setDataAtCell(na);
            }
          }
          handsontable.render();
        }, handsontable);

        ///

      }
    },
    error: function (resData) {
      return false;
    }
  });
}

//更新ボタン
$("#reload_yahoo").click(function () {

  if(document.getElementById("reload_yahoo").innerText == "データの更新"){
    alert("ヤフオクから情報を再取得します");
    document.getElementById("reload_yahoo").innerText = "中断";
    document.getElementById("reload_yahoo").className = "btn btn-warning";
    document.getElementById("progress").value = "continue";
    var rownum = 0;
    ReloadYahoo(rownum);
  }else{
    document.getElementById("reload_yahoo").innerText = "データの更新";
    document.getElementById("reload_yahoo").className = "btn btn-primary";
    document.getElementById("progress").value = "cancel";
  }
});


function ReloadYahoo(rownum){

  var orgData = handsontable.getData();
  while(orgData[rownum][1] == false){
    rownum++;
    if(rownum > orgData.length-1){
      alert("終了しました");
      document.getElementById("reload_yahoo").innerText = "データの更新";
      document.getElementById("reload_yahoo").className = "btn btn-primary";
      document.getElementById("progress").value = "cancel";
      return;
    }
  }

  var query = {url: orgData[rownum][20]};
  var myData = {data: query};

  if(document.getElementById("progress").value == "cancel"){
    alert("中断します")
    return;
  }

  $.ajax({
    url: "/items/reload",
    type: "POST",
    data: myData,
    dataType: 'json',
    success: function (resData) {

      var nData = [];
      var rData = handsontable.getData();
      var usedprice = Number(rData[rownum][10]);
      var newprice = Number(rData[rownum][11]);

      var amafee = rData[rownum][13];
      var sprice = usedprice - 10;
      var bp = resData[3];
      if(bp == 0){
        bp = resData[2];
      }
      var profit = Math.round(sprice * (100 - amafee) / 100) - bp;
      nData[0] = [rownum,3,resData[0]];

      for(var j = 1; j < resData.length; j++){
        nData[j] = [rownum,19+j,resData[j]];
      }

      if(sprice < 0 || bp == 0 || usedprice > newprice || sprice < resData[2] || sprice < resData[3]){
        sprice = 0;
        profit = 0;
      }

      nData[j] = [rownum,3,String(sprice)];
      nData[j+1] = [rownum,4,String(profit)];
      nData[j+2] = [rownum,5,String(bp)];
      handsontable.setDataAtCell(nData);

      rownum++;
      if(rownum < rData.length-1){
        sleep(500,ReloadYahoo(rownum));
      }else{
        alert("終了しました");
        return;
      }
    },
    error: function (resData) {
      alert("error");
      return false;
    }
  });
}

//ここまで

$("#output").click(function () {
  var tempData = handsontable.getData();
  var csvdata = "";

  for(var k = 0; k < tempData.length; k++){
    csvdata = csvdata + tempData[k][0] + "\n";
  }

  var str_array = Encoding.stringToCode(csvdata);
  var uint8_array = new Uint8Array(str_array);

  var blob = new Blob([uint8_array], { "type" : "text/tsv" });

  if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, "list.txt");

      // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
      window.navigator.msSaveOrOpenBlob(blob, "list.txt");
  } else {
      document.getElementById("output").href = window.URL.createObjectURL(blob);
  }
});


var selected_container = document.getElementById('selected');
var init = [];
init[0] = [];
init[0][0] = "";

var selected_handsontable = new Handsontable(selected_container, {
  /* オプション */
  width: 640,
  height: 60,
  colWidths: [540],
  //data: mydata,
  rowHeaderWidth: 100,
  data: init,
  colHeaders: false,
  rowHeaders: ["選択中のセル"],
  maxRows: 1,
  manualColumnResize: true,
  autoColumnSize: true,
  wordWrap: false
});

Handsontable.hooks.add('afterSelectionEnd', function() {
  var data = handsontable.getValue();
  var res = [];
  res[0] = [];
  res[0][0] = data;
  selected_handsontable.loadData(res);
  selected_handsontable.render();
}, handsontable);



//出品用CSVの部分

var maxRownum_csv = 9600;
var mydata_csv = [];
var colOption_csv = [];
var maxColnum_csv = 28;
var mydata_csv = gon.csv_head

for(var i = 0; i < maxColnum_csv; i++){
  colOption_csv[i] = "";
}

var container_csv = document.getElementById('result_csv');
var handsontable_csv = new Handsontable(container_csv, {
  /* オプション */
  width: 1160,
  height: 320,
  contextMenu: true,
  data: mydata_csv,
  wordWrap: false,
  rowHeaders: true,
  colHeaders: true,
  maxCols: maxColnum_csv,
  maxRows: maxRownum_csv,
  manualColumnResize: true,
  autoColumnSize: false,
  colWidths:80,
  rowHeights:24,
  className: "htMiddle",
  columns: colOption_csv
});

handsontable_csv.render();

var selected_csv_container = document.getElementById('selected_csv');
var init = [];
init[0] = [];
init[0][0] = "";

var selected_csv_handsontable = new Handsontable(selected_csv_container, {
  /* オプション */
  width: 640,
  height: 60,
  colWidths: [540],
  //data: mydata,
  rowHeaderWidth: 100,
  //data: mydata,
  data: init,
  colHeaders: false,
  rowHeaders: ["選択中のセル"],
  maxRows: 1,
  manualColumnResize: true,
  autoColumnSize: true,
  wordWrap: false
});

Handsontable.hooks.add('afterSelectionEnd', function() {
  var data = handsontable_csv.getValue();
  var res = [];
  res[0] = [];
  res[0][0] = data;
  selected_csv_handsontable.loadData(res);
  selected_csv_handsontable.render();
}, handsontable_csv);


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  var activated_tab = e.target // activated tab
  var previous_tab = e.relatedTarget // previous tab
  handsontable_csv.render();
  handsontable_fixed.render();
  // 処理,,,,,
})


var sdata = gon.list;
if(sdata != false){
  var mydata_csv2 = sdata;
}else{
  var mydata_csv2 = gon.csv_head;
  mydata_csv2[3] = [];
  for(var x = 0; x < mydata_csv2[1].length; x++){
    mydata_csv2[3][x] = "";
  }
}

var container_fixed = document.getElementById('fixed_csv');
var handsontable_fixed = new Handsontable(container_fixed, {
  /* オプション */
  width: 1160,
  height: 160,
  contextMenu: true,
  data: mydata_csv2,
  wordWrap: false,
  rowHeaders: true,
  colHeaders: true,
  maxCols: maxColnum_csv,
  maxRows: 4,
  manualColumnResize: true,
  autoColumnSize: true,
  rowHeights:24,
  className: "htMiddle",
  columns: colOption_csv
});

handsontable_fixed.render();

$("#setcsv").click(function () {

  var orgdata = handsontable.getData();
  var csvdata = handsontable_csv.getData();
  var fixeddata = handsontable_fixed.getData();

  var j = 0;
  var col = csvdata[2].length;

  for(var i = 0; i < orgdata.length; i++){
    if(orgdata[i][0] == true){
      csvdata[3+j] = [];
      for(var k = 0; k < col; k++){
        csvdata[3+j][k] = fixeddata[3][k];
      }
      var tcol = 0;

      var q = 0;
      for(var p = 0; p < 20; p++){
        if(orgdata[i][20 + p*11] == true){
          tcol = 20 + p*11;
        }
      }

      var sellprice = orgdata[i][3];
      var sku = orgdata[i][tcol+4];
      //var point = 0.01;
      //var ampoint = Math.round(sellprice * point);
      var quantity = 1;

      csvdata[3+j][0] = sku;
      csvdata[3+j][1] = sellprice;
      //csvdata[3+j][2] = ampoint;
      csvdata[3+j][3] = quantity;
      csvdata[3+j][4] = orgdata[i][9];
      csvdata[3+j][5] = "ASIN";
      j++;
    }
  }

  handsontable_csv.loadData(csvdata);
  alert("CSV作成完了");

});


$("#output").click(function () {
  var tempData = handsontable_csv.getData();
  var csvdata = "";

  for(var k = 0; k < tempData.length; k++){
    csvdata = csvdata + tempData[k].join("\t") + "\n";
  }

  var str_array = Encoding.stringToCode(csvdata);
  var sjis_array = Encoding.convert(str_array, "SJIS", "UNICODE");
  var uint8_array = new Uint8Array(sjis_array);

  var blob = new Blob([uint8_array], { "type" : "text/tsv" });

  if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, "list.txt");

      // msSaveOrOpenBlobの場合はファイルを保存せずに開ける
      window.navigator.msSaveOrOpenBlob(blob, "list.txt");
  } else {
      document.getElementById("output").href = window.URL.createObjectURL(blob);
  }
});

$("#upload").click(function () {
  var tempData = handsontable_csv.getData();
  tempData = JSON.stringify(tempData);
  myData = {data: tempData};
  $.ajax({
    url: "/items/upload",
    type: "POST",
    data: myData,
    dataType: 'json',
    success: function (myData) {
      alert("アップロード受け付けました");
    },
    error: function (myData) {
      //alert("NG");
    }
  });
});


$("#fixed_save").click(function () {
  var tempData = handsontable_fixed.getData();
  tempData = JSON.stringify(tempData);
  myData = {data: tempData};
  $.ajax({
    url: "/items/save",
    type: "POST",
    data: myData,
    dataType: 'json',
    success: function (myData) {
      alert("CSVの設定を保存しました");
    },
    error: function (myData) {
      //alert("NG");
    }
  });
});

var asin_list = [];
var ng_asin_list = [];

var ra = gon.regasin;
var na = gon.ngasin;

if(ra != ""){
  for(var x = 0; x < ra.length; x++){
    asin_list[x] = [];
    asin_list[x][0] = ra[x];
  }
}else{
  for(var x = 0; x < 20; x++){
    asin_list[x] = [];
    asin_list[x][0] = "";
  }
}

if(na != ""){
  for(var x = 0; x < na.length; x++){
    ng_asin_list[x] = [];
    ng_asin_list[x][0] = na[x];
  }
}else{
  for(var x = 0; x < 20; x++){
    ng_asin_list[x] = [];
    ng_asin_list[x][0] = "";
  }
}


var container_asin = document.getElementById('set_asin');
var handsontable_asin = new Handsontable(container_asin, {
  /* オプション */
  width: 260,
  height: 260,
  contextMenu: true,
  data: asin_list,
  wordWrap: false,
  rowHeaders: true,
  colHeaders: ["登録ASIN"],
  colWidths: [160],
  maxCols: 1,
  manualColumnResize: true,
  autoColumnSize: true,
  rowHeights:24,
  className: "htMiddle"
});

var container_ng_asin = document.getElementById('ng_asin');
var handsontable_ng_asin = new Handsontable(container_ng_asin, {
  /* オプション */
  width: 260,
  height: 260,
  contextMenu: true,
  data: ng_asin_list,
  wordWrap: false,
  rowHeaders: true,
  colHeaders: ["除外ASIN"],
  colWidths: [160],
  maxCols: 1,
  manualColumnResize: true,
  autoColumnSize: true,
  rowHeights:24,
  className: "htMiddle"
});

$("#set_asin_btn").click(function () {
  var tempData_asin1 = handsontable_asin.getData();
  var tempData_asin2 = handsontable_ng_asin.getData();

  for(var k = 0; k < tempData_asin1.length; k++){
    if(tempData_asin1[k][0] == ""){
      tempData_asin1.length = k;
      break;
    }
  }

  for(var k = 0; k < tempData_asin2.length; k++){
    if(tempData_asin2[k][0] == ""){
      tempData_asin2.length = k;
      break;
    }
  }

  tempData_asin1 = JSON.stringify(tempData_asin1);
  tempData_asin2 = JSON.stringify(tempData_asin2);
  var tempData = {regasin: tempData_asin1, ngasin: tempData_asin2};
  myData = {data: tempData};
  $.ajax({
    url: "/items/mount",
    type: "POST",
    data: myData,
    dataType: 'json',
    success: function (myData) {
      alert("ASINの設定を保存しました");
    },
    error: function (myData) {
      //alert("NG");
    }
  });
});


function sleep(time, callback){
  setTimeout(callback, time);
}
;

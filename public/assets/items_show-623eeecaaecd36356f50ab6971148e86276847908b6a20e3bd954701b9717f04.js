// create table for ASIN


var maxRownum = 9600;
var mydata = [];
var colOption = [];
var cheaders = ["出品","ASIN","画像","商品タイトル","中古最安値","新品最安値","型番","⇒","検索URL","最高落札価格","候補URL","画像","商品名","現在価格","即決価格","検索キー"];
var maxColnum = cheaders.length;



for(var i = 0; i < maxRownum; i++){
  mydata[i] = [];
  for(var j = 0; j < maxColnum; j++){
    mydata[i][j] = "";
  }
  mydata[i][7] = "⇒";
  mydata[i][0] = false;
}

for(var i = 0; i < maxColnum; i++){
  colOption[i] = "";
  if(i == 0){
    colOption[i] = {type: 'checkbox', className: 'htCenter htMiddle'};
  }
  if(i == 2 || i == 8 || i == 10 || i == 11){
    colOption[i] = {renderer: 'html', className: 'htCenter htMiddle'};
  }
}

var container = document.getElementById('result');
var handsontable = new Handsontable(container, {
  /* オプション */
  width: 1160,
  height: 280,
  contextMenu: true,
  data: mydata,
  wordWrap: false,
  rowHeaders: true,
  colHeaders: cheaders,
  maxCols: maxColnum,
  maxRows: maxRownum,
  manualColumnResize: true,
  autoColumnSize: false,
  colWidths:[40,60,90,120,80,80,80,20,80,80,80,90,140,80,80,80],
  rowHeights:70,
  className: "htMiddle",
  columns: colOption
});


$("#submit_url").click(function () {
  if(document.getElementById("submit_url").innerText == "取得開始"){
    alert("ASINの取得を開始します");
    var url = document.getElementById("input_url").value;
    var pgnum = 1;
    var cnum = 0;
    document.getElementById("submit_url").innerText = "中断";
    document.getElementById("submit_url").className = "btn btn-warning";
    document.getElementById("progress").value = "continue";
    handsontable.loadData(mydata);
    repajax(url,pgnum,cnum);
  }else{
    document.getElementById("submit_url").innerText = "取得開始";
    document.getElementById("submit_url").className = "btn btn-success";
    document.getElementById("progress").value = "cancel";
  }
});

function repajax(url,pgnum,cnum){

  var maxnum = document.getElementById("maxnumber").value
  if(maxnum == ""){
    maxnum = 9600;
  }
  maxnum = Number(maxnum);
  var body = [];
  body[0] = url;
  body[1] = pgnum;
  body[2] = maxnum;
  body[3] = cnum;

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
        document.getElementById("submit_url").innerText = "取得開始";
        document.getElementById("submit_url").className = "btn btn-success";
        return;
      }
      var org_data = handsontable.getData();
      for(var i = 0; i < org_data.length; i++){
        if(org_data[i][1] == ""){
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
        document.getElementById("submit_url").innerText = "取得開始";
        document.getElementById("submit_url").className = "btn btn-success";
        return;
      }else{
        handsontable.loadData(org_data);
        pgnum++;
        sleep(1500,repajax(url,pgnum,cnum));
      }

    },
    error: function (resData) {
      return false;
    }
  });
}


$("#connet_yahoo").click(function () {

  if(document.getElementById("connet_yahoo").innerText == "ヤフオク取得"){

    var org = handsontable.getData();
    for(var i = 0; i < org.length; i++){
      for(var j = 0; j < org[i].length; j++){
        if(j > 7){
          org[i][j] = "";
        }
      }
    }

    handsontable.loadData(org);

    alert("ヤフオクから情報を取得します");
    document.getElementById("connet_yahoo").innerText = "中断";
    document.getElementById("connet_yahoo").className = "btn btn-warning";
    document.getElementById("progress").value = "continue";
    var rownum = 0;
    ConnectYahoo(rownum);
  }else{
    document.getElementById("connet_yahoo").innerText = "ヤフオク取得";
    document.getElementById("connet_yahoo").className = "btn btn-success";
    document.getElementById("progress").value = "cancel";
  }
});


function ConnectYahoo(rownum){

  var sr = rownum;
  var orgData = handsontable.getData();
  var query = {title: orgData[rownum][2], mpn: orgData[rownum][6]};
  var myData = {data: query};

  if(document.getElementById("progress").value == "cancel"){
    alert("中断します")
    return;
  }

  $.ajax({
    url: "/items/connect",
    type: "POST",
    data: myData,
    dataType: 'json',
    success: function (resData) {

      var nData = [];
      for(var j = 0; j < resData.length; j++){
        nData[j] = [rownum,8+j,resData[j]];
      }
      handsontable.setDataAtCell(nData);
      sr++;
      var lp = handsontable.getData().length;

      if(sr < lp){
        sleep(500,ConnectYahoo(sr));
      }else{
        alert("終了しました");
        document.getElementById("connet_yahoo").innerText = "ヤフオク取得";
        document.getElementById("connet_yahoo").className = "btn btn-success";
        document.getElementById("progress").value = "cancel";
      }
    },
    error: function (resData) {
      return false;
    }
  });
}


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
  width: 480,
  height: 60,
  colWidths: [480],
  //data: mydata,
  data: init,
  colHeaders: ["選択中のセル"],
  rowHeaders: false,
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



function sleep(time, callback){
  setTimeout(callback, time);
}
;

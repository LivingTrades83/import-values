// config 

var config = importConfiguration("https://raw.githubusercontent.com/jcodesmn/easy-csv/master/apple-school-manager.json");

// menu

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Import on Open")
    .addItem("Run Recipe", "runRecipe")
    .addToUi();
}

function arrSheetNames(ssObj) {
  var sheets = ssObj.getSheets();
  var arr    = [];
  for (var i = 0; i < sheets.length; i++) {
    arr.push(sheets[i].getName());
  } 
  return arr;
} 

function runRecipe() {

  var ss         = SpreadsheetApp.getActiveSpreadsheet();
  var sheets     = ss.getSheets();
  var sheetNames = arrSheetNames(ss);

}

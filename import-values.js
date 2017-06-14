// config 

var config = importConfiguration("https://raw.githubusercontent.com/jcodesmn/easy-csv/master/apple-school-manager.json");

// menu

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Import on Open")
    .addItem("Run Recipe", "runRecipe")
    .addToUi();
}

// array

function checkValIn(arr, val) { 
  return arr.indexOf(val) > -1; 
}

// sheets

function arrSheetNames(ssObj) {
  var sheets = ssObj.getSheets();
  var arr    = [];
  for (var i = 0; i < sheets.length; i++) {
    arr.push(sheets[i].getName());
  } 
  return arr;
} 

// files and folders

function filesIn(fldr) {
  var fi  = fldr.getFiles();
  var arr = [];
  while (fi.hasNext()) {
    var file = fi.next();
    arr.push(file);
  } 
  return arr;
}

function findFileAtPath(path) {
  var arr  = path.split('/');
  var file = arr[arr.length -1];
  var fldr, fi;
  for (i = 0; i < arr.length - 1; i++) {
    if (i === 0) {
      fi = DriveApp.getRootFolder().getFoldersByName(arr[i]);
      if (fi.hasNext()) {
        fldr = fi.next();
      } else { 
        return null;
      }
    } else if (i >= 1) {
        fi = fldr.getFoldersByName(arr[i]);
        if (fi.hasNext()) {
          fldr = fi.next();
        } else { 
          return null;
        }
    }
  } 
  return findFileIn(fldr, file);
} 

function runRecipe() {

  var originSS     = findFileAtPath(config.source.pathToSpreadsheet);
  // var originSNames = arrSheetNames(originSS);
  var originSheet  = originSS.getSheetByName(config.source.sheet);
  var originNumCol = originSheet.getNumRows();
  var originNumRow = originSheet.getNumColumns();

  // from docs

  // copyValuesToRange(sheet, column, columnEnd, row, rowEnd);
  // sheet	Sheet	the target sheet
  // column	Integer	the first column of the target range
  // columnEnd	Integer	the end column of the target range
  // row	Integer	the start row of the target range
  // rowEnd	Integer	the end row of the target range

  var destSS       = SpreadsheetApp.getActiveSpreadsheet();
  // var destSNames   = arrSheetNames(destSS);
  var destSheet    = destSS.getSheetByName(config.destination.sheet);

}

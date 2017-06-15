// config 

var config = importConfiguration("https://raw.githubusercontent.com/jcodesmn/import-values/master/config.json");

function jsonFromUrl(url) {
  var rsp  = UrlFetchApp.fetch(url);
  var data = rsp.getContentText();
  var json = JSON.parse(data);
  return json;
} 

function jsonFromFile(file) {
  var data = file.getBlob().getDataAsString();
  var json = JSON.parse(data);
  return json;
} 

function importConfiguration(scriptConfig) {
  var regExp = new RegExp("^(http|https)://");
  var test   = regExp.test(scriptConfig);
  var json;
  if (test) {
    json = jsonFromUrl(scriptConfig); 
    return json;
  } else {
    var file = findFileAtPath(scriptConfig); 
    json = jsonFromFile(file); 
    return json;
  }
}

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

// files, folders, sheets

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

function openFileAsSpreadsheet(file) {
  var _id = file.getId();
  var _ss = SpreadsheetApp.openById(_id);
  return _ss;
} 

function runRecipe() {

  var originFile   = findFileAtPath(config.source.pathToSpreadsheet);
  var originSS     = openFileAsSpreadsheet(originFile);
  var originSNames = arrSheetNames(originSS);
  var originSheet  = originSS.getSheetByName(config.source.sheet);
  var originNumCol = originSheet.getNumRows();
  var originNumRow = originSheet.getNumColumns();
  Logger.log(originNumCol);
  Logger.log(originNumRow);

  // from documentation

  // copyValuesToRange(sheet, column, columnEnd, row, rowEnd);
  // sheet	Sheet	the target sheet
  // column	Integer	the first column of the target range
  // columnEnd	Integer	the end column of the target range
  // row	Integer	the start row of the target range
  // rowEnd	Integer	the end row of the target range

  var destSS       = SpreadsheetApp.getActiveSpreadsheet();
  var destSNames   = arrSheetNames(destSS);
  var destSheet    = destSS.getSheetByName(config.destination.sheet);



}

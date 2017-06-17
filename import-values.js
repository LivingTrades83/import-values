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

function numCol(number) {
  var num = number - 1, chr;
  if (num <= 25) {
    chr = String.fromCharCode(97 + num).toUpperCase();
    return chr;
  } else if (num >= 26 && num <= 51) {
    num -= 26;
    chr = String.fromCharCode(97 + num).toUpperCase();
    return "A" + chr;
  } else if (num >= 52 && num <= 77) {
    num -= 52;
    chr = String.fromCharCode(97 + num).toUpperCase();
    return "B" + chr;
  } else if (num >= 78 && num <= 103) {
    num -= 78;
    chr = String.fromCharCode(97 + num).toUpperCase();
    return "C" + chr;
  }
}

// files, folders, sheets

function findFileIn(fldr, name) {
  var files = filesIn(fldr);
  var names = fileNames(files);
  if (checkValIn(names, name)) {
    var file = fldr.getFilesByName(name).next();
    return file;
  }
}

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
  var file;
  var arr  = path.split('/');
  if (arr.length >= 2) {
  file = arr[arr.length -1];
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
  } else {
    file = findFileAtRoot(path);
    return file;
  }
} 

function findFileAtRoot(name) {
  var rf    = DriveApp.getRootFolder();
  var files = rootFiles();
  var names = fileNames(files);
  if (checkValIn(names, name)) {
    var file = rf.getFilesByName(name).next();
    return file;
  }
}

function rootFiles() {
  var rf = DriveApp.getRootFolder();
  var fi = rf.getFiles();
  var arr = [];
  while (fi.hasNext()) {
    var file = fi.next();
    arr.push(file);
  } 
  return arr;
}

function fileNames(files) {
  var arr = [];
  for (var i = 0; i < files.length; i++) {
    var name = files[i].getName();
    arr.push(name);
  }
  return arr;
}

function openFileAsSpreadsheet(file) {
  var _id = file.getId();
  var _ss = SpreadsheetApp.openById(_id);
  return _ss;
} 

function runScript() {
  var oFile = findFileAtPath(config.origin.pathToSpreadsheet);
  if (oFile) {
    var oSS = openFileAsSpreadsheet(oFile);
    if (oSS) {
      var oSNames = arrSheetNames(oSS);
      if (checkValIn(oSNames, config.origin.sheet)) {
        var oSheet   = oSS.getSheetByName(config.origin.sheet);
        var oLastRow = oSS.getLastRow();
        var oLastCol = oSS.getLastColumn();
        var oRange   = oSheet.getRange("A1:" + numCol(oLastCol) + oLastRow);
        var dSS      = SpreadsheetApp.getActiveSpreadsheet();
        var dSNames  = arrSheetNames(dSS);
        if (checkValIn(dSNames, config.destination.sheet)) {
          var dSheet = dSS.getSheetByName(config.destination.sheet);
          oRange.copyValuesToRange(dSheet, 1, oLastCol, 1, oLastRow);
        } else {
          Logger.log("Couldn't find sheet " + config.destination.sheet + " in destination Spreadsheet");
        }
      } else {
        Logger.log("Couldn't find sheet " + config.origin.sheet + " in origin Spreadsheet");
      }
    } else {
      Logger.log("Couldn't open file at path " + config.origin.pathToSpreadsheet + " as a Spreadsheet");
    }
  } else {
    Logger.log("Couldn't find a file at path " + config.origin.pathToSpreadsheet);
  }
}

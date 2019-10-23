const fs = window.require ('fs');

const deleteFolderRecursive = function (path) {
  let files = [];
  if (fs.existsSync (path)) {
    files = fs.readdirSync (path);
    files.forEach (function (file, index) {
      let curPath = path + '/' + file;
      if (fs.lstatSync (curPath).isDirectory ()) {
        // recurse
        deleteFolderRecursive (curPath);
      } else {
        // delete file
        fs.unlinkSync (curPath);
      }
    });
    fs.rmdirSync (path);
  }
};

export default path => {
  try {
    deleteFolderRecursive(path);
    return true;
  } catch (e) {
    return false;
  }
};

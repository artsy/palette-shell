PaletteShell = {
  openFile(file) {
    const path = require("path");
    const { exec } = require("child_process");
    file = path.join("~/.artsy-design-system", file);
    exec(
      `open ${file} || open -a "Visual Studio Code" ${file} || open -R ${file}`
    );
  }
};

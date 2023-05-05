
const { exec, execSync } = require("child_process");


module.exports = {
    startMariaDBServer : function (conToDB) {
        exec("sudo /etc/init.d/mysql start", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(stdout);
            conToDB();
        });
    }
}



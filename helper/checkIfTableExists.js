module.exports = {
    checkIfTableExists: (req, res, next) => {
        db.query(
            "CREATE TABLE IF NOT EXISTS tabs (" +
            "databaseTabID MEDIUMINT(8) NOT NULL PRIMARY KEY AUTO_INCREMENT," +
            "windowID MEDIUMINT(8) NULL ," +
            "tabTitle VARCHAR(200) NULL," +
            "activatedTime double NULL," +
            "deactivatedTime double NULL," +
            "browserTabIndex int(10) NULL," +
            "googleID double NULL," +
            "url VARCHAR(2084) NULL," +
            "favicon VARCHAR(2084) NULL );",
            (err) => {
                if (err) throw err;
            }
        );
        next();
    }
}
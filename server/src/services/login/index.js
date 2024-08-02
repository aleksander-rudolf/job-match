const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("jobmatch.db", { verbose: console.log });

/**
 * Handle login post request, validate login credentials
 * @param username - from req.body
 * @param password - from req.body
 * @returns {object} - returns user if user exists, else returns a 400 response status
 */
router.post("/", async (req, res) => {
	try {
		const username = req.body.username;
		const password = req.body.password;
		//read the user email
		if (!username) {
			return res.status(400).json({ error: "Username is required" });
		}
		if (!password) {
			return res.status(400).json({ error: "Password is required" });
		}
		let sql; // for sql statements

		//sql query
		sql = `
      SELECT *
      FROM job_seeker
      WHERE username=?
      AND password=?
    `;

		let stmt = db.prepare(sql);
		const jobSeekerResult = stmt.all(username, password);

		if (jobSeekerResult.length !== 0) {
			jobSeekerResult[0].role = "jobSeeker";
			return res.status(200).json({
				message: "login successful",
				login_details: jobSeekerResult[0],
			});
		}

		sql = `
      SELECT *
      FROM hiring_manager
      WHERE username=?
      AND password=?
    `;

		stmt = db.prepare(sql);
		const hiringManagerResult = stmt.all(username, password);
		if (hiringManagerResult.length !== 0) {
			hiringManagerResult[0].role = "hiringManager";
			return res.status(200).json({
				message: "login successful",
				login_details: hiringManagerResult[0],
			});
		} else {
			return res.status(400).json({ error: "wrong credentials" });
		}
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Server Error" });
	}
});

module.exports = { LoginService: router };

const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("jobmatch.db", { verbose: console.log });

/**
 * Create job offer
 */

router.post("/create", async (req, res) => {
	try {
		const { JSID, HID, JID } = req.body;

		let sql1 = `
			SELECT Salary
			FROM job_post AS jp
			WHERE jp.ID = ?
  		`;
		let stmt1 = db.prepare(sql1);
		const result = stmt1.all(JID)[0];
		const Salary = result.Salary;

		let sql2 = `
			INSERT INTO offer
			VALUES (?, ?, ?, ?, ?)
	  	`;
		
		let stmt2 = db.prepare(sql2);
		const result2 = stmt2.run(
			"agreed",
			"pending",
			Salary,
			JSID,
			HID,
		);
		console.log(result2);
		return res.status(200).json({ msg: "successfully created offer" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: "could not create offer" });
	}
});

/**
 * Update job offer status for job seeker
 */

router.post("/update-status-job-seeker", async (req, res) => {
	try {
		const { JSID, STATUS, HID } = req.body;

		let sql1 = `
			UPDATE offer SET JobSeekerStatus = ? WHERE JSID = ? AND HID = ?
	  	`;
		
		let stmt1 = db.prepare(sql1);
		const result2 = stmt1.run(
		   STATUS, JSID, HID
		);
		console.log(result2);
		return res.status(200).json({ msg: "successfully updated offer status" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: "could not update offer status" });
	}
	
});

router.post("/update-status-hiring-manager", async (req, res) => {
	try {
		const { JSID, STATUS, HID } = req.body;

		let sql1 = `
			UPDATE offer SET ClientStatus = ? WHERE JSID = ? AND HID = ?
	  	`;
		
		let stmt1 = db.prepare(sql1);
		const result2 = stmt1.run(
		   STATUS, JSID, HID
		);
		console.log(result2);
		return res.status(200).json({ msg: "successfully updated offer status" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ error: "could not update offer status" });
	}
	
});

/**
 * Handle get request, to view the offers owned by a user
 * @param - role (either a jobSeeker, hiring manager)
 */
router.get("/:role/:id", async (req, res) => {
	try {
		const { role } = req.params;
		const { id } = req.params;

		if (role === "jobSeeker") {
			queryResult = queryJobSeeker(id);
		} else if (role === "hiringManager") {
			queryResult = queryHiringManager(id);
		} else {
			return res
				.status(404)
				.json({ error: "incorrect role was provided" });
		}
		return res.status(200).json({ results: queryResult });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Server Error" });
	}
});

/**
 * get the offers owned by the jobSeeker
 * @param {string} id - jobSeeker id
 */
function queryJobSeeker(id) {
	//sql query
	let sql = `
  SELECT o.Salary, o.JobSeekerStatus, o.ClientStatus, o.HID,
  h.First_Name || ' ' || h.Last_Name AS hName, h.Business_Name, h.Business_Industry
  FROM offer AS o, job_seeker AS f, hiring_manager AS h
  WHERE o.JSID = f.ID AND h.ID=o.HID
  AND f.ID=?
  `;
	let stmt = db.prepare(sql);
	const result = stmt.all(id);
	return result;
}

/**
 * get the offers owned by the hiring manager
 * @param {string} id - hiring manager id
 */
function queryHiringManager(id) {
	let sql; // for sql statements

	//sql query
	sql = `
  SELECT f.FirstName || ' ' || f.LastName AS name, o.JSID,
  o.ClientStatus AS clientstatus, o.JobSeekerStatus AS jobSeekerstatus, 
  o.Salary AS salary, f.PhoneNo, f.Email AS email
  FROM offer AS o, job_seeker AS f
  WHERE HID=?
  AND o.JSID = f.ID
  `;

	let stmt = db.prepare(sql);
	const result = stmt.all(id);
	return result;
}

module.exports = { OffersService: router };

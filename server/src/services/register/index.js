const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("jobmatch.db", { verbose: console.log });
const { uuid } = require("../../utils/GenerateID");

/**
 * Handle login post request, validate login credentials
 * @param username - from req.body
 * @param password - from req.body
 * @returns {object} - returns user if user exists, else returns a 400 response status
 */
router.post("/", async (req, res) => {
	console.log("register endpoint");
	try {
		const {
			firstName,
			lastName,
			email,
			username,
			password,
			role,
			phoneNumber,
			location,
			businessName,
			businessIndustry,
			businessDept,
			skills,
		} = req.body;

		//check that user and email dont exist
		// ADD LATER: OR h.Email=? OR h.PhoneNo=?
		let sql = `
      SELECT *
      FROM job_seeker AS j, hiring_manager AS h
      WHERE j.Username=? OR j.Email=? OR j.PhoneNo=?
      OR h.Username=? 
    `;
		let stmt = db.prepare(sql);
		let queryResult = stmt.all(username, email, phoneNumber, username);

		if (queryResult.length !== 0) {
			return res
				.status(400)
				.json({ error: "username and/or password already exist" });
		}
		let ID;

		if (role === "jobSeeker") {

			const jobSeekerInfo = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				username: username,
				password: password,
				phoneNumber: phoneNumber,
				location: location,
				skills: skills,
			};
			ID = jobSeekerSignUp(jobSeekerInfo);
		} else {
			const hiringManagerInfo = {
				firstName: firstName,
				lastName: lastName,
				username: username,
				password: password,
				businessName: businessName,
				businessIndustry: businessIndustry,
				businessDept: businessDept,
			};
			ID = hiringManagerSignUp(hiringManagerInfo);
		}
		return res
			.status(200)
			.json({ msg: "successfully added user to DB", userID: ID });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ error: "Server Error" });
	}
});

/**
 * Insert jobSeeker into database
 * @param {object} jobSeekerInfo
 * @returns jobSeeker ID
 */
async function jobSeekerSignUp(jobSeekerInfo) {
	try {
		const {
			firstName,
			lastName,
			email,
			username,
			password,
			phoneNumber,
			location,
			skills,
		} = jobSeekerInfo;

		const jobSeekerID = uuid();

		let sql = `
	  INSERT INTO job_seeker
	  VALUES (?,?,?,?,?,?,?,?)
	  `;
		let stmt = db.prepare(sql);
		stmt.run(
			jobSeekerID,
			username,
			email,
			phoneNumber,
			password,
			location,
			firstName,
			lastName
		);

		skills.map((skill) => {
			skill = skill.charAt(0).toUpperCase() + skill.slice(1);
			try {
				sql = `
			  SELECT *
			  FROM skills
			  WHERE skillName=?
			  `;
				stmt = db.prepare(sql);
				const result = stmt.all(skill);
				if (result.length === 0) {
					const skillID = uuid();
					sql = `
				  INSERT INTO skills
				  VALUES (?,?)
				`;
					stmt = db.prepare(sql);
					const result = stmt.run(skillID, skill);
					console.log(result);
					sql = `
				INSERT INTO has_skill
				VALUES (?,?)
				`;
					stmt = db.prepare(sql);
					stmt.run(skillID, jobSeekerID);
				} else {
					const skillID = result[0].ID;
					sql = `
				INSERT INTO has_skill
				VALUES (?,?)
				`;
					stmt = db.prepare(sql);
					stmt.run(skillID, jobSeekerID);
				}
			} catch (error) {
				console.log(error);
			}
		});

		return jobSeekerID;
	} catch (error) {
		console.log(error);
		throw new Error(error);
	}
}

/**
 * Insert hiring manager and business into database
 * @param {object} hiringManagerInfo
 * @returns hiring manager ID
 */
async function hiringManagerSignUp(hiringManagerInfo) {
	try {
		const {
			firstName,
			lastName,
			username,
			password,
			businessName,
			businessIndustry,
			businessDept,
		} = hiringManagerInfo;

		const hiringManagerID = uuid();
		sql = `
	  INSERT INTO hiring_manager 
	  VALUES (?,?,?,?,?,?,?,?)
	  `;
		stmt = db.prepare(sql);
		stmt.run(
			hiringManagerID,
			username,
			password,
			firstName,
			lastName,
			businessName,
			businessIndustry,
			businessDept
		);
		return hiringManagerID;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

module.exports = { RegisterService: router };

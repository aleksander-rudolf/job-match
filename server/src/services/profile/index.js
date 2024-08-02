const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("jobmatch.db", { verbose: console.log });
const { uuid } = require("../../utils/GenerateID");

/**
 * Handle get request, queries the database to get the profile details of the
 * provided user
 * @param role - from req.params
 * @param id - from req.params
 * @returns {object} - returns user details if user exists,
 * else returns a 400 response status
 */
router.get("/:role/:id", async (req, res) => {
  try {
    const { role } = req.params;
    const { id } = req.params;
    let queryResult;

    if (role === "jobSeeker") {
      queryResult = queryJobSeeker(id);
    } else if (role === "hiringManager") {
      queryResult = queryHiringManager(id);
    } else {
      return res.status(404).json({ error: "incorrect role was provided" });
    }
    if (queryResult.length === 0) {
      return res
        .status(400)
        .json({ error: "User ID provided is not available" });
    }
    return res
      .status(200)
      .json({ results: queryResult[0], skills: queryResult.skills });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

/**
 * perform sql query to get the profile details of the job_seeker
 * @param {string} id - id of job_seeker
 * @returns {object} -returns result of sql query
 */
function queryJobSeeker(id) {
  let sql = null; // for sql statements

  //sql query
  sql = `
    SELECT *
    FROM job_seeker
    WHERE ID=?
  `;

  let stmt = db.prepare(sql);
  let result1 = stmt.all(id);

  sql = `
    SELECT S.skillName as label
    FROM skills AS S, has_skill as HS
    WHERE HS.JSID = ? AND HS.SID = S.ID
  `;

  stmt = db.prepare(sql);
  const result2 = stmt.all(id);
  Object.assign(result1, { skills: result2 });
  return result1;
}

router.post("/update-skills", async (req, res) => {
  try {
    console.log("here");
    const { JSID, skillsArray } = req.body;

    let sql1 = `
			DELETE FROM has_skill WHERE JSID = ? 
	  	`;

    let stmt1 = db.prepare(sql1);
    stmt1.run(JSID);

    skillsArray.map((skill) => {
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
          stmt.run(skillID, JSID);
        } else {
          const skillID = result[0].ID;
          sql = `
				INSERT INTO has_skill
				VALUES (?,?)
				`;
          stmt = db.prepare(sql);
          stmt.run(skillID, JSID);
        }
      } catch (error) {
        console.log(error);
      }
    });

    return res.status(200).json({ msg: "successfully updated skills" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "could not update skills" });
  }
});

/**
 * perform sql query to get the profile details of the hiring manager and
 * the company details, the hiring manager works for
 * @param {string} id - id of hiring manager
 * @returns {object} - return result of sql query
 */
function queryHiringManager(id) {
  let sql; // for sql statements

  //sql query
  sql = `
    SELECT 
    h.ID AS HID,  h.UserName, h.First_Name, h.LAST_NAME, 
    h.Business_Name, h.Business_Industry
    FROM hiring_manager AS h
    WHERE h.ID=?
  `;

  let stmt = db.prepare(sql);
  const result = stmt.all(id);
  return result;
}

module.exports = { ProfileService: router };

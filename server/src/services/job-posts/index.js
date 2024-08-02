const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const { uuid } = require("../../utils/GenerateID");
const { getCurrentDate } = require("../../utils/Date");
const db = new Database("jobmatch.db", { verbose: console.log });

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
    return res.status(200).json({ results: queryResult });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});



router.get("/:jobID", async (req, res) => {
  try {
    const { jobID } = req.params;
    let sql = `
    SELECT j.FirstName || ' ' || j.LastName AS name, 
    j.Email AS email, a.YearsOfExperience, j.Location AS location,
    j.PhoneNo, a.JSID AS JSID
    FROM application AS a, job_seeker AS j
    WHERE a.JID=?
    AND a.JSID=j.ID
    `;

    let stmt = db.prepare(sql);
    const queryResult = stmt.all(jobID);

    return res.status(200).json({ results: queryResult });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }
});

/**
 * Handle job-post post request, creates a job-post
 * @param HID - hiring manager id
 * @param jobName - Name of the job post 
 * @param locations - location of the job post
 * @param industry - industry of the job post
 * @param salary - skills required by the job post
 * @param desciption - description of the job post 
 * @param workingHours - working hours required by the job post
 */
router.post("/create", async (req, res) => {
  try {
    const { HID } = req.body; //hiring manager id
    const {
      jobName,
      duration,
      locations,
      salary,
      skills,
      description,
      workingHours,
    } = req.body;
    let industry;
    const jobPostID = uuid();
    const date = getCurrentDate();

    //query to get industry of the business
    sql = `
      SELECT  Business_Industry AS industry
      FROM hiring_manager AS h
      WHERE h.ID=?
    `;

    try {
      let stmt = db.prepare(sql);
      const queryResult = stmt.all(HID)[0];
      industry = queryResult.industry;
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "hiring manager not found" });
    }

    //query to insert job post into the job_posts table
    sql = `
      INSERT INTO job_post
      VALUES (?,?,?,?,?,?,?,?,?)
    `;
    stmt = db.prepare(sql);
    stmt.run(
      duration,
      workingHours,
      salary,
      description,
      jobName,
      jobPostID,
      date,
      industry,
      HID
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
          INSERT INTO requires
          VALUES (?,?)
          `;
          stmt = db.prepare(sql);
          stmt.run(skillID, jobPostID);
        } else {
          const skillID = result[0].ID;
          sql = `
          INSERT INTO requires
          VALUES (?,?)
          `;
          stmt = db.prepare(sql);
          stmt.run(skillID, jobPostID);
        }
      } catch (error) {
        console.log(error);
      }
    });

    return res.status(200).json({ msg: "successfully added job post" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server Error" });
  }
});



/**
 * perform sql query to get job posts appropriate to the user
 * @param {string} id - id of jobseeker
 * @returns {object} -returns result of sql query
 */
function queryJobSeeker(id) {
  //sql query
  let sql = `
    SELECT distinct j.ID, j.JobName, j.salary, j.Description, j.WorkingHours, 
    j.DatePosted, b.Business_Name AS BusinessName, j.Industry
    FROM has_skill AS h, job_seeker AS f, requires AS r, Skills AS s, job_post AS j, hiring_manager AS b
    WHERE h.JSID=f.ID AND r.JID = j.ID AND h.SID = r.SID AND j.HID = b.ID
    AND f.ID=?
  `;

  let stmt = db.prepare(sql);
  const result = stmt.all(id);
  return result;
}

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
    SELECT Duration, WorkingHours, 
    Salary, Description, JobName, j.ID, 
    DatePosted, Industry, HID
    FROM job_post AS j, hiring_manager AS h
    WHERE h.ID=?
    AND h.ID = j.HID
  `;

  let stmt = db.prepare(sql);
  const result = stmt.all(id);
  return result;
}

module.exports = { JobPostsService: router };

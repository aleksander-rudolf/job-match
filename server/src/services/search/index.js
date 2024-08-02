const { Router } = require("express");
const router = Router();
const Database = require("better-sqlite3");
const db = new Database("jobmatch.db", { verbose: console.log });

/**
 * Handle job-post get request, search jobs
 * @param searchTerm - search term
 */
router.post("/", async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm.length < 1) {
      return res.status(200).json({ results: [] });
    } else {
      //query to get industry of the business
      let sql = `
      SELECT DISTINCT * FROM job_post AS j
      WHERE j.Duration LIKE ?
      OR j.WorkingHours LIKE ?
      OR j.Salary LIKE ?
      OR j.Description LIKE ?
      OR j.JobName LIKE ?
      OR j.ID LIKE ?
      OR j.DatePosted LIKE ?
      OR j.Industry LIKE ?
      OR j.HID LIKE ?
      `;

      let stmt = db.prepare(sql);
      const queryResult = stmt.all(
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`
      );

      return res.status(200).json({ results: queryResult });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = { SearchService: router };

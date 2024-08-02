const request = require('supertest');
const Database = require("better-sqlite3");
const db = new Database("jobmatch.db", { verbose: console.log });
const app = require("../index")
const { getCurrentDate } = require("../utils/Date");


//------------tests for APPLY service---------------------

const date = getCurrentDate();

describe("GET /apply/:id/applications", () => {
  
  beforeAll(async () => {
    // Seed the database with test data
    
    const dummyResume = null;
    await db.exec(`

      INSERT INTO job_seeker (ID, FirstName, LastName, Email, Username, Password, Location ) 
      VALUES ('1', 'John', 'Doe', 'fuck.com', 'asasasasa', 'aaaa', 'calgary');

      INSERT INTO hiring_manager (ID, UserName, Password, Business_Name, Business_Industry, First_Name, Last_Name, Business_Dept) 
      VALUES ('345','hello','..', 'abc', 'IT','fuck','you', 'bitch');

      INSERT INTO job_post (ID, JobName, Salary, Duration, WorkingHours, HID, Description, DatePosted, Industry ) 
      VALUES ('56', 'Developer', 100000, 12, 8, '345', '', '${date}','IT' );

      INSERT INTO application ( YearsOfExperience, JSID, JID, additionalInfo, applicationDate, pdf_data) 
      VALUES ('5','1', '56','blahblah', '${date}', '${dummyResume}' );
    `);
  });

  afterAll(async () => {
    // Clean up the database after each test
    await db.exec(`
      DELETE FROM application WHERE JSID = 1 AND JID = 56;
      DELETE FROM job_post WHERE ID = 56;
      DELETE FROM hiring_manager WHERE ID = 345;
      DELETE FROM job_seeker WHERE ID = 1;
    `);
  });

  it("should return a list of applications for the specified job seeker", async () => {
    const res = await request(app).get("/apply/1/applications");

    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text)).toEqual({
      results: [
        {
          JobName: "Developer",
          Salary: 100000,
          Duration: 12,
          WorkingHours: 8,
          Business_Name: "abc",
          Business_Industry: "IT",
          applicationDate: date
        }
      ],
    })
  });
});
//----------job-posts------------------------------------------------
describe("GET /job-posts/:jobID", () => {
  beforeAll(async () => {
    // Seed the database with test data
    await db.exec(`
      INSERT INTO job_seeker (ID, FirstName, LastName, Email, Username, Password, Location, PhoneNo) 
      VALUES ('1', 'John', 'Doe', 'john@example.com', 'john_doe', 'password', 'New York', '123-456-7890');

      INSERT INTO hiring_manager (ID, UserName, Password, Business_Name, Business_Industry, First_Name, Last_Name, Business_Dept) 
      VALUES ('345','hello','..', 'abc', 'IT','fuck','you', 'bitch');
      
      INSERT INTO job_post (ID, JobName, Salary, Duration, WorkingHours, HID, Description, DatePosted, Industry ) 
      VALUES ('100', 'Software Developer', 80000, 12, 8, '345', 'Software development', '${date}', 'IT');

      INSERT INTO application (YearsOfExperience, JSID, JID, additionalInfo, applicationDate, pdf_data) 
      VALUES ('3', '1', '100', 'Some additional info', '${date}', null);
    `);
  });

  afterAll(async () => {
    // Clean up the database after each test
    await db.exec(`
      DELETE FROM application WHERE JSID = 1 AND JID = 100;
      DELETE FROM job_post WHERE ID = 100;
      DELETE FROM hiring_manager WHERE ID = 345;
      DELETE FROM job_seeker WHERE ID = 1;
    `);
  });

  it("should return the applicants for the specified jobID", async () => {
    const res = await request(app).get("/job-posts/100");
    expect(res.statusCode).toEqual(200);
    expect(JSON.parse(res.text)).toEqual({
      results: [
        {
          name: "John Doe",
          email: "john@example.com",
          YearsOfExperience: "3",
          location: "New York",
          PhoneNo: "123-456-7890",
          JSID: "1"
        }
      ],
    });
  });
});

//----job seeker offer--------------
describe("GET /offers/:role/:id", () => {
  it("should return job seeker offer", async () => {
    const id = "733fe37e-c6e6-4f38-b35c-c5c042910da6"; // Use a valid job seeker- username pcosslett0
    const response = await request(app).get(`/offers/jobSeeker/${id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBeTruthy();
  });
});

//------------------------------hiring manager offer------------------------------------------------------------------
describe("GET /offers/:role/:id", () => {
  it("should return hiring manager offer", async () => {
    const id = "f7b8be14-4ca7-4d39-bbc2-b305a1ab344e"; // Use a valid hiring manager username- elaughrey0
    const response = await request(app).get(`/offers/hiringManager/${id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBeTruthy();
  });
});

//--------------------------------invalid role----------------------------------

describe("GET /offers/:role/:id", () => {
  it("should return 404 for incorrect role", async () => {
    const id = ".";
    const response = await request(app).get(`/offers/owner/${id}`);
    expect(response.statusCode).toEqual(404);
  });
});

//------------------------------profile---------------------------

describe("GET /profile/:role/:id", () => {
  it("should return job seeker profile", async () => {
    const id = "733fe37e-c6e6-4f38-b35c-c5c042910da6"; // Use a valid job seeker ID
    const response = await request(app).get(`/profile/jobSeeker/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(response.body.skills).toBeDefined();
  });
});

describe("GET /profile/:role/:id", () => {
  it("should return hiring manager profile", async () => {
    const id = "f7b8be14-4ca7-4d39-bbc2-b305a1ab344e"; // Use a valid HM ID
    const response = await request(app).get(`/profile/hiringManager/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
   
  });
});

describe("GET /profile/:role/:id", () => {
  it("should return 404 for incorrect role", async () => {
    const id = ".";
    const response = await request(app).get(`/offers/owner/${id}`);
    expect(response.statusCode).toEqual(404);
  });
});

//----------------------------search-------------------------------

describe("POST /search/", () => {
  it("should return an empty array for an empty search term", async () => {
    const searchTerm = "";
    const response = await request(app)
      .post("/search/")
      .send({ searchTerm });

    expect(response.status).toBe(200);
    expect(response.body.results).toEqual([]);
  });
});

describe("POST /search/", () => {
  it("should return search results for a valid search term", async () => {
    const searchTerm = "Engineer"; // Use a search term that exists in your job posts
    const response = await request(app)
      .post("/search/")
      .send({ searchTerm });

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBeTruthy();
    expect(response.body.results.length).toBeGreaterThan(0);
  });
});

describe("POST /search/", () => {
  it("should return an empty array for a search term with no matches", async () => {
    const searchTerm = "*"; // Use a search term that doesn't exist in your job posts
    const response = await request(app)
      .post("/search/")
      .send({ searchTerm });

    expect(response.status).toBe(200);
    expect(response.body.results).toEqual([]);
  });
});

//-------------------------------job-posts----------------------------------

describe("GET /job-posts/jobSeeker/:id", () => {
  it("should return job posts for a valid job seeker ID", async () => {
    const role = "jobSeeker";
    const id = "733fe37e-c6e6-4f38-b35c-c5c042910da6"; //  valid job seeker ID
    const response = await request(app).get(`/job-posts/${role}/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBeTruthy();
    expect(response.body.results.length).toBeGreaterThan(0);
  });
});


describe("GET /job-posts/hiringManager/:id", () => {
  it("should return job posts for a valid hiring manager ID", async () => {
    const role = "hiringManager";
    const id = "f7b8be14-4ca7-4d39-bbc2-b305a1ab344e"; // Replace with a valid hiring manager ID
    const response = await request(app).get(`/job-posts/${role}/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBeTruthy();
    expect(response.body.results.length).toBeGreaterThan(0);
  });
});

describe("GET /job-posts/:jobID", () => {
  it("should return applicants who have applied for a particular job post", async () => {
    const jobID = "b43bcd31-1c55-4966-b5f9-0f6e22a269dd"; // Replace with a valid job post ID
    const response = await request(app).get(`/job-posts/${jobID}`);

    expect(response.status).toBe(200);
    expect(response.body.results).toBeDefined();
    expect(Array.isArray(response.body.results)).toBeTruthy();
    expect(response.body.results.length).toBeGreaterThan(0);
  });
});

describe("POST /job-posts/create", () => {
  it("should create a job post and return a success message", async () => {
    const requestBody = {
      HID: "f7b8be14-4ca7-4d39-bbc2-b305a1ab344e", 
      jobName: "Software Developer",
      duration: "6",
      locations: "New York",
      salary: "100000",
      skills: ["JavaScript", "React", "Node.js"],
      description: "We are looking for a skilled software developer.",
      workingHours: "40",
    };

    const response = await request(app)
      .post("/job-posts/create")
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body.msg).toEqual("successfully added job post");
  });
});

describe("POST /job-posts/create", () => {
  it("should not create a job post and return a bad request message", async () => {
    const requestBody = {
      HID: "HMdoesNotExist", 
      jobName: "Software Developer",
      duration: "6",
      locations: "New York",
      salary: "100000",
      skills: ["JavaScript", "React", "Node.js"],
      description: "We are looking for a skilled software developer.",
      workingHours: "40",
    };

    const response = await request(app)
      .post("/job-posts/create")
      .send(requestBody);

    expect(response.status).toBe(400);

  });
});




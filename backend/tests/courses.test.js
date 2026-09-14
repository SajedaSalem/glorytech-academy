const request = require("supertest");
const app = require("../src/app");

describe("GloryTech Academy API", () => {
  test("GET /api/health should return 200 and healthy status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("healthy");
  });

  test("GET /api/courses should return all courses", async () => {
    const response = await request(app).get("/api/courses");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(6);
    expect(Array.isArray(response.body.courses)).toBe(true);
  });

  test("GET /api/courses?vendor=Cisco should return only Cisco courses", async () => {
    const response = await request(app).get(
      "/api/courses?vendor=Cisco"
    );

    expect(response.statusCode).toBe(200);

    response.body.courses.forEach(course => {
      expect(course.vendor).toBe("Cisco");
    });
  });

  test("GET /api/courses/5 should return Azure Fundamentals", async () => {
    const response = await request(app).get("/api/courses/5");

    expect(response.statusCode).toBe(200);
    expect(response.body.examCode).toBe("AZ-900");
  });

  test("GET /api/courses/999 should return 404", async () => {
    const response = await request(app).get("/api/courses/999");

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Course not found");
  });

  test("GET /api/courses?category=Cloud should return only cloud courses", async () => {
  const response = await request(app).get(
    "/api/courses?category=Cloud"
  );

  expect(response.statusCode).toBe(200);

  response.body.courses.forEach(course => {
    expect(course.category).toBe("Cloud");
  });
});

test("GET /api/courses?level=Professional should return only professional courses", async () => {
  const response = await request(app).get(
    "/api/courses?level=Professional"
  );

  expect(response.statusCode).toBe(200);

  response.body.courses.forEach(course => {
    expect(course.level).toBe("Professional");
  });
});

test("GET /api/courses?search=azure should find Azure Fundamentals", async () => {
  const response = await request(app).get(
    "/api/courses?search=azure"
  );

  expect(response.statusCode).toBe(200);
  expect(response.body.count).toBeGreaterThan(0);
  expect(response.body.courses[0].examCode).toBe("AZ-900");
});

});
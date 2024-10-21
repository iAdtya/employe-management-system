import express from "express";
import { db } from "./db.js";
import { departments, employees } from "./schema.js";
import cors from "cors";
import { like, eq } from 'drizzle-orm';


const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

app.get("/departments", async (req, res) => {
  try {
    const result = await db.select().from(departments);
    res.status(200).json({ departments: result });
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// todo ADD DEPARTMENT
app.post("/AddDepartments", async (req, res) => {
  const { name, description } = req.body;

  console.log("Received payload:", { name, description });

  try {
    await db.insert(departments).values({
      name,
      description,
    });

    res.status(201).json({ message: "Department added successfully" });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/FetchEmployees", async (req, res) => {
  const { name, department_id } = req.query;

  try {
    console.log("Fetching employees with filters:", { name, department_id });
    let query = db.select().from(employees);

    if (name && name.trim() !== '') {
      // Using Drizzle's like operator for case-insensitive search
      query = query.where(like(employees.name, `%${name}%`));
    }
    
    if (department_id) {
      // Using Drizzle's eq operator for exact match
      query = query.where(eq(employees.department_id, Number(department_id)));
    }

    console.log("SQL query:", query.toSQL());
    const employeeList = await query;
    res.status(200).json({ employees: employeeList });
    
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.toString() 
    });
  }
});

// Add a new employee
app.post("/employees", async (req, res) => {
  const { name, address, department_id } = req.body;

  try {
    await db.insert(employees).values({ name, address, department_id });
    res.status(201).json({ message: "Employee added successfully" });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

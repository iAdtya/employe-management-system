import { useState, useEffect } from "react";
import axios from "axios";

const AddEmploye = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeAddress, setEmployeeAddress] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(""); // For adding employees
  const [employees, setEmployees] = useState([]); // Store employees for displaying
  const [filterName, setFilterName] = useState(""); // For filtering by name
  const [filterDepartment, setFilterDepartment] = useState(""); // For filtering by department

  // Function to fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/departments");
      if (response.status === 200) {
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/FetchEmployees", {
        params: {
          name: filterName,
          department_id: filterDepartment || undefined, // Comment: Only send department_id if it's not empty
        },
      });
      if (response.status === 200) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error.response?.data || error.message
      );
    }
  };

  // Fetch departments and employees initially
  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  // Filter employees when filter inputs change
  useEffect(() => {
    fetchEmployees();
  }, [filterName, filterDepartment]);

  const addDepartment = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/AddDepartments",
        {
          name: departmentName,
          description: departmentDescription,
        }
      );

      if (response.status === 201) {
        alert("Department added successfully");
        setDepartments([
          ...departments,
          { name: departmentName, description: departmentDescription },
        ]);
        console.log("Departments:", departments);
        setDepartmentName("");
        setDepartmentDescription("");
      }
    } catch (error) {
      alert(
        "Failed to add department: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const addEmployee = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/employees", {
        name: employeeName,
        address: employeeAddress,
        department_id: selectedDepartment,
      });

      if (response.status === 201) {
        alert("Employee added successfully");
        setEmployeeName("");
        setEmployeeAddress("");
        setSelectedDepartment("");
        fetchEmployees(); // Refresh employee list after adding
      }
    } catch (error) {
      alert(
        "Failed to add employee: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen absolute inset-0 h-full w-full bg-slate-900 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <div className="flex-grow p-6">
        <div className="flex justify-center mt-10 mb-10">
          <div className="text-center max-w-2xl">
            <h1 className="text-5xl font-bold text-white">
              Employee Management System
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Department */}
          <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Add Department</h2>
            <div className="space-y-4 flex-grow">
              <input
                placeholder="Name"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
              />
              <input
                placeholder="Description"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                value={departmentDescription}
                onChange={(e) => setDepartmentDescription(e.target.value)}
              />
            </div>
            <button
              onClick={addDepartment}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mt-auto"
            >
              Add Department
            </button>
          </div>

          {/* Add Employee */}
          <div className="bg-slate-800 text-white rounded-lg shadow-md p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
            <div className="space-y-4 flex-grow">
              <input
                placeholder="Name"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
              <select
                className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <input
                placeholder="Address"
                className="w-full px-3 py-2 bg-slate-700 text-white rounded"
                value={employeeAddress}
                onChange={(e) => setEmployeeAddress(e.target.value)}
              />
            </div>
            <button
              onClick={addEmployee}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mt-4"
            >
              Add Employee
            </button>
          </div>
        </div>

        <div className="mt-6 bg-slate-800 text-white rounded-lg shadow-md p-6">
          <input
            placeholder="Filter by name, Department"
            className="w-full px-3 py-2 bg-slate-700 text-white rounded mb-4"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <input
            placeholder="Filter by Department ID"
            className="w-full px-3 py-2 bg-slate-700 text-white rounded mb-4"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          />
          <div>
            <table className="min-w-full table-auto text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Department</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="border px-4 py-2">{employee.name}</td>
                    <td className="border px-4 py-2">{employee.address}</td>
                    <td className="border px-4 py-2">
                      {employee.department_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmploye;

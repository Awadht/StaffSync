import { useState } from "react";
import axios from "axios";
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  const [editingTraining, setEditingTraining] = useState(null);
  const [showTrainingForm, setShowTrainingForm] = useState(false);

const [newTraining, setNewTraining] = useState({
  title: "",
  description: "",
  date: "",
});
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

const [newAnnouncement, setNewAnnouncement] = useState({
  title: "",
  message: "",
});
  const [showAddEmployee, setShowAddEmployee] = useState(false);
 
  const [showLeaveForm, setShowLeaveForm] = useState(false);

const [newLeave, setNewLeave] = useState({
  employeeId: "",
  startDate: "",
  endDate: "",
  reason: "",
});
  const [editingEmployee, setEditingEmployee] = useState(null);

const [newEmployee, setNewEmployee] = useState({
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  position: "",
});

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      setMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed"
      );
    }
  };
  const fetchEmployees = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/employees",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEmployees(response.data);
  } catch (error) {
    console.error(error);
    setMessage("Unable to fetch employees");
  }
};
const fetchLeaves = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/leaves",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Leave requests:", response.data);
setLeaves(response.data);
  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to fetch leave requests"
    );
  }
};
const fetchMyProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/employees/my",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("My Profile:", response.data);
    setMyProfile(response.data);

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to fetch your profile"
    );
  }
};
const fetchAttendance = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/attendance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Attendance:", response.data);
    setAttendance(response.data);

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to fetch attendance"
    );
  }
};
const fetchMyAttendance = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/attendance/my",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("My Attendance:", response.data);
    setAttendance(response.data);

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to fetch your attendance"
    );
  }
};
const fetchAnnouncements = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/announcements",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Announcements:", response.data);
    setAnnouncements(response.data);

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to fetch announcements"
    );
  }
};
const fetchTrainingPrograms = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/training",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Training Programs:", response.data);
    setTrainingPrograms(response.data);

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to fetch training programs"
    );
  }
};
const handleCreateTraining = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/training",
      newTraining,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTrainingPrograms([
      ...trainingPrograms,
      response.data,
    ]);

    setNewTraining({
      title: "",
      description: "",
      date: "",
    });

    setShowTrainingForm(false);

    setMessage("Training program created successfully!");

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to create training program"
    );
  }
};
const handleEditTraining = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `http://localhost:5000/api/training/${editingTraining._id}`,
      {
        title: editingTraining.title,
        description: editingTraining.description,
        date: editingTraining.date,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTrainingPrograms(
      trainingPrograms.map((training) =>
        training._id === editingTraining._id
          ? response.data
          : training
      )
    );

    setEditingTraining(null);

    setMessage("Training program updated successfully!");

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to update training program"
    );
  }
};
const handleDeleteTraining = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/training/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setTrainingPrograms(
      trainingPrograms.filter(
        (training) => training._id !== id
      )
    );

    setMessage("Training program deleted successfully!");

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to delete training program"
    );
  }
};
const handleLeaveStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `http://localhost:5000/api/leaves/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLeaves(
      leaves.map((leave) =>
        leave._id === id ? response.data : leave
      )
    );

    setMessage(`Leave request ${status.toLowerCase()} successfully!`);

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to update leave request"
    );
  }
};
const handlePostAnnouncement = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/announcements",
      newAnnouncement,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAnnouncements([
      ...announcements,
      response.data,
    ]);

    setNewAnnouncement({
      title: "",
      message: "",
    });

    setShowAnnouncementForm(false);

    setMessage("Announcement posted successfully!");

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to post announcement"
    );
  }
};
const handleAddEmployee = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://localhost:5000/api/employees",
      newEmployee,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEmployees([...employees, response.data]);

    setNewEmployee({
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      position: "",
    });

    setShowAddEmployee(false);
    setMessage("Employee added successfully!");
  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to add employee"
    );
  }
};
const handleApplyLeave = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const profileResponse = await axios.get(
  "http://localhost:5000/api/employees/my",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const leaveData = {
  ...newLeave,
  employeeId: profileResponse.data.employeeId,
};

const response = await axios.post(
  "http://localhost:5000/api/leaves",
  leaveData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    setMessage("Leave applied successfully!");

    setNewLeave({
      employeeId: "",
      startDate: "",
      endDate: "",
      reason: "",
    });

    setShowLeaveForm(false);

    console.log(response.data);

  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to apply for leave"
    );
  }
};

const handleDeleteEmployee = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/employees/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEmployees(
      employees.filter((employee) => employee._id !== id)
    );

    setMessage("Employee deleted successfully!");
  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to delete employee"
    );
  }
};
const handleEditEmployee = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `http://localhost:5000/api/employees/${editingEmployee._id}`,
      editingEmployee,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEmployees(
      employees.map((employee) =>
        employee._id === editingEmployee._id
          ? response.data
          : employee
      )
    );

    setEditingEmployee(null);
    setMessage("Employee updated successfully!");
  } catch (error) {
    console.error(error);

    setMessage(
      error.response?.data?.message ||
        "Unable to update employee"
    );
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setEmail("");
    setPassword("");
  };

  // LOGIN PAGE
  if (!user) {
    return (
      <div
        className="login-page"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f4f7fb",
        }}
      >
        <div
          className="login-card"
  style={{
    width: "380px",
    padding: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 15px 40px rgba(15, 23, 42, 0.12)",
    border: "1px solid #e2e8f0",
  }}
>
          <h1
  style={{
    textAlign: "center",
    color: "#1e40af",
    fontSize: "32px",
    marginBottom: "8px",
    fontWeight: "700",
  }}
>
  StaffSync
</h1>

          <p
            style={{
              textAlign: "center",
              color: "#666",
            }}
          >
            Employee Management System
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  color: "#1e293b",
  boxSizing: "border-box",
}}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "#ffffff",
  color: "#1e293b",
  boxSizing: "border-box",
}}
            />

            <button
              type="submit"
              style={{
  width: "100%",
  padding: "12px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
}}
            >
              Login
            </button>
          </form>

          {message && (
            <p
              className="message"
              role="alert"
              style={{
                textAlign: "center",
                marginTop: "15px",
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  // HR DASHBOARD
  if (user.role === "HR") {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="brand-mark" aria-hidden="true">S</div>
          <div className="dashboard-heading">
            <p className="eyebrow">STAFFSYNC · PEOPLE OPERATIONS</p>
            <h1>Good to see you, {user.name}</h1>
            <p>Manage your people, leave requests, and workplace updates.</p>
          </div>
          <div className="header-actions">
            <span className="role-pill">{user.role}</span>
            <button className="button-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        {message && <div className="message" role="status">{message}</div>}

        <h2>HR Features</h2>

<div className="dashboard-actions">
<button className="dashboard-action" onClick={fetchEmployees}>
  View Employees
</button>

<button
  className="dashboard-action"
  onClick={() => setShowAddEmployee(!showAddEmployee)}
  style={{ marginLeft: "10px" }}
>
  Add Employee
</button>
<button
  className="dashboard-action"
  onClick={fetchLeaves}
  style={{ marginLeft: "10px" }}
>
  Manage Leave Requests
</button>
<button
  className="dashboard-action"
  onClick={fetchAttendance}
  style={{ marginLeft: "10px" }}
>
  View Attendance
</button>
<button
  className="dashboard-action"
  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
  style={{ marginLeft: "10px" }}
>
  Post Announcement
</button>
</div>
{showAnnouncementForm && (
  <form
    onSubmit={handlePostAnnouncement}
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
    }}
  >
    <h2>Post Announcement</h2>

    <input
      type="text"
      placeholder="Announcement Title"
      value={newAnnouncement.title}
      onChange={(e) =>
        setNewAnnouncement({
          ...newAnnouncement,
          title: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <textarea
      placeholder="Announcement Message"
      value={newAnnouncement.message}
      onChange={(e) =>
        setNewAnnouncement({
          ...newAnnouncement,
          message: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <button type="submit">
      Post Announcement
    </button>

    <button
      type="button"
      onClick={() => setShowAnnouncementForm(false)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </form>
)}
{showAddEmployee && (
  <form
    onSubmit={handleAddEmployee}
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
    }}
  >
    <h2>Add New Employee</h2>

    <input
      type="text"
      placeholder="Employee ID"
      value={newEmployee.employeeId}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          employeeId: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="text"
      placeholder="First Name"
      value={newEmployee.firstName}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          firstName: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="text"
      placeholder="Last Name"
      value={newEmployee.lastName}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          lastName: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="email"
      placeholder="Email"
      value={newEmployee.email}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          email: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="text"
      placeholder="Department"
      value={newEmployee.department}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          department: e.target.value,
        })
      }
    />

    <br /><br />

    <input
      type="text"
      placeholder="Position"
      value={newEmployee.position}
      onChange={(e) =>
        setNewEmployee({
          ...newEmployee,
          position: e.target.value,
        })
      }
    />

    <br /><br />

    <button type="submit">
      Save Employee
    </button>

    <button
      type="button"
      onClick={() => setShowAddEmployee(false)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </form>
)}

{employees.length > 0 && (
  <div style={{ marginTop: "30px" }}>
    <h2>Employee List</h2>

    <table
      border="1"
      cellPadding="10"
      style={{
        margin: "auto",
        borderCollapse: "collapse",
      }}
    >
      <thead>
       <tr>
  <th>Employee ID</th>
  <th>Name</th>
  <th>Email</th>
  <th>Department</th>
  <th>Position</th>
  <th>Action</th>
</tr>
      </thead>

      <tbody>
        {employees.map((employee) => (
          <tr key={employee._id}>
  <td>{employee.employeeId}</td>
  <td>
    {employee.firstName} {employee.lastName}
  </td>
  <td>{employee.email}</td>
  <td>{employee.department}</td>
  <td>{employee.position}</td>

  <td>
  <button
    onClick={() => setEditingEmployee(employee)}
  >
    Edit
  </button>

  <button
    onClick={() => handleDeleteEmployee(employee._id)}
    style={{ marginLeft: "10px" }}
  >
    Delete
  </button>
</td>
</tr>
        ))}
      </tbody>
    </table>
    {editingEmployee && (
  <form
    onSubmit={handleEditEmployee}
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
    }}
  >
    <h2>Edit Employee</h2>

    <input
      type="text"
      placeholder="Employee ID"
      value={editingEmployee.employeeId}
      onChange={(e) =>
        setEditingEmployee({
          ...editingEmployee,
          employeeId: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="text"
      placeholder="First Name"
      value={editingEmployee.firstName}
      onChange={(e) =>
        setEditingEmployee({
          ...editingEmployee,
          firstName: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="text"
      placeholder="Last Name"
      value={editingEmployee.lastName}
      onChange={(e) =>
        setEditingEmployee({
          ...editingEmployee,
          lastName: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="email"
      placeholder="Email"
      value={editingEmployee.email}
      onChange={(e) =>
        setEditingEmployee({
          ...editingEmployee,
          email: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="text"
      placeholder="Department"
      value={editingEmployee.department || ""}
      onChange={(e) =>
        setEditingEmployee({
          ...editingEmployee,
          department: e.target.value,
        })
      }
    />

    <br /><br />

    <input
      type="text"
      placeholder="Position"
      value={editingEmployee.position || ""}
      onChange={(e) =>
        setEditingEmployee({
          ...editingEmployee,
          position: e.target.value,
        })
      }
    />

    <br /><br />

    <button type="submit">
      Update Employee
    </button>

    <button
      type="button"
      onClick={() => setEditingEmployee(null)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </form>
)}

  </div>
)}
{leaves.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      maxWidth: "900px",
    }}
  >
    <h2>Leave Requests</h2>

    <table
      border="1"
      cellPadding="10"
      style={{
        margin: "auto",
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <thead>
        <tr>
  <th>Employee</th>
  <th>Start Date</th>
  <th>End Date</th>
  <th>Reason</th>
  <th>Status</th>
  <th>Action</th>
</tr>
      </thead>

      <tbody>
        {leaves.map((leave) => (
          <tr key={leave._id}>
            <td>
              {leave.employeeId?.firstName}{" "}
              {leave.employeeId?.lastName}
            </td>

            <td>
              {new Date(leave.startDate).toLocaleDateString()}
            </td>

            <td>
              {new Date(leave.endDate).toLocaleDateString()}
            </td>

            <td>{leave.reason}</td>

            <td><span className={`status-badge status-${leave.status.toLowerCase()}`}>{leave.status}</span></td>
            <td>
  {leave.status === "Pending" && (
    <>
      <button
  onClick={() =>
    handleLeaveStatus(leave._id, "Approved")
  }
>
  Approve
</button>

     <button
  onClick={() =>
    handleLeaveStatus(leave._id, "Rejected")
  }
  style={{ marginLeft: "10px" }}
>
  Reject
</button>
    </>
  )}
</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{attendance.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      maxWidth: "900px",
    }}
  >
    <h2>Attendance Records</h2>

    <table
      border="1"
      cellPadding="10"
      style={{
        margin: "auto",
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <thead>
        <tr>
          <th>Employee</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {attendance.map((record) => (
          <tr key={record._id}>
            <td>
              {record.employeeId?.firstName}{" "}
              {record.employeeId?.lastName}
            </td>

            <td>
              {new Date(record.date).toLocaleDateString()}
            </td>

            <td>{record.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    );
  }

  // MANAGER DASHBOARD
  if (user.role === "Manager") {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="brand-mark" aria-hidden="true">S</div>
          <div className="dashboard-heading">
            <p className="eyebrow">STAFFSYNC · PEOPLE OPERATIONS</p>
            <h1>Good to see you, {user.name}</h1>
            <p>Review leave, build skills, and keep your team informed.</p>
          </div>
          <div className="header-actions">
            <span className="role-pill">{user.role}</span>
            <button className="button-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        {message && <div className="message" role="status">{message}</div>}

        <h2>Manager Features</h2>
        <div className="dashboard-actions">
        <button
  className="dashboard-action"
  onClick={() => setShowTrainingForm(!showTrainingForm)}
>
  Create Training Program
</button>
<button
  className="dashboard-action"
  onClick={fetchTrainingPrograms}
  style={{ marginLeft: "10px" }}
>
  Manage Training Programs
</button>
<button
  className="dashboard-action"
  onClick={fetchAttendance}
  style={{ marginLeft: "10px" }}
>
  View Attendance
</button>
        </div>
{attendance.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      maxWidth: "900px",
    }}
  >
    <h2>Attendance Records</h2>

    <table
      border="1"
      cellPadding="10"
      style={{
        margin: "auto",
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <thead>
        <tr>
          <th>Employee</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {attendance.map((record) => (
          <tr key={record._id}>
            <td>
              {record.employeeId?.firstName}{" "}
              {record.employeeId?.lastName}
            </td>

            <td>
              {new Date(record.date).toLocaleDateString()}
            </td>

            <td>{record.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
<button
  className="dashboard-action"
  onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
  style={{ marginLeft: "10px" }}
>
  Post Announcement
</button>
{showAnnouncementForm && (
  <form
    onSubmit={handlePostAnnouncement}
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
    }}
  >
    <h2>Post Announcement</h2>

    <input
      type="text"
      placeholder="Announcement Title"
      value={newAnnouncement.title}
      onChange={(e) =>
        setNewAnnouncement({
          ...newAnnouncement,
          title: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <textarea
      placeholder="Announcement Message"
      value={newAnnouncement.message}
      onChange={(e) =>
        setNewAnnouncement({
          ...newAnnouncement,
          message: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <button type="submit">
      Post Announcement
    </button>

    <button
      type="button"
      onClick={() => setShowAnnouncementForm(false)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </form>
)}
<button
  className="dashboard-action"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeaves(response.data);

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch leave requests"
      );
    }
  }}
  style={{ marginLeft: "10px" }}
>
  View Leave Requests
</button>
{leaves.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "900px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
      textAlign: "left",
    }}
  >
    <h2>Leave Requests</h2>

    {leaves.map((leave) => (
      <div
        key={leave._id}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>Employee:</strong>{" "}
          {leave.employeeId?.firstName} {leave.employeeId?.lastName}
        </p>

        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(leave.startDate).toLocaleDateString()}
        </p>

        <p>
          <strong>End Date:</strong>{" "}
          {new Date(leave.endDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Reason:</strong> {leave.reason}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge status-${leave.status.toLowerCase()}`}>{leave.status}</span>
        </p>
        {leave.status === "Pending" && (
  <div style={{ marginTop: "10px" }}>
    <button
      onClick={() =>
        handleLeaveStatus(leave._id, "Approved")
      }
    >
      Approve
    </button>

    <button
      onClick={() =>
        handleLeaveStatus(leave._id, "Rejected")
      }
      style={{ marginLeft: "10px" }}
    >
      Reject
    </button>
  </div>
)}
      </div>
    ))}
  </div>
)}
{showTrainingForm && (
  <form
    onSubmit={handleCreateTraining}
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
    }}
  >
    <h2>Create Training Program</h2>

    <input
      type="text"
      placeholder="Training Title"
      value={newTraining.title}
      onChange={(e) =>
        setNewTraining({
          ...newTraining,
          title: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <textarea
      placeholder="Training Description"
      value={newTraining.description}
      onChange={(e) =>
        setNewTraining({
          ...newTraining,
          description: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <input
      type="date"
      value={newTraining.date}
      onChange={(e) =>
        setNewTraining({
          ...newTraining,
          date: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <button type="submit">
      Create Training
    </button>

    <button
      type="button"
      onClick={() => setShowTrainingForm(false)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </form>
)}
{editingTraining && (
  <form
    onSubmit={handleEditTraining}
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
    }}
  >
    <h2>Edit Training Program</h2>

    <input
      type="text"
      placeholder="Training Title"
      value={editingTraining.title}
      onChange={(e) =>
        setEditingTraining({
          ...editingTraining,
          title: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <textarea
      placeholder="Training Description"
      value={editingTraining.description}
      onChange={(e) =>
        setEditingTraining({
          ...editingTraining,
          description: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <input
      type="date"
      value={
        editingTraining.date
          ? editingTraining.date.substring(0, 10)
          : ""
      }
      onChange={(e) =>
        setEditingTraining({
          ...editingTraining,
          date: e.target.value,
        })
      }
      required
    />

    <br />
    <br />

    <button type="submit">
      Update Training
    </button>

    <button
      type="button"
      onClick={() => setEditingTraining(null)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </form>
)}
{trainingPrograms.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      maxWidth: "900px",
    }}
  >
    <h2>Manage Training Programs</h2>

    {trainingPrograms.map((training) => (
      <div
        key={training._id}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: "#000000",
          textAlign: "left",
        }}
      >
        <h3>{training.title}</h3>

        <p>{training.description}</p>

        <p>
          <strong>Date:</strong>{" "}
          {training.date
            ? new Date(training.date).toLocaleDateString()
            : "Not specified"}
        </p>

        <button
          onClick={() => setEditingTraining(training)}
        >
          Edit
        </button>
        <button
  onClick={() => handleDeleteTraining(training._id)}
  style={{ marginLeft: "10px" }}
>
  Delete
</button>
      </div>
    ))}
  </div>
)}

      </div>
    );
  }

  // EMPLOYEE DASHBOARD
  if (user.role === "Employee") {
    return (
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="brand-mark" aria-hidden="true">S</div>
          <div className="dashboard-heading">
            <p className="eyebrow">STAFFSYNC · PEOPLE OPERATIONS</p>
            <h1>Good to see you, {user.name}</h1>
            <p>Your profile, time off, and team updates in one place.</p>
          </div>
          <div className="header-actions">
            <span className="role-pill">{user.role}</span>
            <button className="button-secondary" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        {message && <div className="message" role="status">{message}</div>}

        <h2>Employee Features</h2>

       <div className="employee-feature-area">
  <button
    className="dashboard-action"
    onClick={() => setShowLeaveForm(!showLeaveForm)}
  >
    Apply for Leave
  </button>
  <button
  className="dashboard-action"
  onClick={async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLeaves(response.data);

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to fetch leave requests"
      );
    }
  }}
  style={{ marginLeft: "10px" }}
>
  View Leave Requests
</button>
{leaves.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "800px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
      textAlign: "left",
    }}
  >
    <h2>My Leave Requests</h2>

    {leaves.map((leave) => (
      <div
        key={leave._id}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(leave.startDate).toLocaleDateString()}
        </p>

        <p>
          <strong>End Date:</strong>{" "}
          {new Date(leave.endDate).toLocaleDateString()}
        </p>

        <p>
          <strong>Reason:</strong> {leave.reason}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge status-${leave.status.toLowerCase()}`}>{leave.status}</span>
        </p>
      </div>
    ))}
  </div>
)}
  <button
  className="dashboard-action"
  onClick={fetchMyAttendance}
  style={{ marginLeft: "10px" }}
>
  View Attendance
</button>
<button
  className="dashboard-action"
  onClick={fetchMyProfile}
  style={{ marginLeft: "10px" }}
>
  View My Profile
</button>
<button
  className="dashboard-action"
  onClick={() => {
    setShowPersonalInfo((visible) => !visible);
    if (!myProfile) fetchMyProfile();
  }}
>
  Personal Information
</button>
{myProfile && (
  <div
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "600px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
      textAlign: "left",
    }}
  >
    <h2>My Profile</h2>

    <p>
      <strong>Employee ID:</strong>{" "}
      {myProfile.employeeId}
    </p>

    <p>
      <strong>First Name:</strong>{" "}
      {myProfile.firstName}
    </p>

    <p>
      <strong>Last Name:</strong>{" "}
      {myProfile.lastName}
    </p>

    <p>
      <strong>Email:</strong>{" "}
      {myProfile.email}
    </p>

    <p>
      <strong>Department:</strong>{" "}
      {myProfile.department || "Not specified"}
    </p>

    <p>
      <strong>Position:</strong>{" "}
      {myProfile.position || "Not specified"}
    </p>
  </div>
)}

  <button
  className="dashboard-action"
  onClick={fetchAnnouncements}
  style={{ marginLeft: "10px" }}
>
  View Announcements
</button>

  <button
  className="dashboard-action"
  onClick={fetchTrainingPrograms}
  style={{ marginLeft: "10px" }}
>
  View Training Programs
</button>

  
{showPersonalInfo && myProfile && (
  <div
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "600px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
      textAlign: "left",
    }}
  >
    <h2>Personal Information</h2>

    <p>
      <strong>Name:</strong>{" "}
      {myProfile.firstName} {myProfile.lastName}
    </p>

    <p>
      <strong>Email:</strong> {myProfile.email}
    </p>

    <p>
      <strong>Employee ID:</strong> {myProfile.employeeId}
    </p>

    <p>
      <strong>Department:</strong> {myProfile.department}
    </p>

    <p>
      <strong>Position:</strong> {myProfile.position}
    </p>
  </div>
)}
</div>
{showLeaveForm && (
  <form
    onSubmit={handleApplyLeave}
    style={{
      margin: "30px auto",
      padding: "20px",
      maxWidth: "500px",
      backgroundColor: "#ffffff",
      color: "#000000",
      borderRadius: "10px",
    }}
  >
    <h2>Apply for Leave</h2>

    

    <br /><br />

    <input
      type="date"
      value={newLeave.startDate}
      onChange={(e) =>
        setNewLeave({
          ...newLeave,
          startDate: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <input
      type="date"
      value={newLeave.endDate}
      onChange={(e) =>
        setNewLeave({
          ...newLeave,
          endDate: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <textarea
      placeholder="Reason for leave"
      value={newLeave.reason}
      onChange={(e) =>
        setNewLeave({
          ...newLeave,
          reason: e.target.value,
        })
      }
      required
    />

    <br /><br />

    <button type="submit">
      Submit Leave
    </button>

    <button
      type="button"
      onClick={() => setShowLeaveForm(false)}
      style={{ marginLeft: "10px" }}
    >
      Cancel
    </button>
  </form>
)}
{attendance.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      maxWidth: "900px",
    }}
  >
    <h2>My Attendance</h2>

    <table
      border="1"
      cellPadding="10"
      style={{
        margin: "auto",
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <thead>
        <tr>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {attendance.map((record) => (
          <tr key={record._id}>
            <td>
              {new Date(record.date).toLocaleDateString()}
            </td>

            <td>{record.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{announcements.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      maxWidth: "900px",
    }}
  >
    <h2>Announcements</h2>

    {announcements.map((announcement) => (
      <div
        key={announcement._id}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: "#000000",
          textAlign: "left",
        }}
      >
        <h3>{announcement.title}</h3>

        <p>{announcement.message}</p>

        <small>
          Posted on:{" "}
          {new Date(
            announcement.createdAt
          ).toLocaleDateString()}
        </small>
      </div>
    ))}
  </div>
)}
{trainingPrograms.length > 0 && (
  <div
    style={{
      margin: "30px auto",
      maxWidth: "900px",
    }}
  >
    <h2>Training Programs</h2>

    {trainingPrograms.map((training) => (
      <div
        key={training._id}
        style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "15px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          color: "#000000",
          textAlign: "left",
        }}
      >
        <h3>{training.title}</h3>

        <p>{training.description}</p>

        <p>
          <strong>Date:</strong>{" "}
          {training.date
            ? new Date(training.date).toLocaleDateString()
            : "Not specified"}
        </p>
      </div>
    ))}
  </div>
)}
      </div>
    );
  }

  return null;
}

export default App;
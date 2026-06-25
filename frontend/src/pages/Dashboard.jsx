
import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";


function Dashboard() {  
  const userName = localStorage.getItem("name");
    const role = (localStorage.getItem("role") || "")
    .trim()
    .toLowerCase(); 
  console.log("ROLE =", role);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");

  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({});

  const loadTickets = async () => {
    try {
      const response = await axios.get(
        "https://helpdesk-ticket-system-se05.onrender.com/tickets"
      );

      setTickets(response.data);
    } catch (error) {
      console.log(error);
    }
  };

        useEffect(() => {

        const userId = localStorage.getItem("user_id");

        if (!userId) {
            navigate("/login");
            return;
        }

        loadTickets();
        loadStats();
        loadAgents();

        }, []);

  const createTicket = async () => {
    try {
      const response = await axios.post(
        "https://helpdesk-ticket-system-se05.onrender.com/tickets",
        {
          title,
          description,
          priority,
          created_by: userId
        }
      );

      alert(response.data.message);

      setTitle("");
      setDescription("");
      setPriority("High");

      loadTickets();
      loadStats();

    } catch (error) {
      console.log(error);
      alert("Error creating ticket");
    }
  };
  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(
        `https://helpdesk-ticket-system-se05.onrender.com/tickets/${ticketId}`
      );

      loadTickets();
      loadStats();

    } catch (error) {
      console.log(error);
    }
  };
  const updateStatus = async (ticketId, status) => {
  try {
    await axios.put(
      `https://helpdesk-ticket-system-se05.onrender.com/tickets/${ticketId}`,
      {
        status: status
      }
    );

    loadTickets();
    loadStats();

  } catch (error) {
    console.log(error);
  }
  };
    const assignTicket = async (ticketId, assignedTo) => {
    try {

        await axios.put(
        `https://helpdesk-ticket-system-se05.onrender.com/tickets/${ticketId}/assign`,
        {
            assigned_to: assignedTo
        }
        );

        loadTickets();

    } catch (error) {
        console.log(error);
    }
    };
    const logout = () => {
    localStorage.clear();
    navigate("/login");
    };  

  const loadStats = async () => {
  try {
    const response = await axios.get(
      "https://helpdesk-ticket-system-se05.onrender.com/dashboard/stats"
    );

    setStats(response.data);

  } catch (error) {
    console.log(error);
  }
  };

    const loadAgents = async () => {
    try {
        const response = await axios.get(
        "https://helpdesk-ticket-system-se05.onrender.com/assistants"
        );

        setAgents(response.data);

    } catch (error) {
        console.log(error);
    }
    };  

  return (
    <div className="container">
    <h2>
    Welcome, {userName} ({role})
    </h2>    
    <div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    }}
    >
    <h1 className="title">
        Help Desk Ticket Management System
    </h1>

    <button onClick={logout}>
        Logout
    </button>
    </div>
          {stats && (
      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Tickets</h3>
          <h2>{stats.total_tickets}</h2>
        </div>

        <div className="card">
          <h3>Open Tickets</h3>
          <h2>{stats.open_tickets}</h2>
        </div>

        <div className="card">
          <h3>Resolved Tickets</h3>
          <h2>{stats.resolved_tickets}</h2>
        </div>

      </div>
    )}

    {role?.trim().toLowerCase() === "user" && (
    <>
        <div className="form-card">
            <h2>Create Ticket</h2>

            <input
                type="text"
                placeholder="Ticket Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br />
            <br />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <br />
            <br />

            <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>

            <br />
            <br />

            <button onClick={createTicket}>
                Create Ticket
            </button>
        </div>

        <hr />
    </>
    )}

      <h2>All Tickets</h2>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned To</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.description}</td>
                <td>

                {role !== "user" ? (

                <select
                    value={ticket.status}
                    onChange={(e) =>
                    updateStatus(
                        ticket.id,
                        e.target.value
                    )
                    }
                >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                </select>

                ) : (

                <span>{ticket.status}</span>

                )}

                </td>
                <td>{ticket.priority}</td>

                <td>

                {role === "admin" ? (

                <>
                <select
                    value={
                        selectedAgents[ticket.id] ||
                        ticket.assigned_to ||
                        ""
                    }
                    onChange={(e) =>
                        setSelectedAgents({
                            ...selectedAgents,
                            [ticket.id]: e.target.value
                        })
                    }
                >

                    <option value="">
                        Select Assistant
                    </option>

                    {agents.map((agent) => (
                    <option
                        key={agent.id}
                        value={agent.id}
                    >
                        {agent.name}
                    </option>
                    ))}

                </select>

                <button
                    onClick={() =>
                        assignTicket(
                            ticket.id,
                            Number(
                                selectedAgents[ticket.id]
                            )
                        )
                    }
                >
                    Assign
                </button>

                </>

                ) : (

                ticket.assigned_to || "Not Assigned"

                )}

                </td>

            <td>

            {role === "admin" && (
                <button
                onClick={() => deleteTicket(ticket.id)}
                >
                Delete
                </button>
            )}

            </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;

import React, { useState, useEffect } from "react";
import NewUserForm from "./Components/NewUserForm";
import EditUserForm from "./Components/EditUserForm";
import UploadPointForm from "./Components/NewPointForm";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import LocationMarker from "./Components/LocationMarker";
import "leaflet/dist/leaflet.css";

const App = () => {
  const initialFormState = {
    id: "",
    name: "",
    email: "",
  };

  const [name, setName] = useState(null);

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(initialFormState);
  const [editing, setEditing] = useState(false);

  const [geo, setGeo] = useState(false);
  const [points, setPoints] = useState([]);
  const [position, setPosition] = useState();
  const [type, setType] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchPoints();
  }, []);
  const fetchPoints = async () => {
    const result = await fetch("http://localhost:8080/points");
    result
      .json()
      .then((data) => {
        setPoints(data);
      })
      .catch(console.log);
  };

  const fetchUsers = async () => {
    const result = await fetch(`http://localhost:8080/users`);
    result
      .json()
      .then((result) => setUsers(result))
      .catch((e) => console.log(e));
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setCurrentUser({ ...currentUser, [id]: value });
  };
  const handlePointChange = (event) => {
    const { value } = event.target;
    setName(value);
  };
  const handleTypeChange = (event) => {
    const { value } = event.target;
    setType(value);
  };

  const submitNewPoint = async (event) => {
    event.preventDefault();
    switch (type) {
      case "point":
        const response = await fetch("http://localhost:8080/points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ name, position }),
        });
        response
          .text()
          .then(console.log)
          .catch((e) => console.log(e));
        fetchPoints();
    }
  };

  const submitNewUser = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser),
    });
    response
      .json()
      .then((result) => setUsers(result))
      .catch((e) => console.log(e));

    fetchUsers();
    setCurrentUser(initialFormState);
  };

  const deleteUser = async (item) => {
    const response = await fetch(`http://localhost:8080/users/${item.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    response
      .json()
      .then((result) => setUsers(result), fetchUsers())
      .catch((e) => console.log(e));
  };

  const editUser = (item) => {
    console.log(item);
    setEditing(true);
    setCurrentUser({ id: item.id, name: item.name, email: item.email });
  };

  const submitUserEdit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8080/users/${currentUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentUser),
      }
    );
    response
      .json()
      .then((result) => setUsers(result))
      .catch((e) => console.log(e));

    fetchUsers();
    setCurrentUser(initialFormState);
    setEditing(false);
  };

  return (
    <div className="container">
      <h1>React, Express, Node, PostgreSQL</h1>
      <h5>A simple app to create, read, update and delete data</h5>

      <div className="flex-row">
        {editing ? (
          <div className="flex-large">
            <EditUserForm
              submitUserEdit={submitUserEdit}
              handleInputChange={handleInputChange}
              currentUser={currentUser}
            />
          </div>
        ) : (
          <div className="flex-large">
            <NewUserForm
              submitNewUser={submitNewUser}
              handleInputChange={handleInputChange}
              currentUser={currentUser}
            />
          </div>
        )}

        <div className="flex-large">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <button
                      onClick={() => editUser(item)}
                      className="muted-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(item)}
                      style={{ marginLeft: 5 }}
                      className="muted-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MapContainer
        style={{ height: "600px" }}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point, index) => {
          return (
            <Marker
              position={[
                point.geometry.coordinates[1],
                point.geometry.coordinates[0],
              ]}
              key={index}
            >
              <Popup>{point.properties.name}</Popup>
            </Marker>
          );
        })}

        <LocationMarker
          position={position}
          setPosition={setPosition}
        ></LocationMarker>
      </MapContainer>
      <div className="flex-row">
        <div className="flex-large">
          <UploadPointForm
            handlePointChange={handlePointChange}
            submitNewPoint={submitNewPoint}
            position={position}
            handleTypeChange={handleTypeChange}
            currentUser={currentUser}
          ></UploadPointForm>
        </div>
      </div>
    </div>
  );
};

export default App;

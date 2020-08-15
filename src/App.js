import React, { useState, useEffect } from 'react';

const App = () => {

  const initialFormState = {
    id: '',
    name: '',
    email: ''
  }

  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(initialFormState)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await fetch(`http://localhost:8080/users`);
      result
        .json()
        .then(result => setUsers(result))
        .catch(e => console.log(e))
    }

    fetchUsers()

  }, [users])

  const handleInputChange = event => {
    const { id, value } = event.target
    setCurrentUser({ ...currentUser, [id]: value })
  }

  const submitNewUser = event => {
    event.preventDefault()

    fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser),
    })
      .then(response => console.log(response))

    setCurrentUser(initialFormState)
  }

  const deleteUser = async (item) => {

    const response = await fetch(`http://localhost:8080/users/${item.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    response
      .json()
      .then(result => setUsers(result))
      .catch(e => console.log(e))
  }

  const editUser = item => {
    console.log(item)
    setEditing(true)
    setCurrentUser({id: item.id, name: item.name, email: item.email})
  }

  const submitUserEdit = event => {
    event.preventDefault()

    fetch(`http://localhost:8080/users/${currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser),
    })
      .then(response => console.log(response))

    setCurrentUser(initialFormState)
    setEditing(false)
  }


  return (
    <div className="container">
      <h1>React, Express, Node, Postgresql</h1>
      <h5>A simple app to create, read, update and delete data</h5>

      <div className="flex-row">

        {editing ?
          <div className="flex-large">
            <form onSubmit={submitUserEdit}>
              <label>Name</label>
              <input
                type="text"
                id="name"
                placeholder="Jane Doe"
                onChange={handleInputChange}
                value={currentUser.name}
              />
              <label>Email</label>
              <input
                type="text"
                id="email"
                placeholder="jane.doe@gmail.com"
                onChange={handleInputChange}
                value={currentUser.email}
              />
              <input type="submit" value="Edit" />
            </form>
          </div>
          :
          <div className="flex-large">
            <form onSubmit={submitNewUser}>
              <label>Name</label>
              <input
                type="text"
                id="name"
                placeholder="Jane Doe"
                onChange={handleInputChange}
                value={currentUser.name}
              />
              <label>Email</label>
              <input
                type="text"
                id="email"
                placeholder="jane.doe@gmail.com"
                onChange={handleInputChange}
                value={currentUser.email}
              />
              <input type="submit" value="Submit" />
            </form>
          </div>
        }

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
              {users.map(item =>
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <button onClick={() => editUser(item)} className="button" >Edit</button>
                    <button onClick={() => deleteUser(item)} style={{ marginLeft: 5 }} className="button" >Delete</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;

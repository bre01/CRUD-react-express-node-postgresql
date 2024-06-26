import React from "react";

const NewPointForm = (props) => {
  const { handleInputChange, submitNewUser, currentUser, position } = props;
  const [type,setType]=useState(null);
  const name = currentUser.name;
  const email = currentUser.email;
  const handleUploadPoint = () => {
    switch(type){
        case"Point":
        

    }
  };
  const handleSelect=(event)=>{
        setType(event.value);
  }

  return (
    <form onSubmit={submitNewUser}>
      <label>Name</label>
      <input
        type="text"
        id="name"
        placeholder="Jane Doe"
        onChange={(e) => handleInputChange(e)}
        value={name}
      />
      <label>Email</label>
      <input
        type="text"
        id="type"
        placeholder="jane.doe@gmail.com"
        onChange={(e) => handleInputChange(e)}
        value={email}
      />
      <select id="geotype" onChange={handleSelect}>
        <option value="">--Please choose an geometry type--</option>
        <option value="point">Point</option>
        <option value="polyline">Polyline</option>
        <option value="polygon">Polygon</option>
      </select>

      <input type="submit" onClick={handleUploadPoint} />
    </form>
  );
};

export default NewUserForm;

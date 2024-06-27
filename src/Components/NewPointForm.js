import React from "react";

export default function NewPointForm(props) {
  const {handleTypeChange,position, handlePointChange, submitNewPoint} = props;
  
  //const email = currentUser.email;

  return (
    <form onSubmit={submitNewPoint}>
      <label>Name</label>
      <input
        type="text"
        id="name"
        placeholder="Jane Doe"
        onChange={(e) => handlePointChange(e)}
        //value={name}
      />
      <select id="geotype" onChange={handleTypeChange}>
        <option value="">--Please choose an geometry type--</option>
        <option value="point">Point</option>
        <option value="polyline">Polyline</option>
        <option value="polygon">Polygon</option>
      </select>
      <input type="text" id="lat" value={position?position.lat:"180"}></input>
      <input type="text" id="lon" value={position?position.lng:"90"}></input>


      <input type="submit" value="Submit" />
    </form>
  );
};



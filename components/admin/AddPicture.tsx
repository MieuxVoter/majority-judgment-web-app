import { useState } from 'react';

export default function AddPicture(props) {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  return (
    <div className="ajout-avatar">
      <div>
        <div className="avatar-placeholer">
          <img src={createObjectURL} />
        </div>
      </div>
      <div className="avatar-text">
        <h4>
          Photo <span> (facultatif)</span>
        </h4>

        <p>
          Importer une photo.
          <br />
          format : jpg, png, pdf
        </p>
        <div className="btn-ajout-avatar">
          <input
            type="file"
            name="myImage"
            id="myImage"
            onChange={uploadToClient}
          />
          <label className="inputfile" htmlFor="myImage">
            Importer une photo
          </label>
          ddpi
        </div>
      </div>
    </div>
  );
}

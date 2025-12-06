import { useState } from 'react';
import Image from 'next/image';

export default function AddPicture() {
  const [, setImage] = useState(null);
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
          {createObjectURL && (
            <Image src={createObjectURL} width={100} height={100} alt="preview" />
          )}
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

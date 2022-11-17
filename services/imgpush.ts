/** 
 * This is a mini-SDK to submit files upload to imgpush
 */
import {IMGPUSH_URL} from '@services/constants';

export const upload = async (photo) => {
  const formData = new FormData();
  formData.append('file', photo);
  formData.append('fileName', photo.name);
  return fetch(
    IMGPUSH_URL,
    {method: "POST", body: formData}
  )
    .then(ans => {return ans.json();})
    .catch(console.log)
}


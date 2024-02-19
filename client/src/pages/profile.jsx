import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/userslice.js';
import { Link, useNavigate } from 'react-router-dom';
export default function Profile() {
  //this is use for storage to store the image in the firebase
  // service firebase.storage {
  //   match /b/{bucket}/o {
  //     match /{allPaths=**} {
  //       allow read; 
  //       allow write: if
  //       request.resource.size < 2 * 1024 * 1024  &&
  //       request.resource.contentType.matches('image/.*')
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined)
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const [fileperc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userlisting, setuserlisting] = useState([])
  const [showlistingerror, setshowlistingerror] = useState(false);
  const [updateSuccess, setupdateSuccess] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    if (file) {
      handleFileUpload(file)
    }
  }, [file]);

  const handleListing = async () => {
    try {

      setshowlistingerror(false)
      const res = await fetch(`/server/userroutes/listings/${currentUser._id
        }`);
      const data = await res.json();
      if (data.success === false) {
        setshowlistingerror(true);
        return;
      }
      setuserlisting(data)

    } catch (error) {
      setshowlistingerror(true)
    }
  }

  const handleListingDelete = async (listingid) => {
    try {
      const res = await fetch(`/server/listing/delete/${listingid}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return
      }
      setuserlisting((prev) => prev.filter((listing) => listing._id !== listingid))
    } catch (error) {
      console.log(error);
    }
  }

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/userroutes/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return;
      }

      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };


  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/userroutes/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutButton = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch('/server/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(data.message));
    }
  };


  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className=' text-3xl font-semibold text-center my-7'>profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref=

          {fileRef} hidden accept='image/*' />

        <img src={formData.avatar || currentUser.avatar} alt="Profile"

          onClick={() => fileRef.current.click()} className=' rounded-full h-24 
        
        w-24 object-cover cursor-pointer self-center mt-2' />

        <p className=' text-sm self-center'>

          {fileUploadError ?

            (<span className=' text-red-700'>

              Error Image Upload

            </span>) :

            fileperc > 0 && fileperc < 100 ?

              (<span className='text-slate-700'>

                {`Uploading ${fileperc}%`}

              </span>) :

              fileperc === 100 ? (<span className=' text-green-700'>

                Succeesfully Uploaded

              </span>) : ('')

          }

        </p>



        <input type="text" id='username' defaultValue={currentUser.username}
          placeholder='Username' className='border p-3 rounded-lg' onChange=
          {handleChange} />

        <input type="email" onChange={handleChange} id='email' placeholder='Email' defaultValue={currentUser.email} className='border p-3 rounded-lg' />


        <input type="password" id='password' onChange={handleChange} placeholder='Password' className='border p-3 rounded-lg' />



        <button disabled={loading} className=' bg-slate-800 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80' >

          {loading ? 'Loading...' : 'Update'}

        </button>

        <Link className=' text-center bg-emerald-800 hover:opacity-85 text-white rounded-lg uppercase p-3' to={"/create-listing"}  >

          Create Listing


        </Link>

      </form>

      <div className='flex justify-between mt-5'>

        <span onClick={handleDelete} className=' text-red-700 cursor-pointer'>


          Delete Account
        </span>

        <span onClick={handleSignOutButton} className=' text-red-700 
        cursor-pointer'>

          Sign out  </span>

      </div>

      <p className=' text-red-700 mt-5' > {error ? error : ''} </p>

      <p className=' text-green-700 mt-5' > {updateSuccess ? 'User Updated Successfully' : ''} </p>


      <button onClick={handleListing} className=' text-green-600 w-full'
      >Show Listing</button>


      <p className=' text-red-600 mt-5'>{showlistingerror ? 'Error showing Listing' : ' '}</p>
      {userlisting && userlisting.length > 0 && (
        <div>
          {/* Your listing JSX goes here */}
          {userlisting.map((listing) => (
            <div key={listing._id} className='flex items-center border   rounded-lg justify-between p-3'>
              {/* Render individual listing details */}
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt='listing cover' className=' h-16 w-16  object-contain rounded-lg' />
              </Link>
              <Link to={`/listing/${listing._id}`}>

                <p className=' text-slate-600 hover:underline font-semibold flex-1 truncate object-contain rounded-lg'> {listing.name}</p>
              </Link>
              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

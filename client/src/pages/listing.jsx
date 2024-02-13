import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Listing() {
  const { currentUser } = useSelector(state => state.user)
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const navigate=useNavigate();
  const [form, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,

  });
  console.log(form);
  const [imageuploaderror, setImageuploadError] = useState();
  const [uploadingimage, setuploading] = useState();
  const handleImageSubmit = (e) => {
    //a sync is used when there is no other fuction inside it 
    //we dont need a sync in this bcz we are using other function in this
    if (files.length > 0 && files.length + form.imageUrls.length < 7) {
      setImageuploadError(false);
      setuploading(true);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        //in this its getting all the data and save it into promises and then all
        //data store in setformdata
        setFormData({ ...form, imageUrls: form.imageUrls.concat(urls) })
        //concat Combines two or more arrays. This method returns a new array without modifying any existing arrays
        setImageuploadError(false);
        setuploading(false);
      }).catch((err) => {
        setImageuploadError('image must be less then 2mb');

      })
    }
    else {
      setImageuploadError('you can only upload 6 image')
    }

  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...form,
      imageUrls: form.imageUrls.filter((_, i) => i !== index)
    })
  }

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...form,
        type: e.target.id
      })
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...form,
        [e.target.id]: e.target.checked
      })

    }
    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...form,
        [e.target.id]: e.target.value,
      });
    }
  }


  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',//'state_changed': This event listener is triggered when the upload state changes
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is${progress} % done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }

      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.imageUrls.length < 1) return setError('atleast put 1 image');

      if (+form.regularPrice < +form.discountPrice) return setError('discount price must be lower then actual price')
        
      const res = await fetch('/server/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          userRef: currentUser._id
        }),
      });
      const data = await res.json();
      
      setLoading(false)
      if (data.success === false) {
        setError(data.message);

      }
navigate(`/listing/${data._id}`)


    } catch (error) {
      setError(error.message)
      setuploading(false);
    }
  }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            onChange={handleChange}
            value={form.name}
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <textarea
            onChange={handleChange}
            value={form.description}
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input
            onChange={handleChange}
            value={form.address}
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={form.type === 'sale'}
                type='checkbox'
                id='sale'
                className='w-5'
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={form.type === 'rent'}
                type='checkbox'
                id='rent'
                className='w-5'
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={form.parking}
                type='checkbox'
                id='parking'
                className='w-5'
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={form.furnished}
                type='checkbox'
                id='furnished'
                className='w-5'
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                onChange={handleChange}
                checked={form.offer}
                type='checkbox'
                id='offer'
                className='w-5'
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                onChange={handleChange}
                checked={form.bedrooms}
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                onChange={handleChange}
                checked={form.bathrooms}
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                onChange={handleChange}
                checked={form.regularPrice}
                type='number'
                id='regularPrice'
                min='50'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>

              </div>
            </div>
           
           {form.offer&&(
            <div className='flex items-center gap-2'>
              <input
                onChange={handleChange}
                checked={form.discountPrice}
                type='number'
                id='discountPrice'
                min='0'
                max='10000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>

                <span className='text-xs'>($ / month)</span>

              </div>
            </div>
)}
          </div>
        </div>
        
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}//on change is used when the update state of a componenet validate input or perform any action
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              onClick={handleImageSubmit}
              disabled={uploadingimage}
              type='button'
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploadingimage ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm' >
            {imageuploaderror && imageuploaderror}
          </p>
          {
            form.imageUrls.length > 0 && form.imageUrls.map((url, index) => (
              <div key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  //callback fucntion is used when you want to do that action then its work 
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))
          }
          <button
            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        disabled={loading|| uploadingimage}  >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className='text-red-700 text-sm'>{error}</p>}
        </div>
      </form>
    </main>
  )
}

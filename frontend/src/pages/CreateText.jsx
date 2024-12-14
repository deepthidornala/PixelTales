import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { FormField, Loader } from '../Components';

const CreateText = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    photo: null,
    caption: '',
    story: '', // Added story field
  });

  const [generatingText, setGeneratingText] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, photo: file });
  };

  // Function to convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generateText = async () => {
    if (form.photo) {
      try {
        setGeneratingText(true);
  
        const formData = new FormData();
        formData.append('image', form.photo);
  
        const response = await fetch('http://localhost:8080/api/v1/blip', {
          method: 'POST',
          body: formData,
        });
  
        // Check the response status
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('Generated caption:', data.caption);
        console.log('Generated story:', data.story);
  
        if (data.caption) {
          // Set caption
          setForm((prevForm) => ({ ...prevForm, caption: data.caption, story: data.story })); // Update this line
        } else {
          alert('No text generated from the image');
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setGeneratingText(false);
      }
    } else {
      alert('Please upload an image');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.photo && form.story) { // Check if story is generated
      setLoading(true);
      try {
        // Convert image to base64 before submitting
        const base64Image = await convertToBase64(form.photo);

        const response = await fetch('http://localhost:8080/api/v1/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.name,
            prompt: form.story, // sending generated story as prompt
            photo: base64Image, // sending base64 image
          }),
        });

        const data = await response.json();
        if (data.success) {
          alert('Success');
          navigate('/');
        } else {
          alert('Failed to post the data');
        }
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please upload an image and generate text');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create Story</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Upload an image and generate a descriptive story.</p>
      </div>

      <form className="mt-5 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., deepthi"
            value={form.name}
            handleChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input 
              type="file" 
              name="photo" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="mt-1 block w-full text-sm text-gray-900"
            />
          </div>

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { form.photo ? (
              <img
                src={URL.createObjectURL(form.photo)}
                alt="Uploaded"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingText && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={generateText}
              className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              {generatingText ? 'Generating Story...' : 'Generate Story'}
            </button>
          </div>

          {form.story && ( // Display generated story instead of caption
            <div className="mt-5">
              <p className="text-sm text-gray-700">Generated Story:</p>
              <p className="p-3 bg-gray-100 rounded-md">{form.story}</p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">Once you have generated text from the image, you can share it with others in the community.</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateText;

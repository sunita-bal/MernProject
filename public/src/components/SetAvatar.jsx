import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import loader from '../assests/loader.gif'
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from "buffer";

export default function SetAvatar() {
  const api = `https://api.multiavatar.com/4645646`;
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }
  useEffect(() => {
    const checkUserAndNavigate = async () => {
      try {
        const user = await JSON.parse(localStorage.getItem("chat-app-user"));
  
        if (!user) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };
    checkUserAndNavigate();
  }, [navigate]);

  

  const setprofilePicture = async () => {
    
    if (!selectedAvatar) {
      toast.error("Please select and avatar", toastOptions)
    }
    else{
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));

      const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
        image:avatars[selectedAvatar],
      });

      if(data.isSet){
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user",JSON.stringify(user)
        );
        navigate('/');
      }
      else{
        toast.error("Error setting avatar, Please try again", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          let image;
          do {
            try {
              image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
            } catch (error) {
              if (error.response && error.response.status === 429) {
                // Wait and retry
                await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the wait time as needed
              } else {
                throw error; // Propagate other errors
              }
            }
          } while (!image);
    
          const buffer = new Buffer(image.data);
          data.push(buffer.toString("base64"));
        }
    
        setAvatars(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching avatars:", error);
        // Handle the error appropriately
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <>
      { isLoading ? (
         <Container>
          <img src={loader} alt="loader" className='loader' />
        </Container> 
        ) : (

          <Container>
            <div className="title-container">
              <h1>Pick an avatar as your profile picture</h1>
            </div>
            <div className="avatars">
              {avatars.map((avatar, index) => {
                return (
                <div
                  key={index}
                  className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
                  >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
                );
              })}
            </div>
            <button className='submit-btn' onClick={setprofilePicture}>Set as Profile Picture</button>
            <ToastContainer />
          </Container>
        )}
    </>
  );
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;

.loader {
  max-inline-size: 100%;
}

.title-container {
  h1 {
    color: white;
  }
}
.avatars {
  display: flex;
  gap: 2rem;

  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    img {
      height: 6rem;
      transition: 0.5s ease-in-out;
    }
  }
  .selected {
    border: 0.4rem solid #4e0eff;
  }
}
.submit-btn {
  background-color: #4e0eff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  &:hover {
    background-color: #4e0eff;
  }
}
`;
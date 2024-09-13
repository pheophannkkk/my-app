import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import image from "./image/profile.jpg";

const API_URL = "https://sample-api-fwbm.onrender.com/api/v1";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({
    email: "Ph@gmail.com",
    password: "99999",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.data.user);
          setProfileImage(response.data.data.user.profile_image || null);
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/login`, loginData);
      if (response.data.status === "success") {
        const token = response.data.token;
        localStorage.setItem("token", token);
        setUser(response.data.data.user);
        setProfileImage(response.data.data.user.profile_image || null);

        Swal.fire({
          icon: "success",
          title: "ສຳເລັດ",
          text: `ຍິນດີຕ້ອນຮັບທ່ານ ${response.data.data.user.first_name} ${response.data.data.user.surname}`,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ລົ້ມເຫຼວ",
        text: "ກະລຸນາກວດສອບຂໍໍມູນຂອງທ່ານແລ້ວລອງໃຫມ່ອີກຄັ້ງ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileImage(null);
    Swal.fire({
      icon: "success",
      title: "ສຳເລັດ",
      text: "ຂອບໃຈທີ່ໃຊ້ບໍລິການ!",
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_image", file);

      try {
        await axios.post(`${API_URL}/users/me/image`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setProfileImage(URL.createObjectURL(file));
        Swal.fire({
          icon: "success",
          title: "ສຳເລັດ",
          text: "ອັບເດດຮູບປະຈໍາແລ້ວ!",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ລົ້ມເຫຼວ",
          text: "ກະລຸນາລອງໃສ່ໃໝ່ອີກຄັ້ງ",
        });
      }
    }
  };

  return (
    <div className="container">
      {isLoading && <div className="loading">ກຳລັງໂຫລດ...</div>}

      {!user ? (
        <div className="login-form">
          <form onSubmit={handleLogin}>
            <center>
            <img src={image} alt="Profile" className="login-image"/>
            </center>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button type="submit" disabled={isLoading}>
              ເຂົ້າສູ່ລະບົບ
            </button>
          </form>
        </div>
      ) : (
        <div className="profile">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <p>ປະຫັວດ</p>
          )}
          <img src={image} alt="Profile" className="login-image"/>
          <p> {user?.BriefHistory || 'ມາຈາກແຂວງຈຳປາສັກ ເກີດຢູ່ແຂວງຈຳປາສັກ ປະຈູບັນກຳລັງສືກສາ ຢູ່ທີ່ມະຫາໄລແຫ່ງຊາດ ຄະນະວິສະວະກຳສາດ ສາຂາໄອທີປີ3 ປະຈຸບັນອາໄສຢູ່ບ້ານທົ່ງກາງ ເມືອງສີສັດຕະນາດ ນະຄອນຫຼວງວຽງຈັນ ສີ່ງທີ່ມັກເຮັດໃນເວລາຫ່ວາງ ຄືການເລາະຊອກຫາຂອງກີນແຊ່ບໆ ຕາມຕະຫຼາດ'}</p>
          <p>Email: {user?.email}</p>
          <p>ເບີໂທ: {user?.phone_number}</p>
          <p>ສິດທິ: {user?.role}</p>
          <button onClick={handleLogout}>ອອກຈາກລະບົບ</button>
        </div>
      )}

      <style jsx>
        {`
          .container {
            font-family: Phetsarath OT, sans-serif;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
          }
          .login-form, .profile {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 400px;
          }
          .login-image {
    
            width: 80%;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          form {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #66b3ff 0%, #ff66b2 100%);
          }
          input {
            margin-bottom: 10px;
            padding: 10px;
            width: 380px;
            height: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
    
          }
          .upload-input {
            margin: 10px 0;
            width: 100%;
          }
          .profile-image {
            width: 10px;
            height: 10px;
            padding: 10px 20px;
            border: 2px solid #ddd;
           
            
          
          }
          button {
            font-family: Phetsarath OT, sans-serif;
            padding: 10px 10px;
            background-color: #4caf50;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-top: 10px;
          }
          button:disabled {
            background-color: #ff4000;
            cursor: not-allowed

          }
          .loading {
            text-align: center;
            padding: 20px;
            font-style: italic;
            color: #ff4000;
          }
        `}
      </style>
    </div>
  );
};

export default Profile;
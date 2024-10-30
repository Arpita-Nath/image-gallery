import { useEffect, useRef, useState } from "react"
import { getDatabase, push, ref, set, onValue, remove, update } from "firebase/database";
import { storageDB } from "./config/FirebaseConfig";
import { deleteObject, getDownloadURL, ref as ref2, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  const db = getDatabase();
  // const ref3 = useRef<HTMLInputElement>(null)//to set the input value empty after button click
  const [image, setImage] = useState()
  const [imageArr, setImageArr] = useState([])
  const [dbInfo, setDbInfo] = useState({})
  const [isEditBtn, setIsEditBtn] = useState(true)
  const [editUrl, setEditUrl] = useState()
  const [isEditUrl, setIsEditUrl] = useState(true)
  


  const handleFile = (e) => {
    
    setImage(e.target.files[0]); 
    // setInputvalue(e.target.files[0].name);
    (!isEditBtn) && (setIsEditUrl(false)) 
    
  } 

  //Write data to database
  const handleUpload = () => {
    if(image){
      const storageRef = ref2(storageDB, `images/${v4()}`)
      uploadBytes(storageRef, image)
      .then((snapshot) => {
         getDownloadURL(storageRef)
        .then((url) => {
          set(push(ref(db, 'gallery')), {
            imgUrl: url,
          })
         
        }).catch((error) => {
          console.log("error2");
        })
        // setInputvalue('')

      }).catch((error) => {
        console.log("error1");
      })
    }
    else{
      console.log("No files have been choosen!");
    }
  }

  //Read data from database
  //useEffect used for preventing infinite loop
  useEffect(()=>{
    const imageRef = ref(db, 'gallery');
    onValue(imageRef, (snapshot) => {
      let arr = []
      snapshot.forEach((item)=>{
        arr.push({...item.val(), id: item.key})
      })
      setImageArr(arr);
    });
  },[])

  // Edit operation
  let handleEdit = (editInfo) => {
    // setImage(editInfo.imgUrl)
    setIsEditBtn(false) 
    setDbInfo(editInfo)    
   }

   let handleUpdate = () => {
    const storageRef = ref2(storageDB, `images/${v4()}`)
      uploadBytes(storageRef, image)
      .then((snapshot) => {
         getDownloadURL(storageRef)
        .then((url) => {
          update(ref(db, 'gallery/' + dbInfo.id), {
            imgUrl: url,
          }) 
        })
        
        .then(() => {
          toast.error('🦄 Edited Successfully', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
            });
        })
        // setInputvalue('')

      })
      setIsEditBtn(true)
   }

  //Delete operation
  let handledelete = (deleteInfo) => {
    //delete from storage
    // deleteObject(ref2(storageDB, 'images/' + deleteInfo.imgUrl))
    // //delete from realtime database
    remove(ref(db, 'gallery/' + deleteInfo.id))
    .then(() => {
      toast.error('🦄 Deleted Successfully', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
        });
    })
  }

  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
      <div className="container">
        <div className="input_box">
          <input type="file" name="file" id="file" placeholder="Enter an image" accept="image/png, image/jpeg,
          image/jpg" onChange={handleFile} />
          {
            (isEditBtn)
            ?
            <button className="uploadBtn" onClick={handleUpload}>Upload</button>
            :
            <div>
              <div className="editImgBox">
                <img src={dbInfo.imgUrl} alt="" />
              </div>
              <button className="updateBtn" onClick={handleUpdate}>Update</button>
            </div>
          }
        </div>
        <div className="imgbox">
            {
              imageArr.map((item,index)=>(
                <div className="images" key={index}>
                  <img src={item.imgUrl} alt="img" />
                  <div className="overlay">
                    <button className="editBtn" onClick={()=>handleEdit(item)}>Edit</button>
                    <button className="deleteBtn" onClick={()=>handledelete(item)}>Delete</button>
                  </div>
                </div>
              ))
            } 
        </div>
      </div>
    </>
  )
}

export default App

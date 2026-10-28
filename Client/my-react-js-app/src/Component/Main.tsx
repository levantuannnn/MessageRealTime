import { useEffect, useMemo, useState } from "react"
import { BrowserRouter as Router, Route, Link, NavLink } from "react-router-dom";

interface User {
     Email: string,
     Password: string,
     trangthai: string
}
export default function Main() {
     const [email, emailSet] = useState<string>("");
     const [password, passwodSet] = useState<string>("");
     const [passwordvery, passwodverySet] = useState<string>("");
     const [check, setCheck] = useState<boolean>(true)
     let changeEmail = (e: any) => {
          console.log("email:", e.target.value)
          emailSet(e.target.value)
     }
     let changePassword = (e: any) => {
          console.log("password:", e.target.value)
          passwodSet(e.target.value);
     }
     let changePasswordVery = (e: any) => {
          passwodverySet(e.target.value)
     }
     // call api
     let handleLogin = async () => {
          let resultUser = await fetch(`http://localhost:8000/register?email=${email}&password=${password}`,
               {
                    method: "POST",
               }
          );
          let data = resultUser.json();
          localStorage.setItem("acessToken", String(data))
     }
     //chuc nang dang ky
     let handleCreate = (e: any) => {
          if (password != passwordvery) {
               alert("vui long nhap lai");
          }
          else {

          }
     }
     let handleCheck = () => {
          setCheck(!check)
     }
     useEffect(() => {

     }, [email, password])
     return (
          <>
               <div className="flex flex-col  justify-center w-3xs h-80 bg-blue-950 items-center rounded-2xl ">
                    <div className="text-center text-2xl text-amber-50 mb-9">Form Dang Nhap</div>
                    <input className="pb-1 w-1/2xl w-64 mb-5 border-2" onChange={changeEmail} type="text" placeholder="Email" />
                    <input className="w-64 border-2 mb-5" onChange={changePassword} type="text" placeholder="Password" />
                    {!check && <input className="w-64 border-2 mb-5" onChange={changePassword} type="text" placeholder="PasswordVery" />}
                    <button onClick={handleLogin} className="bg-red pt-5 mb-2">Dang Nhap</button>
                    <button className="bg-red pt-5" onClick={handleCheck}>Dang ky</button>
               </div>
          </>
     )
}
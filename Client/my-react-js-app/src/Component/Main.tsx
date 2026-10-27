import { useEffect, useMemo, useState } from "react"

interface User {
     Email: string,
     Password: string,
     trangthai: string
}
export default function Main() {
     const [name, nameSet] = useState<string>("");
     const [password, passwodSet] = useState<string>("");
     let handleCrate = () => {

     }
     // call api
     useEffect(() => {

     }, [name, password])
     return (
          <>
               <div className="flex flex-col  justify-center w-3xs h-80 bg-blue-950 items-center rounded-2xl ">
                    <div className="text-center text-2xl text-amber-50"  >Đăng Nhập</div>
                    <input className="pb-1 w-1/2xl w-64 mb-5 border-2" type="text" placeholder="Email" />
                    <input className="w-64 border-2" type="text" placeholder="password" />
                    <button onClick={handleCrate}>Nhấn vào</button>
               </div>
          </>
     )
}
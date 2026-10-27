interface User {
     Email: string,
     Password: string
}
export default function Main() {
     return (
          <>
               <div className="flex flex-col w-3xs h-80 bg-blue-950 items-center">
                    <input className="pb-1 w-1/2xl w-64 mb-5 border-2" type="text" placeholder="Email" />
                    <input className="w-64 border-2" type="text" placeholder="password" />
               </div>
          </>
     )
}
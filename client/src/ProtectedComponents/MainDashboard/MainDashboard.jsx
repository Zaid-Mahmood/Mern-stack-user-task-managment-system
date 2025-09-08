import { usePostApi } from "../../customHooks/usePostApi";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import TableData from "./TableData/TableData";
const MainDashboard = () => {
  const navigate = useNavigate();
  const logoutUrl = `${import.meta.env.VITE_API_URL}logout`;
  const searchUrl = `${import.meta.env.VITE_API_URL}search-task`;
  const [debouncedValue, setDebouncedValue] = useState({ value: "", delay: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutFuction = async () => {
    registerUser();
    if (!error) {
      await navigate("/")
      localStorage.removeItem("loggedUser")
    }
  }
  const changeVal = (event) => {
    const { value } = event.target;
    setDebouncedValue((prev) => ({ ...prev, value: value, delay: 1000 }))
  };

  const { registerUser, loading, error, data } = usePostApi(debouncedValue.value ? searchUrl : logoutUrl);
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  useEffect(() => {
    const handler = setTimeout(() => {
      if(debouncedValue.value){
      registerUser({...debouncedValue});
      }
    }, debouncedValue.delay)
    return () => {
      clearTimeout(handler)
    }
  }, [debouncedValue.value, debouncedValue.delay])


  return (
    <>
      {error
        ?
        error
        :
        loading ?
          <p>Loading ...</p>
          :
          <>
            <nav className="bg-white shadow-md fixed w-full z-10 h-[12vh]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  {/* Website Title */}
                  <div className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600">
                    MyWebsite
                  </div>

                  {/* SearchBar */}
                  <div>
                    <input value={debouncedValue.value} type="text" onChange={changeVal} className="py-1 px-4 border-2 border-gray-400 rounded-sm shadow-md outline-0" placeholder="Search" />
                  </div>
                  {/* Desktop Menu */}
                  <div className=" md:flex items-center space-x-4">
                    <span className="text-gray-600">Welcome, <span className="font-semibold">{loggedUser.Name}</span></span>
                    <button onClick={logoutFuction} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full cursor-pointer">
                      Logout
                    </button>
                  </div>

                  {/* Mobile Hamburger */}
                  <div className="flex items-center md:hidden">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="text-gray-600 focus:outline-none"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {menuOpen ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Menu */}
              {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                  <div className="px-4 py-2 space-y-2">
                    <p className="text-gray-700">Welcome, <span className="font-semibold">{loggedUser.Name}</span></p>
                    <button onClick={logoutFuction} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded cursor-pointer">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </nav>
            <div className="p-16">
              <TableData debouncedValue = {debouncedValue.value} searchData = {data} loggedUser={loggedUser} />
            </div>
          </>
      }

    </>
  )
}

export default MainDashboard

import { useCallback, useState } from 'react';  
import { tableData } from './TableData.utils';
import { usePostApi } from '../../../customHooks/usePostApi';
import TableData2 from './TableData2';
const TableData = ({  debouncedValue , searchData, loggedUser ,  searchError , searchLoading  }) => {
    const postUrl = `${import.meta.env.VITE_API_URL}add-user`;
    const updateUrl = `${import.meta.env.VITE_API_URL}update-task`;
    const [inputVals, setInputVals] = useState("");
    const [addTaskAndBtnStatusFlag, setTaskAndBtnStatusFlag] = useState({ addTaskFlag: false, btnStatus: true })

     const { data, registerUser, error, loading } = usePostApi(addTaskAndBtnStatusFlag.btnStatus ? postUrl : updateUrl);

    const changeValues = (event) => {
        setTaskAndBtnStatusFlag((prev) => ({ ...prev, addTaskFlag: false }));
        const { name, value } = event.target;
        setInputVals((prev) => ({ ...prev, id: loggedUser._id, [name]: value }))
    }

    const addValues = async () => {
        await registerUser(inputVals);
        setTaskAndBtnStatusFlag((prev) => ({ ...prev, addTaskFlag: true }));
        setInputVals({})
    }

    const updateTaskFunction = async () => {
       await registerUser(inputVals)
        setTaskAndBtnStatusFlag({ addTaskFlag: true, btnStatus: true })
    }

    return (
        <div className='h-[calc(100vh+12vh)] content-center text-center'>
            {tableData.map((item, id) => (
                <div className='my-4' key={id}>
                    {item.labelName === "Task Status"
                        ?
                        <>
                            <label className='font-medium'>{item.labelName} :</label>
                            <select value={addTaskAndBtnStatusFlag.addTaskFlag ? "" : inputVals[item.name] || ""} name={item.name} onChange={changeValues} className='border-2 border-gray-500 rounded-lg px-5 py-4 mx-4'>
                                <option value="">Select Status</option>
                                <option value={"Task Initiated"}>Task Initiated</option>
                                <option value={"Task Pending"}>Task Pending</option>
                                <option value={"Task Completed"}>Task Completed</option>
                            </select>
                        </>
                        :
                        <>
                            <label className='font-medium'>{item.labelName} :</label>
                            <input value={addTaskAndBtnStatusFlag.addTaskFlag ? "" : inputVals[item?.name] || ""} onChange={changeValues} name={item.name} className='border-2 border-gray-500 rounded-lg px-5 py-4 mx-4' type={item.type} placeholder={item.placeholder} />
                        </>
                    }

                </div>
            ))}
            <button type='submit' onClick={addTaskAndBtnStatusFlag.btnStatus ? addValues : updateTaskFunction} className={`cursor-pointer ${addTaskAndBtnStatusFlag.btnStatus ? "bg-blue-500" : "bg-green-500"} p-4 rounded-full`}>{addTaskAndBtnStatusFlag.btnStatus ? "Add Task" : "Update Task"}</button>

            <TableData2
                setTaskAndBtnStatusFlag={setTaskAndBtnStatusFlag}
                setInputVals={setInputVals}
                searchData={searchData}
                addAndUpdateData={data}
                debouncedValue={debouncedValue}
                     searchError={searchError}
              searchLoading={searchLoading}
            />
        </div>
    )
}

export default TableData;
